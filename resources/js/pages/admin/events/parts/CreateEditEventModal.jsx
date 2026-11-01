import React from "react";
import {
    CheckCircleOutlined,
    EditOutlined,
    MailFilled,
    PhoneOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Switch,
    Tag,
    TimePicker,
    Typography,
    Upload,
} from "antd";
import dayjs from "dayjs";
import { COLORS } from "~/config/theme";
import { useEventsContext } from "~/pages/admin/events/EventsContext";
import {
    eventCategories,
    eventTypes,
} from "~/pages/admin/events/parts/eventConstants";

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function CreateEditEventModal() {
    const {
        selectedEvent,
        isModalVisible,
        handleCancel,
        isSubmitting,
        form,
        handleCreateEvent,
        handleFormValuesChange,
        draftLastSaved,
        disabledTime,
        fileList,
        handleUploadChange,
        handleBeforeUpload,
        handleFormSubmit,
    } = useEventsContext();

    return (
        <Modal
            title={selectedEvent ? "Edit Event" : "Create New Event"}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={900}
            className="create-event-modal"
            style={{ top: 20 }}
            maskClosable={!isSubmitting}
            closable={!isSubmitting}
            keyboard={!isSubmitting}
        >
            <div className="event-form-container">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateEvent}
                    onValuesChange={handleFormValuesChange}
                    className="event-form-full"
                >
                    {/* Draft Status Indicator */}
                    {!selectedEvent && draftLastSaved && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "16px",
                                padding: "8px 12px",
                                background: "rgba(16, 185, 129, 0.08)",
                                border: "1px solid rgba(16, 185, 129, 0.25)",
                                borderRadius: "8px",
                                width: "fit-content",
                            }}
                        >
                            <CheckCircleOutlined
                                style={{
                                    color: COLORS.emerald500,
                                    fontSize: "16px",
                                }}
                            />
                            <Text strong style={{ color: COLORS.emerald500 }}>
                                Auto Saved
                            </Text>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Last saved: {draftLastSaved}
                            </Text>
                        </div>
                    )}
                    <div className="form-sections">
                        {/* Basic Info Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3>Basic Information</h3>
                                <div className="section-divider"></div>
                            </div>
                            <div className="section-content">
                                <Form.Item
                                    name="title"
                                    label="Event Title"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter event title",
                                        },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        placeholder="Enter a compelling event title"
                                        className="form-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="description"
                                    label="Event Description"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter event description",
                                        },
                                    ]}
                                >
                                    <TextArea
                                        rows={4}
                                        placeholder="Describe your event in detail. What will attendees experience?"
                                        className="form-textarea"
                                    />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="event_type"
                                            label="Event Type"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select event type",
                                                },
                                            ]}
                                        >
                                            <Select
                                                size="large"
                                                placeholder="Select event type"
                                            >
                                                {eventTypes
                                                    .filter(
                                                        (et) =>
                                                            et.value !== "all",
                                                    )
                                                    .map((type) => (
                                                        <Option
                                                            key={type.value}
                                                            value={type.value}
                                                        >
                                                            <Tag
                                                                color={
                                                                    type.color
                                                                }
                                                            >
                                                                {type.label}
                                                            </Tag>
                                                        </Option>
                                                    ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="category"
                                            label="Category"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select category",
                                                },
                                            ]}
                                        >
                                            <Select
                                                size="large"
                                                placeholder="Select category"
                                            >
                                                {eventCategories
                                                    .filter(
                                                        (ec) =>
                                                            ec.value !== "all",
                                                    )
                                                    .map((category) => (
                                                        <Option
                                                            key={category.value}
                                                            value={
                                                                category.value
                                                            }
                                                        >
                                                            {category.label}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </div>

                        {/* Date & Time Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3>Date & Time</h3>
                                <div className="section-divider"></div>
                            </div>
                            <div className="section-content">
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="date"
                                            label="Event Date"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select event date",
                                                },
                                            ]}
                                        >
                                            <DatePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                size="large"
                                                disabledDate={(current) =>
                                                    current &&
                                                    current <
                                                        dayjs().startOf("day")
                                                }
                                                getPopupContainer={(trigger) =>
                                                    trigger.closest(
                                                        ".create-event-modal",
                                                    ) || trigger.parentElement
                                                }
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="timeRange"
                                            label="Event Time"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select event time",
                                                },
                                            ]}
                                        >
                                            <TimePicker.RangePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                size="large"
                                                format="hh:mm A"
                                                disabledTime={disabledTime}
                                                getPopupContainer={(trigger) =>
                                                    trigger.closest(
                                                        ".create-event-modal",
                                                    ) || trigger.parentElement
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="location"
                                    label="Event Location"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter event location",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter physical location or virtual platform"
                                        size="large"
                                        className="form-input"
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Event Details Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3>Event Details</h3>
                                <div className="section-divider"></div>
                            </div>
                            <div className="section-content">
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={8}>
                                        <Form.Item
                                            name="price"
                                            label="Ticket Price (₱)"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter ticket price",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                style={{
                                                    width: "100%",
                                                }}
                                                size="large"
                                                min={0}
                                                placeholder="0"
                                                className="form-input-number"
                                                formatter={(value) =>
                                                    `₱ ${value}`.replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ",",
                                                    )
                                                }
                                                parser={(value) =>
                                                    value.replace(
                                                        /₱\s?|(,*)/g,
                                                        "",
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={8}>
                                        <Form.Item
                                            name="capacity"
                                            label="Capacity"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter event capacity",
                                                },
                                                {
                                                    type: "number",
                                                    max: 500,
                                                    message:
                                                        "Capacity cannot exceed 500",
                                                },
                                                {
                                                    type: "number",
                                                    min: 1,
                                                    message:
                                                        "Capacity must be at least 1",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                style={{
                                                    width: "100%",
                                                }}
                                                size="large"
                                                min={1}
                                                max={500}
                                                placeholder="500"
                                                className="form-input-number"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={8}>
                                        <Form.Item
                                            name="organizer"
                                            label="Organizer"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter organizer name",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Organizer name"
                                                size="large"
                                                className="form-input"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="contact_number"
                                            label="Contact Number"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter contact number",
                                                },
                                                {
                                                    pattern: /^09\d{9}$/,
                                                    message:
                                                        "Contact number must start with 09 and be exactly 11 digits",
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<PhoneOutlined />}
                                                placeholder="e.g. 09496600923"
                                                maxLength={11}
                                                size="large"
                                                className="form-input"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="contact_email"
                                            label="Email (Gmail)"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter your Gmail address",
                                                },
                                                {
                                                    type: "email",
                                                    message:
                                                        "Please enter a valid email address",
                                                },
                                                {
                                                    pattern:
                                                        /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailFilled />}
                                                placeholder="e.g. javiernarn@gmail.com"
                                                size="large"
                                                className="form-input"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="tags"
                                    label="Event Tags"
                                    rules={[
                                        {
                                            type: "array",
                                            required: true,
                                            message:
                                                "Please add at least one tag",
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="tags"
                                        size="large"
                                        placeholder="Add tags to help people find your event"
                                        tokenSeparators={[","]}
                                        className="form-tags"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="agenda"
                                    label="Event Agenda"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter the event agenda",
                                        },
                                    ]}
                                >
                                    <TextArea
                                        rows={4}
                                        placeholder="Enter event schedule (one item per line)"
                                        className="form-textarea"
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Early Bird Pricing Section */}
                        {/* <div className="form-section">
          <div className="section-header">
            <h3>Early Bird Pricing (Optional)</h3>
            <div className="section-divider"></div>
          </div>
          <div className="section-content">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="earlyBirdPrice" label="Early Bird Price (₱)">
                  <InputNumber
                    style={{ width: "100%" }}
                    size="large"
                    min={0}
                    placeholder="0"
                    className="form-input-number"
                    formatter={(value) => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/₱\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="earlyBirdEndDate" label="Early Bird End Date">
                  <DatePicker
                    style={{ width: "100%" }}
                    size="large"
                    format="YYYY-MM-DD"
                    disabledDate={(current) => current && current < dayjs().endOf("day")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div> */}

                        {/* Media Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3>Media & Settings</h3>
                                <div className="section-divider"></div>
                            </div>
                            <div className="section-content">
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="featured"
                                            label="Featured Event"
                                            valuePropName="checked"
                                            initialValue={false}
                                        >
                                            <Switch
                                                checkedChildren="Featured"
                                                unCheckedChildren="Regular"
                                                className="featured-switch"
                                            />
                                        </Form.Item>

                                        <span className="switch-label">
                                            Mark this event as featured to
                                            highlight it on the platform
                                        </span>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="images"
                                            label="Event Images"
                                        >
                                            <Upload
                                                listType="picture-card"
                                                multiple
                                                fileList={fileList}
                                                onChange={handleUploadChange}
                                                beforeUpload={
                                                    handleBeforeUpload
                                                }
                                                className="event-images-upload"
                                            >
                                                {fileList.length >= 8 ? null : (
                                                    <div className="upload-placeholder">
                                                        <PlusOutlined />
                                                        <div
                                                            style={{
                                                                marginTop: 8,
                                                            }}
                                                        >
                                                            Upload Images
                                                        </div>
                                                    </div>
                                                )}
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions-full">
                        <Button
                            onClick={handleCancel}
                            className="cancel-btn"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleFormSubmit}
                            icon={
                                selectedEvent ? (
                                    <EditOutlined />
                                ) : (
                                    <PlusOutlined />
                                )
                            }
                            className="submit-btn"
                            size="large"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Saving..."
                                : selectedEvent
                                  ? "Update Event"
                                  : "Create Event"}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
}
