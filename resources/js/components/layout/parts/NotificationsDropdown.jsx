import React from "react";
import { BellOutlined, EyeInvisibleOutlined, SettingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import NotificationRow from "~/components/layout/parts/NotificationRow";
import { NOTIFICATION_CATEGORIES } from "~/config/notificationCategories";

/**
 * Bell pop-up. Classes only - see layout/styles/14-header-popups.css.
 *
 * It is as tall as its content (header / chips / quick actions / up to 5 rows /
 * footer) and, once that would pass the visible area, ONLY the list scrolls, so
 * the footer button is always reachable and there is no empty band inside.
 */
export default function NotificationsDropdown() {
    const {
        filterNotificationsByCategory,
        notifications,
        getCategoryCounts,
        unreadCount,
        filterUnread,
        setFilterUnread,
        visibleNotificationCategories,
        activeCategory,
        setActiveCategory,
        handleMarkAllAsRead,
        setDropdownVisible,
        setSettingsModalVisible,
        isLoading,
        setAllNotificationsModalVisible,
        fetchAllNotifications,
        totalNotifications,
    } = useLayoutContext();

    const filtered = filterNotificationsByCategory(notifications);
    const counts = getCategoryCounts(notifications);
    const close = () => setDropdownVisible(false);

    const emptyText =
        activeCategory !== "all"
            ? `No ${NOTIFICATION_CATEGORIES[activeCategory].label.toLowerCase()}`
            : filterUnread
              ? "No unread notifications"
              : "No notifications yet";

    return (
        <div className="ntf-panel ntf-panel--dropdown" role="dialog" aria-label="Notifications">
            <div className="ntf-head">
                <div>
                    <h5 className="ntf-head__title">Notifications</h5>
                    <span className="ntf-head__sub">
                        {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
                    </span>
                </div>
                <button
                    type="button"
                    className={`ntf-head__btn${filterUnread ? " is-on" : ""}`}
                    aria-pressed={filterUnread}
                    onClick={() => setFilterUnread(!filterUnread)}
                >
                    {filterUnread ? "Show all" : "Unread only"}
                </button>
            </div>

            <div className="ntf-chips" role="tablist" aria-label="Notification categories">
                {Object.entries(visibleNotificationCategories).map(([key, category]) => (
                    <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={activeCategory === key}
                        aria-label={category.label}
                        title={category.label}
                        className={`ntf-chip ntf-chip--icon${activeCategory === key ? " is-active" : ""}`}
                        style={{ "--chip": category.color }}
                        onClick={() => setActiveCategory(key)}
                    >
                        {category.icon}
                        {counts[key] > 0 && <span className="ntf-chip__count">{counts[key]}</span>}
                    </button>
                ))}
            </div>

            <div className="ntf-actions">
                {unreadCount > 0 && (
                    <button type="button" className="ntf-link" onClick={handleMarkAllAsRead}>
                        <EyeInvisibleOutlined /> Mark all as read
                    </button>
                )}
                <button
                    type="button"
                    className="ntf-link"
                    onClick={() => {
                        close();
                        setSettingsModalVisible(true);
                    }}
                >
                    <SettingOutlined /> Notification settings
                </button>
            </div>

            <div className="ntf-scroll">
                {isLoading ? (
                    <div className="ntf-loading">
                        <Spin />
                        Loading notifications...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="ntf-empty">
                        <BellOutlined />
                        <strong>{emptyText}</strong>
                        <small>We'll notify you when something arrives</small>
                    </div>
                ) : (
                    filtered
                        .slice(0, 5)
                        .map((item) => (
                            <NotificationRow key={item.id} notification={item} onClose={close} />
                        ))
                )}
            </div>

            {notifications.length > 0 && (
                <div className="ntf-foot">
                    <button
                        type="button"
                        className="ntf-foot__btn"
                        onClick={() => {
                            close();
                            setAllNotificationsModalVisible(true);
                            fetchAllNotifications(1);
                        }}
                    >
                        View All Notifications ({totalNotifications})
                    </button>
                </div>
            )}
        </div>
    );
}
