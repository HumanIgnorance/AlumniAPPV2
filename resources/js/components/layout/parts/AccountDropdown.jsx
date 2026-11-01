import React from "react";
import {
    BookOutlined,
    BoxPlotOutlined,
    CommentOutlined,
    DownOutlined,
    InfoCircleOutlined,
    IssuesCloseOutlined,
    LogoutOutlined,
    MoonOutlined,
    SunOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Menu, Select, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import { themeOptions } from "~/components/layout/utils/layoutConstants";
import { logout } from "~/components/layout/utils/sessionActions";
import { ROLES } from "~/config/roles";
import { COLORS } from "~/config/theme";

const { Title, Text } = Typography;

export default function AccountDropdown() {
    const {
        currentTheme,
        history,
        isMobile,
        userData,
        role,
        setAccountDropdownVisible,
        handleThemeChange,
        setHelpSupportExpanded,
        helpSupportExpanded,
        setFeedbackModalOpen,
        setIsPrivacyModalOpen,
        setIsTermsModalOpen,
    } = useLayoutContext();

    const accountItems = [
        // {
        //   label: (
        //     <div style={{ padding: "8px 0" }}>
        //       <div style={{ fontWeight: "bold", fontSize: "16px", color: currentTheme === "black" ? "#fff" : undefined }}>{userData.name}</div>
        //       <div style={{ color: currentTheme === "black" ? "#a0a0a0" : "#666", fontSize: "12px" }}>{userData.email}</div>
        //     </div>
        //   ),
        //   key: "profile-header",
        //   disabled: true,
        // },
        {
            type: "divider",
        },
        {
            label: (
                <span
                    style={{
                        color: currentTheme === "black" ? "#ff6b6b" : undefined,
                    }}
                >
                    Sign out
                </span>
            ),
            key: "logout",
            icon: (
                <LogoutOutlined
                    style={{
                        color: currentTheme === "black" ? "#ff6b6b" : undefined,
                    }}
                />
            ),
            danger: true,
        },
    ];

    const handleAccountItemClick = (e) => {
        switch (e.key) {
            case "view-profile":
                history.push("/profile");
                break;
            case "account-settings":
                history.push("/settings");
                break;
            case "logout":
                logout();
                break;
            default:
                break;
        }
    };

    const isDark = currentTheme === "black";
    return (
        <div
            className="account-dropdown-container"
            style={{
                background: isDark ? COLORS.ink0a : COLORS.white,
                borderRadius: 12,
                boxShadow: isDark
                    ? "0 8px 24px rgba(0,0,0,0.4)"
                    : "0 8px 24px rgba(0,0,0,0.15)",
                // Fixed 280px overflowed narrow viewports (especially
                // phones in "Request Desktop Site" mode) and pushed the
                // panel off the left edge. Clamping to the viewport
                // width keeps it fully visible and centered under the
                // trigger on every screen size.
                width: 280,
                maxWidth: "calc(100vw - 24px)",
                // The panel used to have no height limit at all, so on
                // short landscape-phone screens it simply ran off the
                // bottom of the viewport with nothing below "Theme"
                // reachable (no scroll, no way to get to Sign out).
                // Capping against the actual viewport height and
                // turning this into a flex column lets the profile
                // header stay fixed while the section below it scrolls.
                maxHeight: isMobile
                    ? "calc(100vh - 80px)"
                    : "min(640px, calc(100vh - 80px))",
                display: "flex",
                flexDirection: "column",
                padding: "8px 0",
                border: isDark ? "1px solid #333" : "none",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    flexShrink: 0,
                    padding: "16px",
                    textAlign: "center",
                    borderBottom: isDark
                        ? "1px solid #333"
                        : "1px solid #f0f0f0",
                }}
            >
                <Avatar
                    size={64}
                    src={userData.avatar}
                    style={{
                        marginBottom: 12,
                        border: "3px solid #1890ff",
                    }}
                />
                <Title
                    level={5}
                    style={{
                        margin: 0,
                        marginBottom: 4,
                        color: isDark ? COLORS.white : undefined,
                    }}
                >
                    {userData.name}
                </Title>
                <Text
                    style={{
                        fontSize: "12px",
                        color: isDark ? COLORS.a0a0a0 : COLORS.gray666,
                    }}
                >
                    {userData.email}
                </Text>
                <div style={{ marginTop: 8 }}>
                    <Badge
                        status="success"
                        text={
                            <span
                                style={{
                                    color: isDark ? COLORS.white : undefined,
                                }}
                            >
                                {userData.role.charAt(0).toUpperCase() +
                                    userData.role.slice(1).replace("_", " ")}
                            </span>
                        }
                        style={{ fontSize: "11px" }}
                    />
                </div>
            </div>

            {role === ROLES.ALUMNI && (
                <Link
                    to="/profile"
                    style={{ textDecoration: "none" }}
                    onClick={() => setAccountDropdownVisible(false)}
                >
                    <div
                        style={{
                            flexShrink: 0,
                            padding: "12px 16px",
                            borderBottom: isDark
                                ? "1px solid #333"
                                : "1px solid #f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                        }}
                    >
                        <Space>
                            <TeamOutlined style={{ color: COLORS.antdGreen }} />
                            <Text
                                style={{
                                    color: isDark ? COLORS.white : undefined,
                                }}
                            >
                                Profile
                            </Text>
                        </Space>
                    </div>
                </Link>
            )}

            {/* ============ SCROLLABLE SECTION: Theme → Sign out ============ */}
            {/* Everything from "Theme" through the "Sign out" menu item
                        lives inside this scrollable region, while the avatar /
                        name / email / Profile link above stay fixed in place. */}
            <div
                className="account-dropdown-scroll"
                style={{
                    flex: "1 1 auto",
                    minHeight: 0,
                    overflowY: "auto",
                    background: isDark ? COLORS.ink0a : COLORS.white,
                }}
            >
                {/* ============ THEME DROPDOWN ============ */}
                <div
                    className="account-dropdown-theme-row"
                    style={{
                        padding: "12px 16px",
                        borderBottom: isDark
                            ? "1px solid #333"
                            : "1px solid #f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Space>
                        {isDark ? (
                            <MoonOutlined style={{ color: COLORS.blue400 }} />
                        ) : (
                            <SunOutlined style={{ color: COLORS.antdGold }} />
                        )}
                        <Text
                            style={{ color: isDark ? COLORS.white : undefined }}
                        >
                            Theme
                        </Text>
                    </Space>
                    {/* <Space>
                {isDark ? <CustomerServiceOutlined  style={{ color: "#60a5fa" }} /> : <SunOutlined style={{ color: "#faad14" }} />}
                <Text style={{ color: isDark ? "#fff" : undefined }}>Give feedback</Text>
              </Space> */}
                    <Select
                        value={currentTheme}
                        onChange={handleThemeChange}
                        size="small"
                        style={{ width: 100 }}
                        options={themeOptions}
                    />
                </div>
                <div
                    style={{
                        padding: "12px 16px",
                        borderBottom: isDark
                            ? "1px solid #333"
                            : "1px solid #f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                    }}
                    onClick={() => setHelpSupportExpanded((prev) => !prev)}
                >
                    <Space>
                        {isDark ? (
                            <BoxPlotOutlined
                                style={{ color: COLORS.blue400 }}
                            />
                        ) : (
                            <BookOutlined style={{ color: COLORS.antdGold }} />
                        )}

                        <Text
                            style={{ color: isDark ? COLORS.white : undefined }}
                        >
                            Help & Support
                        </Text>
                    </Space>
                    <DownOutlined
                        style={{
                            fontSize: 11,
                            color: isDark ? "#8a8a8a" : "#8a8d91",
                            transition: "transform 0.2s ease",
                            transform: helpSupportExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                        }}
                    />
                </div>

                {helpSupportExpanded && (
                    <div className="help-support-submenu">
                        <div
                            style={{
                                padding: "10px 16px 10px 40px",
                                borderBottom: isDark
                                    ? "1px solid #333"
                                    : "1px solid #f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: isDark
                                    ? COLORS.c111111
                                    : COLORS.zinc50,
                            }}
                            onClick={() => {
                                setAccountDropdownVisible(false);
                                setFeedbackModalOpen(true);
                            }}
                        >
                            <Space>
                                {isDark ? (
                                    <IssuesCloseOutlined
                                        style={{ color: COLORS.blue400 }}
                                    />
                                ) : (
                                    <IssuesCloseOutlined
                                        style={{ color: COLORS.antdGold }}
                                    />
                                )}
                                <Text
                                    style={{
                                        color: isDark
                                            ? COLORS.white
                                            : undefined,
                                        fontSize: 13,
                                    }}
                                >
                                    Give feedback
                                </Text>
                            </Space>
                        </div>

                        <Link
                            to="/faq"
                            style={{ textDecoration: "none" }}
                            onClick={() => setAccountDropdownVisible(false)}
                        >
                            <div
                                style={{
                                    padding: "10px 16px 10px 40px",
                                    borderBottom: isDark
                                        ? "1px solid #333"
                                        : "1px solid #f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer",
                                    background: isDark
                                        ? COLORS.c111111
                                        : COLORS.zinc50,
                                }}
                            >
                                <Space>
                                    <CommentOutlined
                                        style={{ color: COLORS.antdBlue }}
                                    />
                                    <Text
                                        style={{
                                            color: isDark
                                                ? COLORS.white
                                                : undefined,
                                            fontSize: 13,
                                        }}
                                    >
                                        FAQs
                                    </Text>
                                </Space>
                            </div>
                        </Link>

                        <Link
                            to="/about"
                            style={{ textDecoration: "none" }}
                            onClick={() => setAccountDropdownVisible(false)}
                        >
                            <div
                                style={{
                                    padding: "10px 16px 10px 40px",
                                    borderBottom: isDark
                                        ? "1px solid #333"
                                        : "1px solid #f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer",
                                    background: isDark
                                        ? COLORS.c111111
                                        : COLORS.zinc50,
                                }}
                            >
                                <Space>
                                    <InfoCircleOutlined
                                        style={{ color: COLORS.antdBlue }}
                                    />
                                    <Text
                                        style={{
                                            color: isDark
                                                ? COLORS.white
                                                : undefined,
                                            fontSize: 13,
                                        }}
                                    >
                                        About
                                    </Text>
                                </Space>
                            </div>
                        </Link>
                    </div>
                )}

                {/* {role === "admin" && (
        <Link
            to="/402"
            style={{ textDecoration: "none" }}
            onClick={() => setAccountDropdownVisible(false)}
        >
            <div
                style={{
                    padding: "12px 16px",
                    borderBottom: isDark
                        ? "1px solid #333"
                        : "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                }}
            >
                <Space>
                    <BugOutlined style={{ color: "#ff4d4f" }} />
                    <Text style={{ color: isDark ? "#fff" : undefined }}>
                        System Reports
                    </Text>
                </Space>
            </div>
        </Link>
    )} */}

                {/* ============ END THEME DROPDOWN ============ */}

                <Menu
                    onClick={handleAccountItemClick}
                    items={accountItems}
                    style={{
                        border: "none",
                        background: isDark ? COLORS.ink0a : COLORS.white,
                    }}
                />

                {/* ============ PRIVACY POLICY & TERMS OF SERVICE FOOTER ============ */}
                <div
                    style={{
                        padding: "10px 16px 14px",
                        textAlign: "center",
                    }}
                >
                    <Text
                        className="legal-footer-link"
                        style={{
                            fontSize: "12px",
                            color: isDark ? "#8a8a8a" : "#8a8d91",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            setAccountDropdownVisible(false);
                            setIsPrivacyModalOpen(true);
                        }}
                    >
                        Privacy Policy
                    </Text>
                    <Text
                        style={{
                            fontSize: "12px",
                            color: isDark ? COLORS.c555555 : COLORS.cccccc,
                            margin: "0 6px",
                        }}
                    >
                        ·
                    </Text>
                    <Text
                        className="legal-footer-link"
                        style={{
                            fontSize: "12px",
                            color: isDark ? "#8a8a8a" : "#8a8d91",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            setAccountDropdownVisible(false);
                            setIsTermsModalOpen(true);
                        }}
                    >
                        Terms of Service
                    </Text>
                </div>
            </div>
            {/* ============ END SCROLLABLE SECTION ============ */}
        </div>
    );
}
