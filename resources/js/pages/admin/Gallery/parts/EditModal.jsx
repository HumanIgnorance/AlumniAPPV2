import React from "react";
import {
    CheckCircleOutlined,
    CloseOutlined,
    EditOutlined,
    EyeOutlined,
    PictureOutlined,
    UndoOutlined,
} from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Form,
    Image,
    Input,
    Modal,
    Space,
    Tooltip,
    Typography,
    Upload,
} from "antd";
import { COLORS } from "~/config/theme";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";
import StagedThumbs from "~/pages/admin/Gallery/parts/StagedThumbs";

const { Text } = Typography;
const { Dragger } = Upload;

export default function EditModal() {
    const {
        editModalVisible,
        requestCloseEditModal,
        editForm,
        handleEditSubmit,
        scheduleSaveEditDraft,
        disableFutureDates,
        selectedGallery,
        getGalleryImages,
        remainingExistingImages,
        removedExistingIndexes,
        setRemovedExistingIndexes,
        openViewAll,
        fileList,
        uploadProps,
        compactDraggerStyle,
        uploading,
    } = useGalleryContext();

    return (
        <Modal
            title={
                <Space>
                    <EditOutlined />
                    <span>Edit Gallery</span>
                </Space>
            }
            open={editModalVisible}
            onCancel={requestCloseEditModal}
            footer={null}
            className="gal-modal"
            width={640}
            centered
            maskClosable={false}
            keyboard={false}
            destroyOnClose={false}
        >
            <Form
                form={editForm}
                layout="vertical"
                onFinish={handleEditSubmit}
                onValuesChange={() => scheduleSaveEditDraft()}
            >
                <Form.Item
                    name="title"
                    label="Gallery Title"
                    rules={[
                        { required: true, message: "Please enter a title" },
                        { whitespace: true, message: "Title cannot be empty" },
                    ]}
                >
                    <Input
                        placeholder="Enter title"
                        maxLength={255}
                        showCount
                    />
                </Form.Item>
                <Form.Item
                    name="event_date"
                    label="Event Date"
                    rules={[
                        {
                            required: true,
                            message: "Please select an event date",
                        },
                    ]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        format="MMMM DD, YYYY"
                        disabledDate={disableFutureDates}
                    />
                </Form.Item>

                {/* ===== Current Images: view + remove individually ===== */}
                {selectedGallery &&
                    (() => {
                        const all = getGalleryImages(selectedGallery);
                        const remaining = remainingExistingImages;
                        const visible = remaining.slice(0, 4);
                        const extra = remaining.length - visible.length;
                        return (
                            <div
                                className="gal-current-image-preview"
                                style={{ marginBottom: 12 }}
                            >
                                <Text type="secondary">
                                    Current Images ({remaining.length}
                                    {removedExistingIndexes.length > 0
                                        ? ` of ${all.length}`
                                        : ""}
                                    ):
                                </Text>
                                <div
                                    className="gal-preview-grid"
                                    style={{
                                        marginTop: 8,
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fill, minmax(90px, 1fr))",
                                        gap: 8,
                                    }}
                                >
                                    <Image.PreviewGroup>
                                        {visible.map(({ url, idx }) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    position: "relative",
                                                    width: "100%",
                                                    paddingTop: "100%",
                                                    borderRadius: 8,
                                                    overflow: "hidden",
                                                    background: COLORS.black,
                                                    boxShadow:
                                                        "0 1px 4px rgba(0,0,0,0.15)",
                                                }}
                                            >
                                                <Image
                                                    src={url}
                                                    alt={`${selectedGallery.title} - ${idx + 1}`}
                                                    preview={{
                                                        mask: (
                                                            <EyeOutlined
                                                                style={{
                                                                    fontSize: 18,
                                                                }}
                                                            />
                                                        ),
                                                    }}
                                                    fallback="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%231a1f2b%22/%3E%3Cpath d=%22M20 44l8-10 6 7 4-5 6 8H20z%22 fill=%22%23475569%22/%3E%3Ccircle cx=%2224%22 cy=%2224%22 r=%224%22 fill=%22%23475569%22/%3E%3C/svg%3E"
                                                    className="gal-preview-thumb"
                                                    rootClassName="gal-thumb-image"
                                                    wrapperStyle={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        display: "block",
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        display: "block",
                                                    }}
                                                    onError={(e) => {
                                                        try {
                                                            e.target.style.opacity = 0.4;
                                                        } catch (_) {}
                                                    }}
                                                />
                                                <Tooltip title="Remove this image">
                                                    <Button
                                                        size="small"
                                                        danger
                                                        shape="circle"
                                                        icon={<CloseOutlined />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setRemovedExistingIndexes(
                                                                (prev) => [
                                                                    ...prev,
                                                                    idx,
                                                                ],
                                                            );
                                                        }}
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: 4,
                                                            right: 4,
                                                            zIndex: 3,
                                                        }}
                                                    />
                                                </Tooltip>
                                            </div>
                                        ))}
                                    </Image.PreviewGroup>

                                    {extra > 0 && (
                                        <Tooltip title="View all images">
                                            <div
                                                className="gal-preview-more"
                                                onClick={() =>
                                                    openViewAll(
                                                        selectedGallery,
                                                        remaining.map(
                                                            (r) => r.url,
                                                        ),
                                                        visible.length,
                                                    )
                                                }
                                                style={{
                                                    width: "100%",
                                                    paddingTop: "100%",
                                                    position: "relative",
                                                    cursor: "pointer",
                                                    borderRadius: 8,
                                                    background:
                                                        "var(--accent-soft, rgba(79,70,229,.10))",
                                                    border: "1px dashed var(--accent-ring, rgba(79,70,229,.35))",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        flexDirection: "column",
                                                        color: "var(--accent, #4f46e5)",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    <EyeOutlined
                                                        style={{
                                                            fontSize: 18,
                                                            marginBottom: 4,
                                                        }}
                                                    />
                                                    <span>+{extra}</span>
                                                </div>
                                            </div>
                                        </Tooltip>
                                    )}
                                </div>

                                {removedExistingIndexes.length > 0 && (
                                    <div style={{ marginTop: 6 }}>
                                        <Text
                                            type="warning"
                                            style={{ fontSize: 12 }}
                                        >
                                            {removedExistingIndexes.length}{" "}
                                            image(s) marked for removal — will
                                            be deleted on save.
                                        </Text>
                                        <Button
                                            size="small"
                                            type="link"
                                            icon={<UndoOutlined />}
                                            onClick={() =>
                                                setRemovedExistingIndexes([])
                                            }
                                        >
                                            Undo all removals
                                        </Button>
                                    </div>
                                )}

                                {remaining.length === 0 &&
                                    fileList.length === 0 && (
                                        <div style={{ marginTop: 6 }}>
                                            <Text
                                                type="danger"
                                                style={{ fontSize: 12 }}
                                            >
                                                A gallery must keep at least one
                                                image. Add new images below or
                                                undo removals.
                                            </Text>
                                        </div>
                                    )}
                            </div>
                        );
                    })()}

                <Form.Item
                    label="Add More Images (Optional)"
                    help="Upload new images to add to this gallery"
                >
                    <Dragger
                        {...uploadProps}
                        className="gal-upload-dragger gal-upload-dragger--compact"
                        style={compactDraggerStyle}
                    >
                        <p
                            className="ant-upload-drag-icon"
                            style={{ margin: 0, fontSize: 26, lineHeight: 1 }}
                        >
                            <PictureOutlined />
                        </p>
                        <p
                            className="ant-upload-text"
                            style={{
                                margin: "4px 0 0",
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
                            Click or drag to add images
                        </p>
                        <p
                            className="ant-upload-hint"
                            style={{ margin: 0, fontSize: 11 }}
                        >
                            Click a thumb to view, ✕ to remove before saving
                        </p>
                    </Dragger>

                    {/* New staged images, with view + remove */}
                    {<StagedThumbs />}
                </Form.Item>

                <Form.Item className="gal-modal-actions">
                    <Space wrap>
                        <Button onClick={requestCloseEditModal}>Cancel</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={uploading}
                            icon={<CheckCircleOutlined />}
                        >
                            Save Changes
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}
