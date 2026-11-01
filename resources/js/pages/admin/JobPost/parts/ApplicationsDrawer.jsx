import React from "react";
import {
    BankOutlined,
    CheckOutlined,
    CloseOutlined,
    EnvironmentOutlined,
    FileOutlined,
    IdcardOutlined,
    MailOutlined,
    PhoneOutlined,
    SearchOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Drawer,
    Empty,
    Input,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
} from "antd";
import moment from "moment";
import { STATUS } from "~/config/status";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";
import {
    ApplicantPhotoGrid,
    IdDocumentCard,
    ResumeViewer,
} from "~/pages/admin/JobPost/parts/DocumentViewers";
import { buildImageUrl } from "~/pages/admin/JobPost/parts/jobPostUtils";
import { ApplicantInfo } from "~/pages/admin/JobPost/parts/PersonInfo";

const { Text, Paragraph } = Typography;

export default function ApplicationsDrawer() {
    const {
        selectedJob,
        jobApplications,
        setApplicationsVisible,
        setJobApplications,
        setApplicantSearchText,
        applicationsVisible,
        isMobile,
        applicationsLoading,
        applicantSearchText,
        handleUpdateApplicationStatus,
        applicationActionLoading,
    } = useJobPostContext();

    return (
        <Drawer
            title={
                <Space>
                    <TeamOutlined />
                    <span>Applications for: {selectedJob?.title}</span>
                    <Badge
                        count={jobApplications.length}
                        style={{ backgroundColor: COLORS.antdBlue }}
                    />
                </Space>
            }
            placement="right"
            onClose={() => {
                setApplicationsVisible(false);
                setJobApplications([]);
                setApplicantSearchText("");
            }}
            open={applicationsVisible}
            width={isMobile ? "95%" : 800}
            style={{
                top: isMobile ? 8 : undefined,
                maxWidth: isMobile ? "95vw" : undefined,
                paddingBottom: 0,
            }}
            className="applications-drawer"
        >
            <Spin spinning={applicationsLoading}>
                {/* Applicant Name Search Filter */}
                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search applicant by name..."
                        prefix={
                            <SearchOutlined style={{ color: COLORS.bfbfbf }} />
                        }
                        value={applicantSearchText}
                        onChange={(e) => setApplicantSearchText(e.target.value)}
                        allowClear
                        size="large"
                        style={{ width: "100%" }}
                    />
                </div>

                {jobApplications.filter((application) => {
                    if (!applicantSearchText) return true;
                    const applicant =
                        application.alumni ||
                        application.user ||
                        application.applicant;
                    const fullName =
                        `${applicant?.first_name || ""} ${applicant?.last_name || ""} ${applicant?.name || ""}`.toLowerCase();
                    return fullName.includes(applicantSearchText.toLowerCase());
                }).length > 0 ? (
                    <div className="applications-list">
                        {jobApplications
                            .filter((application) => {
                                if (!applicantSearchText) return true;
                                const applicant =
                                    application.alumni ||
                                    application.user ||
                                    application.applicant;
                                const fullName =
                                    `${applicant?.first_name || ""} ${applicant?.last_name || ""} ${applicant?.name || ""}`.toLowerCase();
                                return fullName.includes(
                                    applicantSearchText.toLowerCase(),
                                );
                            })
                            .map((application) => {
                                const applicant =
                                    application.alumni ||
                                    application.user ||
                                    application.applicant;

                                return (
                                    <Card
                                        key={application.id}
                                        className="application-card"
                                        style={{ marginBottom: 16 }}
                                    >
                                        {/* Applicant Info Header */}
                                        <div className="application-header">
                                            <ApplicantInfo
                                                applicant={applicant}
                                                size="large"
                                            />
                                            <div className="application-status">
                                                <Tag
                                                    color={
                                                        application.status ===
                                                        "accepted"
                                                            ? "green"
                                                            : application.status ===
                                                                STATUS.REJECTED
                                                              ? "red"
                                                              : "orange"
                                                    }
                                                >
                                                    {application.status?.toUpperCase()}
                                                </Tag>
                                            </div>
                                        </div>

                                        <Divider style={{ margin: "12px 0" }} />

                                        {/* ============ NEW: Applicant Contact & Career Information ============ */}
                                        <Row
                                            gutter={[16, 12]}
                                            style={{ marginBottom: 16 }}
                                        >
                                            {/* Contact Information */}
                                            <Col span={24}>
                                                <Card
                                                    size="small"
                                                    className="applicant-contact-card"
                                                    title={
                                                        <Space>
                                                            <PhoneOutlined />
                                                            <span>
                                                                Contact
                                                                Information
                                                            </span>
                                                        </Space>
                                                    }
                                                >
                                                    <Row gutter={[16, 8]}>
                                                        <Col span={12}>
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap: 8,
                                                                }}
                                                            >
                                                                <MailOutlined
                                                                    style={{
                                                                        color: COLORS.antdBlue,
                                                                    }}
                                                                />
                                                                <div>
                                                                    <Text
                                                                        type="secondary"
                                                                        style={{
                                                                            fontSize: 12,
                                                                            display:
                                                                                "block",
                                                                        }}
                                                                    >
                                                                        Email
                                                                    </Text>
                                                                    <Text>
                                                                        {applicant?.email ||
                                                                            "Not provided"}
                                                                    </Text>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col span={12}>
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap: 8,
                                                                }}
                                                            >
                                                                <PhoneOutlined
                                                                    style={{
                                                                        color: COLORS.antdGreen,
                                                                    }}
                                                                />
                                                                <div>
                                                                    <Text
                                                                        type="secondary"
                                                                        style={{
                                                                            fontSize: 12,
                                                                            display:
                                                                                "block",
                                                                        }}
                                                                    >
                                                                        Phone
                                                                    </Text>
                                                                    <Text>
                                                                        {applicant?.phone ||
                                                                            "Not provided"}
                                                                    </Text>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        {applicant?.address && (
                                                            <Col span={24}>
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: 8,
                                                                    }}
                                                                >
                                                                    <EnvironmentOutlined
                                                                        style={{
                                                                            color: COLORS.antdOrange,
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                fontSize: 12,
                                                                                display:
                                                                                    "block",
                                                                            }}
                                                                        >
                                                                            Address
                                                                        </Text>
                                                                        <Text>
                                                                            {
                                                                                applicant.address
                                                                            }
                                                                        </Text>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )}
                                                    </Row>
                                                </Card>
                                            </Col>

                                            {/* Career Information */}
                                            {(applicant?.current_company ||
                                                applicant?.job_title ||
                                                applicant?.years_experience) && (
                                                <Col span={24}>
                                                    <Card
                                                        size="small"
                                                        className="applicant-career-card"
                                                        title={
                                                            <Space>
                                                                <BankOutlined />
                                                                <span>
                                                                    Career
                                                                    Information
                                                                </span>
                                                            </Space>
                                                        }
                                                    >
                                                        <Row gutter={[16, 8]}>
                                                            {applicant?.current_company && (
                                                                <Col span={12}>
                                                                    <div>
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                fontSize: 12,
                                                                                display:
                                                                                    "block",
                                                                            }}
                                                                        >
                                                                            Current
                                                                            Company
                                                                        </Text>
                                                                        <Text
                                                                            strong
                                                                        >
                                                                            {
                                                                                applicant.current_company
                                                                            }
                                                                        </Text>
                                                                    </div>
                                                                </Col>
                                                            )}
                                                            {applicant?.job_title && (
                                                                <Col span={12}>
                                                                    <div>
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                fontSize: 12,
                                                                                display:
                                                                                    "block",
                                                                            }}
                                                                        >
                                                                            Job
                                                                            Title
                                                                        </Text>
                                                                        <Text
                                                                            strong
                                                                        >
                                                                            {
                                                                                applicant.job_title
                                                                            }
                                                                        </Text>
                                                                    </div>
                                                                </Col>
                                                            )}
                                                            {applicant?.years_experience && (
                                                                <Col span={12}>
                                                                    <div>
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                fontSize: 12,
                                                                                display:
                                                                                    "block",
                                                                            }}
                                                                        >
                                                                            Years
                                                                            of
                                                                            Experience
                                                                        </Text>
                                                                        <Text
                                                                            strong
                                                                        >
                                                                            {
                                                                                applicant.years_experience
                                                                            }{" "}
                                                                            years
                                                                        </Text>
                                                                    </div>
                                                                </Col>
                                                            )}
                                                            {applicant?.industry && (
                                                                <Col span={12}>
                                                                    <div>
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                fontSize: 12,
                                                                                display:
                                                                                    "block",
                                                                            }}
                                                                        >
                                                                            Industry
                                                                        </Text>
                                                                        <Text
                                                                            strong
                                                                        >
                                                                            {
                                                                                applicant.industry
                                                                            }
                                                                        </Text>
                                                                    </div>
                                                                </Col>
                                                            )}
                                                            {applicant?.previous_companies && (
                                                                <Col span={24}>
                                                                    <div>
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                fontSize: 12,
                                                                                display:
                                                                                    "block",
                                                                            }}
                                                                        >
                                                                            Previous
                                                                            Companies
                                                                        </Text>
                                                                        <Text>
                                                                            {
                                                                                applicant.previous_companies
                                                                            }
                                                                        </Text>
                                                                    </div>
                                                                </Col>
                                                            )}
                                                        </Row>
                                                    </Card>
                                                </Col>
                                            )}
                                        </Row>

                                        {/* ============ Submitted Photos — gallery-style lightbox ============ */}
                                        {(() => {
                                            const photos =
                                                application.photos ||
                                                application.submitted_photos ||
                                                application.images ||
                                                application.applicant_photos ||
                                                [];
                                            return photos.length > 0 ? (
                                                <ApplicantPhotoGrid
                                                    photos={photos}
                                                    applicantName={
                                                        applicant?.first_name ||
                                                        applicant?.name ||
                                                        "Applicant"
                                                    }
                                                />
                                            ) : null;
                                        })()}

                                        {/* Cover Letter */}
                                        <div style={{ marginBottom: 12 }}>
                                            <Text strong>Cover Letter:</Text>
                                            <Paragraph
                                                style={{
                                                    marginTop: 4,
                                                    whiteSpace: "pre-wrap",
                                                }}
                                                ellipsis={{
                                                    rows: 3,
                                                    expandable: true,
                                                }}
                                            >
                                                {application.cover_letter ||
                                                    "No cover letter provided"}
                                            </Paragraph>
                                        </div>

                                        {/* Resume — inline preview + download */}
                                        {/* Backend saves as resume_path (see JobApplicationController@apply) */}
                                        {(application.resume_path ||
                                            application.resume ||
                                            application.resume_url) && (
                                            <div style={{ marginBottom: 12 }}>
                                                <Text strong>Resume:</Text>
                                                <ResumeViewer
                                                    fileUrl={buildImageUrl(
                                                        application.resume_path ||
                                                            application.resume ||
                                                            application.resume_url,
                                                    )}
                                                    fileName={`${
                                                        applicant?.first_name ||
                                                        applicant?.name ||
                                                        "Applicant"
                                                    } — Resume`}
                                                />
                                            </div>
                                        )}

                                        {/* ============ ID Documents — gallery-style cards ============ */}
                                        {application.id_documents &&
                                            application.id_documents.length >
                                                0 && (
                                                <div
                                                    style={{ marginBottom: 12 }}
                                                >
                                                    <Text
                                                        strong
                                                        style={{
                                                            display: "block",
                                                            marginBottom: 8,
                                                        }}
                                                    >
                                                        <IdcardOutlined
                                                            style={{
                                                                marginRight: 6,
                                                                color: COLORS.brand,
                                                            }}
                                                        />
                                                        ID Documents (
                                                        {
                                                            application
                                                                .id_documents
                                                                .length
                                                        }
                                                        ):
                                                    </Text>
                                                    <Row gutter={[10, 10]}>
                                                        {application.id_documents.map(
                                                            (doc, index) => (
                                                                <Col
                                                                    span={12}
                                                                    key={index}
                                                                >
                                                                    <IdDocumentCard
                                                                        doc={
                                                                            doc
                                                                        }
                                                                        index={
                                                                            index
                                                                        }
                                                                    />
                                                                </Col>
                                                            ),
                                                        )}
                                                    </Row>
                                                </div>
                                            )}

                                        {/* Other Documents — inline previewer */}
                                        {application.other_documents &&
                                            application.other_documents.length >
                                                0 && (
                                                <div
                                                    style={{ marginBottom: 12 }}
                                                >
                                                    <Text
                                                        strong
                                                        style={{
                                                            display: "block",
                                                            marginBottom: 6,
                                                        }}
                                                    >
                                                        <FileOutlined
                                                            style={{
                                                                marginRight: 6,
                                                                color: COLORS.antdGreen,
                                                            }}
                                                        />
                                                        Other Documents (
                                                        {
                                                            application
                                                                .other_documents
                                                                .length
                                                        }
                                                        ):
                                                    </Text>
                                                    {application.other_documents.map(
                                                        (doc, index) => {
                                                            const docUrl =
                                                                buildImageUrl(
                                                                    doc.file_path ||
                                                                        doc.file_url ||
                                                                        doc.path ||
                                                                        doc,
                                                                );
                                                            return (
                                                                <ResumeViewer
                                                                    key={index}
                                                                    fileUrl={
                                                                        docUrl
                                                                    }
                                                                    fileName={
                                                                        doc.name ||
                                                                        doc.original_name ||
                                                                        `Document ${index + 1}`
                                                                    }
                                                                />
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            )}

                                        {/* Applied Date */}
                                        <div style={{ marginBottom: 12 }}>
                                            <Text type="secondary">
                                                Applied:{" "}
                                                {moment(
                                                    application.created_at,
                                                ).format("MMM D, YYYY h:mm A")}
                                            </Text>
                                        </div>

                                        {/* Action Buttons */}
                                        <Space>
                                            <Button
                                                type="primary"
                                                icon={<CheckOutlined />}
                                                onClick={() =>
                                                    handleUpdateApplicationStatus(
                                                        application.id,
                                                        "accepted",
                                                    )
                                                }
                                                disabled={
                                                    application.status ===
                                                    "accepted"
                                                }
                                                loading={
                                                    applicationActionLoading[
                                                        application.id
                                                    ] === "accepted"
                                                }
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                danger
                                                icon={<CloseOutlined />}
                                                onClick={() =>
                                                    handleUpdateApplicationStatus(
                                                        application.id,
                                                        "rejected",
                                                    )
                                                }
                                                disabled={
                                                    application.status ===
                                                    STATUS.REJECTED
                                                }
                                                loading={
                                                    applicationActionLoading[
                                                        application.id
                                                    ] === STATUS.REJECTED
                                                }
                                            >
                                                Reject
                                            </Button>
                                        </Space>
                                    </Card>
                                );
                            })}
                    </div>
                ) : (
                    <Empty
                        description={
                            applicantSearchText
                                ? "No applicants found matching your search"
                                : "No applications yet"
                        }
                    />
                )}
            </Spin>
        </Drawer>
    );
}
