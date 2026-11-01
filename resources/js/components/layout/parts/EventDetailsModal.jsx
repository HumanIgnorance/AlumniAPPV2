import React from "react";
import { CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import { Button, Col, Image, Modal, Row, Space, Spin, Typography } from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import { formatEventTime } from "~/components/layout/utils/notificationUtils";
import { COLORS } from "~/config/theme";

const { Text, Title } = Typography;

export default function EventDetailsModal() {
    const {
        selectedEventDetails,
        currentTheme,
        eventDetailsModalVisible,
        setEventDetailsModalVisible,
        setSelectedEventDetails,
        history,
        eventDetailsLoading,
    } = useLayoutContext();

    if (!selectedEventDetails) return null;
    const isDark = currentTheme === "black";

    return (
        <Modal
            title={
                <Space>
                    <CalendarOutlined style={{ color: COLORS.antdBlue }} />
                    <span>{selectedEventDetails.title}</span>
                </Space>
            }
            open={eventDetailsModalVisible}
            onCancel={() => {
                setEventDetailsModalVisible(false);
                setSelectedEventDetails(null);
            }}
            footer={[
                <Button
                    key="close"
                    onClick={() => {
                        setEventDetailsModalVisible(false);
                        setSelectedEventDetails(null);
                    }}
                >
                    Close
                </Button>,
                <Button
                    key="viewAll"
                    type="primary"
                    onClick={() => {
                        setEventDetailsModalVisible(false);
                        history.push("/events");
                    }}
                >
                    Go to Events Page
                </Button>,
            ]}
            width={700}
        >
            <Spin spinning={eventDetailsLoading}>
                {selectedEventDetails && (
                    <div>
                        {selectedEventDetails.image_urls &&
                            selectedEventDetails.image_urls.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <Image
                                        src={
                                            selectedEventDetails
                                                .image_urls[0] ||
                                            "/placeholder.svg"
                                        }
                                        alt={selectedEventDetails.title}
                                        style={{
                                            width: "100%",
                                            maxHeight: 300,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                        }}
                                        fallback="/community-event.png"
                                    />
                                </div>
                            )}

                        <div
                            className="theme-card-bg"
                            style={{
                                padding: 16,
                                borderRadius: 8,
                                marginBottom: 16,
                            }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Space>
                                        <CalendarOutlined
                                            style={{ color: COLORS.antdBlue }}
                                        />
                                        <div>
                                            <Text
                                                className="theme-text-secondary"
                                                style={{
                                                    display: "block",
                                                    fontSize: 12,
                                                }}
                                            >
                                                Date
                                            </Text>
                                            <Text strong>
                                                {new Date(
                                                    selectedEventDetails.date,
                                                ).toLocaleDateString()}
                                            </Text>
                                        </div>
                                    </Space>
                                </Col>
                                <Col span={12}>
                                    <Space>
                                        <span style={{ fontSize: 16 }}>🕐</span>
                                        <div>
                                            <Text
                                                className="theme-text-secondary"
                                                style={{
                                                    display: "block",
                                                    fontSize: 12,
                                                }}
                                            >
                                                Time
                                            </Text>
                                            <Text strong>
                                                {formatEventTime(
                                                    selectedEventDetails.start_time,
                                                )}{" "}
                                                -{" "}
                                                {formatEventTime(
                                                    selectedEventDetails.end_time,
                                                )}
                                            </Text>
                                        </div>
                                    </Space>
                                </Col>
                                <Col span={12}>
                                    <Space>
                                        <span style={{ fontSize: 16 }}>📍</span>
                                        <div>
                                            <Text
                                                className="theme-text-secondary"
                                                style={{
                                                    display: "block",
                                                    fontSize: 12,
                                                }}
                                            >
                                                Location
                                            </Text>
                                            <Text strong>
                                                {selectedEventDetails.location}
                                            </Text>
                                        </div>
                                    </Space>
                                </Col>
                                <Col span={12}>
                                    <Space>
                                        <TeamOutlined
                                            style={{ color: COLORS.antdGreen }}
                                        />
                                        <div>
                                            <Text
                                                className="theme-text-secondary"
                                                style={{
                                                    display: "block",
                                                    fontSize: 12,
                                                }}
                                            >
                                                Capacity
                                            </Text>
                                            <Text strong>
                                                {selectedEventDetails.registered_count ||
                                                    0}{" "}
                                                /{" "}
                                                {selectedEventDetails.capacity}
                                            </Text>
                                        </div>
                                    </Space>
                                </Col>
                            </Row>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <Title level={5}>Description</Title>
                            <Text>{selectedEventDetails.description}</Text>
                        </div>

                        <div>
                            <Text className="theme-text-secondary">
                                Organized by:{" "}
                            </Text>
                            <Text strong>{selectedEventDetails.organizer}</Text>
                        </div>
                    </div>
                )}
            </Spin>
        </Modal>
    );
}
