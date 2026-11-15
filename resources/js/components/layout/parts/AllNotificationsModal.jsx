import React from "react";
import { BellOutlined, CheckOutlined, ReloadOutlined } from "@ant-design/icons";
import { Badge, Empty, Pagination, Spin } from "antd";
import Modal from "~/components/shared/AppModal";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import NotificationRow from "~/components/layout/parts/NotificationRow";
import { NOTIFICATION_CATEGORIES } from "~/config/notificationCategories";

/**
 * "View all notifications".
 *
 * Rebuilt so there is no dead space on any phone:
 *   - AppModal gives the centred card (tablet / desktop) and the bottom sheet
 *     (phones, PWA + browser, safe-area aware);
 *   - the body is a flex column: controls (fixed) / list (fills and scrolls) /
 *     pager (fixed). The old fixed `maxHeight: 50vh` list left a blank band on
 *     tall phones and the wrapped filter buttons ate three rows on short ones;
 *   - the category filter is one horizontally-scrolling row of chips.
 */
export default function AllNotificationsModal() {
    const {
        filterNotificationsByCategory,
        allNotifications,
        getCategoryCounts,
        totalNotifications,
        allNotificationsModalVisible,
        setAllNotificationsModalVisible,
        isMobile,
        visibleNotificationCategories,
        activeCategory,
        setActiveCategory,
        filterUnread,
        setFilterUnread,
        unreadCount,
        handleMarkAllAsRead,
        fetchAllNotifications,
        currentPage,
        loadingMore,
        modalPerPage,
    } = useLayoutContext();

    const filtered = filterNotificationsByCategory(allNotifications);
    const counts = getCategoryCounts(allNotifications);
    const close = () => setAllNotificationsModalVisible(false);

    const emptyText =
        activeCategory !== "all"
            ? `No ${NOTIFICATION_CATEGORIES[activeCategory].label.toLowerCase()} notifications`
            : filterUnread
              ? "No unread notifications"
              : "No notifications";

    return (
        <Modal
            title={
                <>
                    <BellOutlined />
                    <span>All Notifications</span>
                    <Badge count={totalNotifications} overflowCount={9999} />
                </>
            }
            open={allNotificationsModalVisible}
            onCancel={close}
            footer={null}
            className="all-notifications-modal"
            width={760}
        >
            <div className="ntf-all">
                <div className="ntf-chips" role="tablist" aria-label="Filter by category">
                    {Object.entries(visibleNotificationCategories).map(([key, category]) => (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === key}
                            className={`ntf-chip${activeCategory === key ? " is-active" : ""}`}
                            style={{ "--chip": category.color }}
                            onClick={() => setActiveCategory(key)}
                        >
                            {category.icon}
                            {category.label}
                            {counts[key] > 0 && (
                                <span className="ntf-chip__count">
                                    {counts[key] > 999 ? "999+" : counts[key]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="ntf-actions">
                    <button
                        type="button"
                        className="ntf-link"
                        aria-pressed={filterUnread}
                        onClick={() => setFilterUnread(!filterUnread)}
                    >
                        {filterUnread ? "Show all" : "Unread only"}
                    </button>
                    {unreadCount > 0 && (
                        <button type="button" className="ntf-link" onClick={handleMarkAllAsRead}>
                            <CheckOutlined /> Mark all as read
                        </button>
                    )}
                    <span className="ntf-actions__spacer" />
                    <button
                        type="button"
                        className="ntf-link"
                        disabled={loadingMore}
                        onClick={() => fetchAllNotifications(currentPage)}
                    >
                        <ReloadOutlined spin={loadingMore} /> Refresh
                    </button>
                </div>

                <div className="ntf-scroll">
                    {loadingMore && allNotifications.length === 0 ? (
                        <div className="ntf-loading">
                            <Spin />
                            Loading notifications...
                        </div>
                    ) : filtered.length === 0 ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={emptyText}
                            style={{ margin: 0, padding: "28px 16px" }}
                        />
                    ) : (
                        filtered.map((notification) => (
                            <NotificationRow
                                key={notification.id}
                                notification={notification}
                                onClose={close}
                                showActions
                            />
                        ))
                    )}
                </div>

                {totalNotifications > modalPerPage && (
                    <div className="ntf-pager">
                        <Pagination
                            current={currentPage}
                            total={totalNotifications}
                            pageSize={modalPerPage}
                            onChange={(page) => fetchAllNotifications(page)}
                            showSizeChanger={false}
                            size="small"
                            simple={isMobile}
                            showTotal={
                                isMobile
                                    ? undefined
                                    : (total, range) => `${range[0]}-${range[1]} of ${total} notifications`
                            }
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
}
