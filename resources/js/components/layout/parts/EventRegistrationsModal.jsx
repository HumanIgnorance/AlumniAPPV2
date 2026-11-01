import React from "react";
import { TeamOutlined } from "@ant-design/icons";
import {
    Badge,
    Button,
    Col,
    List,
    Modal,
    Row,
    Space,
    Spin,
    Typography,
} from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import { COLORS } from "~/config/theme";

const { Text } = Typography;

export default function EventRegistrationsModal() {
    const {
        currentTheme,
        selectedEventForRegistrations,
        eventRegistrationsModalVisible,
        setEventRegistrationsModalVisible,
        setSelectedEventForRegistrations,
        setEventRegistrations,
        history,
        eventRegistrationsLoading,
        eventRegistrations,
    } = useLayoutContext();

    const isDark = currentTheme === "black";
    return (
        <Modal
            title={
                <Space>
                    <TeamOutlined style={{ color: COLORS.antdBlue }} />
                    <span>
                        Event Registrations:{" "}
                        {selectedEventForRegistrations?.title}
                    </span>
                </Space>
            }
            open={eventRegistrationsModalVisible}
            onCancel={() => {
                setEventRegistrationsModalVisible(false);
                setSelectedEventForRegistrations(null);
                setEventRegistrations([]);
            }}
            footer={[
                <Button
                    key="close"
                    onClick={() => {
                        setEventRegistrationsModalVisible(false);
                        setSelectedEventForRegistrations(null);
                        setEventRegistrations([]);
                    }}
                >
                    Close
                </Button>,
                <Button
                    key="viewAll"
                    type="primary"
                    onClick={() => {
                        setEventRegistrationsModalVisible(false);
                        history.push("/events");
                    }}
                >
                    Go to Events Page
                </Button>,
            ]}
            width={900}
        >
            <Spin spinning={eventRegistrationsLoading}>
                {selectedEventForRegistrations && (
                    <div
                        className="theme-card-bg"
                        style={{
                            marginBottom: 16,
                            padding: 16,
                            borderRadius: 8,
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text className="theme-text-secondary">
                                    Event Date:
                                </Text>
                                <Text strong style={{ display: "block" }}>
                                    {new Date(
                                        selectedEventForRegistrations.date,
                                    ).toLocaleDateString()}
                                </Text>
                            </Col>
                            <Col span={12}>
                                <Text className="theme-text-secondary">
                                    Location:
                                </Text>
                                <Text strong style={{ display: "block" }}>
                                    {selectedEventForRegistrations.location}
                                </Text>
                            </Col>
                        </Row>
                    </div>
                )}
                <List
                    dataSource={eventRegistrations}
                    locale={{ emptyText: "No registrations yet" }}
                    renderItem={(registration, index) => (
                        <List.Item
                            className={`registration-list-item ${registration.isHighlighted ? "highlighted" : ""}`}
                            style={{
                                padding: "12px 16px",
                            }}
                        >
                            <List.Item.Meta
                                title={
                                    <Space>
                                        <Text strong>
                                            {registration.alumni?.name || "N/A"}
                                        </Text>
                                        {registration.isHighlighted && (
                                            <Badge
                                                color={COLORS.antdBlue}
                                                text="Just Registered"
                                                style={{ fontSize: 11 }}
                                            />
                                        )}
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={0}>
                                        <Text
                                            className="theme-text-secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Email:{" "}
                                            {registration.alumni?.email ||
                                                "N/A"}
                                        </Text>
                                        <Text
                                            className="theme-text-secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Contact:{" "}
                                            {registration.alumni
                                                ?.contact_number || "N/A"}
                                        </Text>
                                        <Text
                                            className="theme-text-secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Batch Year:{" "}
                                            {registration.alumni?.batch_year ||
                                                "N/A"}
                                        </Text>
                                    </Space>
                                }
                            />
                            <div>
                                <Text
                                    className="theme-text-secondary"
                                    style={{ fontSize: 11 }}
                                >
                                    Registered:{" "}
                                    {registration.registration_date
                                        ? new Date(
                                              registration.registration_date,
                                          ).toLocaleString()
                                        : new Date(
                                              registration.created_at,
                                          ).toLocaleString()}
                                </Text>
                            </div>
                        </List.Item>
                    )}
                />
            </Spin>
        </Modal>
    );
}
