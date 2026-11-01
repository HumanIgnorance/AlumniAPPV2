import "./PorfilePage.css";
import {
    Layout,
    AlumniDetails,
} from "~/components";
import { useEffect } from "react";
import { Row, Col, Card, Descriptions, Modal, Spin } from "antd";
import {
    MailOutlined,
    ApartmentOutlined,
    ProfileOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import ChangePasswordModal from "~/pages/admin/ChangePasswordModal";
import { COLORS } from "~/config/theme";
import { Paragraph } from "~/pages/admin/profile-page/parts/profileShared";
import { ProfileProvider } from "~/pages/admin/profile-page/ProfileContext";
import useProfileController from "~/pages/admin/profile-page/hooks/useProfileController";
import ProfileHeroCard from "~/pages/admin/profile-page/parts/ProfileHeroCard";
import ProfileActionButtonsCard from "~/pages/admin/profile-page/parts/ProfileActionButtonsCard";
import ProfileStatisticsCard from "~/pages/admin/profile-page/parts/ProfileStatisticsCard";
import ProfilePersonalInformation from "~/pages/admin/profile-page/parts/ProfilePersonalInformation";
import ProfileAcademicInformation from "~/pages/admin/profile-page/parts/ProfileAcademicInformation";
import ProfileDescriptions from "~/pages/admin/profile-page/parts/ProfileDescriptions";
import ProfileCareerEditLocked from "~/pages/admin/profile-page/parts/ProfileCareerEditLocked";

function ProfilePage() {
    const ctx = useProfileController();
    const {
        loading,
        isRevealed,
        careerLockedVisible,
        careerLockInfo,
        computeRemaining,
        setCareerLockInfo,
        setCareerLockedVisible,
        detailedProfile,
        careerSectionRef,
        isModalVisible,
        setIsModalVisible,
        previewData,
        viewOnly,
        refetch,
        changePasswordVisible,
        setChangePasswordVisible,
        profile,
        careerConfirmVisible,
        setCareerConfirmVisible,
        confirmEnterEditMode,
    } = ctx;

    if (loading) {
        return (
            <Layout>
                <div
                    className={`profile-page ${isRevealed ? "is-revealed" : ""}`}
                >
                    <div
                        className="profile-orb profile-orb-1"
                        aria-hidden="true"
                    />
                    <div
                        className="profile-orb profile-orb-2"
                        aria-hidden="true"
                    />
                    <div style={{ display: "flex", justifyContent: "center", padding: "96px 0" }}>
                    <Spin size="large" />
                </div>
                </div>
            </Layout>
        );
    }

    useEffect(() => {
        if (!careerLockedVisible || !careerLockInfo.unlockAt) return;
        const tick = () => {
            const remaining = computeRemaining(careerLockInfo.unlockAt);
            setCareerLockInfo((prev) => ({ ...prev, remaining }));
            if (
                remaining.days === 0 &&
                remaining.hours === 0 &&
                remaining.minutes === 0 &&
                remaining.seconds === 0
            ) {
                setCareerLockedVisible(false);
            }
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [careerLockedVisible, careerLockInfo.unlockAt]);

    // Profile completeness
    const completeness = (() => {
        if (!detailedProfile) return 0;
        const checks = [
            detailedProfile.personalInfo?.firstName,
            detailedProfile.personalInfo?.lastName,
            detailedProfile.personalInfo?.dateOfBirth,
            detailedProfile.contactInfo?.email,
            detailedProfile.contactInfo?.phone,
            detailedProfile.contactInfo?.address,
            detailedProfile.academicInfo?.studentId,
            detailedProfile.academicInfo?.graduationYear,
            detailedProfile.professionalInfo?.currentCompany,
            detailedProfile.professionalInfo?.jobTitle,
            detailedProfile.professionalInfo?.industry,
            detailedProfile.additionalInfo?.bio &&
                detailedProfile.additionalInfo.bio !==
                    "No biography provided yet.",
        ];
        const filled = checks.filter(
            (v) => v && v !== "Not provided" && v !== "N/A",
        ).length;
        return Math.round((filled / checks.length) * 100);
    })();

    const pageCtx = { ...ctx, completeness };

    return (
        <ProfileProvider value={pageCtx}>
            <Layout>
                <div
                    className={`profile-page ${isRevealed ? "is-revealed" : ""}`}
                >
                    <div className="profile-page-container">
                        {/* ===== Decorative background orbs ===== */}
                        <div
                            className="profile-orb profile-orb-1"
                            aria-hidden="true"
                        />
                        <div
                            className="profile-orb profile-orb-2"
                            aria-hidden="true"
                        />

                        <ProfileHeroCard />

                        {/* ============ ACTION BUTTONS CARD ============ */}
                        <ProfileActionButtonsCard />

                        {/* ============ STATISTICS CARD ============ */}
                        <ProfileStatisticsCard />

                        {/* ============ DETAIL CARDS ============ */}
                        <Row gutter={[24, 24]} className="profile-section-grid">
                            {/* Personal Information */}
                            <ProfilePersonalInformation />

                            {/* Contact Information */}
                            <Col xs={24} lg={12}>
                                <Card
                                    className="profile-card"
                                    bordered={false}
                                    title={
                                        <span className="profile-card-title">
                                            <span className="profile-card-icon profile-icon-cyan">
                                                <MailOutlined />
                                            </span>
                                            Contact Information
                                        </span>
                                    }
                                >
                                    <Descriptions
                                        column={1}
                                        size="small"
                                        className="profile-descriptions"
                                    >
                                        <Descriptions.Item label="Email">
                                            {
                                                detailedProfile?.contactInfo
                                                    ?.email
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Phone">
                                            {
                                                detailedProfile?.contactInfo
                                                    ?.phone
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Address">
                                            {
                                                detailedProfile?.contactInfo
                                                    ?.address
                                            }
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            {/* Academic Information */}
                            <ProfileAcademicInformation />

                            {/* Career Information */}
                            <Col xs={24} lg={12} ref={careerSectionRef}>
                                <Card
                                    className="profile-card"
                                    bordered={false}
                                    title={
                                        <span className="profile-card-title">
                                            <span className="profile-card-icon profile-icon-amber">
                                                <ApartmentOutlined />
                                            </span>
                                            Career Information
                                        </span>
                                    }
                                >
                                    <ProfileDescriptions />
                                </Card>
                            </Col>

                            {/* Additional Information */}
                            <Col xs={24}>
                                <Card
                                    className="profile-card profile-card-wide"
                                    bordered={false}
                                    title={
                                        <span className="profile-card-title">
                                            <span className="profile-card-icon profile-icon-violet">
                                                <ProfileOutlined />
                                            </span>
                                            Additional Information
                                        </span>
                                    }
                                >
                                    <Descriptions
                                        column={1}
                                        size="small"
                                        layout="vertical"
                                        colon={false}
                                        className="profile-descriptions profile-descriptions-vertical"
                                    >
                                        <Descriptions.Item label="Bio">
                                            {
                                                detailedProfile?.additionalInfo
                                                    ?.bio
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Academic Achievements">
                                            {
                                                detailedProfile?.additionalInfo
                                                    ?.academic_achievements
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Extracurricular Activities">
                                            {
                                                detailedProfile?.additionalInfo
                                                    ?.extracurricular
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Career Goals">
                                            {
                                                detailedProfile?.additionalInfo
                                                    ?.career_goals
                                            }
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            {/* ============ INFO UPDATE NOTICE ============ */}
                            <Col xs={24}>
                                <div
                                    className="profile-info-notice"
                                    role="note"
                                >
                                    <div className="profile-info-notice-icon">
                                        <InfoCircleOutlined />
                                    </div>
                                    <div className="profile-info-notice-text">
                                        <strong>
                                            Need to update your information?
                                        </strong>{" "}
                                        For security reasons, changes to your
                                        profile must be verified. Please contact
                                        your administrator to request updates or
                                        corrections to your details.
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* Modals */}
                        <AlumniDetails
                            visible={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            onSubmit={(data) => {
                                // console.log("Updated profile data:", data);
                                setIsModalVisible(false);
                            }}
                            previewData={previewData}
                            viewOnly={viewOnly}
                            refetchAlumni={refetch}
                            viewOwnProfile={true}
                        />
                        <ChangePasswordModal
                            visible={changePasswordVisible}
                            onCancel={() => setChangePasswordVisible(false)}
                            userEmail={profile?.alumni?.email || profile?.email}
                        />

                        {/* ============ CAREER EDIT CONFIRMATION MODAL ============ */}
                        <Modal
                            title={
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <InfoCircleOutlined
                                        style={{ color: COLORS.amber500 }}
                                    />
                                    Heads up before you edit your Career Info
                                </span>
                            }
                            open={careerConfirmVisible}
                            onCancel={() => setCareerConfirmVisible(false)}
                            onOk={confirmEnterEditMode}
                            okText="Continue to Edit"
                            cancelText="Cancel"
                            centered
                            maskClosable={false}
                        >
                            <Paragraph style={{ marginBottom: 8 }}>
                                Please review your{" "}
                                <strong>Career Information</strong> carefully
                                before saving.
                            </Paragraph>
                            <Paragraph style={{ marginBottom: 8 }}>
                                Once you save your changes, this section will be{" "}
                                <strong>
                                    locked for 60 days (about 2 months)
                                </strong>{" "}
                                and cannot be edited again until that period
                                ends.
                            </Paragraph>
                            <Paragraph
                                type="secondary"
                                style={{ marginBottom: 0 }}
                            >
                                This helps us keep your career records accurate
                                and consistent. Do you want to continue?
                            </Paragraph>
                        </Modal>

                        {/* ============ CAREER EDIT LOCKED MODAL ============ */}
                        <ProfileCareerEditLocked />
                    </div>
                </div>
            </Layout>
        </ProfileProvider>
    );
}

export default ProfilePage;
