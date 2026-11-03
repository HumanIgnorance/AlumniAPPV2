import { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import secureLocalStorage from "react-secure-storage";
import { useShallow } from "zustand/react/shallow";
import { useLoginStore } from "~/states/loginState";
import usePreventInspect from "~/hooks/usePreventInspect";

export default function useLoginState() {
    const [error, isSubmit, submitForm] = useLoginStore(
        useShallow((state) => [state.error, state.isSubmit, state.checkLogin]),
    );

    const urlParams = new URLSearchParams(window.location.search);

    const type = urlParams.get("type");

    // Reveal animation
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 60);
        return () => clearTimeout(t);
    }, []);

    // ===== Remember Me (per-device, encrypted via react-secure-storage) =====
    const REMEMBER_KEY = "atms_remembered_credentials";

    const [loginForm] = Form.useForm();

    const [rememberMe, setRememberMe] = useState(false);

    // True when fields were pre-filled by Remember Me (not by a password manager).
    // The autofill poller checks this so it never auto-submits after a normal logout.
    const rememberMePrefilledRef = useRef(false);

    // Load saved credentials on mount
    useEffect(() => {
        try {
            const saved = secureLocalStorage.getItem(REMEMBER_KEY);
            if (saved && saved.email) {
                loginForm.setFieldsValue({
                    email: saved.email,
                    password: saved.password || "",
                });
                setRememberMe(true);
                // Mark that WE filled the fields — not the browser password manager
                rememberMePrefilledRef.current = true;
            }
        } catch (e) {
            console.warn("Failed to load remembered credentials", e);
        }
    }, []);

    // Wrap submit so we can persist credentials before delegating to the store
    const handleLoginSubmit = async (values) => {
        try {
            if (rememberMe) {
                secureLocalStorage.setItem(REMEMBER_KEY, {
                    email: values.email,
                    password: values.password,
                    savedAt: new Date().toISOString(),
                });
            } else {
                secureLocalStorage.removeItem(REMEMBER_KEY);
            }
        } catch (e) {
            console.warn("Failed to persist remembered credentials", e);
        }

        // Attempt normal login
        await submitForm(values);
    };

    // Must be declared BEFORE the autofill effect below (used in its deps array).
    const [currentView, setCurrentView] = useState("login");

    // ─────────────────────────────────────────────────────────
    //  Autofill-detection: submit automatically when a password
    //  manager (iCloud Keychain, Google, Samsung, Chrome, Safari)
    //  fills both fields (these managers may use the device's own
    //  biometric unlock before autofilling, unrelated to this app).
    //  Polls every 300 ms for up to ~5 s after mount, then stops.
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        // Only run on the login view; don't interfere with other views.
        if (currentView !== "login") return;

        let attempts = 0;
        const MAX_ATTEMPTS = 17; // ~5 s at 300 ms

        const autoLogin = setInterval(() => {
            attempts++;

            // If Remember Me pre-filled the fields on this load, the poller
            // must not auto-submit — the user explicitly logged out and should
            // have to sign in manually (or use their password manager biometric).
            // Once the user clears a field and the flag is reset, normal
            // password-manager autofill detection resumes.
            if (rememberMePrefilledRef.current) {
                clearInterval(autoLogin);
                return;
            }

            const values = loginForm.getFieldsValue();

            if (values.email && values.password && !isSubmit) {
                loginForm.submit();
                clearInterval(autoLogin);
                return;
            }

            if (attempts >= MAX_ATTEMPTS) {
                clearInterval(autoLogin);
            }
        }, 300);

        return () => clearInterval(autoLogin);
    }, [currentView]);

    // Password Reset States
    const [forgotEmail, setForgotEmail] = useState("");

    const [foundUser, setFoundUser] = useState(null);

    const [emailSent, setEmailSent] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [forgotError, setForgotError] = useState("");

    const [resetToken, setResetToken] = useState("");

    // Reset Password States
    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [resetSuccess, setResetSuccess] = useState(false);

    const [isRedirecting, setIsRedirecting] = useState(false);

    const [pendingModalOpen, setPendingModalOpen] = useState(false);

    const [rejectedModalOpen, setRejectedModalOpen] = useState(false);

    const [rejectedNotes, setRejectedNotes] = useState("");

    const [loginFormError, setLoginFormError] = useState("");

    // Right-click / DevTools shortcuts / browser-zoom guard, switched by
    // VITE_ENABLE_INSPECT_PROTECTION in .env. The zoom dialog only ever
    // asks to be closed, so setZoomModalOpen(false) maps to closeZoomModal.
    const { zoomModalOpen, closeZoomModal } = usePreventInspect();
    const setZoomModalOpen = (open) => { if (!open) closeZoomModal(); };

    return {
        error,
        setPendingModalOpen,
        setRejectedNotes,
        setRejectedModalOpen,
        setLoginFormError,
        forgotEmail,
        setForgotError,
        setIsLoading,
        setFoundUser,
        setCurrentView,
        setEmailSent,
        newPassword,
        confirmPassword,
        resetToken,
        setResetSuccess,
        setForgotEmail,
        setNewPassword,
        setConfirmPassword,
        setResetToken,
        setIsRedirecting,
        currentView,
        loginFormError,
        type,
        loginForm,
        handleLoginSubmit,
        rememberMePrefilledRef,
        rememberMe,
        setRememberMe,
        REMEMBER_KEY,
        isSubmit,
        forgotError,
        isLoading,
        emailSent,
        foundUser,
        setShowNewPassword,
        showNewPassword,
        setShowConfirmPassword,
        showConfirmPassword,
        revealed,
        zoomModalOpen,
        setZoomModalOpen,
        pendingModalOpen,
        rejectedModalOpen,
        rejectedNotes,
        resetSuccess,
        isRedirecting,
    };
}
