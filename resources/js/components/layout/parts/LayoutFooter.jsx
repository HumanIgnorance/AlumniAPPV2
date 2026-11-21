import React from "react";
import {
    CalendarOutlined,
    CodeOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Layout, Typography } from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import { COLORS } from "~/config/theme";
import DeveloperCredit from "~/components/shared/DeveloperCredit";

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
                    <span className="app-footer-credit-label">
                        <CodeOutlined className="app-footer-credit-icon" />
                        Developed by
                    </span>
                    <DeveloperCredit className="app-footer-credit-link" dark={currentTheme === "black"} />
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
