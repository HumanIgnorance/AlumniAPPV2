import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    SafetyCertificateOutlined,
    StopOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Progress, Tag, Typography } from "antd";
import avatarGuidance from "~/assets/images/avatar_guidance.png";
import { ROLES } from "~/config/roles";
import { COLORS } from "~/config/theme";
import {
    VALID_ID_TYPES,
    jobTypeOptions,
} from "~/pages/admin/JobPost/parts/jobPostConstants";

const { Text } = Typography;

// Helper: Get status tag config
export const getStatusTag = (status) => {
    try {
        const config = {
            approved: {
                color: "green",
                text: "Approved",
                icon: <CheckCircleOutlined />,
            },
            pending: {
                color: "orange",
                text: "Pending",
                icon: <ClockCircleOutlined />,
            },
            rejected: {
                color: "red",
                text: "Rejected",
                icon: <CloseCircleOutlined />,
            },
        };
        const statusConfig = config[status] || {
            color: "default",
            text: status || "Unknown",
        };
        return (
            <Tag color={statusConfig.color} icon={statusConfig.icon}>
                {statusConfig.text}
            </Tag>
        );
    } catch (error) {
        console.error("Error getting status tag:", error);
        return <Tag color="default">Unknown</Tag>;
    }
};

// Helper: Get job type tag
export const getJobTypeTag = (type) => {
    try {
        const option = jobTypeOptions.find((opt) => opt.value === type);
        if (!option) return <Tag>{type || "Unknown"}</Tag>;
        return (
            <Tag color={option.color} icon={option.icon}>
                {option.label}
            </Tag>
        );
    } catch (error) {
        console.error("Error getting job type tag:", error);
        return <Tag>Unknown</Tag>;
    }
};

// Helper: Get creator role badge
export const getCreatorRoleBadge = (creator) => {
    try {
        if (!creator) return null;
        const isAdmin = creator.role === ROLES.ADMIN || creator.is_admin;
        return (
            <Tag
                color={isAdmin ? "gold" : "geekblue"}
                icon={
                    isAdmin ? <SafetyCertificateOutlined /> : <UserOutlined />
                }
                style={{ fontSize: "10px", padding: "0 6px" }}
            >
                {isAdmin ? "Admin" : "Alumni"}
            </Tag>
        );
    } catch (error) {
        console.error("Error getting creator role badge:", error);
        return null;
    }
};

// Helper: Get default avatar based on role
export const getDefaultAvatar = (creator) => {
    try {
        if (!creator) return null;
        const isAdmin = creator.role === ROLES.ADMIN || creator.is_admin;
        if (isAdmin) {
            return avatarGuidance;
        }
        return null;
    } catch (error) {
        console.error("Error getting default avatar:", error);
        return null;
    }
};

// Helper: Check if job is full or expired
export const isJobFullOrExpired = (job) => {
    try {
        return job?.is_full || job?.is_expired;
    } catch (error) {
        console.error("Error checking job status:", error);
        return false;
    }
};

// Helper: Get Full/Expired Tag
export const getFullExpiredTag = (job) => {
    try {
        if (!job) return null;
        if (job.is_expired) {
            return (
                <Tag color="red" icon={<ClockCircleOutlined />}>
                    Expired
                </Tag>
            );
        }
        if (job.is_full) {
            return (
                <Tag color="volcano" icon={<StopOutlined />}>
                    Full
                </Tag>
            );
        }
        return null;
    } catch (error) {
        console.error("Error getting full/expired tag:", error);
        return null;
    }
};

// Helper: Get Capacity Progress - UPDATED with color indicator (green→yellow→red)
export const getCapacityProgress = (job) => {
    try {
        if (!job?.capacity) return null;
        const percent = Math.round(
            ((job.applications_count || 0) / job.capacity) * 100,
        );

        // Color indicator: green (low) → yellow (medium) → red (high/full)
        let strokeColor;
        if (percent <= 50) {
            strokeColor = COLORS.antdGreen; // Green - low capacity used
        } else if (percent <= 80) {
            strokeColor = COLORS.antdGold; // Yellow/Orange - medium capacity
        } else {
            strokeColor = COLORS.antdRed; // Red - high/full capacity
        }

        const status =
            percent >= 100 ? "exception" : percent >= 80 ? "active" : "normal";
        return (
            <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Applications: {job.applications_count || 0} / {job.capacity}
                </Text>
                <Progress
                    percent={percent}
                    size="small"
                    status={status}
                    strokeColor={strokeColor}
                />
            </div>
        );
    } catch (error) {
        console.error("Error getting capacity progress:", error);
        return null;
    }
};

// Helper: Get ID Type Label
export const getIdTypeLabel = (idType) => {
    try {
        const found = VALID_ID_TYPES.find((item) => item.value === idType);
        return found ? found.label : idType || "Unknown";
    } catch (error) {
        console.error("Error getting ID type label:", error);
        return idType || "Unknown";
    }
};
