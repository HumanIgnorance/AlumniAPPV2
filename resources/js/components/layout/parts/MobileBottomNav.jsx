import React, { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppstoreOutlined } from "@ant-design/icons";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import "./MobileBottomNav.css";

// Bottom tab bar for phones (same idea as the SCLF app's MobileBottomNav).
//
// Up to four role-specific shortcut tabs + a "More" tab that opens the full menu
// drawer. It is a normal flex child at the bottom of the app shell (it takes the
// place of the page footer on phones), so it never covers page content and never
// fights the mobile browser's collapsing address bar. The footer links moved into
// the drawer (see SidebarNav).
//
// Which menu items become tabs: each role lists its most-used pages first below;
// anything not in the role's menu is skipped and the rest of the menu fills in.
const PREFERRED = ["/home", "/admin-dashboard", "/department-dashboard", "/events", "/messages", "/job-posts", "/alumni", "/announcements"];
const MAX_TABS = 4;

const isActive = (url, pathname) => pathname === url || pathname.startsWith(`${url}/`);

export default function MobileBottomNav() {
    const { menus = [], isMobile, drawerVisible, toggleDrawer } = useLayoutContext();
    const { pathname } = useLocation();

    const flat = useMemo(() => menus.filter((m) => m && m.url && !m.subMenu), [menus]);
    const needsMore = flat.length > MAX_TABS + 1;

    const tabs = useMemo(() => {
        if (!needsMore) return flat;
        const picked = [];
        PREFERRED.forEach((url) => {
            const hit = flat.find((m) => m.url === url);
            if (hit && picked.length < MAX_TABS) picked.push(hit);
        });
        flat.forEach((m) => { if (picked.length < MAX_TABS && !picked.includes(m)) picked.push(m); });
        // keep the menu's own order so tabs don't jump around between roles
        return picked.sort((a, b) => flat.indexOf(a) - flat.indexOf(b));
    }, [flat, needsMore]);

    const show = isMobile && flat.length > 1;

    // lets CSS reserve room (toasts, update pop-up) and hide the desktop footer
    useEffect(() => {
        if (!show) return undefined;
        document.documentElement.classList.add("has-bottom-nav");
        return () => document.documentElement.classList.remove("has-bottom-nav");
    }, [show]);

    if (!show) return null;

    return (
        <nav className="atms-bottomnav" aria-label="Quick navigation">
            {tabs.map((menu) => {
                const active = isActive(menu.url, pathname);
                return (
                    <Link
                        key={menu.key}
                        to={menu.url}
                        className={`atms-bottomnav__item${active ? " is-active" : ""}`}
                        aria-current={active ? "page" : undefined}
                        onClick={() => {
                            try { navigator.vibrate?.(8); } catch { /* ignore */ }
                            if (active) {
                                const c = document.getElementById("content");
                                if (c && c.scrollTo) c.scrollTo({ top: 0, behavior: "smooth" });
                            }
                        }}
                    >
                        <span className="atms-bottomnav__icon">{menu.icon}</span>
                        <span className="atms-bottomnav__label">{menu.label}</span>
                    </Link>
                );
            })}
            {needsMore && (
                <button
                    type="button"
                    className={`atms-bottomnav__item${drawerVisible ? " is-active" : ""}`}
                    onClick={toggleDrawer}
                    aria-haspopup="dialog"
                    aria-expanded={drawerVisible}
                >
                    <span className="atms-bottomnav__icon"><AppstoreOutlined className="menu-icon" /></span>
                    <span className="atms-bottomnav__label">More</span>
                </button>
            )}
        </nav>
    );
}
