import { useEffect } from "react";
import { resetShellScroll } from "~/utils/scrollInContent";

/**
 * Locks the signed-in shell to the viewport so ONLY #content scrolls, and keeps
 * the shell glued to what the person can actually SEE when the on-screen
 * keyboard opens.
 *
 *  1. adds  html.app-shell-active / body.app-shell-active  (the CSS in
 *     layout/styles/01-shell-base.css + css/mobile-app-responsive.css is
 *     scoped to this class, so it only applies while the shell is mounted
 *     and never leaks onto the public pages);
 *
 *  2. iOS keyboard ("the header vibrates / gets pushed down when I tap a text
 *     area"):
 *     The old version snapped the page back to 0,0 on EVERY visualViewport
 *     scroll event. iOS pans the visual viewport to reveal the focused field,
 *     we snapped it back, iOS panned again ... a tug-of-war that looked like
 *     vibration and dragged the header down. We no longer fight the pan.
 *     Instead, while a text field is focused and the keyboard is open, the
 *     shell is resized to visualViewport.height and shifted by
 *     visualViewport.offsetTop, so the header stays pinned to the top of the
 *     visible area and the composer/input sits right above the keyboard.
 *     Everything is rAF-throttled, so it is one write per frame at most.
 *
 *  3. publishes  --shell-header-h  (real header height) for any page that
 *     needs to sit just below it (e.g. the full-screen chat).
 *
 * Works in Safari, Chrome, installed PWAs and Android browsers. Without
 * visualViewport it degrades to innerHeight (no glue, plain lock).
 */
const NON_TEXT_INPUTS = /^(checkbox|radio|button|submit|reset|range|file|color|image|hidden)$/i;

const isTextField = (el) =>
    !!el &&
    (el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT" ||
        (el.tagName === "INPUT" && !NON_TEXT_INPUTS.test(el.type || "")) ||
        el.isContentEditable === true);

export default function useShellScrollLock() {
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        html.classList.add("app-shell-active");
        body.classList.add("app-shell-active");

        const shell = document.querySelector(".app-shell-root");
        const inner = document.querySelector(".site-layout");
        const header = document.getElementById("header");
        const vv = window.visualViewport;

        let raf = 0;
        let baseHeight = Math.max(window.innerHeight, vv ? vv.height : 0);
        const timers = new Set();

        const clearGlue = () => {
            if (!shell) return;
            shell.style.removeProperty("height");
            shell.style.removeProperty("max-height");
            shell.style.removeProperty("transform");
        };

        const sync = () => {
            raf = 0;
            const vvHeight = vv ? vv.height : window.innerHeight;
            const vvTop = vv ? vv.offsetTop : 0;
            const fieldFocused = isTextField(document.activeElement);

            // Remember the keyboard-closed height. (Android Chrome can shrink
            // innerHeight itself, so we compare against the last height that
            // was measured while no field was focused.)
            if (!fieldFocused) baseHeight = Math.max(vvHeight, window.innerHeight);
            const keyboardOpen = fieldFocused && baseHeight - vvHeight > 120;

            html.classList.toggle("shell-kb-open", keyboardOpen);

            if (header && !keyboardOpen) {
                const h = header.offsetHeight;
                if (h > 0) html.style.setProperty("--shell-header-h", `${h}px`);
            }

            // The full-screen chat pins itself with --chat-vh / --chat-vt
            // (useMobileChatViewport) - never double-shift it.
            const chatOwnsViewport = html.classList.contains("alumni-chat-active");

            if (shell && keyboardOpen && !chatOwnsViewport) {
                shell.style.height = `${Math.round(vvHeight)}px`;
                shell.style.maxHeight = `${Math.round(vvHeight)}px`;
                shell.style.transform = vvTop > 0 ? `translate3d(0, ${Math.round(vvTop)}px, 0)` : "";
            } else {
                clearGlue();
            }
        };

        const schedule = () => {
            if (!raf) raf = window.requestAnimationFrame(sync);
        };

        // The keyboard animates for ~300ms: re-measure while it moves.
        const settle = () => {
            schedule();
            [60, 180, 360].forEach((ms) => {
                const id = window.setTimeout(() => {
                    timers.delete(id);
                    schedule();
                }, ms);
                timers.add(id);
            });
        };

        // Once the keyboard has fully closed, drop any leftover pan - ONCE, not
        // on every event (that was the tug-of-war).
        const onFocusOut = () => {
            settle();
            const id = window.setTimeout(() => {
                timers.delete(id);
                if (!isTextField(document.activeElement)) resetShellScroll();
            }, 420);
            timers.add(id);
        };

        const onShellScroll = (e) => {
            const t = e.currentTarget;
            if (t.scrollTop !== 0 || t.scrollLeft !== 0) {
                t.scrollTop = 0;
                t.scrollLeft = 0;
            }
        };
        // A real window scroll can only come from scrollIntoView()/focus() on a
        // non-fixed page; snap it back unless the keyboard is handling it.
        const onWindowScroll = () => {
            if (!html.classList.contains("shell-kb-open")) resetShellScroll();
        };

        sync();

        shell?.addEventListener("scroll", onShellScroll, { passive: true });
        inner?.addEventListener("scroll", onShellScroll, { passive: true });
        window.addEventListener("scroll", onWindowScroll, { passive: true });
        window.addEventListener("resize", schedule);
        window.addEventListener("orientationchange", settle);
        vv?.addEventListener("resize", schedule);
        vv?.addEventListener("scroll", schedule); // sync only - never reset the page here
        document.addEventListener("focusin", settle);
        document.addEventListener("focusout", onFocusOut);

        return () => {
            if (raf) window.cancelAnimationFrame(raf);
            timers.forEach((id) => window.clearTimeout(id));
            timers.clear();

            html.classList.remove("app-shell-active", "shell-kb-open");
            body.classList.remove("app-shell-active");
            html.style.removeProperty("--shell-header-h");
            clearGlue();

            shell?.removeEventListener("scroll", onShellScroll);
            inner?.removeEventListener("scroll", onShellScroll);
            window.removeEventListener("scroll", onWindowScroll);
            window.removeEventListener("resize", schedule);
            window.removeEventListener("orientationchange", settle);
            vv?.removeEventListener("resize", schedule);
            vv?.removeEventListener("scroll", schedule);
            document.removeEventListener("focusin", settle);
            document.removeEventListener("focusout", onFocusOut);
        };
    }, []);
}
