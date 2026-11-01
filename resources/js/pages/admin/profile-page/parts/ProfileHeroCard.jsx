import { Card, Avatar, Tooltip, Tag } from "antd";
import logobg from "~/assets/images/occ_edit_test.png";
import {
    UserOutlined,
    CheckCircleOutlined,
    MailOutlined,
    CalendarOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { Title, Text } from "~/pages/admin/profile-page/parts/profileShared";
import { useProfileContext } from "~/pages/admin/profile-page/ProfileContext";

export default function ProfileHeroCard() {
    const { profile, detailedProfile, completeness } = useProfileContext();

    return (
        <Card className="profile-hero-card" bordered={false}>
            {/* Cover banner */}
            <img
                src={logobg}
                alt="Cover Banner"
                className="profile-cover-banner"
            />

            {/* Avatar overlapping cover */}
            <div className="profile-avatar-wrap">
                <div className="profile-avatar-ring" aria-hidden="true" />
                <Avatar
                    size={160}
                    icon={<UserOutlined />}
                    src={profile?.alumni?.profile_image_url}
                    className="profile-avatar"
                    alt={
                        detailedProfile?.personalInfo?.displayName ||
                        "Alumni avatar"
                    }
                />
                <Tooltip title="Verified Alumni">
                    <span
                        className="profile-avatar-badge"
                        aria-label="Verified Alumni"
                    >
                        <CheckCircleOutlined />
                    </span>
                </Tooltip>
            </div>

            {/* Centered identity */}
            <div className="profile-hero-body">
                <Title level={2} className="profile-hero-name">
                    {detailedProfile?.personalInfo?.displayName}
                </Title>
                <Text className="profile-hero-studentid">
                    {detailedProfile?.academicInfo?.studentId || "—"}
                </Text>

                {/* <div className="profile-hero-eyebrow">
                <span className="profile-eyebrow-dot" />
                Alumni Profile
              </div> */}

                <Text className="profile-hero-email">
                    <MailOutlined /> {detailedProfile?.contactInfo?.email}
                </Text>

                <div className="profile-hero-tags">
                    <Tag className="profile-tag profile-tag-role">
                        <UserOutlined /> {detailedProfile?.basicInfo?.role}
                    </Tag>
                    <Tag className="profile-tag profile-tag-status">
                        <CheckCircleOutlined />{" "}
                        {detailedProfile?.basicInfo?.status}
                    </Tag>
                    <Tag className="profile-tag profile-tag-year">
                        <CalendarOutlined /> Class of{" "}
                        {detailedProfile?.basicInfo?.memberSince || "—"}
                    </Tag>
                </div>

                {/* Profile completeness — full width below tags */}
                <div
                    className="profile-meter profile-meter--v2"
                    role="progressbar"
                    aria-valuenow={completeness}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Profile completeness"
                >
                    <div className="profile-meter-head">
                        <span className="profile-meter-label">
                            <TrophyOutlined /> Profile completeness
                        </span>
                        <strong>{completeness}%</strong>
                    </div>
                    <div className="profile-meter-track">
                        <div
                            className="profile-meter-fill"
                            style={{ width: `${completeness}%` }}
                        />
                    </div>
                    <Text className="profile-meter-hint">
                        {completeness === 100
                            ? "Your profile looks great — everything is filled in."
                            : "Complete your profile to help us keep you connected."}
                    </Text>
                </div>
            </div>
        </Card>
    );
}
