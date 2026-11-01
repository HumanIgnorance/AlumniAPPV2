import logo from "~/assets/images/site-logo.png";
import { COLORS } from "~/config/theme";
import { Dropdown } from "antd";
import {
    DownOutlined,
    MoonOutlined,
    SunOutlined,
    CloseOutlined,
    MenuOutlined,
} from "@ant-design/icons";
import { usePublicHomeContext } from "~/pages/auth/public-home-page/PublicHomeContext";

export default function PublicHomeHeader() {
    const {
        headerRef,
        scrolled,
        isDark,
        scrollToTop,
        navItems,
        announcementsDropdownMenu,
        eventsDropdownMenu,
        galleryDropdownItems,
        galleryDropdownMenu,
        goToGallery,
        jobsDropdownMenu,
        occServicesDropdownMenu,
        toggleTheme,
        goLogin,
        goRegister,
        mobileNavOpen,
        setMobileNavOpen,
    } = usePublicHomeContext();

    return (
        <header
            ref={headerRef}
            className={`ph-header ${scrolled ? "scrolled" : ""} ${isDark ? "dark" : "light"}`}
        >
            <div
                className="ph-brand"
                onClick={scrollToTop}
                role="button"
                tabIndex={0}
            >
                <img src={logo} alt="OCC Alumni Logo" />
                <div className="ph-brand-text">
                    <span className="ph-brand-title">
                        <span
                            style={{ color: COLORS.c003366, fontWeight: 900 }}
                        >
                            O
                        </span>
                        <span style={{ color: COLORS.ffd700, fontWeight: 900 }}>
                            C
                        </span>
                        <span style={{ color: COLORS.cc0000, fontWeight: 900 }}>
                            C
                        </span>{" "}
                        <span
                            style={{ color: COLORS.c003366, fontWeight: 900 }}
                        >
                            Alumni
                        </span>
                    </span>
                    <span className="ph-brand-sub">Opol Community College</span>
                </div>
            </div>

            <nav className="ph-nav">
                <button className="ph-nav-link" onClick={navItems[0].onClick}>
                    {navItems[0].label}
                </button>

                <Dropdown
                    menu={announcementsDropdownMenu}
                    trigger={["hover", "click"]}
                    placement="bottomLeft"
                    overlayClassName="ph-events-dropdown-overlay"
                >
                    <button
                        className="ph-nav-link ph-nav-link-dropdown"
                        type="button"
                    >
                        Announcements{" "}
                        <DownOutlined className="ph-nav-link-caret" />
                    </button>
                </Dropdown>

                <Dropdown
                    menu={eventsDropdownMenu}
                    trigger={["hover", "click"]}
                    placement="bottomLeft"
                    overlayClassName="ph-events-dropdown-overlay"
                >
                    <button
                        className="ph-nav-link ph-nav-link-dropdown"
                        type="button"
                    >
                        Events <DownOutlined className="ph-nav-link-caret" />
                    </button>
                </Dropdown>

                {galleryDropdownItems.length > 0 ? (
                    <Dropdown
                        menu={galleryDropdownMenu}
                        trigger={["hover", "click"]}
                        placement="bottomLeft"
                        overlayClassName="ph-events-dropdown-overlay"
                    >
                        <button
                            className="ph-nav-link ph-nav-link-dropdown"
                            type="button"
                        >
                            Gallery{" "}
                            <DownOutlined className="ph-nav-link-caret" />
                        </button>
                    </Dropdown>
                ) : (
                    <button
                        className="ph-nav-link"
                        onClick={() => goToGallery()}
                    >
                        Gallery
                    </button>
                )}

                {navItems.slice(1).map((item) => (
                    <button
                        key={item.label}
                        className="ph-nav-link"
                        onClick={item.onClick}
                    >
                        {item.label}
                    </button>
                ))}

                <Dropdown
                    menu={jobsDropdownMenu}
                    trigger={["hover", "click"]}
                    placement="bottomLeft"
                    overlayClassName="ph-events-dropdown-overlay"
                >
                    <button
                        className="ph-nav-link ph-nav-link-dropdown"
                        type="button"
                    >
                        Job Posts <DownOutlined className="ph-nav-link-caret" />
                    </button>
                </Dropdown>

                <Dropdown
                    menu={occServicesDropdownMenu}
                    trigger={["hover", "click"]}
                    placement="bottomLeft"
                    overlayClassName="ph-events-dropdown-overlay"
                >
                    <button
                        className="ph-nav-link ph-nav-link-dropdown"
                        type="button"
                    >
                        OCC Services{" "}
                        <DownOutlined className="ph-nav-link-caret" />
                    </button>
                </Dropdown>
            </nav>

            <div className="ph-header-actions">
                <button
                    type="button"
                    className="ph-theme-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {isDark ? <MoonOutlined /> : <SunOutlined />}
                </button>
                {/* Sign In: stays in the header, right beside the theme
                        toggle, at every breakpoint — desktop, mobile
                        landscape, and mobile portrait. */}
                <button
                    className="ph-btn ph-btn-ghost ph-header-signin"
                    onClick={goLogin}
                >
                    Sign In
                </button>
                {/* Sign Up: stays in the header on desktop and mobile
                        landscape. Hidden on mobile portrait only, where
                        there isn't room beside the theme toggle, Sign In,
                        and burger icon. */}
                <button
                    className="ph-btn ph-btn-solid ph-header-signup"
                    onClick={goRegister}
                >
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
}
