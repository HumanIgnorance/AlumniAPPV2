import { useMemo } from "react";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Tag, Tooltip, Typography } from "antd";
import { ROLES } from "~/config/roles";
import { COLORS } from "~/config/theme";
import {
    getCreatorRoleBadge,
    getDefaultAvatar,
} from "~/pages/admin/JobPost/parts/jobPostHelpers";
import { buildImageUrl } from "~/pages/admin/JobPost/parts/jobPostUtils";
import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";

const { Text } = Typography;

export const CreatorInfo = ({ creator, size = "default" }) => {
    if (!creator) {
        return (
            <div className="creator-info-container">
                <Avatar
                    size={size === "large" ? 56 : 48}
                    icon={<UserOutlined />}
                />
                <div className="creator-details">
                    <Text className="creator-name">Unknown User</Text>
                </div>
            </div>
        );
    }

    const isTouchDevice = useIsTouchDevice();
    try {
        const isAdmin = creator.role === ROLES.ADMIN || creator.is_admin;
        const avatarSize = size === "large" ? 56 : 48;

        // Use profile image or fallback to default avatar - memoize the URL
        const profileImageUrl = useMemo(
            () =>
                buildImageUrl(
                    creator.profile_image ||
                        creator.profile_image_url ||
                        creator.avatar,
                ),
            [creator.profile_image, creator.profile_image_url, creator.avatar],
        );
        const defaultAvatarUrl = getDefaultAvatar(creator);
        const displayAvatarUrl = profileImageUrl || defaultAvatarUrl;

        return (
            <div
                className={`creator-info-container ${size === "large" ? "creator-info-large" : ""}`}
            >
                <Tooltip
                    title={isAdmin ? "Posted by Admin" : "Posted by Alumni"}
                    trigger={isTouchDevice ? [] : ["hover"]}
                    open={isTouchDevice ? false : undefined}
                >
                    <Avatar
                        size={avatarSize}
                        src={displayAvatarUrl}
                        icon={!displayAvatarUrl && <UserOutlined />}
                        className={`creator-avatar ${isAdmin ? "admin-avatar" : "alumni-avatar"}`}
                        style={{
                            border: isAdmin
                                ? "3px solid #faad14"
                                : "3px solid #667eea",
                            backgroundColor: !displayAvatarUrl
                                ? isAdmin
                                    ? COLORS.fffbe6
                                    : "#f0f5ff"
                                : undefined,
                            color: !displayAvatarUrl
                                ? isAdmin
                                    ? COLORS.antdGold
                                    : COLORS.brand
                                : undefined,
                        }}
                    />
                </Tooltip>
                <div className="creator-details">
                    <div className="creator-name-row">
                        <Text strong className="creator-name">
                            {creator.name || creator.first_name || "Unknown"}
                        </Text>
                        {getCreatorRoleBadge(creator)}
                    </div>
                    {creator.email && (
                        <Text type="secondary" className="creator-email">
                            <MailOutlined
                                style={{ marginRight: 4, fontSize: 11 }}
                            />
                            {creator.email}
                        </Text>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error rendering CreatorInfo:", error);
        return (
            <div className="creator-info-container">
                <Avatar
                    size={size === "large" ? 56 : 48}
                    icon={<UserOutlined />}
                />
                <div className="creator-details">
                    <Text className="creator-name">Unknown User</Text>
                </div>
            </div>
        );
    }
};

// ============ APPLICANT INFO COMPONENT ============
export const ApplicantInfo = ({ applicant, size = "default" }) => {
    if (!applicant) {
        return (
            <div className="applicant-info-container">
                <Avatar
                    size={size === "large" ? 56 : 48}
                    icon={<UserOutlined />}
                />
                <div className="applicant-details">
                    <Text className="applicant-name">Unknown Applicant</Text>
                </div>
            </div>
        );
    }

    try {
        const avatarSize = size === "large" ? 56 : 48;
        const profileImageUrl = useMemo(
            () =>
                buildImageUrl(
                    applicant.profile_image ||
                        applicant.profile_image_url ||
                        applicant.avatar ||
                        applicant.image,
                ),
            [
                applicant.profile_image,
                applicant.profile_image_url,
                applicant.avatar,
                applicant.image,
            ],
        );

        return (
            <div
                className={`applicant-info-container ${size === "large" ? "applicant-info-large" : ""}`}
            >
                <Avatar
                    size={avatarSize}
                    src={profileImageUrl}
                    icon={!profileImageUrl && <UserOutlined />}
                    className="applicant-avatar"
                    style={{
                        border: "3px solid #52c41a",
                        backgroundColor: !profileImageUrl
                            ? COLORS.f6ffed
                            : undefined,
                        color: !profileImageUrl ? COLORS.antdGreen : undefined,
                    }}
                />
                <div className="applicant-details">
                    <div className="applicant-name-row">
                        <Text strong className="applicant-name">
                            {applicant.name ||
                                applicant.first_name ||
                                "Unknown"}
                        </Text>
                        <Tag
                            color="geekblue"
                            icon={<UserOutlined />}
                            style={{ fontSize: "10px", padding: "0 6px" }}
                        >
                            Alumni
                        </Tag>
                    </div>
                    {applicant.email && (
                        <Text type="secondary" className="applicant-email">
                            <MailOutlined
                                style={{ marginRight: 4, fontSize: 11 }}
                            />
                            {applicant.email}
                        </Text>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error rendering ApplicantInfo:", error);
        return (
            <div className="applicant-info-container">
                <Avatar
                    size={size === "large" ? 56 : 48}
                    icon={<UserOutlined />}
                />
                <div className="applicant-details">
                    <Text className="applicant-name">Unknown Applicant</Text>
                </div>
            </div>
        );
    }
};
