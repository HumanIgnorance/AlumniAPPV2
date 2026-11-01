import { MoonOutlined, SunOutlined, CloseOutlined, MenuOutlined } from "@ant-design/icons";
import logo from "~/assets/images/site-logo.png";
import { COLORS } from "~/config/theme";

/**
 * Sticky header shared by the public pages (brand, nav, theme toggle,
 * Sign In / Sign Up, mobile burger). Styling comes from the .ph-* classes.
 */
const PublicHeader = ({
    headerRef,
    scrolled,
    isDark,
    navItems,
    toggleTheme,
    goTo,
    goLogin,
    goRegister,
    mobileNavOpen,
    setMobileNavOpen,
}) => {
    return (
    <header
        ref={headerRef}
        className={`ph-header ${scrolled ? "scrolled" : ""} ${isDark ? "dark" : "light"}`}
    >
        <div className="ph-brand" onClick={() => goTo("/")} role="button" tabIndex={0}>
            <img src={logo} alt="OCC Alumni Logo" />
            <div className="ph-brand-text">
                <span className="ph-brand-title">
                    <span style={{ color: COLORS.c003366, fontWeight: 900 }}>O</span>
                    <span style={{ color: COLORS.ffd700, fontWeight: 900 }}>C</span>
                    <span style={{ color: COLORS.cc0000, fontWeight: 900 }}>C</span>{" "}
                    <span style={{ color: COLORS.c003366, fontWeight: 900 }}>Alumni</span>
                </span>
                <span className="ph-brand-sub">Opol Community College</span>
            </div>
        </div>

        <nav className="ph-nav">
            {navItems.map((item) => (
                <button key={item.label} className="ph-nav-link" onClick={item.onClick}>
                    {item.label}
                </button>
            ))}
        </nav>

        <div className="ph-header-actions">
            <button type="button" className="ph-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? <MoonOutlined /> : <SunOutlined />}
            </button>
            <button className="ph-btn ph-btn-ghost ph-header-signin" onClick={goLogin}>
                Sign In
            </button>
            <button className="ph-btn ph-btn-solid ph-header-signup" onClick={goRegister}>
                Sign Up
            </button>
            <button
                type="button"
                className={`ph-burger ${mobileNavOpen ? "open" : ""}`}
                onClick={() => setMobileNavOpen((open) => !open)}
                aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileNavOpen}
            >
                {mobileNavOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
        </div>
    </header>
    );
};

export default PublicHeader;
