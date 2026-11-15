import { Card, List, Row, Col, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Text } from "~/pages/admin/events/event-details-modal/parts/eventDetailsModalShared";
import { useEventDetailsModalContext } from "~/pages/admin/events/event-details-modal/EventDetailsModalContext";

export default function EventDetailsModalAgendaSection() {
    const { event } = useEventDetailsModalContext();

    // The API sends the agenda as one text block ("09:00 - Registration\n..."),
    // but tolerate arrays / objects / empty values so a odd record can never
    // crash the whole details modal (a crash here = "nothing happens").
    const agendaItems = (
        typeof event.agenda === "string"
            ? event.agenda.split("\n")
            : Array.isArray(event.agenda)
              ? event.agenda
              : []
    )
        .map((item) =>
            typeof item === "string"
                ? item.trim()
                : [item?.time, item?.title || item?.description]
                      .filter(Boolean)
                      .join(" - "),
        )
        .filter(Boolean);
    const speakers = Array.isArray(event.speakers) ? event.speakers : [];

    return (
        <>
            {agendaItems.length > 0 && (
                <Card title="Event Agenda" className="agenda-card">
                    <List
                        dataSource={agendaItems}
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
            {speakers.length > 0 && (
                <Card title="Featured Speakers" className="speakers-card">
                    <Row gutter={[16, 16]}>
                        {speakers.map((speaker, index) => (
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
