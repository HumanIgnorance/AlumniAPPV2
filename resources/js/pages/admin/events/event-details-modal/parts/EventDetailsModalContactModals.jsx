import { Modal, Space, Button, Alert } from "antd";
import {
    PhoneFilled,
    PhoneOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import {
    Text,
    Title,
} from "~/pages/admin/events/event-details-modal/parts/eventDetailsModalShared";
import { useEventDetailsModalContext } from "~/pages/admin/events/event-details-modal/EventDetailsModalContext";

export default function EventDetailsModalContactModals() {
    const { phoneModalVisible, setPhoneModalVisible, contactInfo } =
        useEventDetailsModalContext();

    return (
        <Modal
            title={
                <Space>
                    <PhoneFilled
                        style={{
                            color: "var(--accent, #4f46e5)",
                            fontSize: "20px",
                        }}
                    />
                    <span>Contact via Phone</span>
                </Space>
            }
            open={phoneModalVisible}
            onCancel={() => setPhoneModalVisible(false)}
            footer={[
                <Button key="close" onClick={() => setPhoneModalVisible(false)}>
                    Close
                </Button>,
                <Button
                    key="call"
                    type="primary"
                    icon={<PhoneOutlined />}
                    href={`tel:${contactInfo.phone}`}
                >
                    Call Now
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
                        <Text type="secondary">Phone Number</Text>
                        <Title
                            level={3}
                            style={{
                                margin: "8px 0",
                                color: "var(--accent, #4f46e5)",
                            }}
                        >
                            {contactInfo.phone}
                        </Title>
                    </div>
                    <Alert
                        message="Available Hours"
                        description="Monday - Friday: 8:00 AM - 5:00 PM"
                        type="info"
                        showIcon
                        icon={<ClockCircleOutlined />}
                    />
                </Space>
            </div>
        </Modal>
    );
}
