import React from "react";
import { Menu, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useLayoutContext } from "~/components/layout/LayoutContext";

export default function SideMenu() {
    const { menus, isMobile, basePath } = useLayoutContext();

    return (
        <Menu theme="light" mode="inline">
            {menus.map((menu, i) => (
                <React.Fragment key={i}>
                    {!menu.subMenu && (
                        <Tooltip
                            title={isMobile ? null : menu.label}
                            placement="right"
                            trigger={isMobile ? [] : ["hover"]}
                            open={isMobile ? false : undefined}
                            className={
                                basePath === menu.url ||
                                basePath === menu.subUrl1 ||
                                basePath === menu.subUrl2
                                    ? "active-menu"
                                    : ""
                            }
                        >
                            <Menu.Item key={menu.key}>
                                {menu.icon}
                                <Link to={menu.url}>
                                    {isMobile ? menu.label : null}
                                </Link>
                            </Menu.Item>
                        </Tooltip>
                    )}
                    {menu.subMenu && (
                        <Menu.SubMenu
                            key={menu.key}
                            title={isMobile ? menu.label : null}
                            icon={menu.icon}
                        >
                            <Menu.ItemGroup key={menu.key}>
                                {menu.submenu.map((sub) => (
                                    <Menu.Item key={sub.key}>
                                        <Link to={sub.path}>{sub?.label}</Link>
                                    </Menu.Item>
                                ))}
                            </Menu.ItemGroup>
                        </Menu.SubMenu>
                    )}
                </React.Fragment>
            ))}
        </Menu>
    );
}
