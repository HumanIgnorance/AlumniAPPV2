import { Modal, Space, Button, message, Alert } from "antd";
import {
    MailFilled,
    CopyOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import {
    Text,
    Title,
} from "~/pages/admin/events/event-details-modal/parts/eventDetailsModalShared";
import { useEventDetailsModalContext } from "~/pages/admin/events/event-details-modal/EventDetailsModalContext";

export default function EventDetailsModalModalBlock() {
    const { emailModalVisible, setEmailModalVisible, contactInfo } =
        useEventDetailsModalContext();

    return (
        <Modal
            title={
                <Space>
                    <MailFilled
                        style={{
                            color: "var(--success, #22c55e)",
                            fontSize: "20px",
                        }}
                    />
                    <span>Contact via Email</span>
                </Space>
            }
            open={emailModalVisible}
            onCancel={() => setEmailModalVisible(false)}
            footer={[
                <Button
                    key="copy"
                    icon={<CopyOutlined />}
                    onClick={() => {
                        navigator.clipboard.writeText(contactInfo.email);
                        message.success("Email copied to clipboard!");
                    }}
                >
                    Copy Email
                </Button>,
                <Button key="close" onClick={() => setEmailModalVisible(false)}>
                    Close
                </Button>,
                <Button
                    key="email"
                    type="primary"
                    icon={<MailFilled />}
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Send Email
                </Button>,
            ]}
        >
            <div style={{ padding: "20px 0" }}>
                <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                >
                    <div>
                        <Text type="secondary">Contact Person</Text>
                        <Title level={4} style={{ margin: "8px 0" }}>
                            {contactInfo.title}
                        </Title>
                    </div>
                    <div>
                        <Text type="secondary">Email Address</Text>
                        <Title
                            level={4}
                            style={{
                                margin: "8px 0",
                                color: "var(--success, #22c55e)",
                            }}
                        >
                            {contactInfo.email}
                        </Title>
                    </div>
                    <Alert
                        message="Response Time"
                        description="We typically respond within 24-48 hours during business days."
                        type="success"
                        showIcon
                        icon={<InfoCircleOutlined />}
                    />
                </Space>
            </div>
        </Modal>
    );
}
