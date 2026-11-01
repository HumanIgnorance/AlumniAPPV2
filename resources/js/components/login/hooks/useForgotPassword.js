import { useEffect } from "react";
import { API_BASE_URL } from "~/components/login/loginConstants";
import { buildPageTitle } from "~/config/site";
import { COLORS } from "~/config/theme";

// POST JSON and never throw on a non-JSON body (e.g. a 429 or proxy page).
async function postJson(path, body) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(body),
    });
    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }
    return { response, data };
}

// Friendly message for any failed response (rate limit, Laravel 422, plain).
function errorMessage(response, data, fallback) {
    if (response.status === 429) {
        return "Too many attempts. Please wait a few minutes and try again.";
    }
    const firstGroup = data?.errors && Object.values(data.errors)[0];
    if (Array.isArray(firstGroup) && firstGroup[0]) return firstGroup[0];
    return data?.message || fallback;
}

export default function useForgotPassword({
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
}) {
    const handleFindAccount = async () => {
        // Mobile keyboards often append a space; emails are not case-sensitive.
        const email = forgotEmail.trim();
        if (!email) {
            setForgotError("Please enter your email address");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setForgotError("Please enter a valid email address");
            return;
        }
        if (email !== forgotEmail) setForgotEmail(email);

        setIsLoading(true);
        setForgotError("");

        try {
            const { response, data } = await postJson("/password/find-account", {
                email,
            });

            if (response.ok && data?.success) {
                setFoundUser({
                    fullName: data.data.full_name,
                    email: data.data.email,
                });
                setCurrentView("find-user");
            } else {
                setForgotError(
                    errorMessage(
                        response,
                        data,
                        "No account found with this email address",
                    ),
                );
            }
        } catch (err) {
            console.error("Find account error:", err);
            setForgotError(
                "Unable to connect to server. Please try again later.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendResetLink = async () => {
        setIsLoading(true);
        setForgotError("");

        try {
            const { response, data } = await postJson(
                "/password/send-reset-link",
                { email: forgotEmail.trim() },
            );

            if (response.ok && data?.success) {
                setEmailSent(true);
            } else {
                setForgotError(
                    errorMessage(
                        response,
                        data,
                        "Failed to send reset link. Please try again.",
                    ),
                );
            }
        } catch (err) {
            console.error("Send reset link error:", err);
            setForgotError(
                "Unable to connect to server. Please try again later.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setForgotError("Please fill in all fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            setForgotError("Passwords do not match");
            return;
        }
        if (!isPasswordValid()) {
            setForgotError("Password does not meet requirements");
            return;
        }

        setIsLoading(true);
        setForgotError("");

        try {
            const { response, data } = await postJson("/password/reset", {
                email: forgotEmail.trim(),
                token: resetToken,
                password: newPassword,
                password_confirmation: confirmPassword,
            });

            if (response.ok && data?.success) {
                setResetSuccess(true);
            } else {
                setForgotError(
                    errorMessage(
                        response,
                        data,
                        "Failed to reset password. The link may have expired.",
                    ),
                );
            }
        } catch (err) {
            console.error("Reset password error:", err);
            setForgotError(
                "Unable to connect to server. Please try again later.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const hasMinLength = newPassword.length >= 8;

    const hasUppercase = /[A-Z]/.test(newPassword);

    const hasLowercase = /[a-z]/.test(newPassword);

    const hasNumber = /[0-9]/.test(newPassword);

    const passwordsMatch =
        newPassword === confirmPassword && confirmPassword.length > 0;

    const isPasswordValid = () =>
        hasMinLength && hasUppercase && hasLowercase && hasNumber;

    const getPasswordStrength = () => {
        let strength = 0;
        if (hasMinLength) strength++;
        if (hasUppercase) strength++;
        if (hasLowercase) strength++;
        if (hasNumber) strength++;

        if (strength <= 1)
            return { label: "Weak", color: COLORS.red500, percent: 25 };
        if (strength === 2)
            return { label: "Fair", color: COLORS.amber500, percent: 50 };
        if (strength === 3)
            return { label: "Good", color: COLORS.green500, percent: 75 };
        return { label: "Strong", color: "var(--success)", percent: 100 };
    };

    const passwordStrength = getPasswordStrength();

    const handleBackToLogin = () => {
        setCurrentView("login");
        setForgotEmail("");
        setFoundUser(null);
        setEmailSent(false);
        setForgotError("");
        setNewPassword("");
        setConfirmPassword("");
        setResetToken("");
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
        );
    };

    const handleTryAgain = () => {
        setCurrentView("forgot-password");
        setFoundUser(null);
        setEmailSent(false);
        setForgotError("");
    };

    const handleSuccessModalClose = () => {
        setIsRedirecting(true);
        setTimeout(() => {
            setIsRedirecting(false);
            setResetSuccess(false);
            handleBackToLogin();
        }, 1500);
    };

    useEffect(() => {
        switch (currentView) {
            case "forgot-password":
                document.title = buildPageTitle("Forgot Password");
                break;

            case "find-user":
                document.title = buildPageTitle("Account Recovery");
                break;

            case "reset-password":
                document.title = buildPageTitle("Reset Password");
                break;

            default:
                document.title = buildPageTitle("Login");
        }
    }, [currentView]);

    return {
        handleFindAccount,
        handleBackToLogin,
        handleTryAgain,
        handleSendResetLink,
        passwordStrength,
        passwordsMatch,
        hasMinLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        handleResetPassword,
        isPasswordValid,
        handleSuccessModalClose,
    };
}
