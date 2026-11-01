import React from "react";
import {
    BankOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    SafetyCertificateOutlined,
    StopOutlined,
    TeamOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Divider,
    Drawer,
    Image,
    Progress,
    Row,
    Space,
    Statistic,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import moment from "moment";
import { ROLES } from "~/config/roles";
import { STATUS } from "~/config/status";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";
import {
    getFullExpiredTag,
    getJobTypeTag,
    getStatusTag,
    isJobFullOrExpired,
} from "~/pages/admin/JobPost/parts/jobPostHelpers";
import {
    buildImageUrl,
    isValidHttpUrl,
} from "~/pages/admin/JobPost/parts/jobPostUtils";
import { CreatorInfo } from "~/pages/admin/JobPost/parts/PersonInfo";

const { Title, Text, Paragraph } = Typography;

export default function JobDetailsDrawer() {
    const {
        selectedJob,
        setJobDetailsVisible,
        setSelectedJob,
        jobDetailsVisible,
        isMobile,
        isTouchDevice,
        userRole,
        isJobCreator,
        handleReviewApplications,
    } = useJobPostContext();

    return (
        <Drawer
            title={
                <Space>
                    <BankOutlined />
                    <span>Job Details</span>
                    {selectedJob && getStatusTag(selectedJob.status)}
                    {selectedJob && getFullExpiredTag(selectedJob)}
                </Space>
            }
            placement="right"
            onClose={() => {
                setJobDetailsVisible(false);
                setSelectedJob(null);
            }}
            open={jobDetailsVisible}
            width={isMobile ? "95%" : 640}
            style={{
                top: isMobile ? 8 : undefined,
                maxWidth: isMobile ? "95vw" : undefined,
                paddingBottom: 0,
            }}
            className="job-details-drawer"
        >
            {selectedJob && (
                <div className="job-details-content">
                    {/* Banner Image */}
                    {(selectedJob.banner_image ||
                        selectedJob.banner_image_url) && (
                        <div className="job-details-banner">
                            <Image
                                src={
                                    buildImageUrl(
                                        selectedJob.banner_image ||
                                            selectedJob.banner_image_url,
                                    ) || "/placeholder.svg"
                                }
                                alt={selectedJob.title}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                }}
                            />
                        </div>
                    )}

                    {/* Title and Type */}
                    <div className="job-details-header">
                        <Title level={3} className="job-details-title">
                            {selectedJob.title}
                        </Title>
                        <div className="job-details-badges">
                            {getJobTypeTag(selectedJob.job_type)}
                            {selectedJob.status === STATUS.APPROVED && (
                                <Tag
                                    color="green"
                                    icon={<CheckCircleOutlined />}
                                >
                                    Verified
                                </Tag>
                            )}
                            {isValidHttpUrl(selectedJob.reference_url) ? (
                                <Tooltip
                                    title="Reference URL provided"
                                    trigger={isTouchDevice ? [] : ["hover"]}
                                    open={isTouchDevice ? false : undefined}
                                >
                                    <Tag
                                        color="green"
                                        icon={<SafetyCertificateOutlined />}
                                    >
                                        <a
                                            href={selectedJob.reference_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "inherit" }}
                                        >
                                            Verified Reference Provided
                                        </a>
                                    </Tag>
                                </Tooltip>
                            ) : (
                                <Tag color="orange" icon={<WarningOutlined />}>
                                    Reference Not Provided
                                </Tag>
                            )}
                        </div>
                    </div>

                    {/* ============ Job Verification Information ============ */}
                    {(selectedJob.reference_source_type ||
                        selectedJob.reference_url ||
                        selectedJob.verification_notes) && (
                        <Card
                            size="small"
                            style={{ marginBottom: 16 }}
                            title={
                                <Space>
                                    <SafetyCertificateOutlined
                                        style={{ color: COLORS.antdGreen }}
                                    />
                                    <span>Job Verification Information</span>
                                </Space>
                            }
                        >
                            <Row gutter={[16, 12]}>
                                {selectedJob.reference_source_type && (
                                    <Col xs={24} sm={12}>
                                        <Text
                                            type="secondary"
                                            style={{ display: "block" }}
                                        >
                                            Reference Source Type
                                        </Text>
                                        <Text strong>
                                            {selectedJob.reference_source_type}
                                        </Text>
                                    </Col>
                                )}
                                {selectedJob.reference_url && (
                                    <Col xs={24} sm={12}>
                                        <Text
                                            type="secondary"
                                            style={{ display: "block" }}
                                        >
                                            Reference URL
                                        </Text>
                                        {isValidHttpUrl(
                                            selectedJob.reference_url,
                                        ) ? (
                                            <a
                                                href={selectedJob.reference_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    wordBreak: "break-all",
                                                }}
                                            >
                                                {selectedJob.reference_url}
                                            </a>
                                        ) : (
                                            <Text
                                                style={{
                                                    wordBreak: "break-all",
                                                }}
                                            >
                                                {selectedJob.reference_url}
                                            </Text>
                                        )}
                                    </Col>
                                )}
                                {selectedJob.verification_notes && (
                                    <Col xs={24}>
                                        <Text
                                            type="secondary"
                                            style={{ display: "block" }}
                                        >
                                            Verification Notes
                                        </Text>
                                        <Paragraph
                                            style={{
                                                marginBottom: 0,
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                                            {selectedJob.verification_notes}
                                        </Paragraph>
                                    </Col>
                                )}
                            </Row>
                        </Card>
                    )}

                    {/* Creator Info */}
                    <Card
                        size="small"
                        className="job-details-creator-card"
                        style={{ marginBottom: 16 }}
                    >
                        <CreatorInfo
                            creator={selectedJob.creator}
                            size="large"
                        />
                    </Card>

                    {/* Capacity and Expiration Info */}
                    {(selectedJob.capacity || selectedJob.expires_at) && (
                        <>
                            <Card
                                size="small"
                                style={{
                                    marginBottom: 16,
                                    background: COLORS.zinc50,
                                }}
                            >
                                <Row gutter={16}>
                                    {selectedJob.capacity && (
                                        <Col span={12}>
                                            <Statistic
                                                title="Applications"
                                                value={
                                                    selectedJob.applications_count ||
                                                    0
                                                }
                                                suffix={`/ ${selectedJob.capacity}`}
                                                valueStyle={{
                                                    color: selectedJob.is_full
                                                        ? COLORS.antdRed
                                                        : COLORS.antdBlue,
                                                    fontSize: 20,
                                                }}
                                            />
                                            <Progress
                                                percent={Math.round(
                                                    ((selectedJob.applications_count ||
                                                        0) /
                                                        selectedJob.capacity) *
                                                        100,
                                                )}
                                                size="small"
                                                status={
                                                    selectedJob.is_full
                                                        ? "exception"
                                                        : "active"
                                                }
                                            />
                                        </Col>
                                    )}
                                    {selectedJob.expires_at && (
                                        <Col
                                            span={
                                                selectedJob.capacity ? 12 : 24
                                            }
                                        >
                                            <Statistic
                                                title="Time Remaining"
                                                value={
                                                    selectedJob.is_expired
                                                        ? "Expired"
                                                        : selectedJob.expiration_display
                                                }
                                                valueStyle={{
                                                    color: selectedJob.is_expired
                                                        ? COLORS.antdRed
                                                        : COLORS.antdGreen,
                                                    fontSize: 20,
                                                }}
                                                prefix={<ClockCircleOutlined />}
                                            />
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: 12 }}
                                            >
                                                Expires:{" "}
                                                {moment(
                                                    selectedJob.expires_at,
                                                ).format("MMM D, YYYY h:mm A")}
                                            </Text>
                                        </Col>
                                    )}
                                </Row>
                            </Card>
                            <Divider />
                        </>
                    )}

                    {/* Job Info */}
                    <div className="job-details-info">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <div className="info-item">
                                    <BankOutlined className="info-icon" />
                                    <div>
                                        <Text type="secondary">Company:</Text>
                                        <Text
                                            strong
                                            className="info-value"
                                            style={{ marginLeft: 8 }}
                                        >
                                            {selectedJob.company}
                                        </Text>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="info-item">
                                    <EnvironmentOutlined className="info-icon" />
                                    <div>
                                        <Text type="secondary">Location:</Text>
                                        <Text
                                            strong
                                            className="info-value"
                                            style={{ marginLeft: 8 }}
                                        >
                                            {selectedJob.location || "Remote"}
                                        </Text>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="info-item">
                                    <DollarOutlined className="info-icon" />
                                    <div>
                                        <Text type="secondary">
                                            Salary Range:
                                        </Text>
                                        <Text
                                            strong
                                            className="info-value"
                                            style={{ marginLeft: 8 }}
                                        >
                                            {selectedJob.salary_min ||
                                            selectedJob.salary_max
                                                ? `₱${Number(selectedJob.salary_min || 0).toLocaleString()} - ₱${Number(selectedJob.salary_max || 0).toLocaleString()}`
                                                : "Not specified"}
                                        </Text>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="info-item">
                                    <CalendarOutlined className="info-icon" />
                                    <div>
                                        <Text type="secondary">Posted:</Text>
                                        <Text
                                            strong
                                            className="info-value"
                                            style={{ marginLeft: 8 }}
                                        >
                                            {moment(
                                                selectedJob.created_at,
                                            ).format("MMM D, YYYY")}
                                        </Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <Divider />

                    {/* Description */}
                    <div className="job-details-section">
                        <Title level={5}>Job Description</Title>
                        <Paragraph style={{ whiteSpace: "pre-wrap" }}>
                            {selectedJob.description}
                        </Paragraph>
                    </div>

                    <Divider />

                    {/* Requirements */}
                    <div className="job-details-section">
                        <Title level={5}>Requirements</Title>
                        <Paragraph style={{ whiteSpace: "pre-wrap" }}>
                            {selectedJob.requirements}
                        </Paragraph>
                    </div>

                    {/* Action Button in Drawer */}
                    <div
                        className="job-details-actions"
                        style={{ marginTop: 24 }}
                    >
                        {isJobFullOrExpired(selectedJob) ? (
                            <Button
                                type="primary"
                                size="large"
                                block
                                disabled
                                icon={
                                    selectedJob.is_expired ? (
                                        <ClockCircleOutlined />
                                    ) : (
                                        <StopOutlined />
                                    )
                                }
                            >
                                {selectedJob.is_expired
                                    ? "Job Post Expired"
                                    : "Applications Full"}
                            </Button>
                        ) : (
                            (userRole === ROLES.ADMIN ||
                                (isJobCreator(selectedJob) &&
                                    selectedJob.status ===
                                        STATUS.APPROVED)) && (
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    icon={<TeamOutlined />}
                                    onClick={() => {
                                        setJobDetailsVisible(false);
                                        handleReviewApplications(selectedJob);
                                    }}
                                >
                                    Review Applications
                                </Button>
                            )
                        )}
                    </div>
                </div>
            )}
        </Drawer>
    );
}
