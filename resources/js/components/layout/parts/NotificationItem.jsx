import React from "react";
import {
    CommentOutlined,
    EyeOutlined,
    MessageOutlined,
    SoundOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Badge,
    Button,
    Image,
    List,
    Space,
    Tag,
    Typography,
} from "antd";
import avatarGuidance from "~/assets/images/avatar_guidance.png";
import avatarBEED from "~/assets/images/beed-logo.png";
import avatarBSBA from "~/assets/images/bsba-logo.png";
import avatarBSIT from "~/assets/images/bsit-logo.jpg";
import avatarBSED from "~/assets/images/educ-logo.png";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import {
    getCategoryInfo,
    getNotificationData,
    withImageCacheBuster,
} from "~/components/layout/utils/notificationUtils";
import { ROLES } from "~/config/roles";
import { COLORS } from "~/config/theme";

const { Text } = Typography;

export default function NotificationItem({ notification }) {
    const {
        currentTheme,
        handleMarkAsRead,
        setDropdownVisible,
        handleViewAlumniProfile,
        handleViewEventRegistrations,
        handleViewEventDetails,
        handleViewAnnouncement,
        handleViewFeedbackReport,
        history,
        role,
    } = useLayoutContext();

    const notificationData = getNotificationData(notification);
    const categoryInfo = getCategoryInfo(notification);
    const isDark = currentTheme === "black";

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return COLORS.antdRed;
            case "medium":
                return COLORS.antdGold;
            case "low":
                return COLORS.antdGreen;
            default:
                return COLORS.antdBlue;
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "Just now";
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const handleNotificationClick = () => {
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }

        if (
            notificationData?.type === "profile_update" &&
            notificationData?.alumni_id
        ) {
            setDropdownVisible(false);
            handleViewAlumniProfile(notificationData.alumni_id);
        }

        if (
            notification.notifiable_type === "event_registration" &&
            notificationData?.event_id
        ) {
            setDropdownVisible(false);
            handleViewEventRegistrations(
                notificationData.event_id,
                notificationData.alumni_id,
            );
        }

        if (
            notification.notifiable_type === "new_event" &&
            notificationData?.event_id
        ) {
            setDropdownVisible(false);
            handleViewEventDetails(notificationData.event_id);
        }

        if (
            notification.notifiable_type === "announcement" ||
            notification.notifiable_type === "new_announcement" ||
            notificationData?.type === "announcement"
        ) {
            setDropdownVisible(false);
            handleViewAnnouncement(notificationData?.announcement_id);
        }

        if (
            notification.notifiable_type === "feedback_report_update" &&
            notificationData?.feedback_report_id
        ) {
            setDropdownVisible(false);
            handleViewFeedbackReport(notificationData.feedback_report_id, {
                id: notificationData.feedback_report_id,
                status: notificationData.status,
                admin_notes: notificationData.admin_notes,
                type: notificationData.feedback_type,
                area: notificationData.feedback_area,
            });
        }

        // Admin-facing: an alumni just submitted a new feedback report.
        // Deep-link straight into the admin Feedback Reports page with
        // ?id= so it can open that exact report (see
        // AtmsFeedbackReportsPage.js), same pattern as
        // handleViewAnnouncement above.
        if (
            notification.notifiable_type === "new_feedback_report" &&
            notificationData?.feedback_report_id
        ) {
            setDropdownVisible(false);
            history.push(
                `/feedback-reports?id=${notificationData.feedback_report_id}`,
            );
        }

        // "admin_message" (alumni got a message from the admin) and
        // "alumni_message" (admin's combined unread-across-all-alumni
        // count) both just deep-link to the Messages feature itself
        // — same /messages route renders the right view for each
        // role (see routes/index.js). The admin variant intentionally
        // does NOT jump into one specific alumni's thread, so it
        // can't be mistaken for a per-alumni notification.
        if (
            notification.notifiable_type === "admin_message" ||
            notification.notifiable_type === "alumni_message" ||
            notificationData?.type === "admin_message" ||
            notificationData?.type === "alumni_message"
        ) {
            setDropdownVisible(false);
            history.push("/messages");
        }
    };

    const getAlumniAvatar = () => {
        if (
            notificationData?.type === "department_head_login" ||
            (notification.title &&
                notification.title.toLowerCase().includes("department head")) ||
            (notification.message &&
                notification.message.toLowerCase().includes("department head"))
        ) {
            const courseId = notificationData?.course_id;
            switch (courseId) {
                case 1:
                case "1":
                    return avatarBSIT;
                case 2:
                case "2":
                    return avatarBSED;
                case 3:
                case "3":
                    return avatarBEED;
                case 4:
                case "4":
                    return avatarBSBA;
                default:
                    return avatarGuidance;
            }
        }

        if (notificationData?.alumni_profile_image) {
            return withImageCacheBuster(notificationData.alumni_profile_image);
        }
        if (notificationData?.profile_image_url) {
            return withImageCacheBuster(notificationData.profile_image_url);
        }
        if (notification.sender?.avatar) {
            return withImageCacheBuster(notification.sender.avatar);
        }
        return null;
    };

    const alumniAvatar = getAlumniAvatar();

    const getEventImage = () => {
        if (
            notification.notifiable_type === "new_event" &&
            notificationData?.event_images?.length > 0
        ) {
            return notificationData.event_images[0];
        }
        return null;
    };

    const eventImage = getEventImage();

    const isAnnouncementNotification =
        notification.notifiable_type === "announcement" ||
        notification.notifiable_type === "new_announcement" ||
        notificationData?.type === "announcement";

    // The API's top-level title/message for announcement notifications
    // is just the generic "New Announcement" wrapper text — the real
    // title lives in notificationData.announcement_title (backend also
    // duplicates it into data.message). Prefer that so we show
    // "Announcement: Homecoming 2026" instead of "Announcement: New
    // Announcement".
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
    const notificationMessage = isAnnouncementNotification
        ? notificationData?.announcement_excerpt ||
          notification.message ||
          notificationData?.message ||
          ""
        : notification.message || notificationData?.message || "";

    return (
        <List.Item
            className={notification.read ? "" : "unread"}
            style={{
                padding: "12px 16px",
                background: notification.read
                    ? isDark
                        ? COLORS.ink0a
                        : COLORS.white
                    : isDark
                      ? COLORS.c1a1a2e
                      : COLORS.f0f7ff,
                cursor: "pointer",
                transition: "all 0.2s ease",
                borderBottom: isDark ? "1px solid #333" : "1px solid #f0f0f0",
                borderLeft: notification.read
                    ? "none"
                    : `3px solid ${getPriorityColor(notification.priority)}`,
                borderRadius: "0",
            }}
            onClick={handleNotificationClick}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                }}
            >
                {notification.notifiable_type === "new_event" && eventImage ? (
                    <div style={{ marginRight: 12, flexShrink: 0 }}>
                        <Image
                            src={eventImage || "/placeholder.svg"}
                            alt="Event"
                            width={50}
                            height={50}
                            style={{ borderRadius: 8, objectFit: "cover" }}
                            preview={false}
                            fallback="/community-event.png"
                        />
                    </div>
                ) : (
                    <Avatar
                        size={40}
                        src={
                            // "alumni_message" is the admin's combined
                            // inbox notification — it isn't about any
                            // one alumni, so there's no real profile
                            // photo to show. Previously this fell
                            // through to the generic default-person
                            // silhouette (alumniAvatar resolves to
                            // null here), which read as a placeholder
                            // photo rather than an icon. Force the
                            // TeamOutlined icon below instead.
                            notification.notifiable_type === "alumni_message"
                                ? undefined
                                : role === ROLES.ALUMNI
                                  ? avatarGuidance
                                  : alumniAvatar
                        }
                        icon={
                            notification.notifiable_type ===
                            "alumni_message" ? (
                                <TeamOutlined />
                            ) : (
                                !alumniAvatar &&
                                role !== ROLES.ALUMNI && <UserOutlined />
                            )
                        }
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
                            border:
                                notification.notifiable_type ===
                                "alumni_message"
                                    ? "none"
                                    : alumniAvatar
                                      ? isDark
                                          ? "1px solid #333"
                                          : "1px solid #e8e8e8"
                                      : "none",
                        }}
                    />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
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
                                lineHeight: "1.3",
                                color: isDark ? COLORS.white : undefined,
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
                            {categoryInfo.icon} {categoryInfo.label}
                        </Tag>
                    </div>
                    <Text
                        style={{
                            fontSize: "12px",
                            color: isDark ? COLORS.a0a0a0 : COLORS.gray666,
                            lineHeight: "1.4",
                            display: "block",
                            marginBottom: 4,
                        }}
                    >
                        {notificationMessage}
                    </Text>
                    {notification.notifiable_type === "new_event" &&
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
                                {notificationData.event_title}
                            </Text>
                        )}
                    {notification.notifiable_type === "new_event" &&
                        notificationData?.event_id && (
                            <Button
                                type="link"
                                size="small"
                                icon={<EyeOutlined />}
                                style={{
                                    padding: 0,
                                    fontSize: "11px",
                                    height: "auto",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!notification.read) {
                                        handleMarkAsRead(notification.id);
                                    }
                                    setDropdownVisible(false);
                                    handleViewEventDetails(
                                        notificationData.event_id,
                                    );
                                }}
                            >
                                View Details
                            </Button>
                        )}
                    {notification.notifiable_type === "event_registration" &&
                        notificationData?.event_id && (
                            <Button
                                type="link"
                                size="small"
                                icon={<TeamOutlined />}
                                style={{
                                    padding: 0,
                                    fontSize: "11px",
                                    height: "auto",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!notification.read) {
                                        handleMarkAsRead(notification.id);
                                    }
                                    setDropdownVisible(false);
                                    handleViewEventRegistrations(
                                        notificationData.event_id,
                                        notificationData.alumni_id,
                                    );
                                }}
                            >
                                View Registrations
                            </Button>
                        )}
                    {isAnnouncementNotification && (
                        <Button
                            type="link"
                            size="small"
                            icon={<SoundOutlined />}
                            style={{
                                padding: 0,
                                fontSize: "11px",
                                height: "auto",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!notification.read) {
                                    handleMarkAsRead(notification.id);
                                }
                                setDropdownVisible(false);
                                handleViewAnnouncement(
                                    notificationData?.announcement_id,
                                );
                            }}
                        >
                            View Announcement
                        </Button>
                    )}
                    {notification.notifiable_type ===
                        "feedback_report_update" &&
                        notificationData?.feedback_report_id && (
                            <Button
                                type="link"
                                size="small"
                                icon={<CommentOutlined />}
                                style={{
                                    padding: 0,
                                    fontSize: "11px",
                                    height: "auto",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!notification.read) {
                                        handleMarkAsRead(notification.id);
                                    }
                                    setDropdownVisible(false);
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
                                }}
                            >
                                View Feedback
                            </Button>
                        )}
                    {notification.notifiable_type === "new_feedback_report" &&
                        notificationData?.feedback_report_id && (
                            <Button
                                type="link"
                                size="small"
                                icon={<CommentOutlined />}
                                style={{
                                    padding: 0,
                                    fontSize: "11px",
                                    height: "auto",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!notification.read) {
                                        handleMarkAsRead(notification.id);
                                    }
                                    setDropdownVisible(false);
                                    history.push(
                                        `/feedback-reports?id=${notificationData.feedback_report_id}`,
                                    );
                                }}
                            >
                                View Report
                            </Button>
                        )}
                    {(notification.notifiable_type === "admin_message" ||
                        notification.notifiable_type === "alumni_message" ||
                        notificationData?.type === "admin_message" ||
                        notificationData?.type === "alumni_message") && (
                        <Button
                            type="link"
                            size="small"
                            icon={<MessageOutlined />}
                            style={{
                                padding: 0,
                                fontSize: "11px",
                                height: "auto",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!notification.read) {
                                    handleMarkAsRead(notification.id);
                                }
                                setDropdownVisible(false);
                                history.push("/messages");
                            }}
                        >
                            Open Messages
                        </Button>
                    )}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Space size="small">
                            <Text
                                style={{
                                    fontSize: "11px",
                                    color: isDark
                                        ? COLORS.a0a0a0
                                        : COLORS.c999999,
                                }}
                            >
                                {role === ROLES.ALUMNI
                                    ? "Guidance Counselor (Admin)"
                                    : notification.sender?.name ||
                                      notificationData?.created_by ||
                                      notificationData?.alumni_name ||
                                      ""}
                            </Text>
                            {!notification.read && (
                                <Badge
                                    dot
                                    color={COLORS.antdBlue}
                                    size="small"
                                />
                            )}
                        </Space>
                        <Text
                            style={{
                                fontSize: "10px",
                                color: isDark ? COLORS.a0a0a0 : COLORS.c999999,
                            }}
                        >
                            {formatTime(notification.created_at)}
                        </Text>
                    </div>
                </div>
            </div>
        </List.Item>
    );
}
