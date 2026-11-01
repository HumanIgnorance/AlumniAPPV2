import React from "react";
import {
    CheckCircleFilled,
    CloseCircleFilled,
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
} from "@ant-design/icons";
import { Alert, Input } from "antd";
import { Button } from "~/components/index";
import logo from "~/assets/images/site-logo.png";
import { useLoginContext } from "~/components/login/LoginContext";

/* =========================================================
     RENDER: RESET PASSWORD FORM
     ========================================================= */
export default function ResetPasswordForm() {
    const {
        forgotError,
        setForgotError,
        setShowNewPassword,
        showNewPassword,
        newPassword,
        setNewPassword,
        passwordStrength,
        setShowConfirmPassword,
        showConfirmPassword,
        confirmPassword,
        setConfirmPassword,
        passwordsMatch,
        hasMinLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        isLoading,
        handleResetPassword,
        isPasswordValid,
        handleBackToLogin,
    } = useLoginContext();

    return (
        <div className="login-card">
            <div className="mobile-landscape-logo">
                <img src={logo || "/placeholder.svg"} alt="OCC Alumni Logo" />
            </div>
            <div className="login-card__header">
                <div className="login-card__logo">
                    <img
                        src={logo || "/placeholder.svg"}
                        alt="OCC Alumni Logo"
                    />
                </div>
                <span className="login-card__chip">
                    <LockOutlined /> Set New Password
                </span>
                <h2 className="login-card__title">Create a new password</h2>
                <p className="login-card__subtitle">
                    Set up a strong and secure password for your account.
                </p>
            </div>

            {forgotError && (
                <Alert
                    className="login-alert"
                    message={forgotError}
                    type="error"
                    showIcon
                    onClick={() => setForgotError("")}
                    style={{ cursor: "pointer" }}
                />
            )}

            <div style={{ marginBottom: 14 }}>
                <label className="login-label">
                    New Password <span className="req">*</span>
                </label>
                <Input
                    prefix={<LockOutlined />}
                    suffix={
                        <span
                            role="button"
                            tabIndex={0}
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setShowNewPassword(!showNewPassword))}
                            style={{ cursor: "pointer" }}
                        >
                            {showNewPassword ? (
                                <EyeTwoTone />
                            ) : (
                                <EyeInvisibleOutlined />
                            )}
                        </span>
                    }
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    size="large"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="login-input"
                />

                {newPassword && (
                    <div className="login-strength">
                        <div className="login-strength__head">
                            <span>Password strength</span>
                            <span
                                className="val"
                                style={{ color: passwordStrength.color }}
                            >
                                {passwordStrength.label}
                            </span>
                        </div>
                        <div className="login-strength__bar">
                            <div
                                style={{
                                    width: `${passwordStrength.percent}%`,
                                    background: passwordStrength.color,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: 14 }}>
                <label className="login-label">
                    Confirm Password <span className="req">*</span>
                </label>
                <Input
                    prefix={<LockOutlined />}
                    suffix={
                        <span
                            role="button"
                            tabIndex={0}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setShowConfirmPassword(!showConfirmPassword))}
                            style={{ cursor: "pointer" }}
                        >
                            {showConfirmPassword ? (
                                <EyeTwoTone />
                            ) : (
                                <EyeInvisibleOutlined />
                            )}
                        </span>
                    }
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    size="large"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onPressEnter={() => {
                        if (isPasswordValid() && passwordsMatch && !isLoading) {
                            handleResetPassword();
                        }
                    }}
                    autoComplete="new-password"
                    className="login-input"
                />

                {confirmPassword && (
                    <div
                        className={`login-match ${passwordsMatch ? "is-ok" : "is-bad"}`}
                    >
                        {passwordsMatch ? (
                            <CheckCircleFilled />
                        ) : (
                            <CloseCircleFilled />
                        )}
                        <span>
                            {passwordsMatch
                                ? "Passwords match"
                                : "Passwords do not match"}
                        </span>
                    </div>
                )}
            </div>

            <div className="login-req-card">
                <div className="login-req-card__title">
                    <LockOutlined /> Password Requirements
                </div>
                <div className="login-req-grid">
                    <div
                        className={`login-req-item ${hasMinLength ? "is-ok" : ""}`}
                    >
                        {hasMinLength ? (
                            <CheckCircleFilled />
                        ) : (
                            <CloseCircleFilled />
                        )}
                        <span>8+ characters</span>
                    </div>
                    <div
                        className={`login-req-item ${hasUppercase ? "is-ok" : ""}`}
                    >
                        {hasUppercase ? (
                            <CheckCircleFilled />
                        ) : (
                            <CloseCircleFilled />
                        )}
                        <span>Uppercase (A-Z)</span>
                    </div>
                    <div
                        className={`login-req-item ${hasLowercase ? "is-ok" : ""}`}
                    >
                        {hasLowercase ? (
                            <CheckCircleFilled />
                        ) : (
                            <CloseCircleFilled />
                        )}
                        <span>Lowercase (a-z)</span>
                    </div>
                    <div
                        className={`login-req-item ${hasNumber ? "is-ok" : ""}`}
                    >
                        {hasNumber ? (
                            <CheckCircleFilled />
                        ) : (
                            <CloseCircleFilled />
                        )}
                        <span>Number (0-9)</span>
                    </div>
                </div>
            </div>

            <Button
                type="primary"
                loading={isLoading}
                onClick={handleResetPassword}
                disabled={!isPasswordValid() || !passwordsMatch}
                label={
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <LockOutlined /> Reset Password
                    </span>
                }
                className={`login-btn-primary ${!isPasswordValid() || !passwordsMatch ? "is-disabled" : ""}`}
            />

            <div className="login-divider">
                <div className="line" />
                <span>OR</span>
                <div className="line" />
            </div>

            <p
                style={{
                    textAlign: "center",
                    margin: 0,
                    color: "var(--text-muted)",
                    fontSize: 14,
                }}
            >
                Remember your password?{" "}
                <a
                    className="login-link"
                    role="button"
                    tabIndex={0}
                    onClick={handleBackToLogin}
                    onKeyDown={(e) => e.key === "Enter" && handleBackToLogin()}
                >
                    Sign in here
                </a>
            </p>
        </div>
    );
}
