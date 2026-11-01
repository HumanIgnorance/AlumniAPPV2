import React from "react";
import {
    CalendarOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Layout, Typography } from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import { COLORS } from "~/config/theme";

const { Footer } = Layout;
const { Text } = Typography;

export default function LayoutFooter() {
    const { currentTheme } = useLayoutContext();

    return (
        <Footer
            className="app-footer"
            style={{
                textAlign: "center",
                background: currentTheme === "black" ? COLORS.ink0a : "#f8f9fa",
                borderTop:
                    currentTheme === "black"
                        ? "1px solid #333"
                        : "1px solid #dee2e6",
                marginTop: "auto",
            }}
        >
            <div className="app-footer-inner">
                <Text
                    className="app-footer-credits"
                    style={{
                        color:
                            currentTheme === "black"
                                ? COLORS.c888888
                                : "#6c757d",
                    }}
                >
                    {" </> "}Developed by{" "}
                    <a
                        href="https://www.facebook.com/EphemeralKun/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontWeight: 600,
                            background:
                                "linear-gradient(90deg, #667eea, #764ba2)",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            textDecoration: "none",
                        }}
                        onMouseEnter={(e) =>
                            (e.target.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.textDecoration = "none")
                        }
                    >
                        {" </> "}Antiquina, Jonee John R.
                    </a>
                </Text>

                <span
                    className="app-footer-sep"
                    style={{
                        color:
                            currentTheme === "black"
                                ? COLORS.c444444
                                : COLORS.cccccc,
                    }}
                >
                    |
                </span>

                <div className="app-footer-links">
                    <Text
                        style={{
                            color:
                                currentTheme === "black"
                                    ? COLORS.c888888
                                    : "#6c757d",
                        }}
                    >
                        <SafetyCertificateOutlined style={{ marginRight: 3 }} />
                        Secure
                    </Text>
                    <span
                        className="app-footer-dot"
                        style={{
                            color:
                                currentTheme === "black"
                                    ? COLORS.c444444
                                    : COLORS.cccccc,
                        }}
                    >
                        •
                    </span>
                    <Text
                        style={{
                            color:
                                currentTheme === "black"
                                    ? COLORS.c888888
                                    : "#6c757d",
                        }}
                    >
                        <TeamOutlined style={{ marginRight: 3 }} />
                        Alumni Association
                    </Text>
                    <span
                        className="app-footer-dot"
                        style={{
                            color:
                                currentTheme === "black"
                                    ? COLORS.c444444
                                    : COLORS.cccccc,
                        }}
                    >
                        •
                    </span>
                    <Text
                        style={{
                            color:
                                currentTheme === "black"
                                    ? COLORS.c888888
                                    : "#6c757d",
                        }}
                    >
                        <CalendarOutlined style={{ marginRight: 3 }} />
                        Events
                    </Text>
                </div>

                <span
                    className="app-footer-sep"
                    style={{
                        color:
                            currentTheme === "black"
                                ? COLORS.c444444
                                : COLORS.cccccc,
                    }}
                >
                    |
                </span>

                <Text
                    className="app-footer-copy"
                    style={{
                        color:
                            currentTheme === "black"
                                ? COLORS.gray666
                                : "#868e96",
                    }}
                >
                    © {"2025"} ATMS • Built with ❤️
                </Text>
            </div>
        </Footer>
    );
}
