import React from "react";
import { Card, Col, Row, Typography } from "antd";
import Button from "~/components/shared/AsyncButton";
import { ROLES } from "~/config/roles";
import { useEventsContext } from "~/pages/admin/events/EventsContext";
import { EventCard } from "~/pages/admin/events/parts/EventCard";

const { Title, Text } = Typography;

export default function EventsDisplay() {
    const {
        isLoading,
        filteredAndSortedEvents,
        role,
        clearAllFilters,
        showEventDetails,
        handleEditEvent,
        handleDeleteEvent,
    } = useEventsContext();

    return (
        <div className="events-display">
            {isLoading ? null : filteredAndSortedEvents.length === 0 ? (
                <Card className="no-events-card">
                    <div className="no-events-content">
                        <Title level={3}>No events found</Title>
                        <Text type="secondary">
                            {role === ROLES.ADMIN
                                ? "Try adjusting your filters or create a new event to get started."
                                : "No events found at the moment. Only the Guidance Counselor (Administrator) is authorized to create events. If you would like to request an event, please message the Guidance Counselor with complete event details for review and approval, or visit the Guidance Counselor for further assistance."}
                        </Text>
                        <br />
                        <Button type="primary" onClick={clearAllFilters}>
                            Clear All Filters
                        </Button>
                    </div>
                </Card>
            ) : (
                <Row gutter={[24, 24]}>
                    {filteredAndSortedEvents.map((event) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={event.id}>
                            <EventCard
                                event={event}
                                showEventDetails={(event) =>
                                    showEventDetails(event)
                                }
                                onEdit={handleEditEvent}
                                onDelete={handleDeleteEvent}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
