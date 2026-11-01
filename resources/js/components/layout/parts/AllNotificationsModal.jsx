import React from "react";
import {
    BellOutlined,
    CheckOutlined,
    DeleteOutlined,
    ReloadOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Badge,
    Button,
    Empty,
    Image,
    List,
    Modal,
    Pagination,
    Popconfirm,
    Space,
    Spin,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import {
    getCategoryInfo,
    getNotificationAlumniAvatar,
    getNotificationData,
    getNotificationEventImage,
} from "~/components/layout/utils/notificationUtils";
import { NOTIFICATION_CATEGORIES } from "~/config/notificationCategories";
import { COLORS } from "~/config/theme";

const { Text } = Typography;

export default function AllNotificationsModal() {
    const {
        filterNotificationsByCategory,
        allNotifications,
        getCategoryCounts,
        currentTheme,
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
        handleMarkAsRead,
        handleDeleteNotification,
        handleViewAlumniProfile,
        handleViewEventRegistrations,
        handleViewEventDetails,
        handleViewAnnouncement,
        handleViewFeedbackReport,
        history,
        modalPerPage,
    } = useLayoutContext();

    const filteredNotifications =
        filterNotificationsByCategory(allNotifications);
    const categoryCounts = getCategoryCounts(allNotifications);
    const isDark = currentTheme === "black";

    return (
        <Modal
            title={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingRight: 24,
                    }}
                >
                    <Space>
                        <BellOutlined />
                        <span>All Notifications</span>
                        <Badge
                            count={totalNotifications}
                            style={{ marginLeft: 8 }}
                            overflowCount={9999}
                        />
                    </Space>
                </div>
            }
            open={allNotificationsModalVisible}
            onCancel={() => setAllNotificationsModalVisible(false)}
            footer={null}
            className="all-notifications-modal"
            width={isMobile ? "95%" : 800}
            style={{
                top: isMobile ? 8 : undefined,
                maxWidth: isMobile ? "95vw" : undefined,
                paddingBottom: 0,
            }}
            styles={{ body: { padding: 0 } }}
        >
            <div
                className="theme-card-bg"
                style={{
                    padding: "12px 16px",
                    borderBottom: isDark
                        ? "1px solid #333"
                        : "1px solid #f0f0f0",
                }}
            >
                <div style={{ marginBottom: 12 }}>
                    <Text
                        strong
                        className="theme-text-secondary"
                        style={{
                            display: "block",
                            marginBottom: 8,
                            fontSize: 12,
                        }}
                    >
                        Filter by Category:
                    </Text>
                    <Space wrap size={[8, 8]}>
                        {Object.entries(visibleNotificationCategories).map(
                            ([key, category]) => (
                                <Button
                                    key={key}
                                    size="small"
                                    type={
                                        activeCategory === key
                                            ? "primary"
                                            : "default"
                                    }
                                    icon={category.icon}
                                    onClick={() => setActiveCategory(key)}
                                    style={{
                                        borderColor:
                                            activeCategory === key
                                                ? category.color
                                                : undefined,
                                        background:
                                            activeCategory === key
                                                ? category.color
                                                : undefined,
                                    }}
                                >
                                    {category.label}
                                    {categoryCounts[key] > 0 && (
                                        <Badge
                                            count={categoryCounts[key]}
                                            size="small"
                                            overflowCount={9999}
                                            style={{
                                                marginLeft: 6,
                                                backgroundColor:
                                                    activeCategory === key
                                                        ? COLORS.white
                                                        : category.color,
                                                color:
                                                    activeCategory === key
                                                        ? category.color
                                                        : COLORS.white,
                                            }}
                                        />
                                    )}
                                </Button>
                            ),
                        )}
                    </Space>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // Without wrap, this row was squeezed on narrow
                        // screens and the Refresh button's label got
                        // clipped down to just "Re". Wrapping lets the
                        // Refresh button drop to its own line instead.
                        flexWrap: "wrap",
                        gap: 8,
                    }}
                >
                    <Space wrap>
                        <Button
                            size="small"
                            type={filterUnread ? "primary" : "default"}
                            onClick={() => setFilterUnread(!filterUnread)}
                        >
                            {filterUnread ? "Show All" : "Show Unread Only"}
                        </Button>
                        {unreadCount > 0 && (
                            <Button
                                size="small"
                                icon={<CheckOutlined />}
                                onClick={handleMarkAllAsRead}
                            >
                                Mark All as Read
                            </Button>
                        )}
                    </Space>
                    <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={() => fetchAllNotifications(currentPage)}
                        loading={loadingMore}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
                {loadingMore ? (
                    <div style={{ padding: 40, textAlign: "center" }}>
                        <Spin />
                        <div
                            className="theme-text-secondary"
                            style={{ marginTop: 10 }}
                        >
                            Loading notifications...
                        </div>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            activeCategory !== "all"
                                ? `No ${NOTIFICATION_CATEGORIES[activeCategory].label.toLowerCase()} notifications`
                                : filterUnread
                                  ? "No unread notifications"
                                  : "No notifications"
                        }
                        style={{ padding: 40 }}
                    />
                ) : (
                    <List
                        dataSource={filteredNotifications}
                        renderItem={(notification) => {
                            const alumniAvatar =
                                getNotificationAlumniAvatar(notification);
                            const eventImage =
                                getNotificationEventImage(notification);
                            const notificationData =
                                getNotificationData(notification);
                            const categoryInfo = getCategoryInfo(notification);

                            const isAnnouncementNotification =
                                notification.notifiable_type ===
                                    "announcement" ||
                                notification.notifiable_type ===
                                    "new_announcement" ||
                                notificationData?.type === "announcement";
                            const announcementTitle =
                                notificationData?.announcement_title ||
                                notification.message ||
                                notificationData?.message ||
                                "";
                            const rawNotificationTitle =
                                notification.title ||
                                notificationData?.title ||
                                "Guidance Counselor (Admin)";
                            const notificationTitle = isAnnouncementNotification
                                ? `Announcement: ${announcementTitle || rawNotificationTitle}`
                                : rawNotificationTitle;
                            const notificationMessage =
                                isAnnouncementNotification
                                    ? notificationData?.announcement_excerpt ||
                                      notification.message ||
                                      notificationData?.message ||
                                      ""
                                    : notification.message ||
                                      notificationData?.message ||
                                      "";

                            return (
                                <List.Item
                                    className={`notification-list-item ${notification.read ? "" : "unread"}`}
                                    style={{
                                        padding: "12px 16px",
                                        cursor: "pointer",
                                    }}
                                    actions={[
                                        !notification.read && (
                                            <Tooltip
                                                title="Mark as read"
                                                key="read"
                                                trigger={
                                                    isMobile ? [] : ["hover"]
                                                }
                                                open={
                                                    isMobile ? false : undefined
                                                }
                                            >
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<CheckOutlined />}
                                                    aria-label="Mark as read"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(
                                                            notification.id,
                                                        );
                                                    }}
                                                />
                                            </Tooltip>
                                        ),
                                        <Popconfirm
                                            key="delete"
                                            title="Delete this notification?"
                                            onConfirm={(e) => {
                                                e?.stopPropagation();
                                                handleDeleteNotification(
                                                    notification.id,
                                                );
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Tooltip
                                                title="Delete"
                                                trigger={
                                                    isMobile ? [] : ["hover"]
                                                }
                                                open={
                                                    isMobile ? false : undefined
                                                }
                                            >
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    aria-label="Delete"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                />
                                            </Tooltip>
                                        </Popconfirm>,
                                    ].filter(Boolean)}
                                    onClick={() => {
                                        if (!notification.read) {
                                            handleMarkAsRead(notification.id);
                                        }
                                        if (
                                            notificationData?.type ===
                                                "profile_update" &&
                                            notificationData?.alumni_id
                                        ) {
                                            setAllNotificationsModalVisible(
                                                false,
                                            );
                                            handleViewAlumniProfile(
                                                notificationData.alumni_id,
                                            );
                                        }
                                        if (
                                            notification.notifiable_type ===
                                                "event_registration" &&
                                            notificationData?.event_id
                                        ) {
                                            setAllNotificationsModalVisible(
                                                false,
                                            );
                                            handleViewEventRegistrations(
                                                notificationData.event_id,
                                                notificationData.alumni_id,
                                            );
                                        }
                                        if (
                                            notification.notifiable_type ===
                                                "new_event" &&
                                            notificationData?.event_id
                                        ) {
                                            setAllNotificationsModalVisible(
                                                false,
                                            );
                                            handleViewEventDetails(
                                                notificationData.event_id,
                                            );
                                        }
                                        if (
                                            notification.notifiable_type ===
                                                "announcement" ||
                                            notification.notifiable_type ===
                                                "new_announcement" ||
                                            notificationData?.type ===
                                                "announcement"
                                        ) {
                                            setAllNotificationsModalVisible(
                                                false,
                                            );
                                            handleViewAnnouncement(
                                                notificationData?.announcement_id,
                                            );
                                        }
                                        if (
                                            notification.notifiable_type ===
                                                "feedback_report_update" &&
                                            notificationData?.feedback_report_id
                                        ) {
                                            setAllNotificationsModalVisible(
                                                false,
                                            );
                                            handleViewFeedbackReport(
                                                notificationData.feedback_report_id,
                                                {
                                                    id: notificationData.feedback_report_id,
                                                    status: notificationData.status,
                                                    admin_notes:
                                                        notificationData.admin_notes,
                                                    type: notificationData.feedback_type,
                                                    area: notificationData.feedback_area,
                                                },
                                            );
                                        }
                                        if (
                                            notification.notifiable_type ===
                                                "new_feedback_report" &&
                                            notificationData?.feedback_report_id
                                        ) {
                                            setAllNotificationsModalVisible(
                                                false,
                                            );
                                            history.push(
                                                `/feedback-reports?id=${notificationData.feedback_report_id}`,
                                            );
                                        }
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            width: "100%",
                                        }}
                                    >
                                        {notification.notifiable_type ===
                                            "new_event" && eventImage ? (
                                            <div
                                                style={{
                                                    marginRight: 12,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Image
                                                    src={
                                                        eventImage ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt="Event"
                                                    width={50}
                                                    height={50}
                                                    style={{
                                                        borderRadius: 8,
                                                        objectFit: "cover",
                                                    }}
                                                    preview={false}
                                                    fallback="/community-event.png"
                                                />
                                            </div>
                                        ) : (
                                            <Avatar
                                                size={40}
                                                src={
                                                    notification.notifiable_type ===
                                                    "alumni_message"
                                                        ? undefined
                                                        : alumniAvatar
                                                }
                                                icon={
                                                    notification.notifiable_type ===
                                                    "alumni_message" ? (
                                                        <TeamOutlined />
                                                    ) : (
                                                        !alumniAvatar && (
                                                            <UserOutlined />
                                                        )
                                                    )
                                                }
                                                className="theme-avatar-border"
                                                style={{
                                                    marginRight: 12,
                                                    background:
                                                        notification.notifiable_type ===
                                                        "alumni_message"
                                                            ? COLORS.blue600
                                                            : alumniAvatar
                                                              ? "transparent"
                                                              : notification.read
                                                                ? COLORS.antdGray5
                                                                : COLORS.antdBlue,
                                                }}
                                            />
                                        )}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "flex-start",
                                                    marginBottom: 4,
                                                    flexWrap: "wrap",
                                                    gap: 4,
                                                }}
                                            >
                                                <Text
                                                    strong
                                                    style={{
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    {notificationTitle}
                                                </Text>
                                                <Tag
                                                    color={categoryInfo.color}
                                                    style={{
                                                        fontSize: "10px",
                                                        padding: "0 6px",
                                                        borderRadius: 10,
                                                        lineHeight: "18px",
                                                        margin: 0,
                                                    }}
                                                >
                                                    {categoryInfo.icon}{" "}
                                                    {categoryInfo.label}
                                                </Tag>
                                            </div>
                                            <Text
                                                className="theme-text-secondary"
                                                style={{
                                                    fontSize: "12px",
                                                    display: "block",
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {notificationMessage}
                                            </Text>
                                            {notification.notifiable_type ===
                                                "new_event" &&
                                                notificationData?.event_title && (
                                                    <Text
                                                        strong
                                                        style={{
                                                            fontSize: "12px",
                                                            color: COLORS.antdBlue,
                                                            display: "block",
                                                            marginBottom: 4,
                                                        }}
                                                    >
                                                        {
                                                            notificationData.event_title
                                                        }
                                                    </Text>
                                                )}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Space size="small">
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: "11px",
                                                        }}
                                                    >
                                                        {notification.sender
                                                            ?.name ||
                                                            notificationData?.created_by ||
                                                            notificationData?.alumni_name ||
                                                            ""}
                                                    </Text>
                                                    {!notification.read && (
                                                        <Badge
                                                            dot
                                                            color={
                                                                COLORS.antdBlue
                                                            }
                                                            size="small"
                                                        />
                                                    )}
                                                </Space>
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                    {notification.created_at
                                                        ? (() => {
                                                              const date =
                                                                  new Date(
                                                                      notification.created_at,
                                                                  );
                                                              const now =
                                                                  new Date();
                                                              const diffMs =
                                                                  now - date;
                                                              const diffMins =
                                                                  Math.floor(
                                                                      diffMs /
                                                                          60000,
                                                                  );
                                                              const diffHours =
                                                                  Math.floor(
                                                                      diffMs /
                                                                          3600000,
                                                                  );
                                                              const diffDays =
                                                                  Math.floor(
                                                                      diffMs /
                                                                          86400000,
                                                                  );
                                                              if (diffMins < 1)
                                                                  return "Just now";
                                                              if (diffMins < 60)
                                                                  return `${diffMins}m ago`;
                                                              if (
                                                                  diffHours < 24
                                                              )
                                                                  return `${diffHours}h ago`;
                                                              if (diffDays < 7)
                                                                  return `${diffDays}d ago`;
                                                              return date.toLocaleDateString();
                                                          })()
                                                        : "Just now"}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                )}
            </div>

            {totalNotifications > modalPerPage && (
                <div
                    className="theme-footer-bg"
                    style={{
                        borderTop: isDark
                            ? "1px solid #333"
                            : "1px solid #f0f0f0",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Pagination
                        current={currentPage}
                        total={totalNotifications}
                        pageSize={modalPerPage}
                        onChange={(page) => {
                            fetchAllNotifications(page);
                        }}
                        showSizeChanger={false}
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} notifications`
                        }
                    />
                </div>
            )}
        </Modal>
    );
}
