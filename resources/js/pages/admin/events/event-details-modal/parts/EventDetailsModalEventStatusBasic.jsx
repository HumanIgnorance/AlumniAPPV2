import { Card, Space, Tag, Divider, Row, Col, Progress, Button } from "antd";
import {
    getEventTypeConfig,
    getCategoryLabel,
    formatTimeDisplay,
} from "~/pages/admin/events/parts/eventHelpers";
import {
    TagOutlined,
    StarOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { COLORS } from "~/config/theme";
import { ROLES } from "~/config/roles";
import {
    Paragraph,
    Text,
} from "~/pages/admin/events/event-details-modal/parts/eventDetailsModalShared";
import { useEventDetailsModalContext } from "~/pages/admin/events/event-details-modal/EventDetailsModalContext";

export default function EventDetailsModalEventStatusBasic() {
    const {
        event,
        registeredCount,
        capacity,
        spotsRemaining,
        isFull,
        role,
        setRegistrationsModalVisible,
    } = useEventDetailsModalContext();

    return (
        <Card className="event-info-card">
            <Space size="middle" style={{ marginBottom: 16 }}>
                <Tag
                    color={
                        getEventTypeConfig(event.eventType || event.event_type)
                            .color
                    }
                    icon={
                        getEventTypeConfig(event.eventType || event.event_type)
                            .icon
                    }
                >
                    {
                        getEventTypeConfig(event.eventType || event.event_type)
                            .label
                    }
                </Tag>
                <Tag icon={<TagOutlined />} color="blue">
                    {getCategoryLabel(event.category)}
                </Tag>
                {event.featured && (
                    <Tag icon={<StarOutlined />} color="gold">
                        Featured
                    </Tag>
                )}
            </Space>

            <Paragraph className="event-description-detailed">
                {event.description}
            </Paragraph>

            <Divider />

            {/* Event Details Grid */}
            <Row gutter={[16, 16]} className="event-details-grid">
                <Col span={12}>
                    <div className="detail-item-large">
                        <CalendarOutlined className="detail-icon" />
                        <div className="detail-content">
                            <Text strong>Date</Text>
                            <Text>
                                {moment(event.date).format(
                                    "dddd, MMMM DD, YYYY",
                                )}
                            </Text>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="detail-item-large">
                        <ClockCircleOutlined className="detail-icon" />
                        <div className="detail-content">
                            <Text strong>Time</Text>
                            <Text>
                                {formatTimeDisplay(
                                    event.startTime || event.start_time,
                                )}{" "}
                                -{" "}
                                {formatTimeDisplay(
                                    event.endTime || event.end_time,
                                )}
                            </Text>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="detail-item-large">
                        <EnvironmentOutlined className="detail-icon" />
                        <div className="detail-content">
                            <Text strong>Location</Text>
                            <Text>{event.location}</Text>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="detail-item-large">
                        <TeamOutlined className="detail-icon" />
                        <div className="detail-content">
                            <Text strong>Capacity</Text>
                            <Text>
                                {registeredCount} / {capacity} registered
                            </Text>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="registration-progress" style={{ marginTop: 20 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <Text strong>Registration Progress</Text>
                    <Text type="secondary">
                        {spotsRemaining} spots remaining
                    </Text>
                </div>
                <Progress
                    percent={Math.round((registeredCount / capacity) * 100)}
                    status={isFull ? "exception" : "active"}
                    strokeColor={{
                        from: COLORS.c108ee9,
                        to: isFull ? "var(--danger, #ef4444)" : COLORS.c87d068,
                    }}
                />
                {role === ROLES.ADMIN && (
                    <Button
                        type="link"
                        icon={<UsergroupAddOutlined />}
                        onClick={() => setRegistrationsModalVisible(true)}
                        style={{ padding: 0, marginTop: 8 }}
                    >
                        View All Registrations ({registeredCount})
                    </Button>
                )}
            </div>
        </Card>
    );
}
