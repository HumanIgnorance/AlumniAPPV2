import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "~/assets/images/site-logo.png";

/**
 * The ONE top bar for every signed-out phone screen (Login, Forgot password,
 * Find account, Reset password, Register, FAQ, About, Quizzes).
 *
 * Why a shared component: each page used to carry its own copy of this markup and
 * its own spacing rules, so the bar was a different height on Login than on
 * Register. Now there is one component + one stylesheet (css/auth-appbar.css) that
 * gives it an explicit, identical height everywhere.
 *
 * It is only visible on portrait phones (CSS); desktop, tablet and landscape keep
 * their own headers. While it is mounted <html> carries `has-auth-appbar`, which
 * lets the stylesheet pin the page's theme / settings button inside the bar.
 */
export default function AuthAppBar() {
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add("has-auth-appbar");
        return () => root.classList.remove("has-auth-appbar");
    }, []);

    return (
        <header className="auth-appbar">
            <Link to="/PublicHomePage" className="auth-appbar__brand">
                <img src={logo} alt="OCC Alumni Logo" />
                <span className="auth-appbar__text">
                    <span className="auth-appbar__name">ATMS | Alumni Association</span>
                    <span className="auth-appbar__sub">Opol Community College</span>
                </span>
            </Link>
        </header>
    );
}
