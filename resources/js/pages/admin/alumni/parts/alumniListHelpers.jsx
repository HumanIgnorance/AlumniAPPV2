import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    StarOutlined,
    StopOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";
import moment from "moment";
import { COLORS } from "~/config/theme";

export const getStatusIcon = (status) => {
    switch (status) {
        case "approved":
            return <CheckCircleOutlined style={{ color: COLORS.antdGreen }} />;
        case "pending":
            return <ClockCircleOutlined style={{ color: COLORS.antdGold }} />;
        case "inactive":
            return <StopOutlined style={{ color: COLORS.antdRed }} />;
        case "rejected":
            return <CloseCircleOutlined style={{ color: COLORS.antdRed }} />;
        default:
            return <UserOutlined />;
    }
};

export const getEmploymentStatusTag = (status) => {
    const config = {
        Employed: {
            color: "green",
            text: "Employed",
            icon: <CheckCircleOutlined />,
        },
        Unemployed: {
            color: "red",
            text: "Seeking Work",
            icon: <ClockCircleOutlined />,
        },
        "Under Employed": {
            color: "orange",
            text: "Under Employed",
            icon: <ExclamationCircleOutlined />,
        },
    };

    // No employment_status on the alumni record yet — either they didn't
    // set one at registration, or an admin hasn't set one via the "Edit
    // Status" modal. Previously this fell through to
    // `{ color: "default", text: status }` with status === undefined,
    // which rendered as a blank, unlabeled tag with no way to tell it
    // apart from a loading glitch. Show an explicit "Not Set" tag instead
    // so it's clear the value is genuinely unset, not a display bug.
    if (!status) {
        return (
            <Tag color="default" icon={<ExclamationCircleOutlined />}>
                Not Set
            </Tag>
        );
    }

    const statusConfig = config[status] || {
        color: "default",
        text: status,
    };
    return (
        <Tag color={statusConfig.color} icon={statusConfig.icon}>
            {statusConfig.text}
        </Tag>
    );
};

export const getLastActiveStatus = (lastActive, isOnline) => {
    const now = moment();
    const lastActiveTime = lastActive ? moment(lastActive) : null;

    // Grace period: heartbeat fires every 2 min, so we allow up to 5 min
    // before treating a stale is_online flag as unreliable.
    // This prevents "ghost online" caused by a browser crash / forced close
    // where beforeunload could not fire.
    const HEARTBEAT_GRACE_MINUTES = 5;

    const isGenuinelyOnline =
        isOnline &&
        lastActiveTime !== null &&
        now.diff(lastActiveTime, "minutes") < HEARTBEAT_GRACE_MINUTES;

    if (isGenuinelyOnline) {
        return {
            status: "active",
            color: COLORS.antdGreen,
            text: "Active now",
            dotColor: COLORS.antdGreen,
        };
    }

    if (!lastActive) {
        return {
            status: "offline",
            color: COLORS.antdRed,
            text: "Never active",
            dotColor: COLORS.antdRed,
        };
    }

    const diffSeconds = now.diff(lastActiveTime, "seconds");
    const diffMinutes = now.diff(lastActiveTime, "minutes");
    const diffHours = now.diff(lastActiveTime, "hours");
    const diffDays = now.diff(lastActiveTime, "days");
    const diffWeeks = now.diff(lastActiveTime, "weeks");
    const diffMonths = now.diff(lastActiveTime, "months");
    const diffYears = now.diff(lastActiveTime, "years");

    let timeText = "";

    if (diffSeconds < 60) {
        timeText = diffSeconds <= 1 ? "Just now" : `${diffSeconds} seconds ago`;
    } else if (diffMinutes < 60) {
        timeText =
            diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
        timeText = diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
        timeText = diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else if (diffWeeks < 4) {
        timeText = diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
    } else if (diffMonths < 12) {
        timeText =
            diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
    } else {
        timeText = diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
    }

    return {
        status: "offline",
        color: COLORS.antdRed,
        text: timeText,
        dotColor: COLORS.antdRed,
    };
};

// ============ QUIZ STATUS HELPERS ============
export const getAlumniQuizStatus = (alumnus, quizResults) => {
    if (!Array.isArray(quizResults) || quizResults.length === 0) return [];

    // Get all unique quiz types that exist in results
    const allTypes = [...new Set(quizResults.map((r) => r.type))];

    // Get the quiz results for this specific alumni (matched by name or user id)
    const alumniResults = quizResults.filter(
        (r) =>
            r.user?.name?.toLowerCase() ===
                `${alumnus.first_name} ${alumnus.last_name}`.toLowerCase() ||
            r.user?.id === alumnus.user_id ||
            r.alumni_id === alumnus.id,
    );

    const takenTypes = [...new Set(alumniResults.map((r) => r.type))];

    return allTypes.map((type) => ({
        type,
        label:
            type === "abcd"
                ? "ABCD Quiz"
                : type === "rate"
                  ? "Rating Quiz"
                  : type,
        taken: takenTypes.includes(type),
        color: takenTypes.includes(type) ? "green" : "orange",
        icon: type === "rate" ? <StarOutlined /> : <UnorderedListOutlined />,
    }));
};
