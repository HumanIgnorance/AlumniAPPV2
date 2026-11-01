import { useEffect, useState } from "react";
import { useAppTheme } from "~/hooks/useAppTheme";

export default function useLoginStatus({
    error,
    setPendingModalOpen,
    setRejectedNotes,
    setRejectedModalOpen,
    setLoginFormError,
}) {
    // ==========================================================
    // Prevent right-click, DevTools, and browser zoom (Desktop only)
    // ==========================================================

    // Disable right-click
    // useEffect(() => {
    //     const disableContextMenu = (e) => {
    //         if (window.innerWidth >= 992) {
    //             e.preventDefault();
    //         }
    //     };

    //     document.addEventListener("contextmenu", disableContextMenu);

    //     return () => {
    //         document.removeEventListener("contextmenu", disableContextMenu);
    //     };
    // }, []);

    // // Disable DevTools + Detect Zoom
    // useEffect(() => {
    //     if (window.innerWidth < 992) return;

    //     const showZoomModal = () => {
    //         setZoomModalOpen(true);
    //     };

    //     // ---------------------------------------------------------------
    //     // Baseline devicePixelRatio.
    //     //
    //     // Captured ONCE, silently, the moment the user lands on (or
    //     // refreshes) the login page. We never compare against a hardcoded
    //     // "100%" — some displays/OS scaling settings never report exactly
    //     // 1.0 even at true 100% browser zoom, which was what caused the
    //     // modal to incorrectly pop up on every page load/refresh.
    //     //
    //     // From here on, the modal only opens when devicePixelRatio
    //     // CHANGES relative to this baseline — i.e. the user actually
    //     // zoomed in/out while on this page. A plain window resize (e.g.
    //     // dragging the window edge) does not change devicePixelRatio, so
    //     // it will not false-trigger either.
    //     // ---------------------------------------------------------------
    //     let baselineDPR = window.devicePixelRatio;

    //     const handleKeyDown = (e) => {
    //         const key = e.key.toLowerCase();

    //         // ===============================
    //         // Block Developer Tools
    //         // ===============================
    //         if (
    //             e.key === "F12" ||
    //             (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
    //             (e.ctrlKey && key === "u") ||
    //             (e.ctrlKey && key === "s")
    //         ) {
    //             e.preventDefault();
    //             e.stopPropagation();
    //             return false;
    //         }

    //         // ===============================
    //         // Ctrl + 0 (Allow Reset Zoom)
    //         // ===============================
    //         if (e.ctrlKey && e.key === "0") {
    //             setTimeout(() => {
    //                 // Resetting zoom becomes the new "normal" baseline too.
    //                 baselineDPR = window.devicePixelRatio;
    //                 setZoomModalOpen(false);
    //             }, 300);

    //             return;
    //         }

    //         // ===============================
    //         // Block Zoom In / Out
    //         // ===============================
    //         if (
    //             e.ctrlKey &&
    //             (
    //                 e.key === "+" ||
    //                 e.key === "-" ||
    //                 e.key === "=" ||
    //                 e.key === "_" ||
    //                 e.code === "NumpadAdd" ||
    //                 e.code === "NumpadSubtract"
    //             )
    //         ) {
    //             e.preventDefault();
    //             e.stopPropagation();

    //             showZoomModal();

    //             return false;
    //         }
    //     };

    //     // Block Ctrl + Mouse Wheel
    //     const handleWheel = (e) => {
    //         if (e.ctrlKey) {
    //             e.preventDefault();
    //             e.stopPropagation();

    //             showZoomModal();

    //             return false;
    //         }
    //     };

    //     // Catches browser-menu zoom (Ctrl+/Ctrl- bypass via mouse, e.g.
    //     // View > Zoom In) which doesn't fire our keydown/wheel handlers.
    //     // Only compares against the live baseline — never fires on mount.
    //     const checkZoom = () => {
    //         const currentDPR = window.devicePixelRatio;

    //         if (currentDPR !== baselineDPR) {
    //             setZoomModalOpen(true);
    //         }
    //     };

    //     // Intentionally NOT calling checkZoom() here. Doing so was what
    //     // made the modal appear on every page load/refresh — we only want
    //     // to react to a live zoom action taken while the user is here.

    //     window.addEventListener("resize", checkZoom);
    //     document.addEventListener("keydown", handleKeyDown);
    //     document.addEventListener("wheel", handleWheel, {
    //         passive: false,
    //     });

    //     return () => {
    //         window.removeEventListener("resize", checkZoom);
    //         document.removeEventListener("keydown", handleKeyDown);
    //         document.removeEventListener("wheel", handleWheel);
    //     };
    // }, []);

    const PENDING_MSG_MATCH =
        /pending approval|wait for administrator|notified via email/i;

    const isPendingApproval = (msg) =>
        typeof msg === "string" && PENDING_MSG_MATCH.test(msg);

    // Backend signals a rejected alumni login by returning a message that
    // starts with "REJECTED::" followed by the admin notes, e.g.:
    //   "REJECTED::Your submitted document is unreadable, please re-upload."
    const REJECTED_PREFIX = "REJECTED::";

    const isRejectedAccount = (msg) =>
        typeof msg === "string" && msg.startsWith(REJECTED_PREFIX);

    const extractRejectedNotes = (msg) =>
        typeof msg === "string" ? msg.slice(REJECTED_PREFIX.length).trim() : "";

    useEffect(() => {
        if (!error) return;
        if (isPendingApproval(error)) {
            setPendingModalOpen(true);
            return;
        }
        if (isRejectedAccount(error)) {
            setRejectedNotes(extractRejectedNotes(error));
            setRejectedModalOpen(true);
            return;
        }
        // Any other error → show inline alert above the Email field
        setLoginFormError(typeof error === "string" ? error : String(error));
    }, [error]);

    // Local dismissed flags
    const [dismissedError, setDismissedError] = useState(null);

    const [dismissedSessionAlert, setDismissedSessionAlert] = useState(false);

    useEffect(() => {
        if (error) setDismissedError(null);
    }, [error]);

    // ============ THEME SYSTEM ============
    // Now backed by the shared useAppTheme hook so the black/white
    // preference is app-wide (not just this component), synced across
    // tabs, and reflected in the browser/PWA chrome (theme-color meta,
    // status bar, manifest) — not just the login page's own DOM attribute.
    const { theme: currentTheme, toggleTheme } = useAppTheme();

    const handleThemeToggle = () => {
        toggleTheme();
        if (currentTheme === "white") {
            // We're switching TO black — currentTheme still reflects the
            // pre-toggle value at the moment this handler runs.
            // (removed: setScatterLetters/setAnimationKey were never defined
            // and threw a ReferenceError on every switch to the dark theme)
        }
    };

    return {
        currentTheme,
        handleThemeToggle,
        dismissedSessionAlert,
        setDismissedSessionAlert,
    };
}
