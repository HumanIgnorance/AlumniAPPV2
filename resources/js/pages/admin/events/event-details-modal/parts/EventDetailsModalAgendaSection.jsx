import { Card, List, Row, Col, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Text } from "~/pages/admin/events/event-details-modal/parts/eventDetailsModalShared";
import { useEventDetailsModalContext } from "~/pages/admin/events/event-details-modal/EventDetailsModalContext";

export default function EventDetailsModalAgendaSection() {
    const { event } = useEventDetailsModalContext();

    return (
        <>
            {event.agenda && (
                <Card title="Event Agenda" className="agenda-card">
                    <List
                        dataSource={
                            typeof event.agenda === "string"
                                ? event.agenda.split("\n")
                                : event.agenda
                        }
                        renderItem={(item, index) => {
                            const hasTimeFormat = item.includes(" - ");
                            const timePart = hasTimeFormat
                                ? item.split(" - ")[0]
                                : `Item ${index + 1}`;
                            const contentPart = hasTimeFormat
                                ? item.split(" - ")[1]
                                : item;

                            return (
                                <List.Item className="agenda-item">
                                    <div className="agenda-time">
                                        <Text strong>{timePart}</Text>
                                    </div>
                                    <div className="agenda-content">
                                        <Text>{contentPart}</Text>
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                </Card>
            )}

            {/* Speakers Section */}
            {event.speakers && (
                <Card title="Featured Speakers" className="speakers-card">
                    <Row gutter={[16, 16]}>
                        {event.speakers.map((speaker, index) => (
                            <Col span={8} key={index}>
                                <div className="speaker-card">
                                    <Avatar size={64} icon={<UserOutlined />} />
                                    <div className="speaker-info">
                                        <Text strong>{speaker.name}</Text>
                                        <Text type="secondary">
                                            {speaker.role}
                                        </Text>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card>
            )}
        </>
    );
}
