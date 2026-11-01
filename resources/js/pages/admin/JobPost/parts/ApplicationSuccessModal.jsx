import React from "react";
import {
    ClockCircleOutlined,
    MailOutlined,
    SendOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Modal, Result, Space, Typography } from "antd";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";

const { Title, Text, Paragraph } = Typography;

export default function ApplicationSuccessModal() {
    const {
        applicationSuccessModalVisible,
        setApplicationSuccessModalVisible,
        isMobile,
        setActiveTab,
    } = useJobPostContext();

    return (
        <Modal
            open={applicationSuccessModalVisible}
            footer={null}
            onCancel={() => setApplicationSuccessModalVisible(false)}
            width={isMobile ? "95%" : 520}
            style={{
                top: isMobile ? 8 : undefined,
                maxWidth: isMobile ? "95vw" : undefined,
                paddingBottom: 0,
            }}
            centered
            className="application-success-modal"
        >
            <Result
                status="success"
                icon={
                    <ClockCircleOutlined
                        style={{ color: COLORS.antdGold, fontSize: 72 }}
                    />
                }
                title={
                    <Title
                        level={3}
                        style={{ color: COLORS.c1a1a2e, marginBottom: 8 }}
                    >
                        Application Submitted - Pending Review
                    </Title>
                }
                subTitle={
                    <div style={{ textAlign: "left", marginTop: 16 }}>
                        <Card
                            style={{
                                background: COLORS.fffbe6,
                                borderColor: "#ffe58f",
                            }}
                        >
                            <Space
                                direction="vertical"
                                size="middle"
                                style={{ width: "100%" }}
                            >
                                <div>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: 16,
                                            display: "block",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <ClockCircleOutlined
                                            style={{
                                                marginRight: 8,
                                                color: COLORS.antdGold,
                                            }}
                                        />
                                        Response Time
                                    </Text>
                                    <Paragraph
                                        style={{
                                            margin: 0,
                                            fontSize: 14,
                                        }}
                                    >
                                        We typically respond within{" "}
                                        <Text strong>24-48 hours</Text> during
                                        business days. Please be patient while
                                        we review your application carefully.
                                    </Paragraph>
                                </div>

                                <Divider style={{ margin: "12px 0" }} />

                                <div>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: 16,
                                            display: "block",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <SendOutlined
                                            style={{
                                                marginRight: 8,
                                                color: COLORS.antdBlue,
                                            }}
                                        />
                                        What's Next?
                                    </Text>
                                    <Paragraph
                                        style={{
                                            margin: 0,
                                            fontSize: 14,
                                        }}
                                    >
                                        Please go to{" "}
                                        <Text
                                            strong
                                            style={{ color: COLORS.antdBlue }}
                                        >
                                            "My Applications"
                                        </Text>{" "}
                                        tab to see the status of your
                                        application. You will be able to check
                                        if you are{" "}
                                        <Text type="success">accepted</Text> or{" "}
                                        <Text type="danger">rejected</Text>.
                                    </Paragraph>
                                </div>

                                <Divider style={{ margin: "12px 0" }} />

                                <div>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: 16,
                                            display: "block",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <MailOutlined
                                            style={{
                                                marginRight: 8,
                                                color: COLORS.antdGreen,
                                            }}
                                        />
                                        Email Notification
                                    </Text>
                                    <Paragraph
                                        style={{
                                            margin: 0,
                                            fontSize: 14,
                                        }}
                                    >
                                        If you are{" "}
                                        <Text type="success" strong>
                                            accepted
                                        </Text>
                                        , you will receive an email notification
                                        with further details about the interview
                                        schedule and next steps. Please check
                                        your email regularly!
                                    </Paragraph>
                                </div>
                            </Space>
                        </Card>
                    </div>
                }
                extra={[
                    <Button
                        type="primary"
                        key="applications"
                        size="large"
                        icon={<SendOutlined />}
                        onClick={() => {
                            setApplicationSuccessModalVisible(false);
                            setActiveTab("my-applications");
                        }}
                    >
                        Go to My Applications
                    </Button>,
                    <Button
                        key="close"
                        size="large"
                        onClick={() => setApplicationSuccessModalVisible(false)}
                    >
                        Close
                    </Button>,
                ]}
            />
        </Modal>
    );
}
