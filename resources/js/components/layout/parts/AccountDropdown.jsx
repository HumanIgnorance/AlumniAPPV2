import React from "react";
import {
    BookOutlined,
    CommentOutlined,
    DownOutlined,
    InfoCircleOutlined,
    IssuesCloseOutlined,
    LogoutOutlined,
    MoonOutlined,
    SunOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Select } from "antd";
import { Link } from "react-router-dom";
import HeaderAvatar from "~/components/layout/parts/HeaderAvatar";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import { themeOptions } from "~/components/layout/utils/layoutConstants";
import { logout } from "~/components/layout/utils/sessionActions";
import { ROLES } from "~/config/roles";
import { COLORS } from "~/config/theme";

/**
 * Account pop-up (avatar button in the header).
 *
 * Pure markup + classes: ALL looks (light/dark, spacing, right-anchoring,
 * transparent antd wrapper) live in layout/styles/14-header-popups.css and use
 * the shared --app-* theme tokens, so light and dark are the same layout with
 * different colours. No inline colours, no antd <Menu> (that nested, boxed
 * "Sign out" row was what looked messy in dark mode).
 */
const formatRole = (role = "") =>
    role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ");

export default function AccountDropdown() {
    const {
        currentTheme,
        role,
        userData,
        setAccountDropdownVisible,
        handleThemeChange,
        helpSupportExpanded,
        setHelpSupportExpanded,
        setFeedbackModalOpen,
        setIsPrivacyModalOpen,
        setIsTermsModalOpen,
    } = useLayoutContext();

    const isDark = currentTheme === "black";
    const close = () => setAccountDropdownVisible(false);

    return (
        <div className="acc-panel" role="menu" aria-label="Account menu">
            <div className="acc-head">
                <HeaderAvatar size={64} src={userData.avatar} />
                <h5 className="acc-name">{userData.name}</h5>
                <span className="acc-email">{userData.email}</span>
                <span className="acc-role">{formatRole(userData.role)}</span>
            </div>

            <div className="acc-scroll">
                {role === ROLES.ALUMNI && (
                    <Link to="/profile" className="acc-row" onClick={close}>
                        <span className="acc-ico" style={{ color: COLORS.antdGreen }}>
                            <TeamOutlined />
                        </span>
                        <span className="acc-label">Profile</span>
                    </Link>
                )}

                <div className="acc-row acc-row--theme">
                    <span
                        className="acc-ico"
                        style={{ color: isDark ? COLORS.blue400 : COLORS.antdGold }}
                    >
                        {isDark ? <MoonOutlined /> : <SunOutlined />}
                    </span>
                    <span className="acc-label">Theme</span>
                    <Select
                        className="acc-select"
                        value={currentTheme}
                        onChange={handleThemeChange}
                        options={themeOptions}
                        popupMatchSelectWidth={false}
                        aria-label="Theme"
                    />
                </div>

                <button
                    type="button"
                    className="acc-row"
                    aria-expanded={!!helpSupportExpanded}
                    onClick={() => setHelpSupportExpanded((prev) => !prev)}
                >
                    <span className="acc-ico" style={{ color: COLORS.antdGold }}>
                        <BookOutlined />
                    </span>
                    <span className="acc-label">Help &amp; Support</span>
                    <DownOutlined
                        className={`acc-chevron${helpSupportExpanded ? " is-open" : ""}`}
                    />
                </button>

                {helpSupportExpanded && (
                    <div className="acc-sub">
                        <button
                            type="button"
                            className="acc-row"
                            onClick={() => {
                                close();
                                setFeedbackModalOpen(true);
                            }}
                        >
                            <span className="acc-ico" style={{ color: COLORS.antdGold }}>
                                <IssuesCloseOutlined />
                            </span>
                            <span className="acc-label">Give feedback</span>
                        </button>
                        <Link to="/faq" className="acc-row" onClick={close}>
                            <span className="acc-ico" style={{ color: COLORS.antdBlue }}>
                                <CommentOutlined />
                            </span>
                            <span className="acc-label">FAQs</span>
                        </Link>
                        <Link to="/about" className="acc-row" onClick={close}>
                            <span className="acc-ico" style={{ color: COLORS.antdBlue }}>
                                <InfoCircleOutlined />
                            </span>
                            <span className="acc-label">About</span>
                        </Link>
                    </div>
                )}

                <button
                    type="button"
                    className="acc-row acc-row--danger"
                    onClick={() => {
                        close();
                        logout();
                    }}
                >
                    <span className="acc-ico">
                        <LogoutOutlined />
                    </span>
                    <span className="acc-label">Sign out</span>
                </button>
            </div>

            <div className="acc-legal">
                <button
                    type="button"
                    onClick={() => {
                        close();
                        setIsPrivacyModalOpen(true);
                    }}
                >
                    Privacy Policy
                </button>
                <span aria-hidden="true">·</span>
                <button
                    type="button"
                    onClick={() => {
                        close();
                        setIsTermsModalOpen(true);
                    }}
                >
                    Terms of Service
                </button>
            </div>
        </div>
    );
}
