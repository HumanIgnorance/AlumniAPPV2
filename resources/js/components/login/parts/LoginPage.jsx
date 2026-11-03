import React from "react";
import {
    DashboardOutlined,
    RocketOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import logo from "~/assets/images/site-logo.png";
import { useLoginContext } from "~/components/login/LoginContext";
import FindUserForm from "~/components/login/parts/FindUserForm";
import ForgotPasswordForm from "~/components/login/parts/ForgotPasswordForm";
import LoginForm from "~/components/login/parts/LoginForm";
import ResetPasswordForm from "~/components/login/parts/ResetPasswordForm";

export default function LoginPage() {
    const {
        revealed,
        brandParticlesRef,
        riveStageRef,
        FloatingRiveComponent,
        handleFeatureEnter,
        handleFeatureMove,
        handleFeatureLeave,
        currentView,
    } = useLoginContext();

    return (
        <div className={`login-page ${revealed ? "is-revealed" : ""}`}>
            <div className="login-page__rive" aria-hidden="true">
                {/* <DragBgRiveComponent /> */}
            </div>
            {/* Portrait-phone app bar (hidden on desktop / tablet / landscape via CSS) */}
            <header className="auth-appbar">
                <a href="/PublicHomePage" className="auth-appbar__brand">
                    <img src={logo || "/placeholder.svg"} alt="OCC Alumni Logo" />
                    <span>
                        <span className="auth-appbar__name">ATMS | Alumni Association</span>
                        <span className="auth-appbar__sub">Opol Community College</span>
                    </span>
                </a>
            </header>
            <div className="login-shell">
                {/* ============ LEFT: BRAND PANEL ============ */}
                <aside className="login-brand">
                    <div className="login-brand__bg" aria-hidden="true">
                        <div className="lb-bg-gradient" />
                        <div className="lb-bg-grid" />
                        <div className="lb-bg-dotgrid" />

                        <canvas
                            ref={brandParticlesRef}
                            className="lb-bg-particles"
                        />

                        <div className="lb-orb lb-orb-1" />
                        <div className="lb-orb lb-orb-2" />
                        <div className="lb-orb lb-orb-3" />
                        <div className="lb-orb lb-orb-4" />

                        <div className="lb-light-beam" />
                    </div>

                    <div className="login-brand__top">
                        <span className="login-brand__chip">
                            <ThunderboltOutlined /> Official Institutional
                            Platform
                        </span>

                        <h1 className="login-brand__title">
                            Welcome to <br />
                            <span className="grad-text">
                                Alumni Tracing Management
                            </span>
                        </h1>

                        <p className="login-brand__lead">
                            The ATMS is a comprehensive solution for managing
                            alumni information while promoting continuous
                            collaboration, professional growth, and
                            institutional excellence — empowering graduates and
                            institutions to grow together.
                        </p>

                        <div className="login-brand__features has-rive-center">
                            <div
                                className="login-brand__rive login-brand__rive--center"
                                ref={riveStageRef}
                                aria-hidden="true"
                            >
                                <FloatingRiveComponent />
                            </div>

                            <div
                                className="login-brand__feature feat--tl"
                                style={{ animationDelay: "0ms" }}
                                onMouseEnter={handleFeatureEnter}
                                onMouseMove={handleFeatureMove}
                                onMouseLeave={handleFeatureLeave}
                            >
                                <span className="icon">
                                    <TeamOutlined />
                                </span>
                                <div className="meta">
                                    <strong>Alumni Network</strong>
                                    <span>
                                        Stay in touch with classmates and
                                        faculty.
                                    </span>
                                </div>
                            </div>

                            <div
                                className="login-brand__feature feat--tr"
                                style={{ animationDelay: "80ms" }}
                                onMouseEnter={handleFeatureEnter}
                                onMouseMove={handleFeatureMove}
                                onMouseLeave={handleFeatureLeave}
                            >
                                <span className="icon">
                                    <RocketOutlined />
                                </span>
                                <div className="meta">
                                    <strong>Career Boost</strong>
                                    <span>
                                        Job posts, events, and growth
                                        opportunities.
                                    </span>
                                </div>
                            </div>

                            <div
                                className="login-brand__feature feat--bl"
                                style={{ animationDelay: "160ms" }}
                                onMouseEnter={handleFeatureEnter}
                                onMouseMove={handleFeatureMove}
                                onMouseLeave={handleFeatureLeave}
                            >
                                <span className="icon">
                                    <SafetyCertificateOutlined />
                                </span>
                                <div className="meta">
                                    <strong>Secure Access</strong>
                                    <span>
                                        Role-based authentication for every
                                        user.
                                    </span>
                                </div>
                            </div>

                            <div
                                className="login-brand__feature feat--br"
                                style={{ animationDelay: "240ms" }}
                                onMouseEnter={handleFeatureEnter}
                                onMouseMove={handleFeatureMove}
                                onMouseLeave={handleFeatureLeave}
                            >
                                <span className="icon">
                                    <DashboardOutlined />
                                </span>
                                <div className="meta">
                                    <strong>Live Analytics</strong>
                                    <span>
                                        Real-time insights and tracer reports.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== Seamless Looping Features Marquee ===== */}
                    <div className="login-brand__marquee" aria-hidden="true">
                        <div className="login-brand__marquee-track">
                            {[
                                "Photo Library",
                                "Profile",
                                "Events",
                                "Alumni List",
                                "Messages",
                                "Job Postings",
                                "Rating Quiz",
                                "Image Quiz",
                            ]
                                .concat([
                                    "Photo Library",
                                    "Profile",
                                    "Events",
                                    "Alumni List",
                                    "Messages",
                                    "Job Postings",
                                    "Rating Quiz",
                                    "Image Quiz",
                                ])
                                .map((name, i) => (
                                    <span
                                        key={i}
                                        className="login-brand__marquee-item"
                                    >
                                        <span className="login-brand__marquee-dot" />
                                        {name}
                                    </span>
                                ))}
                        </div>
                    </div>

                    <div className="login-brand__footer">
                        <span className="dot" />
                        <span>
                            System status:{" "}
                            <strong>All services operational</strong>{" "}
                        </span>
                    </div>
                </aside>

                {/* ============ RIGHT: FORM PANEL ============ */}
                <section className="login-form-panel">
                    {currentView === "login" && <LoginForm />}
                    {currentView === "forgot-password" && (
                        <ForgotPasswordForm />
                    )}
                    {currentView === "find-user" && <FindUserForm />}
                    {currentView === "reset-password" && <ResetPasswordForm />}
                </section>
            </div>
            <p className="auth-legal">
                Authorized users only. By continuing you agree to the ATMS Terms of
                Service and Privacy Policy.
            </p>
        </div>
    );
}
