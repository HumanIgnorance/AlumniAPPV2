import React from "react";
import {
    ArrowRightOutlined,
    CheckCircleFilled,
    MailOutlined,
} from "@ant-design/icons";
import { Alert } from "antd";
import { Button } from "~/components/index";
import logo from "~/assets/images/site-logo.png";
import { useLoginContext } from "~/components/login/LoginContext";

/* =========================================================
     RENDER: FIND USER / SEND RESET LINK
     ========================================================= */
export default function FindUserForm() {
    const {
        forgotError,
        setForgotError,
        emailSent,
        maskName,
        foundUser,
        maskEmail,
        handleTryAgain,
        isLoading,
        handleSendResetLink,
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
                    <CheckCircleFilled /> Account Found
                </span>
                <h2 className="login-card__title">Reset your password</h2>
                <p className="login-card__subtitle">
                    We'll send a secure password reset link to your registered
                    email.
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

            {emailSent && (
                <div className="login-success-box">
                    <div className="head">
                        <CheckCircleFilled />
                        <div>
                            <strong>Email Sent</strong>
                            <small>
                                We've emailed your password reset link.
                            </small>
                        </div>
                    </div>
                </div>
            )}

            <div className="login-success-box">
                <div className="head">
                    <CheckCircleFilled />
                    <div>
                        <strong>Account Found!</strong>
                        <div className="row">
                            {maskName(foundUser?.fullName)}
                        </div>
                        <div className="row">
                            <MailOutlined /> {maskEmail(foundUser?.email)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-info-box">
                <div className="head">
                    <span className="icon-wrap">
                        <MailOutlined />
                    </span>
                    <div>
                        <strong>Ready to reset your password?</strong>
                        <span>
                            Click the button below to receive a secure reset
                            link via email. The link will expire in 60 minutes.
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <button
                    type="button"
                    className="login-btn-ghost"
                    onClick={handleTryAgain}
                >
                    <ArrowRightOutlined
                        style={{ transform: "rotate(180deg)" }}
                    />{" "}
                    Try Again
                </button>
                <Button
                    type="primary"
                    loading={isLoading}
                    onClick={handleSendResetLink}
                    disabled={emailSent}
                    label={
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <MailOutlined />{" "}
                            {emailSent ? "Link Sent" : "Send Reset Link"}
                        </span>
                    }
                    className={`login-btn-primary ${emailSent ? "is-disabled" : ""}`}
                />
            </div>

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
                <a className="login-link" onClick={handleBackToLogin}>
                    Sign in here
                </a>
            </p>
        </div>
    );
}
