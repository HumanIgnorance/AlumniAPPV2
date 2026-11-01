import React from "react";
import {
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Badge,
    Button,
    Col,
    Dropdown,
    Layout,
    Row,
    Space,
    Typography,
} from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import AccountDropdown from "~/components/layout/parts/AccountDropdown";
import NotificationsDropdown from "~/components/layout/parts/NotificationsDropdown";
import { ROLES } from "~/config/roles";
import { COLORS } from "~/config/theme";

const { Header } = Layout;
const { Text } = Typography;

export default function LayoutHeader() {
    const {
        isMobile,
        drawerVisible,
        toggleDrawer,
        history,
        role,
        dropdownVisible,
        setDropdownVisible,
        unreadCount,
        animateBell,
        isLoading,
        accountDropdownVisible,
        setAccountDropdownVisible,
        userData,
    } = useLayoutContext();

    return (
        <Header id="header">
            <Row
                style={{ flex: 1, height: "100%" }}
                className="row-header"
                justify="space-between"
                align="middle"
            >
                <Col
                    className="first"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flex: isMobile ? 1 : "auto",
                        justifyContent: isMobile ? "center" : "flex-start",
                        position: "relative",
                    }}
                >
                    {isMobile && (
                        <Button
                            type="text"
                            icon={
                                drawerVisible ? (
                                    <MenuUnfoldOutlined />
                                ) : (
                                    <MenuFoldOutlined />
                                )
                            }
                            onClick={toggleDrawer}
                            className="burger-menu"
                            style={{
                                position: "absolute",
                                left: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        />
                    )}

                    <Text
                        strong
                        style={{
                            fontSize: isMobile ? 15 : 22,
                            fontWeight: 800,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.2,
                            maxWidth: isMobile ? "calc(100vw - 180px)" : "auto",
                            textAlign: isMobile ? "center" : "left",
                            paddingLeft: isMobile ? 40 : 0,
                            paddingRight: isMobile ? 40 : 0,
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            history.push("/");
                        }}
                    >
                        <span
                            style={{
                                color: COLORS.c003366,
                                fontWeight: 900,
                            }}
                        >
                            ATMS |
                        </span>{" "}
                        <span
                            style={{
                                color: COLORS.ffd700,
                                fontWeight: 900,
                            }}
                        >
                            ALUMNI
                        </span>{" "}
                        <span
                            style={{
                                color: COLORS.cc0000,
                                fontWeight: 900,
                            }}
                        >
                            ASSOCIATION
                        </span>{" "}
                        <span
                            style={{
                                color: COLORS.c003366,
                                fontWeight: 900,
                            }}
                        >
                            - OCC
                        </span>
                    </Text>
                </Col>
                <Col
                    flex={isMobile ? "auto" : "280px"}
                    className="second"
                    style={{
                        position: isMobile ? "absolute" : "relative",
                        right: isMobile ? 8 : 0,
                    }}
                >
                    <Space size={isMobile ? 8 : 16}>
                        {role !== ROLES.DEPARTMENT_HEAD && (
                            <Dropdown
                                placement="bottomRight"
                                trigger={["click"]}
                                dropdownRender={() => <NotificationsDropdown />}
                                overlayStyle={{ padding: 0 }}
                                visible={dropdownVisible}
                                onVisibleChange={setDropdownVisible}
                                // Anchoring the popup to the header
                                // (instead of the default document.body)
                                // keeps its positioning tied to a
                                // predictable, bounded container. This
                                // matters most on mobile browsers in
                                // "Request Desktop Site" mode, where
                                // body-relative absolute positioning
                                // can otherwise miscalculate against
                                // the wrong viewport and push the
                                // panel off-screen or to the left edge.
                                getPopupContainer={() =>
                                    document.getElementById("header") ||
                                    document.body
                                }
                            >
                                <Badge
                                    count={unreadCount}
                                    offset={[0, 0]}
                                    size="small"
                                    style={{
                                        boxShadow: "0 0 0 2px #fff",
                                        zIndex: 1000,
                                    }}
                                >
                                    <Button
                                        shape="circle"
                                        icon={<BellOutlined />}
                                        type="text"
                                        className={`btn-notification ${animateBell ? "bell-animate" : ""}`}
                                        loading={isLoading}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            minWidth: 40,
                                            minHeight: 40,
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "1px solid #f0f0f0",
                                            padding: 0,
                                        }}
                                    />
                                </Badge>
                            </Dropdown>
                        )}

                        <Dropdown
                            placement="bottomRight"
                            trigger={["click"]}
                            dropdownRender={() => <AccountDropdown />}
                            open={accountDropdownVisible}
                            onOpenChange={setAccountDropdownVisible}
                            getPopupContainer={() =>
                                document.getElementById("header") ||
                                document.body
                            }
                        >
                            <Button
                                type="text"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    height: 40,
                                    padding: isMobile ? "0 8px" : "0 12px",
                                    border: "1px solid rgb(102 126 234)",
                                    borderRadius: 20,
                                    background: "#667eea40",
                                }}
                            >
                                <Avatar
                                    size={24}
                                    src={userData.avatar}
                                    style={{
                                        marginRight: isMobile ? 0 : 8,
                                    }}
                                />
                                {!isMobile && (
                                    <Text strong style={{ fontSize: "14px" }}>
                                        {userData.name.split(" ")[0]}
                                    </Text>
                                )}
                            </Button>
                        </Dropdown>
                    </Space>
                </Col>
            </Row>
        </Header>
    );
}
