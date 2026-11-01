import React from "react";
import {
    BankOutlined,
    CheckCircleOutlined,
    DeleteOutlined,
    EnvironmentOutlined,
    FileImageOutlined,
    FileOutlined,
    IdcardOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusOutlined,
    SendOutlined,
    TeamOutlined,
    UserOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Tag,
    Typography,
    Upload,
} from "antd";
import { ROLES } from "~/config/roles";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";
import { ACCEPTED_FORMATS } from "~/pages/admin/JobPost/parts/jobPostConstants";
import { getJobTypeTag } from "~/pages/admin/JobPost/parts/jobPostHelpers";
import { buildImageUrl } from "~/pages/admin/JobPost/parts/jobPostUtils";

const { Title, Text } = Typography;

export default function ApplicationFormModal() {
    const {
        selectedJob,
        isApplicationModalVisible,
        appForm,
        submitApplicationLoading,
        attemptCloseApplicationModal,
        isMobile,
        profileLoading,
        currentAlumniProfile,
        handleApplicationSubmit,
        handleApplicationFormValuesChange,
        idDocuments,
        handleIdDocumentRemove,
        handleIdDocumentTypeChange,
        getAvailableIdTypes,
        handleIdDocumentFileChange,
        handleIdDocumentAdd,
        validateIdDocuments,
    } = useJobPostContext();

    return (
        <Modal
            title={
                <Space>
                    <SendOutlined />
                    <span>Apply for: {selectedJob?.title}</span>
                </Space>
            }
            open={isApplicationModalVisible}
            okText="Submit Application"
            onOk={() => appForm.submit()}
            confirmLoading={submitApplicationLoading}
            okButtonProps={{ loading: submitApplicationLoading }}
            onCancel={() => {
                // FEATURE 1: prompt before discarding unsaved application data.
                // Covers X button, Cancel button, mask click, and ESC key.
                attemptCloseApplicationModal();
            }}
            maskClosable={false}
            keyboard={false}
            width={isMobile ? "95%" : 700}
            style={{
                top: isMobile ? 8 : undefined,
                maxWidth: isMobile ? "95vw" : undefined,
                paddingBottom: 0,
            }}
            className="application-modal"
        >
            <Spin spinning={profileLoading}>
                {/* Selected Job Info */}
                {selectedJob && (
                    <Card
                        size="small"
                        style={{
                            marginBottom: 16,
                            background: COLORS.f6ffed,
                            borderColor: "#b7eb8f",
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={16}>
                                <Title level={5} style={{ margin: 0 }}>
                                    {selectedJob.title}
                                </Title>
                                <Space style={{ marginTop: 4 }}>
                                    <Tag icon={<BankOutlined />}>
                                        {selectedJob.company}
                                    </Tag>
                                    {getJobTypeTag(selectedJob.job_type)}
                                </Space>
                            </Col>
                            <Col span={8} style={{ textAlign: "right" }}>
                                <Text type="secondary">
                                    <EnvironmentOutlined />{" "}
                                    {selectedJob.location || "Remote"}
                                </Text>
                            </Col>
                        </Row>
                    </Card>
                )}

                {/* ============ NEW: Current Alumni Profile Summary ============ */}
                {currentAlumniProfile && (
                    <Card
                        size="small"
                        title={
                            <Space>
                                <UserOutlined />
                                <span>Your Profile Information</span>
                            </Space>
                        }
                        style={{
                            marginBottom: 16,
                            background: COLORS.e6f7ff,
                            borderColor: "#91d5ff",
                        }}
                    >
                        <Row gutter={[16, 12]}>
                            <Col span={24}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <Avatar
                                        size={56}
                                        src={buildImageUrl(
                                            currentAlumniProfile.profile_image ||
                                                currentAlumniProfile.profile_image_url,
                                        )}
                                        icon={
                                            !currentAlumniProfile.profile_image && (
                                                <UserOutlined />
                                            )
                                        }
                                        style={{
                                            border: "2px solid #1890ff",
                                        }}
                                    />
                                    <div>
                                        <Text
                                            strong
                                            style={{
                                                fontSize: 16,
                                                display: "block",
                                            }}
                                        >
                                            {currentAlumniProfile.first_name}{" "}
                                            {currentAlumniProfile.last_name}
                                        </Text>
                                        <Text type="secondary">
                                            {currentAlumniProfile.email}
                                        </Text>
                                    </div>
                                </div>
                            </Col>
                            {(currentAlumniProfile.phone ||
                                currentAlumniProfile.contact_number) && (
                                <Col span={12}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <PhoneOutlined
                                            style={{ color: COLORS.antdGreen }}
                                        />
                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                    display: "block",
                                                }}
                                            >
                                                Phone
                                            </Text>
                                            <Text>
                                                {currentAlumniProfile.phone ||
                                                    currentAlumniProfile.contact_number}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                            )}
                            {currentAlumniProfile.address && (
                                <Col span={12}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <EnvironmentOutlined
                                            style={{ color: COLORS.antdOrange }}
                                        />
                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                    display: "block",
                                                }}
                                            >
                                                Address
                                            </Text>
                                            <Text>
                                                {currentAlumniProfile.address}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Card>
                )}

                {/* Job Creator Contact Info - For Clarification */}
                {selectedJob?.creator &&
                    selectedJob.creator.role !== ROLES.ADMIN && (
                        <Card
                            size="small"
                            title={
                                <Space>
                                    <TeamOutlined />
                                    <span>
                                        Job Posted By (Contact for
                                        Clarification)
                                    </span>
                                </Space>
                            }
                            style={{
                                marginBottom: 16,
                                background: "#fff7e6",
                                borderColor: "#ffd591",
                            }}
                        >
                            <Row gutter={[16, 12]}>
                                <Col span={24}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            marginBottom: 12,
                                        }}
                                    >
                                        <Avatar
                                            size={48}
                                            src={buildImageUrl(
                                                selectedJob.creator
                                                    .profile_image ||
                                                    selectedJob.creator
                                                        .profile_image_url,
                                            )}
                                            icon={
                                                !selectedJob.creator
                                                    .profile_image && (
                                                    <UserOutlined />
                                                )
                                            }
                                            style={{
                                                border: "2px solid #faad14",
                                            }}
                                        />
                                        <div>
                                            <Text
                                                strong
                                                style={{ fontSize: 16 }}
                                            >
                                                {selectedJob.creator.name ||
                                                    selectedJob.creator
                                                        .first_name ||
                                                    "Unknown"}
                                            </Text>
                                            <br />
                                            <Tag
                                                color="geekblue"
                                                icon={<UserOutlined />}
                                                style={{ marginTop: 4 }}
                                            >
                                                Alumni
                                            </Tag>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <MailOutlined
                                            style={{ color: COLORS.antdOrange }}
                                        />
                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                    display: "block",
                                                }}
                                            >
                                                Email
                                            </Text>
                                            <a
                                                href={`mailto:${selectedJob.creator.email}`}
                                            >
                                                <Text
                                                    style={{
                                                        color: COLORS.antdBlue,
                                                    }}
                                                >
                                                    {selectedJob.creator
                                                        .email ||
                                                        "Not provided"}
                                                </Text>
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <PhoneOutlined
                                            style={{ color: COLORS.antdOrange }}
                                        />

                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                    display: "block",
                                                }}
                                            >
                                                Phone
                                            </Text>

                                            {selectedJob?.creator?.phone ? (
                                                <a
                                                    href={`tel:${selectedJob.creator.phone}`}
                                                >
                                                    <Text
                                                        style={{
                                                            color: COLORS.antdBlue,
                                                        }}
                                                    >
                                                        {
                                                            selectedJob.creator
                                                                .phone
                                                        }
                                                    </Text>
                                                </a>
                                            ) : (
                                                <Text type="secondary">
                                                    Not provided
                                                </Text>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    )}

                <Divider />

                {/* ============ APPLICATION FORM ============ */}
                <Form
                    form={appForm}
                    onFinish={handleApplicationSubmit}
                    onValuesChange={handleApplicationFormValuesChange}
                    layout="vertical"
                >
                    <Form.Item
                        name="resume"
                        label={
                            <>
                                Resume{" "}
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: "normal",
                                    }}
                                >
                                    ({ACCEPTED_FORMATS.RESUME.hint})
                                </Text>
                            </>
                        }
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        rules={[
                            {
                                required: true,
                                message:
                                    "Resume is required. Please upload your resume file.",
                            },
                        ]}
                    >
                        <Upload
                            beforeUpload={() => false}
                            maxCount={1}
                            accept={ACCEPTED_FORMATS.RESUME.accept}
                        >
                            <Button icon={<FileOutlined />}>
                                Upload Resume
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="cover_letter"
                        label="Cover Letter"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Cover letter is required. Please write a brief introduction about yourself.",
                            },
                            {
                                min: 50,
                                message:
                                    "Cover letter must be at least 50 characters long.",
                            },
                            {
                                max: 5000,
                                message:
                                    "Cover letter cannot exceed 5000 characters.",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={6}
                            placeholder="Write a cover letter introducing yourself and why you're a great fit for this role..."
                            showCount
                            maxLength={5000}
                        />
                    </Form.Item>

                    <Divider>Valid ID Documents (At Least 2 Required)</Divider>

                    {/* ID Documents Info Alert */}
                    <Alert
                        message="Required: Upload at least 2 valid government-issued IDs"
                        description="Accepted IDs: Philippine National ID (PhilID/ePhilID), UMID, Passport, Driver's License, SSS, PhilHealth, Pag-IBIG, PRC ID, NBI Clearance, Voter's ID"
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />

                    {/* ID Documents Upload Section */}
                    {idDocuments.map((doc, index) => (
                        <Card
                            key={index}
                            size="small"
                            style={{
                                marginBottom: 12,
                                background: COLORS.zinc50,
                            }}
                            title={
                                <Space>
                                    <IdcardOutlined />
                                    <span>ID Document {index + 1}</span>
                                    {index >= 2 && (
                                        <Button
                                            type="text"
                                            danger
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() =>
                                                handleIdDocumentRemove(index)
                                            }
                                        />
                                    )}
                                </Space>
                            }
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="ID Type"
                                        style={{ marginBottom: 8 }}
                                    >
                                        <Select
                                            placeholder="Select ID type"
                                            value={doc.type || undefined}
                                            onChange={(value) =>
                                                handleIdDocumentTypeChange(
                                                    index,
                                                    value,
                                                )
                                            }
                                            options={getAvailableIdTypes(
                                                index,
                                            ).map((type) => ({
                                                value: type.value,
                                                label: type.label,
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Upload ID"
                                        style={{ marginBottom: 8 }}
                                    >
                                        <Upload
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            accept={
                                                ACCEPTED_FORMATS.ID_DOCUMENT
                                                    .accept
                                            }
                                            fileList={doc.fileList}
                                            onChange={(info) =>
                                                handleIdDocumentFileChange(
                                                    index,
                                                    info,
                                                )
                                            }
                                        >
                                            <Button
                                                icon={<FileImageOutlined />}
                                            >
                                                Upload
                                            </Button>
                                        </Upload>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 11,
                                                display: "block",
                                                marginTop: 4,
                                            }}
                                        >
                                            {ACCEPTED_FORMATS.ID_DOCUMENT.hint}
                                        </Text>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    ))}

                    {/* Add More ID Button */}
                    {idDocuments.length < 5 && (
                        <Button
                            type="dashed"
                            onClick={handleIdDocumentAdd}
                            block
                            icon={<PlusOutlined />}
                            style={{ marginBottom: 16 }}
                        >
                            Add Another ID Document
                        </Button>
                    )}

                    {/* Validation Status */}
                    {idDocuments.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            {validateIdDocuments() ? (
                                <Tag
                                    color="green"
                                    icon={<CheckCircleOutlined />}
                                >
                                    ✓ Minimum 2 valid IDs uploaded
                                </Tag>
                            ) : (
                                <Tag color="orange" icon={<WarningOutlined />}>
                                    Please upload at least 2 valid ID documents
                                </Tag>
                            )}
                        </div>
                    )}

                    {/* <Divider>Any Other Documents to Upload (Optional)</Divider> */}

                    {/* Other Documents Upload */}
                    {/* <Form.Item label="Other Supporting Documents">
          <Upload
            beforeUpload={() => false}
            multiple
            maxCount={5}
            accept={ACCEPTED_FORMATS.OTHER_DOCUMENT.accept}
            fileList={otherDocuments}
            onChange={handleOtherDocumentsChange}
          >
            <Button icon={<FileOutlined />}>Upload Additional Documents</Button>
          </Upload>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            You can upload up to 5 additional documents. {ACCEPTED_FORMATS.OTHER_DOCUMENT.hint}
          </Text>
        </Form.Item> */}
                </Form>
            </Spin>
        </Modal>
    );
}
