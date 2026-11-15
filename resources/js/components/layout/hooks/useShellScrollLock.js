import { useEffect } from "react";
import { resetShellScroll } from "~/utils/scrollInContent";

/**
 * Locks the signed-in shell to the viewport so ONLY #content scrolls.
 *
 *  1. adds  html.app-shell-active / body.app-shell-active  (the CSS in
 *     layout/styles/01-shell-base.css + css/mobile-app-responsive.css is
 *     scoped to this class, so it only applies while the shell is mounted
 *     and never leaks onto the public pages);
 *  2. guards against anything (scrollIntoView, focus(), autofocus, an iOS
 *     keyboard) scrolling the shell wrappers or the document: if they ever
 *     move, they are snapped straight back to 0 so the header, sidebar and
 *     footer can never ride up.
 */
export default function useShellScrollLock() {
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        html.classList.add("app-shell-active");
        body.classList.add("app-shell-active");

        const shell = document.querySelector(".app-shell-root");
        const inner = document.querySelector(".site-layout");

        const onShellScroll = (e) => {
            const t = e.currentTarget;
            if (t.scrollTop !== 0 || t.scrollLeft !== 0) {
                t.scrollTop = 0;
                t.scrollLeft = 0;
            }
        };
        const onWindowScroll = () => resetShellScroll();

        shell?.addEventListener("scroll", onShellScroll, { passive: true });
        inner?.addEventListener("scroll", onShellScroll, { passive: true });
        window.addEventListener("scroll", onWindowScroll, { passive: true });

        // iOS: the on-screen keyboard resizes the visual viewport and can nudge the page.
        const vv = window.visualViewport;
        vv?.addEventListener("scroll", onWindowScroll);

        return () => {
            html.classList.remove("app-shell-active");
            body.classList.remove("app-shell-active");
            shell?.removeEventListener("scroll", onShellScroll);
            inner?.removeEventListener("scroll", onShellScroll);
            window.removeEventListener("scroll", onWindowScroll);
            vv?.removeEventListener("scroll", onWindowScroll);
        };
    }, []);
}
