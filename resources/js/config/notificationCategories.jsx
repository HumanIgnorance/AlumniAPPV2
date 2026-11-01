import {
    AppstoreOutlined,
    CalendarOutlined,
    CommentOutlined,
    EditOutlined,
    FormOutlined,
    IdcardOutlined,
    LoginOutlined,
    MessageOutlined,
    SafetyCertificateOutlined,
    SoundOutlined,
    TeamOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";

export const NOTIFICATION_CATEGORIES = {
    all: {
        label: "All",
        icon: <AppstoreOutlined />,
        color: COLORS.antdBlue,
        types: [],
    },
    event_registration: {
        label: "Event Registered",
        icon: <CalendarOutlined />,
        color: COLORS.antdGreen,
        // "event_registration_success" is the copy sent back to the
        // alumni who just registered (EventController@register) — same
        // category as the admin-facing "event_registration" notice.
        types: [
            "event_registration",
            "new_event",
            "event_registration_success",
        ],
    },
    profile_update: {
        label: "Profile Updates",
        icon: <EditOutlined />,
        color: COLORS.antdPurple,
        types: ["profile_update"],
    },
    account_login: {
        label: "Login Activity",
        icon: <LoginOutlined />,
        color: COLORS.antdCyan,
        types: ["login", "login_success", "account_login"],
    },
    account_approved: {
        label: "Account Approved",
        icon: <SafetyCertificateOutlined />,
        color: COLORS.antdGold,
        types: ["account_approved", "approved", "approval"],
    },
    quiz_submission: {
        label: "Quiz Submissions",
        icon: <FormOutlined />,
        color: COLORS.antdMagenta,
        // "quiz_completed" is the copy sent back to the alumni who just
        // finished a quiz (QuizController@submit) — same category as the
        // admin-facing "quiz_submission" notice.
        types: [
            "quiz_submission",
            "rating_quiz",
            "abcd_quiz",
            "quiz",
            "quiz_completed",
        ],
    },
    login_attempt: {
        label: "Login Attempts",
        icon: <WarningOutlined />,
        color: COLORS.antdRed,
        // "pending_alumni_login" (AuthController::notifyAdminsAboutPendingAlumniLogin)
        // is the real type; it doesn't reach this list via notifiable_type
        // though — see the TYPE_TO_CATEGORY lookup below for why.
        types: [
            "login_attempt",
            "failed_login",
            "suspicious_login",
            "pending_alumni_login",
        ],
    },
    department_head_login: {
        label: "Dept. Head Login",
        icon: <IdcardOutlined />,
        color: "#9254de",
        types: ["department_head_login"],
    },
    announcement: {
        label: "Announcements",
        icon: <SoundOutlined />,
        color: COLORS.antdOrange,
        types: ["announcement", "new_announcement"],
    },
    feedback: {
        label: "Feedback",
        icon: <CommentOutlined />,
        color: COLORS.red500,
        types: ["new_feedback_report", "feedback_report_update"],
    },
    messages: {
        label: "Messages",
        icon: <MessageOutlined />,
        color: COLORS.blue600,
        // Alumni-facing only: unread count of one admin's messages to
        // THIS specific alumni. Kept as its own category (not merged
        // with alumni_messages below) so the icon/label stay accurate —
        // this is a single 1-to-1 conversation, not a many-people inbox.
        types: ["admin_message"],
    },
    alumni_messages: {
        label: "Alumni Messages",
        icon: <TeamOutlined />,
        color: COLORS.blue600,
        // Admin-facing only: combined unread count across EVERY alumni
        // conversation (see MessagingController::notifyAdminsOfAlumniMessages).
        // TeamOutlined (many-people icon) instead of MessageOutlined on
        // purpose — it's an aggregate of many alumni, not one thread.
        types: ["alumni_message"],
    },
};

// Reverse lookup built from NOTIFICATION_CATEGORIES above: exact type
// token -> category key. Keeps every known type listed in exactly one
// place (each category's `types` array) instead of duplicating it again
// in getNotificationCategory's switch logic.
export const TYPE_TO_CATEGORY = Object.entries(NOTIFICATION_CATEGORIES).reduce(
    (acc, [key, meta]) => {
        (meta.types || []).forEach((t) => {
            acc[t] = key;
        });
        return acc;
    },
    {},
);

// ============ ROLE-BASED NOTIFICATION VISIBILITY ============
// Not every role cares about every notification category. Alumni, for
// example, only need their own event registrations, login activity, and
// quiz submissions — security/admin-facing categories like login attempts
// or department-head logins are just noise for them.
//
// Alumni & department-head login/logout activity now lives in the
// dedicated Audit Log page (see AuditLogController + AuthController's
// logAudit()) instead of being pushed here as Notification rows, since
// with hundreds of alumni logging in the "account_login" /
// "department_head_login" categories drowned out every other
// notification in the bell — including for admins, who previously fell
// back to seeing every category since they weren't listed here. Admin
// is now listed explicitly, excluding those two noisy categories; any
// older rows of that type still in the database simply won't render
// (see getVisibleNotificationCategoryKeys) rather than falling back to
// "all".
export const ROLE_NOTIFICATION_CATEGORIES = {
    alumni: [
        "event_registration",
        "account_login",
        "quiz_submission",
        "announcement",
        "feedback",
        "messages",
    ],
    department_head: ["account_login", "event_registration"],
    admin: [
        "event_registration",
        "profile_update",
        "account_approved",
        "quiz_submission",
        "login_attempt",
        "announcement",
        "feedback",
        "alumni_messages",
    ],
};

export const getVisibleNotificationCategoryKeys = (userRole) => {
    const restricted = ROLE_NOTIFICATION_CATEGORIES[userRole];
    if (!restricted) {
        // Unlisted roles (admin, etc.) see every category.
        return Object.keys(NOTIFICATION_CATEGORIES).filter(
            (key) => key !== "all",
        );
    }
    return restricted;
};
