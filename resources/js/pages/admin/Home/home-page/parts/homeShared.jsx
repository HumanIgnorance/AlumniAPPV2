import { Typography, Card, Skeleton, Tag } from "antd";
import beedLogo from "~/assets/images/beed-logo.png";
import bsbaLogo from "~/assets/images/bsba-logo.png";
import bsitLogo from "~/assets/images/bsit-logo.jpg";
import { COLORS } from "~/config/theme";
import educLogo from "~/assets/images/educ-logo.png";
import joneeLogo from "~/assets/images/jonee.png";
import {
    TeamOutlined,
    CalendarOutlined,
    SolutionOutlined,
    MessageOutlined,
    IdcardOutlined,
    PictureOutlined,
    ThunderboltOutlined,
    CloudOutlined,
    UnorderedListOutlined,
    StarOutlined,
    CheckCircleOutlined,
    QuestionCircleOutlined,
    EnvironmentOutlined,
    ApartmentOutlined,
} from "@ant-design/icons";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEYS } from "~/config/storageKeys";
import moment from "moment";
import React from "react";

export const { Title, Text, Paragraph } = Typography;

/* ── Department logos shown around the central site logo ─────────────────
   BEED and EDUC intentionally use the same artwork (per college branding). */
export const DEPARTMENT_LOGOS = [
    {
        key: "beed",
        tag: "BEED",
        full: "Bachelor of Elementary Education",
        logo: beedLogo,
        accent: "#c026d3",
    },
    {
        key: "bsba",
        tag: "BSBA",
        full: "Bachelor of Science in Business Administration",
        logo: bsbaLogo,
        accent: "#1e3a8a",
    },
    {
        key: "bsit",
        tag: "BSIT",
        full: "Bachelor of Science in Information Technology",
        logo: bsitLogo,
        accent: COLORS.red700,
    },
    {
        key: "educ",
        tag: "BSEd",
        full: "Bachelor of Secondary Education",
        logo: educLogo,
        accent: COLORS.violet600,
    },
];

export const DEV_TEAM = [
    // { key: "john", name: "John", logo: johnLogo },
    { key: "jonee", name: "Jonee", logo: joneeLogo },
];

/* ── Quick-nav cards — filtered by role ──────────────────────────────────── */
export const ALL_QUICK_LINKS = [
    {
        key: "alumni",
        icon: <TeamOutlined />,
        label: "Alumni Directory",
        description: "Find and connect with fellow graduates",
        url: "/alumni",
        color: COLORS.antdBlue,
        bg: "rgba(24,144,255,0.08)",
        roles: ["admin", "alumni"],
    },
    {
        key: "events",
        icon: <CalendarOutlined />,
        label: "Events",
        description: "Upcoming job fairs, workshops & reunions",
        url: "/events",
        color: COLORS.antdGreen,
        bg: "rgba(82,196,26,0.08)",
        roles: ["admin", "alumni"],
    },
    {
        key: "job-posts",
        icon: <SolutionOutlined />,
        label: "Job Postings",
        description: "Browse career opportunities posted for you",
        url: "/job-posts",
        color: COLORS.antdOrange,
        bg: "rgba(250,140,22,0.08)",
        roles: ["admin", "alumni"],
    },
    {
        key: "messages",
        icon: <MessageOutlined />,
        label: "Messages",
        description: "Chat with the guidance counselor",
        url: "/messages",
        color: COLORS.antdPurple,
        bg: "rgba(114,46,209,0.08)",
        roles: ["admin", "alumni"],
    },
    {
        key: "profile",
        icon: <IdcardOutlined />,
        label: "My Profile",
        description: "View and update your alumni information",
        url: "/profile",
        color: COLORS.antdCyan,
        bg: "rgba(19,194,194,0.08)",
        roles: ["alumni"],
    },
    {
        key: "gallery",
        icon: <PictureOutlined />,
        label: "Gallery",
        description: "Relive memorable moments and milestones",
        url: "/gallery",
        color: COLORS.antdMagenta,
        bg: "rgba(235,47,150,0.08)",
        roles: ["admin", "alumni"],
    },
];

/* ── Greeting + identity helpers ─────────────────────────────────────────── */
export const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
};

export const getFirstName = () => {
    try {
        const fname =
            secureLocalStorage.getItem("firstName") ||
            secureLocalStorage.getItem("fname");
        const name =
            secureLocalStorage.getItem(STORAGE_KEYS.USER_NAME) ||
            secureLocalStorage.getItem(STORAGE_KEYS.NAME);
        if (fname) return fname.toUpperCase();
        if (name) return name.split(" ")[0].toUpperCase();
        return "ALUMNI";
    } catch {
        return "ALUMNI";
    }
};

export const getCurrentUserId = () => {
    try {
        const userObj = secureLocalStorage.getItem(STORAGE_KEYS.USER);
        return (
            userObj?.id ||
            secureLocalStorage.getItem(STORAGE_KEYS.USER_ID_CAMEL) ||
            secureLocalStorage.getItem(STORAGE_KEYS.USER_ID) ||
            secureLocalStorage.getItem(STORAGE_KEYS.USER_ID_SNAKE) ||
            secureLocalStorage.getItem(STORAGE_KEYS.ID) ||
            null
        );
    } catch {
        return null;
    }
};

export const getWeatherIcon = (condition) => {
    const c = (condition || "").toLowerCase();
    if (c.includes("thunder") || c.includes("storm"))
        return <ThunderboltOutlined style={{ color: COLORS.antdGold }} />;
    if (c.includes("rain") || c.includes("drizzle"))
        return <span style={{ fontSize: 18 }}>🌧️</span>;
    if (c.includes("cloud") || c.includes("overcast"))
        return <CloudOutlined style={{ color: COLORS.antdGray7 }} />;
    if (c.includes("sun") || c.includes("clear"))
        return <span style={{ fontSize: 18 }}>☀️</span>;
    if (c.includes("fog") || c.includes("mist"))
        return <span style={{ fontSize: 18 }}>🌫️</span>;
    return <CloudOutlined style={{ color: COLORS.antdGray7 }} />;
};

export const toCelsius = (f) => Math.round(((f - 32) * 5) / 9);

/* ── Quiz helpers ────────────────────────────────────────────────────────── */
export const getQuizMeta = (row) => {
    const type = (row?.type || "").toLowerCase();
    const map = {
        abcd: {
            label: "Multiple Choice Quiz",
            icon: <UnorderedListOutlined />,
            color: COLORS.antdGreen,
        },
        rate: {
            label: "Rating Quiz",
            icon: <StarOutlined />,
            color: COLORS.antdBlue,
        },
        survey: {
            label: "Alumni Survey",
            icon: <CheckCircleOutlined />,
            color: COLORS.antdPurple,
        },
    };
    if (map[type]) return map[type];
    return {
        label:
            row?.quiz?.title ||
            row?.title ||
            (type
                ? type.replace(/^\w/, (c) => c.toUpperCase()) + " Quiz"
                : "Quiz"),
        icon: <QuestionCircleOutlined />,
        color: COLORS.antdOrange,
    };
};

export const getQuizScore = (row) => {
    if (!row) return null;
    const direct =
        row.percentage ?? row.score_percentage ?? row.percent ?? null;
    if (direct != null && !isNaN(direct)) return Math.round(Number(direct));
    const score = row.score ?? row.correct ?? row.total_score;
    const total =
        row.total ??
        row.total_items ??
        row.max_score ??
        row.items ??
        row.questions_count;
    if (score != null && total) {
        const pct = (Number(score) / Number(total)) * 100;
        if (!isNaN(pct)) return Math.round(pct);
    }
    return null;
};

/* ── Stat card ───────────────────────────────────────────────────────────── */
export const StatCard = ({ icon, value, label, color, loading }) => (
    <Card className="hp-stat-card" bordered={false}>
        <div className="hp-stat-inner">
            <div
                className="hp-stat-icon"
                style={{
                    background: `linear-gradient(135deg, ${color}26, ${color}10)`,
                    color,
                    boxShadow: `0 6px 16px ${color}26`,
                }}
            >
                {icon}
            </div>
            <div className="hp-stat-text">
                {loading ? (
                    <Skeleton.Input active size="small" style={{ width: 48 }} />
                ) : (
                    <span className="hp-stat-value">{value ?? "0"}</span>
                )}
                <span className="hp-stat-label">{label}</span>
            </div>
        </div>
    </Card>
);

/* ── Event row ───────────────────────────────────────────────────────────── */
export const EventRow = ({ event }) => {
    const start = event.start_date || event.event_date || event.date;
    const daysLeft = start
        ? moment(start).diff(moment().startOf("day"), "days")
        : null;
    const typeColorMap = {
        "job-fair": COLORS.antdBlue,
        workshop: COLORS.antdOrange,
        conference: COLORS.antdPurple,
        hiring: COLORS.antdGreen,
        seminar: COLORS.antdCyan,
    };
    const typeColor =
        typeColorMap[(event.type || "").toLowerCase()] || COLORS.antdBlue;

    return (
        <div className="hp-event-row">
            <div
                className="hp-event-date-box"
                style={{ borderColor: typeColor }}
            >
                <span className="hp-event-month">
                    {start ? moment(start).format("MMM") : "—"}
                </span>
                <span className="hp-event-day" style={{ color: typeColor }}>
                    {start ? moment(start).format("DD") : "—"}
                </span>
            </div>
            <div className="hp-event-info">
                <Text strong className="hp-event-title">
                    {event.title || event.name || "Untitled Event"}
                </Text>
                <div className="hp-event-meta">
                    {event.location && (
                        <span className="hp-event-meta-item">
                            <EnvironmentOutlined /> {event.location}
                        </span>
                    )}
                    {daysLeft !== null && daysLeft >= 0 && (
                        <Tag
                            color={
                                daysLeft <= 3
                                    ? "red"
                                    : daysLeft <= 7
                                      ? "orange"
                                      : "blue"
                            }
                            style={{ fontSize: 11 }}
                        >
                            {daysLeft === 0 ? "Today!" : `${daysLeft}d left`}
                        </Tag>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Job row ─────────────────────────────────────────────────────────────── */
export const JobRow = ({ job }) => (
    <div className="hp-job-row">
        <div className="hp-job-company-avatar">
            {job.company_logo ? (
                <img src={job.company_logo} alt={job.company_name} />
            ) : (
                <ApartmentOutlined
                    style={{ fontSize: 18, color: COLORS.antdBlue }}
                />
            )}
        </div>
        <div className="hp-job-info">
            <Text strong className="hp-job-title">
                {job.job_title || job.title || "Job Opening"}
            </Text>
            <div className="hp-job-meta">
                <span>{job.company_name || "Company"}</span>
                {job.work_location && (
                    <>
                        <span className="hp-dot">·</span>
                        <span>{job.work_location}</span>
                    </>
                )}
                {job.employment_type && (
                    <Tag
                        color="geekblue"
                        style={{ marginLeft: 6, fontSize: 11 }}
                    >
                        {job.employment_type}
                    </Tag>
                )}
            </div>
        </div>
        <Tag color="green" className="hp-job-new-tag">
            New
        </Tag>
    </div>
);
