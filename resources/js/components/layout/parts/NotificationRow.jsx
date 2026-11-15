import React from "react";
import {
    CheckOutlined,
    DeleteOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Image, Popconfirm } from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import {
    getCategoryInfo,
    getNotificationAlumniAvatar,
    getNotificationData,
    getNotificationEventImage,
} from "~/components/layout/utils/notificationUtils";
import { COLORS } from "~/config/theme";

export const timeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
};

/**
 * ONE notification row, used by the bell dropdown and by "All Notifications".
 * (They used to be two separate 300-line copies with different spacing.)
 *
 *   onClose      called after a row that opens something (profile, event,
 *                announcement, ...) so the host panel can close itself
 *   showActions  adds the "mark as read" / "delete" icon buttons (full list)
 *
 * Layout: media | body (title + time / 2-line message / sender + category) |
 * actions. Text is clamped and wraps, so a row is only as tall as its content.
 */
export default function NotificationRow({ notification, onClose, showActions = false }) {
    const {
        handleMarkAsRead,
        handleDeleteNotification,
        handleViewAlumniProfile,
        handleViewEventRegistrations,
        handleViewEventDetails,
        handleViewAnnouncement,
        handleViewFeedbackReport,
        history,
    } = useLayoutContext();

    const data = getNotificationData(notification);
    const category = getCategoryInfo(notification);
    const avatar = getNotificationAlumniAvatar(notification);
    const eventImage = getNotificationEventImage(notification);
    const type = notification.notifiable_type;

    const isAnnouncement =
        type === "announcement" || type === "new_announcement" || data?.type === "announcement";
    const isInbox =
        type === "admin_message" ||
        type === "alumni_message" ||
        data?.type === "admin_message" ||
        data?.type === "alumni_message";

    const announcementTitle = data?.announcement_title || notification.message || data?.message || "";
    const rawTitle = notification.title || data?.title || "Guidance Counselor (Admin)";
    const title = isAnnouncement ? `Announcement: ${announcementTitle || rawTitle}` : rawTitle;
    const message = isAnnouncement
        ? data?.announcement_excerpt || notification.message || data?.message || ""
        : notification.message || data?.message || "";
    const sender = notification.sender?.name || data?.created_by || data?.alumni_name || "";

    const open = () => {
        if (!notification.read) handleMarkAsRead(notification.id);
        const done = () => onClose && onClose();

        if (data?.type === "profile_update" && data?.alumni_id) {
            done();
            handleViewAlumniProfile(data.alumni_id);
        }
        if (type === "event_registration" && data?.event_id) {
            done();
            handleViewEventRegistrations(data.event_id, data.alumni_id);
        }
        if (type === "new_event" && data?.event_id) {
            done();
            handleViewEventDetails(data.event_id);
        }
        if (isAnnouncement) {
            done();
            handleViewAnnouncement(data?.announcement_id);
        }
        if (type === "feedback_report_update" && data?.feedback_report_id) {
            done();
            handleViewFeedbackReport(data.feedback_report_id, {
                id: data.feedback_report_id,
                status: data.status,
                admin_notes: data.admin_notes,
                type: data.feedback_type,
                area: data.feedback_area,
            });
        }
        if (type === "new_feedback_report" && data?.feedback_report_id) {
            done();
            history.push(`/feedback-reports?id=${data.feedback_report_id}`);
        }
        // admin_message / alumni_message just deep-link to the Messages feature
        if (isInbox) {
            done();
            history.push("/messages");
        }
    };

    const media =
        type === "new_event" && eventImage ? (
            <Image
                src={eventImage}
                alt="Event"
                width={44}
                height={44}
                style={{ borderRadius: 10, objectFit: "cover" }}
                preview={false}
                fallback="/community-event.png"
            />
        ) : (
            <Avatar
                size={44}
                src={type === "alumni_message" ? undefined : avatar}
                icon={type === "alumni_message" ? <TeamOutlined /> : !avatar && <UserOutlined />}
                style={{
                    background:
                        type === "alumni_message"
                            ? COLORS.blue600
                            : avatar
                              ? "transparent"
                              : notification.read
                                ? COLORS.antdGray5
                                : COLORS.antdBlue,
                    border: "1px solid var(--app-border, #e2e6ec)",
                }}
            />
        );

    return (
        <div
            className={`ntf-row${notification.read ? "" : " is-unread"}`}
            role="button"
            tabIndex={0}
            onClick={open}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                }
            }}
        >
            <div className="ntf-row__media">{media}</div>

            <div className="ntf-row__body">
                <div className="ntf-row__top">
                    <span className="ntf-row__title">{title}</span>
                    <span className="ntf-row__time">{timeAgo(notification.created_at)}</span>
                </div>

                {message && <p className="ntf-row__msg">{message}</p>}

                {type === "new_event" && data?.event_title && (
                    <div className="ntf-row__event">{data.event_title}</div>
                )}

                <div className="ntf-row__meta">
                    <span className="ntf-tag" style={{ background: category.color }}>
                        {category.icon}
                        {category.label}
                    </span>
                    {sender && <span className="ntf-row__by">{sender}</span>}
                </div>
            </div>

            {showActions && (
                <div
                    className="ntf-row__actions"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    {!notification.read && (
                        <button
                            type="button"
                            className="ntf-iconbtn"
                            aria-label="Mark as read"
                            onClick={() => handleMarkAsRead(notification.id)}
                        >
                            <CheckOutlined />
                        </button>
                    )}
                    <Popconfirm
                        title="Delete this notification?"
                        okText="Yes"
                        cancelText="No"
                        placement="topRight"
                        onConfirm={() => handleDeleteNotification(notification.id)}
                    >
                        <button
                            type="button"
                            className="ntf-iconbtn ntf-iconbtn--danger"
                            aria-label="Delete notification"
                        >
                            <DeleteOutlined />
                        </button>
                    </Popconfirm>
                </div>
            )}
        </div>
    );
}
