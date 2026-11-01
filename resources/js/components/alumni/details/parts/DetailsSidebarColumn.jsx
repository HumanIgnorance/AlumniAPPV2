import React from "react";
import {
    CalendarOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    FileImageOutlined,
    GithubOutlined,
    GlobalOutlined,
    IdcardOutlined,
    LinkedinOutlined,
    SafetyCertificateOutlined,
    TwitterOutlined,
    UploadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Typography, Upload } from "antd";
import moment from "moment";
import { useAlumniDetailsContext } from "~/components/alumni/details/AlumniDetailsContext";
import { ID_TYPES } from "~/config/alumniOptions";
import { COLORS } from "~/config/theme";

const { Title, Text } = Typography;

export default function DetailsSidebarColumn() {
    const {
        canViewFullDetails,
        getData,
        localDocuments,
        handleImageZoom,
        isAdmin,
        handleUploadDocument,
        uploadLoading,
    } = useAlumniDetailsContext();

    return (
        canViewFullDetails && (
            <>
                <Col xs={24} lg={8}>
                    {/* Quick Info Card */}
                    <Card className="sidebar-card" size="small">
                        {/* Personal Information */}
                        <div className="sidebar-section">
                            <Title level={5} className="sidebar-title">
                                <IdcardOutlined /> Personal Info
                            </Title>
                            <div className="sidebar-items">
                                {getData("birth_date") && (
                                    <div className="sidebar-item">
                                        <CalendarOutlined className="sidebar-icon" />
                                        <div className="sidebar-content">
                                            <Text className="sidebar-label">
                                                Birth Date
                                            </Text>
                                            <Text className="sidebar-value">
                                                {moment(
                                                    getData("birth_date"),
                                                ).format("MMM DD, YYYY")}
                                            </Text>
                                        </div>
                                    </div>
                                )}
                                {getData("gender") && (
                                    <div className="sidebar-item">
                                        <UserOutlined className="sidebar-icon" />
                                        <div className="sidebar-content">
                                            <Text className="sidebar-label">
                                                Gender
                                            </Text>
                                            <Text
                                                className="sidebar-value"
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {getData("gender").replace(
                                                    "_",
                                                    " ",
                                                )}
                                            </Text>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social Profiles */}
                        <div className="sidebar-section">
                            <Title level={5} className="sidebar-title">
                                <GlobalOutlined /> Social Profiles
                            </Title>

                            <div className="sidebar-items">
                                {getData("linkedin") && (
                                    <div className="sidebar-item">
                                        <LinkedinOutlined className="sidebar-icon linkedin" />

                                        <div
                                            className="sidebar-content"
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <Text className="sidebar-label">
                                                LinkedIn
                                            </Text>

                                            <Text
                                                className="sidebar-value"
                                                ellipsis={{
                                                    tooltip:
                                                        getData("linkedin"),
                                                }}
                                            >
                                                {getData("linkedin")}
                                            </Text>
                                        </div>

                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<EyeOutlined />}
                                            onClick={() =>
                                                window.open(
                                                    getData("linkedin"),
                                                    "_blank",
                                                    "noopener,noreferrer",
                                                )
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                )}

                                {getData("github") && (
                                    <div className="sidebar-item">
                                        <GithubOutlined className="sidebar-icon github" />

                                        <div
                                            className="sidebar-content"
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <Text className="sidebar-label">
                                                GitHub
                                            </Text>

                                            <Text
                                                className="sidebar-value"
                                                ellipsis={{
                                                    tooltip: getData("github"),
                                                }}
                                            >
                                                {getData("github")}
                                            </Text>
                                        </div>

                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<EyeOutlined />}
                                            onClick={() =>
                                                window.open(
                                                    getData("github"),
                                                    "_blank",
                                                    "noopener,noreferrer",
                                                )
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                )}

                                {getData("portfolio") && (
                                    <div className="sidebar-item">
                                        <GlobalOutlined className="sidebar-icon portfolio" />

                                        <div
                                            className="sidebar-content"
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <Text className="sidebar-label">
                                                Portfolio
                                            </Text>

                                            <Text
                                                className="sidebar-value"
                                                ellipsis={{
                                                    tooltip:
                                                        getData("portfolio"),
                                                }}
                                            >
                                                {getData("portfolio")}
                                            </Text>
                                        </div>

                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<EyeOutlined />}
                                            onClick={() =>
                                                window.open(
                                                    getData("portfolio"),
                                                    "_blank",
                                                    "noopener,noreferrer",
                                                )
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                )}

                                {getData("twitter") && (
                                    <div className="sidebar-item">
                                        <TwitterOutlined
                                            className="sidebar-icon"
                                            style={{
                                                color: "#1DA1F2",
                                            }}
                                        />

                                        <div
                                            className="sidebar-content"
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <Text className="sidebar-label">
                                                Twitter / X
                                            </Text>

                                            <Text
                                                className="sidebar-value"
                                                ellipsis={{
                                                    tooltip: getData("twitter"),
                                                }}
                                            >
                                                {getData("twitter")}
                                            </Text>
                                        </div>

                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<EyeOutlined />}
                                            onClick={() =>
                                                window.open(
                                                    getData("twitter"),
                                                    "_blank",
                                                    "noopener,noreferrer",
                                                )
                                            }
                                        >
                                            View
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Document Status - Only show for admin, not for viewOwnProfile */}
                        {canViewFullDetails && (
                            <div className="sidebar-section">
                                <Title level={5} className="sidebar-title">
                                    <FileImageOutlined /> Documents
                                </Title>
                                <div className="document-status">
                                    {/* Show all document types - View for uploaded, Upload icon for missing */}
                                    {ID_TYPES.map((docType) => {
                                        // Check if this document type is uploaded - use localDocuments for immediate updates
                                        const uploadedDoc = Array.isArray(
                                            localDocuments,
                                        )
                                            ? localDocuments.find(
                                                  (doc) =>
                                                      doc.document_type ===
                                                          docType.value ||
                                                      doc.type ===
                                                          docType.value,
                                              )
                                            : null;

                                        return (
                                            <div
                                                key={docType.value}
                                                className={`document-item ${uploadedDoc ? "uploaded" : "pending"}`}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                    padding: "6px 0",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                    }}
                                                >
                                                    {uploadedDoc ? (
                                                        <CheckCircleOutlined
                                                            className="doc-icon"
                                                            style={{
                                                                color: COLORS.antdGreen,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            style={{
                                                                color: COLORS.bfbfbf,
                                                            }}
                                                        >
                                                            {docType.icon}
                                                        </span>
                                                    )}
                                                    <Text
                                                        style={{
                                                            color: uploadedDoc
                                                                ? "inherit"
                                                                : COLORS.antdGray7,
                                                        }}
                                                    >
                                                        {docType.label}
                                                    </Text>
                                                </div>
                                                {uploadedDoc ? (
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        icon={<EyeOutlined />}
                                                        onClick={() =>
                                                            handleImageZoom(
                                                                uploadedDoc.file_url ||
                                                                    uploadedDoc.url,
                                                                docType.value,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    isAdmin && (
                                                        <Upload
                                                            showUploadList={
                                                                false
                                                            }
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            beforeUpload={(
                                                                file,
                                                            ) =>
                                                                handleUploadDocument(
                                                                    file,
                                                                    docType.value,
                                                                )
                                                            }
                                                            disabled={
                                                                uploadLoading
                                                            }
                                                        >
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={
                                                                    <UploadOutlined />
                                                                }
                                                                loading={
                                                                    uploadLoading
                                                                }
                                                                style={{
                                                                    color: COLORS.antdBlue,
                                                                }}
                                                            />
                                                        </Upload>
                                                    )
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Preferences */}
                        <div className="sidebar-section">
                            <Title level={5} className="sidebar-title">
                                <SafetyCertificateOutlined /> Preferences
                            </Title>
                            <div className="preference-items">
                                <div className="preference-item">
                                    <CheckCircleOutlined className="pref-icon" />
                                    <Text>Terms & Conditions Accepted</Text>
                                </div>
                                {getData("newsletter") && (
                                    <div className="preference-item">
                                        <CheckCircleOutlined className="pref-icon" />
                                        <Text>Newsletter Subscribed</Text>
                                    </div>
                                )}
                                {getData("contactPermission") && (
                                    <div className="preference-item">
                                        <CheckCircleOutlined className="pref-icon" />
                                        <Text>Contact Permission Granted</Text>
                                    </div>
                                )}
                                {getData("continueEducation") && (
                                    <div className="preference-item">
                                        <CheckCircleOutlined className="pref-icon" />
                                        <Text>Planning Further Education</Text>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </Col>
            </>
        )
    );
}
