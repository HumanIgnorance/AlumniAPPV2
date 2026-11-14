import { useEffect, useState } from "react";
import { message } from "antd";
import { useAppTheme } from "~/hooks/useAppTheme";

export default function useLoginStatus({
    error,
    setPendingModalOpen,
    setVerifyModalOpen,
    setVerifyEmail,
    loginForm,
    setRejectedNotes,
    setRejectedModalOpen,
    setLoginFormError,
}) {
    // Right-click / DevTools / zoom guard now lives in usePreventInspect
    // (called from useLoginState) and is switched by .env - nothing here.

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

    // Backend (AuthController@login) asks for email verification with a
    // message containing "verify your email address".
    const isEmailUnverified = (msg) =>
        typeof msg === "string" && /verify your email address/i.test(msg);

    // Result of clicking the link in the verification email: /login?verify=ok|invalid
    useEffect(() => {
        const flag = new URLSearchParams(window.location.search).get("verify");
        if (flag === "ok") {
            message.success("Email verified. Your registration now waits for administrator approval.", 6);
        } else if (flag === "invalid") {
            message.error("That verification link is invalid or has expired. Sign in to request a new email.", 6);
        }
    }, []);

    useEffect(() => {
        if (!error) return;
        if (isEmailUnverified(error)) {
            setVerifyEmail((loginForm && loginForm.getFieldValue("email")) || "");
            setVerifyModalOpen(true);
            return;
        }
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
