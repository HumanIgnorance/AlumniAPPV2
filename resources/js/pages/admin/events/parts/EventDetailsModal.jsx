import { Menu, Modal, Dropdown, Button, Row, Col, Card, Tag } from "antd";
import {
    EditOutlined,
    UsergroupAddOutlined,
    DeleteOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import { ROLES } from "~/config/roles";
import { RegistrationsModal } from "~/pages/admin/events/parts/RegistrationsModal";
import { Title } from "~/pages/admin/events/event-details-modal/parts/eventDetailsModalShared";
import { EventDetailsModalProvider } from "~/pages/admin/events/event-details-modal/EventDetailsModalContext";
import useEventDetailsModalController from "~/pages/admin/events/event-details-modal/hooks/useEventDetailsModalController";
import EventDetailsModalImageGallery from "~/pages/admin/events/event-details-modal/parts/EventDetailsModalImageGallery";
import EventDetailsModalEventStatusBasic from "~/pages/admin/events/event-details-modal/parts/EventDetailsModalEventStatusBasic";
import EventDetailsModalAgendaSection from "~/pages/admin/events/event-details-modal/parts/EventDetailsModalAgendaSection";
import EventDetailsModalPricingRegistrationCard from "~/pages/admin/events/event-details-modal/parts/EventDetailsModalPricingRegistrationCard";
import EventDetailsModalSafetyCard from "~/pages/admin/events/event-details-modal/parts/EventDetailsModalSafetyCard";
import EventDetailsModalContactModals from "~/pages/admin/events/event-details-modal/parts/EventDetailsModalContactModals";
import EventDetailsModalModalBlock from "~/pages/admin/events/event-details-modal/parts/EventDetailsModalModalBlock";
import EventDetailsModalModalBlock2 from "~/pages/admin/events/event-details-modal/parts/EventDetailsModalModalBlock2";

export const EventDetailsModal = ({
    event,
    visible,
    onClose,
    onEdit,
    onDelete,
    onRefresh,
}) => {
    const ctx = useEventDetailsModalController({
        event,
        visible,
        onClose,
        onEdit,
        onDelete,
        onRefresh,
    });
    const {
        handleMenuClick,
        role,
        registrationsModalVisible,
        setRegistrationsModalVisible,
    } = ctx;

    if (!event) return null;

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
            {/* <Menu.Item key="duplicate" icon={<CopyOutlined />}>
        Duplicate Event
      </Menu.Item>
      <Menu.Divider /> */}
            {/* <Menu.Item key="share" icon={<ShareAltOutlined />}>
        Share Event
      </Menu.Item> */}
            <Menu.Item key="registrations" icon={<UsergroupAddOutlined />}>
                View Registrations
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                Delete Event
            </Menu.Item>
        </Menu>
    );

    const registeredCount = event.registered_count || event.registered || 0;
    const capacity = event.capacity || 0;
    const spotsRemaining = capacity - registeredCount;
    const isFull = registeredCount >= capacity;

    const pageCtx = {
        ...ctx,
        registeredCount,
        capacity,
        spotsRemaining,
        isFull,
    };

    return (
        <EventDetailsModalProvider value={pageCtx}>
            <>
                <Modal
                    title={
                        <div
                            className="event-detail-header"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingRight: "48px",
                            }}
                        >
                            <Title level={3} style={{ margin: 0 }}>
                                {event.title}
                            </Title>
                            <div className="event-header-actions">
                                {role === ROLES.ADMIN && (
                                    <Dropdown
                                        overlay={menu}
                                        trigger={["click"]}
                                    >
                                        <Button
                                            type="text"
                                            icon={<MoreOutlined />}
                                        />
                                    </Dropdown>
                                )}
                            </div>
                        </div>
                    }
                    open={visible}
                    onCancel={onClose}
                    footer={null}
                    width={1200}
                    className="event-details-modal"
                    afterOpenChange={(open) => {
                        if (open) {
                            // Fire a resize event AFTER the AntD modal zoom animation
                            // completes. React-slick listens to window resize and will
                            // recalculate all slide widths/positions, fixing the
                            // "images invisible on portrait mobile" bug.
                            window.dispatchEvent(new Event("resize"));
                        }
                    }}
                >
                    <div className="event-details-content">
                        {/* Image Gallery */}
                        <EventDetailsModalImageGallery />

                        <Row gutter={32} className="event-details-body">
                            {/* Left Column - Main Content */}
                            <Col span={16}>
                                {/* Event Status & Basic Info */}
                                <EventDetailsModalEventStatusBasic />

                                {/* Agenda Section */}
                                <EventDetailsModalAgendaSection />
                            </Col>

                            {/* Right Column - Sidebar */}
                            <Col span={8}>
                                {/* Pricing & Registration Card */}
                                <EventDetailsModalPricingRegistrationCard />

                                {/* Event Tags */}
                                <Card title="Event Tags" className="tags-card">
                                    <div className="event-tags-detailed">
                                        {event.tags.map((tag) => (
                                            <Tag
                                                key={tag}
                                                className="event-tag-detailed"
                                            >
                                                {tag}
                                            </Tag>
                                        ))}
                                    </div>
                                </Card>

                                <EventDetailsModalSafetyCard />
                            </Col>
                        </Row>
                    </div>

                    {/* Contact Modals */}
                    <EventDetailsModalContactModals />

                    <EventDetailsModalModalBlock />

                    <EventDetailsModalModalBlock2 />
                </Modal>

                <RegistrationsModal
                    event={event}
                    visible={registrationsModalVisible}
                    onClose={() => setRegistrationsModalVisible(false)}
                />
            </>
        </EventDetailsModalProvider>
    );
};
