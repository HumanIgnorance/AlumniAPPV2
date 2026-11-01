import { Card, Tag, Space, Button, Divider, Avatar, Tooltip } from "antd";
import { ROLES } from "~/config/roles";
import {
    CheckCircleOutlined,
    PhoneFilled,
    MailFilled,
    MessageOutlined,
} from "@ant-design/icons";
import {
    Title,
    Text,
} from "~/pages/admin/events/event-details-modal/parts/eventDetailsModalShared";
import { useEventDetailsModalContext } from "~/pages/admin/events/event-details-modal/EventDetailsModalContext";

export default function EventDetailsModalPricingRegistrationCard() {
    const {
        event,
        isEarlyBirdAvailable,
        role,
        isRegistered,
        handleCancelRegistration,
        handleRegister,
        isFull,
        isLoadingRegistrationStatus,
        isRegistering,
        isTouchDevice,
        setPhoneModalVisible,
        setEmailModalVisible,
        setMessengerModalVisible,
    } = useEventDetailsModalContext();

    return (
        <Card className="pricing-card">
            <div className="pricing-header">
                <Title level={3} style={{ margin: 0 }}>
                    {event.price === 0
                        ? "FREE"
                        : `₱${Number(event.price).toLocaleString()}`}
                </Title>

                {event.earlyBirdPrice && isEarlyBirdAvailable(event) && (
                    <div className="early-bird-pricing">
                        <Text delete type="secondary">
                            ₱{Number(event.price).toLocaleString()}
                        </Text>

                        <Text
                            strong
                            style={{
                                color: "var(--danger, #ef4444)",
                                fontSize: "20px",
                            }}
                        >
                            ₱{Number(event.earlyBirdPrice).toLocaleString()}
                        </Text>

                        <Tag color="red">Early Bird</Tag>
                    </div>
                )}
            </div>

            {role === ROLES.ALUMNI && event.status === "upcoming" && (
                <>
                    {isRegistered ? (
                        <Space
                            direction="vertical"
                            style={{
                                width: "100%",
                                marginTop: 16,
                            }}
                        >
                            <Button
                                type="primary"
                                size="large"
                                block
                                icon={<CheckCircleOutlined />}
                                style={{
                                    background: "var(--success, #22c55e)",
                                    borderColor: "var(--success, #22c55e)",
                                }}
                                disabled
                            >
                                Registered
                            </Button>
                            <Button
                                type="default"
                                size="large"
                                block
                                danger
                                onClick={handleCancelRegistration}
                            >
                                Cancel Registration
                            </Button>
                        </Space>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={handleRegister}
                            disabled={isFull || isLoadingRegistrationStatus}
                            loading={isRegistering}
                            className="register-btn"
                            style={{ marginTop: 16 }}
                        >
                            {isFull ? "Fully Booked" : "Register Now"}
                        </Button>
                    )}
                </>
            )}

            {isFull && !isRegistered && (
                <Text
                    type="danger"
                    style={{
                        textAlign: "center",
                        display: "block",
                        marginTop: 8,
                    }}
                >
                    This event is fully booked
                </Text>
            )}

            <Divider />

            <div className="event-organizer-detailed">
                <div className="organizer-header">
                    <Avatar size="large" src="/images/avatar.jpg" />

                    <div className="organizer-info">
                        <Text strong>Hosted by {event.organizer}</Text>
                        <Text type="secondary">Event Organizer</Text>
                    </div>
                </div>
                <div className="organizer-actions">
                    <Tooltip
                        title="Call"
                        trigger={isTouchDevice ? [] : ["hover"]}
                        open={isTouchDevice ? false : undefined}
                    >
                        <Button
                            type="text"
                            icon={<PhoneFilled />}
                            size="small"
                            onClick={() => setPhoneModalVisible(true)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Email"
                        trigger={isTouchDevice ? [] : ["hover"]}
                        open={isTouchDevice ? false : undefined}
                    >
                        <Button
                            type="text"
                            icon={<MailFilled />}
                            size="small"
                            onClick={() => setEmailModalVisible(true)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Message"
                        trigger={isTouchDevice ? [] : ["hover"]}
                        open={isTouchDevice ? false : undefined}
                    >
                        <Button
                            type="text"
                            icon={<MessageOutlined />}
                            size="small"
                            onClick={() => setMessengerModalVisible(true)}
                        />
                    </Tooltip>
                </div>
            </div>
        </Card>
    );
}
