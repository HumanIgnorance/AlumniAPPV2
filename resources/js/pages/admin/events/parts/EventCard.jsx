import { useState } from "react";
import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, EnvironmentOutlined, ExclamationCircleOutlined, EyeOutlined, MoreOutlined, TeamOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Avatar, Badge, Card, Carousel, Divider, Dropdown, Menu, Modal, Progress, Space, Tag, Tooltip, Typography, message } from "antd";
import moment from "moment";
import { ROLES } from "~/config/roles";
import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";
import { getCategoryLabel, getEventTypeConfig, getStatusTag } from "~/pages/admin/events/parts/eventHelpers";
import { RegistrationsModal } from "~/pages/admin/events/parts/RegistrationsModal";
import { getUserRole } from "~/utils/session";

const { Title, Paragraph, Text } = Typography;

export const EventCard = ({ event, showEventDetails, onEdit, onDelete }) => {
    const isTouchDevice = useIsTouchDevice();
    const role = getUserRole();
    const [registrationsModalVisible, setRegistrationsModalVisible] =
        useState(false);

    const handleMenuClick = ({ key }) => {
        if (key === "delete") {
            Modal.confirm({
                title: "Delete Event",
                icon: <ExclamationCircleOutlined />,
                content:
                    "Are you sure you want to delete this event? This action cannot be undone.",
                okText: "Yes, Delete",
                okType: "danger",
                cancelText: "Cancel",
                onOk() {
                    onDelete(event);
                },
            });
        } else if (key === "edit") {
            if (event.status === "ongoing" || event.status === "completed") {
                message.warning("Cannot edit ongoing or completed events");
                return;
            }
            onEdit(event);
        } else if (key === "registrations") {
            setRegistrationsModalVisible(true);
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                disabled={
                    event.status === "ongoing" || event.status === "completed"
                }
            >
                Edit Event
            </Menu.Item>
            <Menu.Item key="registrations" icon={<UsergroupAddOutlined />}>
                View Registrations
            </Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                Delete Event
            </Menu.Item>
        </Menu>
    );

    const registeredCount = event.registered_count || event.registered || 0;
    const capacity = event.capacity || 0;

    return (
        <>
            <Badge.Ribbon
                text="Featured"
                color="red"
                style={{ display: event.featured ? "block" : "none" }}
            >
                <Card
                    className={`event-card ${event.featured ? "has-featured" : ""}`}
                    cover={(() => {
                        const imageUrls =
                            event.image_urls?.filter(Boolean) || [];
                        return (
                            <div className="event-cover">
                                {imageUrls.length === 0 ? (
                                    <div className="event-cover-placeholder">
                                        <CalendarOutlined
                                            style={{
                                                fontSize: 40,
                                                color: "#adb5bd",
                                            }}
                                        />
                                    </div>
                                ) : imageUrls.length === 1 ? (
                                    <img
                                        alt={event.title}
                                        src={imageUrls[0]}
                                        className="event-cover-img"
                                        loading="lazy"
                                    />
                                ) : (
                                    <Carousel
                                        autoplay
                                        dots={false}
                                        effect="fade"
                                        autoplaySpeed={3000}
                                        className="event-card-carousel"
                                    >
                                        {imageUrls.map((img, i) => (
                                            <div
                                                key={i}
                                                className="event-card-carousel-slide"
                                            >
                                                <img
                                                    alt={`${event.title} - ${i + 1}`}
                                                    src={img}
                                                    className="event-cover-img"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                )}
                                <div className="event-cover-overlay" />
                                <div className="event-status-badge">
                                    {getStatusTag(event.status)}
                                </div>
                            </div>
                        );
                    })()}
                    actions={[
                        <Tooltip
                            title="View Details"
                            key="view"
                            trigger={isTouchDevice ? [] : ["hover"]}
                            open={isTouchDevice ? false : undefined}
                        >
                            <EyeOutlined
                                onClick={() => showEventDetails(event)}
                            />
                        </Tooltip>,
                        ...(role === ROLES.ADMIN
                            ? [
                                  <Tooltip
                                      title={`${registeredCount} Registered`}
                                      key="registrations"
                                      trigger={
                                          isTouchDevice ? [] : ["hover"]
                                      }
                                      open={
                                          isTouchDevice ? false : undefined
                                      }
                                  >
                                      <Badge
                                          count={registeredCount}
                                          size="small"
                                          offset={[5, 0]}
                                      >
                                          <UsergroupAddOutlined
                                              onClick={() =>
                                                  setRegistrationsModalVisible(
                                                      true,
                                                  )
                                              }
                                          />
                                      </Badge>
                                  </Tooltip>,
                                  <Dropdown
                                      overlay={menu}
                                      trigger={["click"]}
                                      key="more"
                                  >
                                      <MoreOutlined />
                                  </Dropdown>,
                              ]
                            : []),
                    ]}
                >
                    <div className="event-card-content">
                        <div className="event-header">
                            <Title level={4} className="event-title">
                                {event.title}
                            </Title>
                        </div>

                        <Paragraph
                            ellipsis={{ rows: 2 }}
                            className="event-description"
                        >
                            {event.description}
                        </Paragraph>

                        <div className="event-organizer">
                            <Avatar size="large" src="/images/avatar.jpg" />
                            <Text type="secondary">
                                Hosted by {event.organizer}
                            </Text>
                        </div>

                        <Divider />

                        <div style={{ marginBottom: 12 }}>
                            <Space size={4} wrap>
                                <Tag
                                    color={
                                        getEventTypeConfig(
                                            event.eventType || event.event_type,
                                        ).color
                                    }
                                    style={{ fontSize: 10 }}
                                >
                                    {
                                        getEventTypeConfig(
                                            event.eventType || event.event_type,
                                        ).label
                                    }
                                </Tag>

                                <Tag color="blue" style={{ fontSize: 10 }}>
                                    {getCategoryLabel(event.category)}
                                </Tag>
                            </Space>
                        </div>

                        <div className="event-details">
                            <div className="detail-item">
                                <CalendarOutlined />
                                <Text>
                                    {moment(event.date).format("MMM DD, YYYY")}
                                </Text>
                            </div>
                            <div className="detail-item">
                                <ClockCircleOutlined />
                                <Text>
                                    {moment(event.start_time, "HH:mm").format(
                                        "hh:mm A",
                                    )}{" "}
                                    -
                                    {moment(event.end_time, "HH:mm").format(
                                        "hh:mm A",
                                    )}
                                </Text>
                            </div>
                            <div className="detail-item">
                                <EnvironmentOutlined />
                                <Text ellipsis={{ tooltip: event.location }}>
                                    {event.location}
                                </Text>
                            </div>
                            <div className="detail-item">
                                <TeamOutlined />
                                <Text>
                                    {registeredCount} / {capacity} registered
                                </Text>
                            </div>
                        </div>

                        <div style={{ marginTop: 12, marginBottom: 12 }}>
                            <Progress
                                percent={Math.round(
                                    (registeredCount / capacity) * 100,
                                )}
                                size="small"
                                status={
                                    registeredCount >= capacity
                                        ? "exception"
                                        : "active"
                                }
                                showInfo={false}
                            />
                        </div>

                        <div className="event-pricing">
                            <Text strong className="regular-price">
                                {Number.parseFloat(event.price) === 0
                                    ? "FREE"
                                    : `₱${Number(event.price).toLocaleString()}`}
                            </Text>
                        </div>

                        <div className="event-tags">
                            {event.tags.map((tag) => (
                                <Tag key={tag} className="event-tag">
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                    </div>
                </Card>
            </Badge.Ribbon>

            <RegistrationsModal
                event={event}
                visible={registrationsModalVisible}
                onClose={() => setRegistrationsModalVisible(false)}
            />
        </>
    );
};
