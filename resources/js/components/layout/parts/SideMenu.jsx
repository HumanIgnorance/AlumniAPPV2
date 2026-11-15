import React from "react";
import { Menu, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useLayoutContext } from "~/components/layout/LayoutContext";

export default function SideMenu() {
    const { menus, isMobile, basePath, history, pathname, setDrawerVisible } =
        useLayoutContext();

    // Tapping anywhere on a menu row (not only on the label text) goes to the
    // page, and on phones the drawer closes right away. Before, the drawer
    // stayed open on top of the new page, which looked like a broken sidebar.
    const goTo = (url) => {
        if (isMobile) setDrawerVisible(false);
        if (url && pathname !== url) history.push(url);
    };
    // The row handles navigation, so the inner <Link> must not push twice.
    const rowOnly = (e) => e.preventDefault();

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
                            <Menu.Item
                                key={menu.key}
                                onClick={() => goTo(menu.url)}
                            >
                                {menu.icon}
                                <Link to={menu.url} onClick={rowOnly}>
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
                                    <Menu.Item
                                        key={sub.key}
                                        onClick={() => goTo(sub.path)}
                                    >
                                        <Link to={sub.path} onClick={rowOnly}>
                                            {sub?.label}
                                        </Link>
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
