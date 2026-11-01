import React from "react";
import { CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import {
    Alert,
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    Row,
    Space,
    Typography,
} from "antd";
import { COLORS } from "~/config/theme";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";

const { Title, Text } = Typography;

export default function ReviewSubmitStep() {
    const {
        profileImage,
        idDocuments,
        handlePreview,
        setIsPrivacyModalOpen,
        setIsTermsModalOpen,
    } = useRegistrationContext();

    return (
        <div className="form-step">
            <Title level={3}>Review & Submit</Title>
            <Text type="secondary">
                Please review your information before submitting
            </Text>

            <Divider />

            <Alert
                message="Almost Done!"
                description="Please review all your information carefully. Once submitted, you'll be able to update your profile later."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />

            {/* Document Status Check */}
            <div className="document-status-check">
                <Space direction="vertical" style={{ width: "100%" }}>
                    <div className="status-item">
                        <CheckCircleOutlined
                            style={{
                                color: profileImage
                                    ? "var(--success)"
                                    : "var(--border-strong)",
                            }}
                        />
                        <Text>
                            Profile Photo{" "}
                            {profileImage ? "Uploaded" : "Required"}
                        </Text>
                    </div>
                    <div className="status-item">
                        <CheckCircleOutlined
                            style={{
                                color:
                                    idDocuments.length > 0
                                        ? "var(--success)"
                                        : "var(--border-strong)",
                            }}
                        />
                        <Text>
                            ID Documents{" "}
                            {idDocuments.length > 0 ? "Uploaded" : "Required"}
                        </Text>
                    </div>
                </Space>
            </div>

            <Divider />

            <div className="review-section">
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => {
                        handlePreview();
                    }}
                    size="large"
                    disabled={!profileImage || idDocuments.length === 0}
                >
                    Preview Full Application
                </Button>
                {(!profileImage || idDocuments.length === 0) && (
                    <Text
                        type="danger"
                        style={{ display: "block", marginTop: 8 }}
                    >
                        Please upload both profile photo and at least one ID
                        document to continue
                    </Text>
                )}
            </div>

            <Divider />

            <Row gutter={[24, 16]}>
                <Col xs={24}>
                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                required: true,
                                message: "Please agree to the terms",
                            },
                        ]}
                    >
                        <Checkbox>
                            I confirm that all information provided is accurate
                            and truthful. I agree to the{" "}
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsPrivacyModalOpen(true);
                                }}
                                style={{
                                    marginLeft: 4,
                                    cursor: "pointer",
                                    color: "var(--danger)",
                                    textDecoration: "underline",
                                }}
                            >
                                Privacy Policy
                            </a>{" "}
                            and{" "}
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsTermsModalOpen(true);
                                }}
                                style={{
                                    marginLeft: 4,
                                    cursor: "pointer",
                                    color: "var(--danger)",
                                    textDecoration: "underline",
                                }}
                            >
                                Terms of Service
                            </a>
                            .
                        </Checkbox>
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item name="newsletter" valuePropName="checked">
                        <Checkbox>
                            I would like to receive updates about alumni events,
                            news, and opportunities
                        </Checkbox>
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item name="contactPermission" valuePropName="checked">
                        <Checkbox>
                            I give permission to be contacted by the university
                            and other alumni for networking opportunities
                        </Checkbox>
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
}
