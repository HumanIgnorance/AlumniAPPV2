import React from "react";
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
    MailOutlined,
    RocketOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Alert, Checkbox, Form, Input } from "antd";
import secureLocalStorage from "react-secure-storage";
import { Button } from "~/components/index";
import logo from "~/assets/images/site-logo.png";
import { useLoginContext } from "~/components/login/LoginContext";

/* =========================================================
     RENDER: LOGIN FORM
     ========================================================= */
export default function LoginForm() {
    const {
        loginFormError,
        setLoginFormError,
        error,
        type,
        dismissedSessionAlert,
        setDismissedSessionAlert,
        loginForm,
        handleLoginSubmit,
        rememberMePrefilledRef,
        rememberMe,
        setRememberMe,
        REMEMBER_KEY,
        setCurrentView,
        isSubmit,
        handleRegisterRedirect,
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
                    <SafetyCertificateOutlined /> Secure Sign-in
                </span>
                <h2 className="login-card__title">Welcome back</h2>
                <p className="login-card__subtitle">
                    Sign in to continue to your alumni workspace.
                </p>
            </div>

            {loginFormError && (
                <Alert
                    className="login-alert"
                    message={loginFormError}
                    type="error"
                    showIcon
                    onClick={() => setLoginFormError("")}
                    style={{ cursor: "pointer" }}
                />
            )}

            {!error && type === "session-expired" && !dismissedSessionAlert && (
                <Alert
                    className="login-alert"
                    message="Your session has expired."
                    type="error"
                    showIcon
                    onClick={() => setDismissedSessionAlert(true)}
                    style={{ cursor: "pointer" }}
                />
            )}

            <Form
                form={loginForm}
                name="normal_login"
                onFinish={handleLoginSubmit}
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    name="email"
                    label={<span className="login-label">Email Address</span>}
                    rules={[
                        { required: true, message: "Please input your Email!" },
                        {
                            type: "email",
                            message: "Please enter a valid email address.",
                        },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="occ.last_name.first_name@gmail.com"
                        size="large"
                        className="login-input"
                        autoComplete="username email"
                        onChange={() => {
                            // User touched the field manually — lift the Remember Me
                            // guard so password-manager autofill can work next time.
                            rememberMePrefilledRef.current = false;
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={<span className="login-label">Password</span>}
                    rules={[
                        {
                            required: true,
                            message: "Please input your Password!",
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Enter your password"
                        size="large"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        className="login-input"
                        autoComplete="current-password"
                    />
                </Form.Item>

                {/* Remember Me + Forgot password row */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: -4,
                        marginBottom: 10,
                        gap: 8,
                        flexWrap: "wrap",
                    }}
                >
                    <Checkbox
                        checked={rememberMe}
                        onChange={(e) => {
                            const next = e.target.checked;
                            setRememberMe(next);
                            if (!next) {
                                try {
                                    secureLocalStorage.removeItem(REMEMBER_KEY);
                                } catch (err) {}
                            }
                        }}
                    >
                        <span
                            className="login-label"
                            style={{ fontWeight: 500 }}
                        >
                            Keep me signed in
                        </span>
                    </Checkbox>

                    <a
                        className="login-link"
                        onClick={() => setCurrentView("forgot-password")}
                    >
                        Forgot password?
                    </a>
                </div>

                <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmit}
                        label={
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <RocketOutlined /> Sign in
                            </span>
                        }
                        className="login-btn-primary"
                    />
                </Form.Item>
            </Form>

            <div className="login-divider-row">
                <span
                    className="login-link login-back-home-inline"
                    onClick={() => {
                        window.location.href = "/PublicHomePage";
                    }}
                >
                    Back to Home
                </span>

                <div className="login-divider">
                    <div className="line" />
                    <span>NEW HERE</span>
                    <div className="line" />
                </div>
            </div>

            <p className="login-register-text">
                Don't have an account?{" "}
                <a
                    href="/register"
                    className="login-link"
                    onClick={(e) => {
                        e.preventDefault();
                        handleRegisterRedirect();
                    }}
                >
                    Sign up here
                </a>
            </p>
        </div>
    );
}
