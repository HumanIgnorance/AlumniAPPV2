import React from "react";
import {
    BankOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    PictureOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Button,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space,
    Tag,
    Typography,
    Upload,
    message,
} from "antd";
import moment from "moment";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";
import {
    ACCEPTED_FORMATS,
    LEGITIMATE_JOB_SOURCES,
    REFERENCE_SOURCE_OPTIONS,
    expirationOptions,
} from "~/pages/admin/JobPost/parts/jobPostConstants";
import { isValidHttpUrl } from "~/pages/admin/JobPost/parts/jobPostUtils";

const { Text } = Typography;

export default function CreateEditJobModal() {
    const {
        editingPost,
        draftLastSaved,
        isModalVisible,
        fileList,
        form,
        requestCloseCreateModal,
        jobPostSubmitLoading,
        isMobile,
        handleFormSubmit,
        handleFormValuesChange,
        setReferenceUrlValid,
        handleUploadChange,
        handleBeforeUpload,
        referenceUrlValid,
    } = useJobPostContext();

    return (
        <Modal
            title={
                <Space size="middle" wrap>
                    <span>
                        {editingPost ? "Edit Job Post" : "Create Job Post"}
                    </span>
                    {!editingPost && draftLastSaved && (
                        <Tag
                            icon={<CheckCircleOutlined />}
                            color="green"
                            style={{ margin: 0 }}
                        >
                            Auto Saved ·{" "}
                            {moment(draftLastSaved).format("HH:mm:ss")}
                        </Tag>
                    )}
                </Space>
            }
            open={isModalVisible}
            okText={editingPost ? "Update" : "Submit"}
            onOk={() => {
                // ✅ FIX: Validate fileList manually for banner_image since Upload doesn't work with Form validation
                if (fileList.length === 0) {
                    message.error("Please upload a banner image");
                    return;
                }
                form.submit();
            }}
            onCancel={requestCloseCreateModal}
            okButtonProps={{ loading: jobPostSubmitLoading }}
            maskClosable={false}
            width={isMobile ? "95%" : 760}
            style={{
                top: isMobile ? 8 : undefined,
                maxWidth: isMobile ? "95vw" : undefined,
                paddingBottom: 0,
            }}
            className="job-form-modal"
        >
            <Form
                form={form}
                onFinish={handleFormSubmit}
                layout="vertical"
                onValuesChange={(changed, all) => {
                    handleFormValuesChange();
                    if (
                        Object.prototype.hasOwnProperty.call(
                            changed,
                            "reference_url",
                        )
                    ) {
                        const v = all.reference_url;
                        if (!v) setReferenceUrlValid(null);
                        else setReferenceUrlValid(isValidHttpUrl(v));
                    }
                }}
            >
                {/* ============ IMAGE UPLOAD (SAME AS AlumniEvents.js) ============ */}
                <Form.Item name="banner_image" label="Job Post Banner Image">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={handleBeforeUpload}
                        maxCount={1}
                        accept={ACCEPTED_FORMATS.BANNER_IMAGE.accept}
                    >
                        {fileList.length < 1 && (
                            <div>
                                <PictureOutlined
                                    style={{
                                        fontSize: 24,
                                        color: COLORS.brand,
                                    }}
                                />
                                <div style={{ marginTop: 8 }}>
                                    Upload Banner
                                </div>
                            </div>
                        )}
                    </Upload>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Recommended size: 1200x630px.{" "}
                        {ACCEPTED_FORMATS.BANNER_IMAGE.hint}{" "}
                        <Text type="danger">*Required</Text>
                    </Text>
                </Form.Item>

                <Form.Item
                    name="title"
                    label="Job Title"
                    extra="Example: Software Developer"
                    rules={[
                        {
                            required: true,
                            message: "Please enter job title",
                        },
                        {
                            min: 5,
                            message: "Job title must be at least 5 characters",
                        },
                        { max: 120, message: "Job title is too long" },
                    ]}
                >
                    <Input
                        placeholder="e.g., Senior Software Engineer"
                        size="large"
                        maxLength={120}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Job Description"
                    extra="Describe responsibilities, day-to-day work, and what success looks like."
                    rules={[
                        {
                            required: true,
                            message: "Please enter job description",
                        },
                        {
                            min: 50,
                            message:
                                "Description must be at least 50 characters",
                        },
                    ]}
                >
                    <Input.TextArea
                        rows={5}
                        placeholder="Describe the job responsibilities..."
                        showCount
                        maxLength={5000}
                    />
                </Form.Item>

                <Form.Item
                    name="company"
                    label="Company Name"
                    extra="Example: Accenture Philippines"
                    rules={[
                        {
                            required: true,
                            message: "Please enter company name",
                        },
                        {
                            max: 150,
                            message: "Company name is too long",
                        },
                    ]}
                >
                    <Input
                        placeholder="e.g., Tech Company Inc."
                        prefix={<BankOutlined />}
                        size="large"
                        maxLength={150}
                    />
                </Form.Item>

                <Form.Item
                    name="requirements"
                    label="Requirements"
                    extra="List required skills, qualifications, and certifications."
                    rules={[
                        {
                            required: true,
                            message: "Please enter job requirements",
                        },
                    ]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Enter required skills and qualifications"
                        showCount
                        maxLength={3000}
                    />
                </Form.Item>

                <Form.Item
                    name="job_type"
                    label="Job Type"
                    rules={[
                        {
                            required: true,
                            message: "Please select job type",
                        },
                    ]}
                >
                    <Select placeholder="Select job type" size="large">
                        <Select.Option value="Full-time">
                            Full-time
                        </Select.Option>
                        <Select.Option value="Part-time">
                            Part-time
                        </Select.Option>
                        <Select.Option value="Contract">Contract</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="location"
                    label="Location"
                    extra="Example: Cagayan de Oro City"
                    rules={[
                        {
                            required: true,
                            message: "Please enter location",
                        },
                    ]}
                >
                    <Input
                        placeholder="e.g., Manila, Philippines"
                        prefix={<EnvironmentOutlined />}
                        size="large"
                        maxLength={150}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="salary_min"
                            label="Salary Min (₱)"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter minimum salary",
                                },
                                {
                                    validator(_, value) {
                                        if (
                                            value === undefined ||
                                            value === null ||
                                            value === ""
                                        )
                                            return Promise.resolve();
                                        if (Number(value) < 0)
                                            return Promise.reject(
                                                new Error(
                                                    "Salary cannot be negative",
                                                ),
                                            );
                                        return Promise.resolve();
                                    },
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const max = getFieldValue("salary_max");

                                        if (!value || !max) {
                                            return Promise.resolve();
                                        }

                                        if (Number(value) >= Number(max)) {
                                            return Promise.reject(
                                                new Error(
                                                    "Minimum salary must be lower than maximum salary",
                                                ),
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input
                                prefix="₱"
                                type="number"
                                min={0}
                                placeholder="Min salary"
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="salary_max"
                            label="Salary Max (₱)"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter maximum salary",
                                },
                                {
                                    validator(_, value) {
                                        if (
                                            value === undefined ||
                                            value === null ||
                                            value === ""
                                        )
                                            return Promise.resolve();
                                        if (Number(value) < 0)
                                            return Promise.reject(
                                                new Error(
                                                    "Salary cannot be negative",
                                                ),
                                            );
                                        return Promise.resolve();
                                    },
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const min = getFieldValue("salary_min");

                                        if (!value || !min) {
                                            return Promise.resolve();
                                        }

                                        if (Number(value) <= Number(min)) {
                                            return Promise.reject(
                                                new Error(
                                                    "Maximum salary must be higher than minimum salary",
                                                ),
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input
                                prefix="₱"
                                type="number"
                                min={0}
                                placeholder="Max salary"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ============ CAPACITY AND EXPIRATION FIELDS - NOW REQUIRED ============ */}
                <Divider>Application Limits</Divider>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="capacity"
                            label={
                                <Space>
                                    <TeamOutlined />
                                    <span>Application Capacity</span>
                                </Space>
                            }
                            tooltip="Maximum number of applications allowed."
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please enter application capacity",
                                },
                                {
                                    validator(_, value) {
                                        if (
                                            value === undefined ||
                                            value === null ||
                                            value === ""
                                        )
                                            return Promise.resolve();
                                        if (Number(value) < 1)
                                            return Promise.reject(
                                                new Error(
                                                    "Capacity must be at least 1",
                                                ),
                                            );
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <InputNumber
                                placeholder="e.g., 50"
                                min={1}
                                style={{ width: "100%" }}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="expiration_days"
                            label={
                                <Space>
                                    <ClockCircleOutlined />
                                    <span>Expiration Period</span>
                                </Space>
                            }
                            tooltip="How long this job post will be active."
                            rules={[
                                {
                                    required: true,
                                    message: "Please select expiration period",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select duration"
                                size="large"
                                options={expirationOptions.filter(
                                    (opt) => opt.value !== null,
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ============ ENHANCEMENT: Job Post Verification ============ */}
                <Divider>
                    <Space>
                        <SafetyCertificateOutlined />
                        <span>Job Post Verification</span>
                    </Space>
                </Divider>

                <Alert
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message="Help applicants trust this job"
                    description={
                        <div>
                            <div style={{ marginBottom: 6 }}>
                                Provide a public link from a recognized source
                                so applicants can verify this posting.
                            </div>
                            <Space size={[6, 6]} wrap>
                                {LEGITIMATE_JOB_SOURCES.map((s) => (
                                    <Tag
                                        key={s.name}
                                        color="blue"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <a
                                            href={s.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {s.name}
                                        </a>
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                    }
                />

                <Form.Item
                    name="reference_source_type"
                    label="Reference Source Type"
                    tooltip="Where this job post is originally published."
                >
                    <Select
                        placeholder="Select reference source"
                        size="large"
                        allowClear
                        options={REFERENCE_SOURCE_OPTIONS}
                    />
                </Form.Item>

                <Form.Item
                    name="reference_url"
                    label={
                        <Space>
                            <span>Reference URL</span>
                            {referenceUrlValid === true && (
                                <Tag color="green">Valid URL</Tag>
                            )}
                            {referenceUrlValid === false && (
                                <Tag color="red">Invalid URL</Tag>
                            )}
                        </Space>
                    }
                    extra="Example: https://www.linkedin.com/jobs/view/123456"
                    rules={[
                        {
                            validator(_, value) {
                                if (!value) return Promise.resolve();
                                return isValidHttpUrl(value)
                                    ? Promise.resolve()
                                    : Promise.reject(
                                          new Error(
                                              "Please enter a valid http(s) URL",
                                          ),
                                      );
                            },
                        },
                    ]}
                >
                    <Input
                        placeholder="https://..."
                        size="large"
                        allowClear
                        addonAfter={
                            <Button
                                type="link"
                                size="small"
                                icon={<EyeOutlined />}
                                disabled={!referenceUrlValid}
                                onClick={() => {
                                    const url =
                                        form.getFieldValue("reference_url");
                                    if (isValidHttpUrl(url)) {
                                        window.open(
                                            url,
                                            "_blank",
                                            "noopener,noreferrer",
                                        );
                                    }
                                }}
                                style={{ padding: 0 }}
                            >
                                View Reference
                            </Button>
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="verification_notes"
                    label="Verification Notes"
                    extra="Optional: add any context that helps verify this job is legitimate."
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="e.g., Posted on the official LinkedIn page of the company on Jan 5."
                        showCount
                        maxLength={1000}
                    />
                </Form.Item>

                <div style={{ marginTop: 8 }}>
                    {referenceUrlValid === true ? (
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                            Verified Reference Provided
                        </Tag>
                    ) : (
                        <Tag color="orange" icon={<WarningOutlined />}>
                            Reference Not Provided
                        </Tag>
                    )}
                </div>
            </Form>
        </Modal>
    );
}
