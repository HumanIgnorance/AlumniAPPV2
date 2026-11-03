// ============================================================
// devtoolsGuard.js
// ATMS - hide the whole app while browser DevTools is open.
//
// Imported FIRST in app.js, so it runs before React mounts. That also
// covers DevTools already being open when someone types our URL: the
// first check happens at load, before any UI is shown, and it keeps
// checking every second after that.
//
// While DevTools is open the page is plain white with a short notice.
// Close DevTools and the app comes back (no reload needed).
//
// Switch with VITE_ENABLE_INSPECT_PROTECTION in .env (true|false).
// Desktop only. This is a deterrent: it cannot stop a proxy or direct
// API calls - real security stays on the server (auth, policies).
// ============================================================
import { INSPECT_PROTECTION_ENABLED } from "../config/inspect";

const DESKTOP_MIN_WIDTH = 992;

const COVER_HTML =
    "<h1>ATMS - Opol Community College</h1>" +
    "<p>Alumni Tracing Management System for the OCC Alumni Association.</p>" +
    "<p>JavaScript is required to use ATMS. Please enable JavaScript in your " +
    "browser, then reload this page.</p>";

function startGuard() {
    if (!INSPECT_PROTECTION_ENABLED || typeof window === "undefined") return;

    // Desktop check uses the SCREEN size, not the page size: with DevTools
    // already open the page area can be narrower than 992px, which would
    // wrongly skip the guard exactly when it is needed.
    const isTouch =
        window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (
        isTouch ||
        Math.max(window.screen.width, window.screen.height) < DESKTOP_MIN_WIDTH
    ) {
        return;
    }

    const baseDPR = window.devicePixelRatio || 1;
    let cover = null;
    let hider = null;

    const show = () => {
        // (Re)create both pieces every time, so deleting them from the
        // Elements panel does nothing - the next check puts them back.
        if (!hider || !hider.isConnected) {
            hider = document.createElement("style");
            hider.textContent = "#app{display:none !important}";
            document.head.appendChild(hider);
        }
        if (!cover || !cover.isConnected) {
            cover = document.createElement("div");
            cover.style.cssText =
                "position:fixed;inset:0;z-index:2147483647;background:#fff;" +
                "color:#111;font-family:Arial,Helvetica,sans-serif;padding:24px;";
            cover.innerHTML = COVER_HTML;
            document.body.appendChild(cover);
        }
    };

    const hide = () => {
        if (cover) { cover.remove(); cover = null; }
        if (hider) { hider.remove(); hider = null; }
    };

    // Docked DevTools: outer window gets bigger than the page area.
    // Normalised by zoom so browser zoom alone does not trigger it.
    const dockedOpen = () => {
        const zoom = (window.devicePixelRatio || 1) / baseDPR;
        return (
            window.outerWidth - window.innerWidth * zoom > 160 ||
            window.outerHeight - window.innerHeight * zoom > 160
        );
    };

    const check = () => {
        if (dockedOpen()) show();
        else hide();
    };

    check(); // before React mounts, so nothing is ever shown
    window.setInterval(check, 1000);
    window.addEventListener("resize", check);
}

startGuard();
