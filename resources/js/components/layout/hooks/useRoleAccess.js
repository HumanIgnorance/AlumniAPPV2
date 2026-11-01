import { MENU_ADMIN, MENU_ALUMNI, MENU_DEPARTMENT_HEAD } from "~/config/menus";
import {
    NOTIFICATION_CATEGORIES,
    getVisibleNotificationCategoryKeys,
} from "~/config/notificationCategories";
import { ROLES } from "~/config/roles";
import { getUserRole } from "~/utils/session";

export default function useRoleAccess() {
    let menus = [];

    const role = getUserRole();

    if (role === ROLES.ADMIN) {
        menus = MENU_ADMIN;
    } else if (role === ROLES.ALUMNI) {
        menus = MENU_ALUMNI;
    } else if (role === ROLES.DEPARTMENT_HEAD) {
        menus = MENU_DEPARTMENT_HEAD;
    } else if (role === "faculty") {
        // menus = MENU_FACULTY;
    }

    // Category keys this role is permitted to see in the notification
    // bell dropdown / "All Notifications" modal, plus the derived lookup
    // table used to render the category filter buttons. Notifications
    // that don't match any known category fall back to "all" in
    // getNotificationCategory(), so they stay visible to every role
    // instead of silently disappearing for restricted ones.
    const allowedNotificationCategoryKeys =
        getVisibleNotificationCategoryKeys(role);

    const visibleNotificationCategories = Object.fromEntries(
        Object.entries(NOTIFICATION_CATEGORIES).filter(
            ([key]) =>
                key === "all" || allowedNotificationCategoryKeys.includes(key),
        ),
    );

    return {
        allowedNotificationCategoryKeys,
        role,
        visibleNotificationCategories,
        menus,
    };
}
