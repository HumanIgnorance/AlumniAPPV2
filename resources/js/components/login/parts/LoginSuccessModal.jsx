import React from "react";
import { CheckCircleFilled, RocketOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { Button } from "~/components/index";
import logo from "~/assets/images/site-logo.png";
import { useLoginContext } from "~/components/login/LoginContext";

export default function LoginSuccessModal() {
    const {
        resetSuccess,
        isRedirecting,
        currentTheme,
        handleSuccessModalClose,
    } = useLoginContext();

    return (
        <Modal
            open={resetSuccess}
            footer={null}
            closable={false}
            centered
            width={420}
            className="login-success-modal"
        >
            <div className="login-success-modal__inner">
                {isRedirecting ? (
                    <div
                        className={`signin-redirect ${currentTheme === "black" ? "dark" : "light"}`}
                    >
                        <span className="signin-redirect__chip">
                            <span className="pulse" />
                            Secure Session
                        </span>
                        <div className="signin-redirect__logo">
                            <img
                                src={logo || "/placeholder.svg"}
                                alt="OCC Alumni Logo"
                            />
                        </div>
                        <h3 className="signin-redirect__title">
                            Sign <span className="grad">In</span>
                        </h3>
                        <p className="signin-redirect__sub">
                            We're directing you to the login…
                        </p>
                        <div
                            className="signin-redirect__loader"
                            aria-hidden="true"
                        />
                        <div className="signin-redirect__loading-text">
                            Loading<span className="dot">.</span>
                            <span className="dot">.</span>
                            <span className="dot">.</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="login-success-modal__icon">
                            <CheckCircleFilled />
                        </div>
                        <h3>Password Reset Successful!</h3>
                        <p>
                            Your password has been successfully changed. Please
                            sign in with your new password.
                        </p>
                        <Button
                            type="primary"
                            onClick={handleSuccessModalClose}
                            label={
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <RocketOutlined /> Sign In
                                </span>
                            }
                            className="login-btn-primary"
                        />
                    </>
                )}
            </div>
        </Modal>
    );
}
