import React from "react";
import {
    BellOutlined,
    EyeInvisibleOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Button, List, Space, Spin, Tooltip, Typography } from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import NotificationItem from "~/components/layout/parts/NotificationItem";
import { NOTIFICATION_CATEGORIES } from "~/config/notificationCategories";
import { COLORS } from "~/config/theme";

const { Title, Text } = Typography;

export default function NotificationsDropdown() {
    const {
        filterNotificationsByCategory,
        notifications,
        getCategoryCounts,
        currentTheme,
        isMobile,
        unreadCount,
        filterUnread,
        setFilterUnread,
        visibleNotificationCategories,
        isTouchDevice,
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

    const filteredNotifications = filterNotificationsByCategory(notifications);
    const categoryCounts = getCategoryCounts(notifications);
    const isDark = currentTheme === "black";

    return (
        <div
            className="notification-dropdown-container"
            style={{
                background: isDark ? COLORS.ink0a : COLORS.white,
                borderRadius: 12,
                boxShadow: isDark
                    ? "0 8px 24px rgba(0,0,0,0.4)"
                    : "0 8px 24px rgba(0,0,0,0.15)",
                width: isMobile ? "calc(100vw - 32px)" : 450,
                maxWidth: isMobile ? 340 : 450,
                // Capped against the viewport height (not just a vh
                // percentage) so short landscape-phone screens never
                // push the footer ("View All Notifications") past the
                // visible area. The header/category/actions rows below
                // are pinned (flexShrink: 0) and only the notification
                // list itself scrolls, so the footer stays reachable.
                maxHeight: isMobile
                    ? "calc(100vh - 80px)"
                    : "min(550px, calc(100vh - 80px))",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: isDark ? "1px solid #333" : "1px solid #f0f0f0",
            }}
        >
            <div
                className="notification-header"
                style={{
                    flexShrink: 0,
                    padding: isMobile ? "12px" : "16px",
                    borderBottom: isDark
                        ? "1px solid #333"
                        : "1px solid #f0f0f0",
                    background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: isMobile ? "wrap" : "nowrap",
                        gap: isMobile ? 8 : 0,
                    }}
                >
                    <div>
                        <Title
                            level={5}
                            style={{
                                color: "white",
                                margin: 0,
                                fontSize: isMobile ? 14 : 16,
                            }}
                        >
                            Notifications
                        </Title>
                        <Text
                            style={{
                                color: "rgba(255,255,255,0.8)",
                                fontSize: isMobile ? "11px" : "12px",
                            }}
                        >
                            {unreadCount} unread{" "}
                            {unreadCount === 1 ? "message" : "messages"}
                        </Text>
                    </div>
                    <Space>
                        <Button
                            size="small"
                            type={filterUnread ? "primary" : "default"}
                            onClick={() => setFilterUnread(!filterUnread)}
                            style={{
                                background: filterUnread
                                    ? "rgba(255,255,255,0.2)"
                                    : "transparent",
                                border: "1px solid rgba(255,255,255,0.3)",
                                color: "white",
                                fontSize: isMobile ? 11 : 14,
                            }}
                        >
                            {filterUnread ? "Show All" : "Show Unread"}
                        </Button>
                    </Space>
                </div>
            </div>

            <div
                className="notification-category-bar"
                style={{
                    flexShrink: 0,
                    padding: isMobile ? "6px 8px" : "8px 12px",
                    borderBottom: isDark
                        ? "1px solid #333"
                        : "1px solid #f0f0f0",
                    background: isDark ? COLORS.ink1a : "#f8f9fa",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                }}
            >
                <Space size={4}>
                    {Object.entries(visibleNotificationCategories).map(
                        ([key, category]) => (
                            <Tooltip
                                key={key}
                                title={category.label}
                                // On touch devices, hover never reliably
                                // fires mouseleave, so these tooltips
                                // would stack up and stay stuck open.
                                // Uses isTouchDevice (not isMobile) so
                                // this stays correct in landscape too —
                                // isMobile is intentionally false there
                                // for unrelated sidebar-layout reasons,
                                // but the device is still a touchscreen.
                                trigger={isTouchDevice ? [] : ["hover"]}
                                open={isTouchDevice ? false : undefined}
                            >
                                <Button
                                    size="small"
                                    type={
                                        activeCategory === key
                                            ? "primary"
                                            : "text"
                                    }
                                    icon={category.icon}
                                    aria-label={category.label}
                                    onClick={() => setActiveCategory(key)}
                                    style={{
                                        borderColor:
                                            activeCategory === key
                                                ? category.color
                                                : "transparent",
                                        background:
                                            activeCategory === key
                                                ? category.color
                                                : "transparent",
                                        color:
                                            activeCategory === key
                                                ? COLORS.white
                                                : category.color,
                                        minWidth: isMobile ? 28 : 32,
                                        padding: isMobile ? "0 4px" : "0 8px",
                                        fontSize: isMobile ? 10 : 14,
                                    }}
                                >
                                    {categoryCounts[key] > 0 && (
                                        <span
                                            style={{
                                                marginLeft: 4,
                                                fontSize: isMobile ? 9 : 10,
                                            }}
                                        >
                                            {categoryCounts[key]}
                                        </span>
                                    )}
                                </Button>
                            </Tooltip>
                        ),
                    )}
                </Space>
            </div>

            <div
                className="notification-actions-bar"
                style={{
                    flexShrink: 0,
                    padding: isMobile ? "6px 12px" : "8px 16px",
                    borderBottom: isDark
                        ? "1px solid #333"
                        : "1px solid #f0f0f0",
                    background: isDark ? COLORS.ink0a : COLORS.zinc50,
                }}
            >
                <Space>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            type="link"
                            onClick={handleMarkAllAsRead}
                            loading={false}
                            icon={<EyeInvisibleOutlined />}
                            style={{
                                padding: 0,
                                fontSize: isMobile ? "11px" : "12px",
                                color: isDark ? COLORS.blue400 : undefined,
                            }}
                        >
                            Mark all as read
                        </Button>
                    )}
                    <Button
                        size="small"
                        type="link"
                        icon={<SettingOutlined />}
                        style={{
                            padding: 0,
                            fontSize: isMobile ? "11px" : "12px",
                            color: isDark ? COLORS.blue400 : undefined,
                        }}
                        onClick={() => {
                            setDropdownVisible(false);
                            setSettingsModalVisible(true);
                        }}
                    >
                        Notification settings
                    </Button>
                </Space>
            </div>

            <div
                className="notification-list-scroll"
                style={{
                    // Was a fixed maxHeight (180/250) that, combined with
                    // the outer container's overflow:hidden, simply
                    // clipped the footer off-screen on short landscape
                    // viewports. flex:1 + minHeight:0 lets this region
                    // take whatever space remains between the pinned
                    // header/category/actions bars above and the pinned
                    // footer below, scrolling internally when needed.
                    flex: "1 1 auto",
                    minHeight: 0,
                    overflowY: "auto",
                    background: isDark ? COLORS.ink0a : COLORS.white,
                }}
            >
                {isLoading ? (
                    <div style={{ padding: 40, textAlign: "center" }}>
                        <Spin />
                        <div
                            style={{
                                marginTop: 10,
                                color: isDark ? COLORS.a0a0a0 : COLORS.gray666,
                            }}
                        >
                            Loading notifications...
                        </div>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div
                        style={{
                            padding: isMobile ? 20 : 40,
                            textAlign: "center",
                            color: isDark ? COLORS.a0a0a0 : COLORS.c999999,
                        }}
                    >
                        <BellOutlined
                            style={{
                                fontSize: isMobile ? 28 : 32,
                                marginBottom: 16,
                                color: isDark
                                    ? COLORS.c555555
                                    : COLORS.antdGray5,
                            }}
                        />
                        <div
                            style={{
                                fontSize: isMobile ? "13px" : "14px",
                                color: isDark ? COLORS.white : undefined,
                            }}
                        >
                            {activeCategory !== "all"
                                ? `No ${NOTIFICATION_CATEGORIES[activeCategory].label.toLowerCase()}`
                                : filterUnread
                                  ? "No unread notifications"
                                  : "No notifications yet"}
                        </div>
                        <Text
                            style={{
                                fontSize: isMobile ? "10px" : "12px",
                                color: isDark ? COLORS.a0a0a0 : COLORS.c999999,
                            }}
                        >
                            We'll notify you when something arrives
                        </Text>
                    </div>
                ) : (
                    <List
                        dataSource={filteredNotifications.slice(0, 5)}
                        renderItem={(item) => (
                            <NotificationItem notification={item} />
                        )}
                    />
                )}
            </div>

            {notifications.length > 0 && (
                <div
                    className="notification-footer"
                    style={{
                        flexShrink: 0,
                        borderTop: isDark
                            ? "1px solid #333"
                            : "1px solid #f0f0f0",
                        padding: "12px 16px",
                        textAlign: "center",
                        background: isDark ? COLORS.ink0a : COLORS.zinc50,
                    }}
                >
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            setDropdownVisible(false);
                            setAllNotificationsModalVisible(true);
                            fetchAllNotifications(1);
                        }}
                        style={{ borderRadius: 6 }}
                    >
                        View All Notifications ({totalNotifications})
                    </Button>
                </div>
            )}
        </div>
    );
}
