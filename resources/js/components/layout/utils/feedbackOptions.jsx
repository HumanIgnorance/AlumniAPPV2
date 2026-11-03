import {
    BulbOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationOutlined,
    EyeOutlined,
    StopOutlined,
} from "@ant-design/icons";

export const FEEDBACK_AREAS = [
    { value: "gallery", label: "Photo Library" },
    { value: "dashboard", label: "Dashboard" },
    { value: "alumni", label: "Alumni List" },
    { value: "events", label: "Events" },
    { value: "questions", label: "Questions" },
    { value: "create-dha", label: "Create D.H.A" },
    { value: "messages", label: "Messages" },
    { value: "job-posts", label: "Job Posts" },
    { value: "faq", label: "FAQs" },
    { value: "about", label: "About" },
    { value: "profile", label: "Profile" },
    { value: "notifications", label: "Notifications" },
    { value: "login", label: "Login / Authentication" },
    { value: "image-quiz", label: "Image Quiz" },
    { value: "rating-quiz", label: "Rating Quiz" },
    { value: "registration", label: "Registration" },
    { value: "other", label: "Other" },
];

// "Your feedback was reviewed" notification -> shows the admin's note
// and the report's current status. Opened from handleViewFeedbackReport.
export const FEEDBACK_TYPE_META = {
    improve: {
        label: "Help us improve",
        color: "blue",
        icon: <BulbOutlined />,
    },
    wrong: {
        label: "Something went wrong",
        color: "orange",
        icon: <ExclamationOutlined />,
    },
};

export const FEEDBACK_STATUS_META = {
    pending: { label: "Pending", color: "gold", icon: <ClockCircleOutlined /> },
    in_review: {
        label: "In Review",
        color: "processing",
        icon: <EyeOutlined />,
    },
    resolved: {
        label: "Resolved",
        color: "success",
        icon: <CheckCircleOutlined />,
    },
    dismissed: { label: "Dismissed", color: "default", icon: <StopOutlined /> },
};

export const FEEDBACK_AREA_LABELS = {
    gallery: "Photo Library",
    dashboard: "Dashboard",
    alumni: "Alumni List",
    events: "Events",
    questions: "Questions",
    "create-dha": "Create D.H.A",
    messages: "Messages",
    "job-posts": "Job Posts",
    faq: "FAQs",
    about: "About",
    profile: "Profile",
    notifications: "Notifications",
    login: "Login / Authentication",
    "image-quiz": "Image Quiz",
    "rating-quiz": "Rating Quiz",
    registration: "Registration",
    other: "Other",
};
