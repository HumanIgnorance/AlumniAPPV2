import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Drawer, Layout } from "antd";
import { Link } from "react-router-dom";
import logoMini from "~/assets/images/site-logo.png";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import SideMenu from "~/components/layout/parts/SideMenu";

const { Sider } = Layout;

export default function SidebarNav() {
    const {
        isMobile,
        setDrawerVisible,
        toggleDrawer,
        drawerVisible,
        collapsed,
    } = useLayoutContext();

    return isMobile ? (
        <Drawer
            title={
                <Link
                    to="/gallery"
                    style={{ textDecoration: "none" }}
                    onClick={() => setDrawerVisible(false)}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src={logoMini || "/placeholder.svg"}
                            alt="Logo"
                            style={{
                                width: 40,
                                height: 40,
                                objectFit: "contain",
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                            }}
                        >
                            <span
                                className="theme-text-secondary"
                                style={{
                                    fontWeight: 700,
                                    fontSize: 14,
                                    lineHeight: 1.3,
                                }}
                            >
                                ATMS | ALUMNI-ASOCC
                            </span>

                            <span
                                className="theme-text-secondary"
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700, // bold
                                    lineHeight: 1.3,
                                }}
                            >
                                <ArrowLeftOutlined /> Photo Library
                            </span>
                        </div>
                    </div>
                </Link>
            }
            placement="left"
            closable={false}
            onClose={toggleDrawer}
            visible={drawerVisible}
            width={isMobile ? "55%" : 280}
            bodyStyle={{ padding: 0 }}
        >
            <SideMenu />
        </Drawer>
    ) : (
        <div id={`sidebar-wrapper`} style={{ width: 80 }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={!isMobile && collapsed}
            >
                <div className="logo">
                    <Link to="/gallery">
                        <img
                            src={logoMini || "/placeholder.svg"}
                            style={{ width: 80, cursor: "pointer" }}
                            alt="Logo"
                        />
                    </Link>
                </div>
                <SideMenu />
            </Sider>
        </div>
    );
}
