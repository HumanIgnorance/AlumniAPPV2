import { useEffect, useLayoutEffect, useState } from "react";

/**
 * Phone / small-tablet detection for the alumni chat.
 * Same breakpoint the messages stylesheet uses for its mobile layout.
 */
const PHONE_QUERY = "(max-width: 992px)";

const readPhone = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia(PHONE_QUERY).matches
        : false;

export function useIsPhoneViewport() {
    const [isPhone, setIsPhone] = useState(readPhone);

    useEffect(() => {
        if (typeof window.matchMedia !== "function") return undefined;
        const mq = window.matchMedia(PHONE_QUERY);
        const onChange = () => setIsPhone(mq.matches);
        onChange();
        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else mq.addListener(onChange); // old iOS Safari (<14)
        return () => {
            if (mq.removeEventListener)
                mq.removeEventListener("change", onChange);
            else mq.removeListener(onChange);
        };
    }, []);

    return isPhone;
}

/**
 * Keeps the alumni chat glued to what the person can actually SEE.
 *
 * Why this exists: on iPhone (Safari AND the installed PWA) the on-screen
 * keyboard does not shrink the page, it shrinks the *visual viewport* and iOS
 * then scrolls the page up/down to reveal the focused field. Anything sized
 * with vh / dvh / 100% ends up taller than the visible area, so the composer
 * slides behind the keyboard and the typed text cannot be seen.
 *
 * While `active` this hook:
 *   - sets  --chat-vh  (visible height) and  --chat-vt  (visual viewport
 *     offset) on <html>, kept in sync on every keyboard / rotation / URL-bar
 *     change. The CSS pins the chat to exactly that box (position: fixed).
 *   - adds  html.alumni-chat-active  (locks page scrolling) and
 *     html.alumni-chat-kb  (keyboard is open: drop the home-indicator inset).
 *   - keeps the newest message visible when the keyboard opens (the pinned
 *     box follows iOS's pan; the page is never snapped back).
 *   - blocks rubber-band scrolling of the page from the header / composer.
 *
 * Works the same in Safari, Chrome, installed PWAs and Android browsers. When
 * `visualViewport` is missing it falls back to innerHeight.
 */
export default function useMobileChatViewport(active, variant = "alumni") {
    // Layout effect so the first painted frame is already pinned (no flash).
    useLayoutEffect(() => {
        if (!active || typeof window === "undefined") return undefined;

        const html = document.documentElement;
        const vv = window.visualViewport;
        let raf = 0;
        let keyboardWasOpen = false;
        const timers = new Set();

        // Full (keyboard-closed) height. Android Chrome / installed PWAs use
        // `interactive-widget=resizes-content`, which shrinks innerHeight too,
        // so "innerHeight - visualViewport.height" can never detect the
        // keyboard there. Compare against the last height measured while no
        // field was focused instead.
        const isField = (el) =>
            !!el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT");
        let baseHeight = Math.max(window.innerHeight, vv ? vv.height : 0);

        // "alumni-chat-active" drives the shared pinning rules; the admin chat
        // adds "admin-chat-active" for its own container (see 10-ui-upgrade.css).
        const activeClasses =
            variant === "admin"
                ? ["alumni-chat-active", "admin-chat-active"]
                : ["alumni-chat-active"];
        html.classList.add(...activeClasses);
        document.body.classList.add(...activeClasses);

        const scrollListToBottom = () => {
            const area = document.querySelector(
                ".alumni-messages-container .alumni-messages-area, .chat-area.admin-chat-pinned .messages-area",
            );
            if (area) area.scrollTop = area.scrollHeight;
        };

        const sync = () => {
            raf = 0;
            const height = vv ? vv.height : window.innerHeight;
            const top = vv ? vv.offsetTop : 0;

            html.style.setProperty("--chat-vh", `${Math.round(height)}px`);
            html.style.setProperty("--chat-vt", `${Math.max(0, Math.round(top))}px`);

            // Keyboard heuristic: a field is focused and the visible area is
            // much shorter than the full (keyboard-closed) height.
            const fieldFocused = isField(document.activeElement);
            if (!fieldFocused) {
                baseHeight = Math.max(height, window.innerHeight);
            }
            const keyboardOpen = fieldFocused && baseHeight - height > 120;
            html.classList.toggle("alumni-chat-kb", keyboardOpen);

            // NOTE: we deliberately do NOT scrollTo(0, 0) / resetShellScroll() here.
            // iOS pans the visual viewport to reveal the focused field; snapping
            // it back on every event made the header and composer "vibrate".
            // The chat is pinned to visualViewport (--chat-vt / --chat-vh), so it
            // follows the pan instead of fighting it.

            if (keyboardOpen && !keyboardWasOpen) scrollListToBottom();
            keyboardWasOpen = keyboardOpen;
        };

        const schedule = () => {
            if (!raf) raf = window.requestAnimationFrame(sync);
        };

        // The keyboard animates for ~250-300ms; re-measure while it moves.
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

        // Stop the page rubber-banding when the finger is on the header or the
        // composer. The message list itself (and the lightbox / modals) scroll.
        const onTouchMove = (e) => {
            if (!e.cancelable) return;
            const t = e.target;
            if (!t || typeof t.closest !== "function") return;
            if (
                !t.closest(
                    ".alumni-messages-container, .chat-area.admin-chat-pinned",
                )
            )
                return;
            if (
                t.closest(
                    ".alumni-messages-area, .messages-area, textarea, input, .image-lightbox, .mam-overlay, .delete-confirm-modal-overlay",
                )
            )
                return;
            e.preventDefault();
        };

        sync();

        vv?.addEventListener("resize", schedule);
        vv?.addEventListener("scroll", schedule);
        window.addEventListener("resize", schedule);
        window.addEventListener("orientationchange", settle);
        window.addEventListener("scroll", schedule, { passive: true });
        // Focus: measure right now (no frame of delay), then keep re-measuring
        // while the keyboard animates, so the pinned box never lags behind.
        const onFocusIn = () => {
            if (raf) window.cancelAnimationFrame(raf);
            sync();
            settle();
        };
        document.addEventListener("focusin", onFocusIn);
        document.addEventListener("focusout", settle);
        document.addEventListener("touchmove", onTouchMove, { passive: false });

        return () => {
            if (raf) window.cancelAnimationFrame(raf);
            timers.forEach((id) => window.clearTimeout(id));
            timers.clear();

            vv?.removeEventListener("resize", schedule);
            vv?.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            window.removeEventListener("orientationchange", settle);
            window.removeEventListener("scroll", schedule);
            document.removeEventListener("focusin", onFocusIn);
            document.removeEventListener("focusout", settle);
            document.removeEventListener("touchmove", onTouchMove);

            html.classList.remove(...activeClasses, "alumni-chat-kb");
            document.body.classList.remove(...activeClasses);
            html.style.removeProperty("--chat-vh");
            html.style.removeProperty("--chat-vt");
        };
    }, [active, variant]);
}
