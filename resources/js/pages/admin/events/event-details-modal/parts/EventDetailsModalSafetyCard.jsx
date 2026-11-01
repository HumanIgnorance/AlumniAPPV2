import { Card, Tooltip, Space, Alert } from "antd";
import {
    SafetyCertificateOutlined,
    HeartOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { Text } from "~/pages/admin/events/event-details-modal/parts/eventDetailsModalShared";
import { useEventDetailsModalContext } from "~/pages/admin/events/event-details-modal/EventDetailsModalContext";

export default function EventDetailsModalSafetyCard() {
    const { isTouchDevice } = useEventDetailsModalContext();

    return (
        <Card
            title="Safety & Guidelines"
            className="safety-card"
            extra={
                <Tooltip
                    title="All safety measures are strictly enforced"
                    trigger={isTouchDevice ? [] : ["hover"]}
                    open={isTouchDevice ? false : undefined}
                >
                    <SafetyCertificateOutlined
                        style={{
                            color: "var(--success, #22c55e)",
                            fontSize: "16px",
                        }}
                    />
                </Tooltip>
            }
        >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {/* Health & Hygiene */}
                <div className="guideline-category">
                    <div className="category-header">
                        <HeartOutlined
                            style={{
                                color: "var(--danger, #ef4444)",
                            }}
                        />
                        <Text strong>Health & Hygiene</Text>
                    </div>
                    <div className="guideline-item">
                        <CheckCircleOutlined
                            style={{
                                color: "var(--success, #22c55e)",
                            }}
                        />
                        <Text>Hand sanitizing stations throughout venue</Text>
                    </div>
                    <div className="guideline-item">
                        <CheckCircleOutlined
                            style={{
                                color: "var(--success, #22c55e)",
                            }}
                        />
                        <Text>Enhanced cleaning between sessions</Text>
                    </div>
                    <div className="guideline-item">
                        <CheckCircleOutlined
                            style={{
                                color: "var(--success, #22c55e)",
                            }}
                        />
                        <Text>Medical staff and first aid available</Text>
                    </div>
                </div>

                {/* Security */}
                <div className="guideline-category">
                    <div className="category-header">
                        <SafetyCertificateOutlined
                            style={{
                                color: "var(--accent, #4f46e5)",
                            }}
                        />
                        <Text strong>Security & Safety</Text>
                    </div>
                    <div className="guideline-item">
                        <CheckCircleOutlined
                            style={{
                                color: "var(--success, #22c55e)",
                            }}
                        />
                        <Text>Professional security personnel on duty</Text>
                    </div>
                    <div className="guideline-item">
                        <CheckCircleOutlined
                            style={{
                                color: "var(--success, #22c55e)",
                            }}
                        />
                        <Text>Bag checks and metal detection at entrance</Text>
                    </div>
                    <div className="guideline-item">
                        <CheckCircleOutlined
                            style={{
                                color: "var(--success, #22c55e)",
                            }}
                        />
                        <Text>Emergency evacuation procedures in place</Text>
                    </div>
                </div>

                {/* Additional Notes */}
                <Alert
                    message="Important Notice"
                    description="By attending this event, you agree to comply with all safety guidelines."
                    type="warning"
                    showIcon
                    closable
                />
            </Space>
        </Card>
    );
}
