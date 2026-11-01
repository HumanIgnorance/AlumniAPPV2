import { Modal, Space, Button, Alert } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import {
    Text,
    Title,
    Paragraph,
} from "~/pages/admin/events/event-details-modal/parts/eventDetailsModalShared";
import { useEventDetailsModalContext } from "~/pages/admin/events/event-details-modal/EventDetailsModalContext";

export default function EventDetailsModalModalBlock2() {
    const { messengerModalVisible, setMessengerModalVisible } =
        useEventDetailsModalContext();

    return (
        <Modal
            title={
                <Space>
                    <MessageOutlined
                        style={{ color: "#0084ff", fontSize: "20px" }}
                    />
                    <span>Contact Via Messages</span>
                </Space>
            }
            open={messengerModalVisible}
            onCancel={() => setMessengerModalVisible(false)}
            footer={[
                <Button
                    key="close"
                    onClick={() => setMessengerModalVisible(false)}
                >
                    Close
                </Button>,
                <Button
                    key="messenger"
                    type="primary"
                    size="large"
                    icon={<MessageOutlined />}
                    onClick={() => {
                        // Navigate to messages page
                        window.location.href = "/messages";
                    }}
                >
                    Open Messages
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
                            Guidance Counselor
                        </Title>
                    </div>
                    <div>
                        <Text type="secondary">Messages</Text>
                        <Paragraph style={{ margin: "8px 0" }}>
                            Click the button below to start a conversation on
                            Messages.
                        </Paragraph>
                    </div>
                    <Alert
                        message="Instant Messaging"
                        description="Get quick responses to your inquiries through Messages during office hours."
                        type="info"
                        showIcon
                        icon={<MessageOutlined />}
                    />
                </Space>
            </div>
        </Modal>
    );
}
