import React from "react";
import { BulbOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Input } from "antd";
import { Button } from "~/components/index";
import logo from "~/assets/images/site-logo.png";
import { useLoginContext } from "~/components/login/LoginContext";

/* =========================================================
     RENDER: FORGOT PASSWORD FORM
     ========================================================= */
export default function ForgotPasswordForm() {
    const {
        forgotError,
        setForgotError,
        forgotEmail,
        setForgotEmail,
        handleFindAccount,
        isLoading,
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
                    <MailOutlined /> Account Recovery
                </span>
                <h2 className="login-card__title">Forgot your password?</h2>
                <p className="login-card__subtitle">
                    No worries — enter your registered Gmail and we'll help you
                    recover your account.
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

            <div style={{ marginBottom: 16 }}>
                <label className="login-label">
                    Gmail Address <span className="req">*</span>
                </label>
                <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your gmail"
                    size="large"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    onPressEnter={handleFindAccount}
                    className="login-input"
                />
            </div>

            <Button
                type="primary"
                loading={isLoading}
                onClick={handleFindAccount}
                label={
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <UserOutlined /> Find my account
                    </span>
                }
                className="login-btn-primary"
            />

            <div className="login-divider">
                <div className="line" />
                <span>OR</span>
                <div className="line" />
            </div>

            <p className="login-register-text">
                Remember your password?{" "}
                <a className="login-link" onClick={handleBackToLogin}>
                    Sign in here
                </a>
            </p>

            <div className="login-tip">
                <span className="icon">
                    <BulbOutlined />
                </span>
                <div className="meta">
                    <strong>Tip</strong>
                    <span>
                        Your Gmail is the email address you use to log in to the
                        system.
                    </span>
                </div>
            </div>
        </div>
    );
}
