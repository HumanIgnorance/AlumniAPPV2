import React from "react";
import { CloudUploadOutlined, PictureOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, Space, Upload } from "antd";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";
import { MAX_IMAGES_PER_UPLOAD } from "~/pages/admin/Gallery/galleryHelpers";
import StagedThumbs from "~/pages/admin/Gallery/parts/StagedThumbs";

const { Dragger } = Upload;

export default function UploadModal() {
    const {
        uploadModalVisible,
        requestCloseUploadModal,
        form,
        handleUpload,
        scheduleSaveUploadDraft,
        disableFutureDates,
        fileList,
        uploadProps,
        compactDraggerStyle,
        uploading,
    } = useGalleryContext();

    return (
        <Modal
            title={
                <Space>
                    <CloudUploadOutlined />
                    <span>Create New Gallery</span>
                </Space>
            }
            open={uploadModalVisible}
            onCancel={requestCloseUploadModal}
            footer={null}
            className="gal-modal"
            width={620}
            centered
            maskClosable={false}
            keyboard={false}
            destroyOnClose={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpload}
                onValuesChange={() => scheduleSaveUploadDraft()}
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
                        placeholder="Enter title for this gallery"
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
                <Form.Item
                    label={`Images (up to ${MAX_IMAGES_PER_UPLOAD} photos per gallery)`}
                    required
                    help={`Selected: ${fileList.length}/${MAX_IMAGES_PER_UPLOAD} — click a thumbnail to view, ✕ to remove`}
                    validateStatus={fileList.length === 0 ? "error" : "success"}
                >
                    {/* Compact dragger so uploaded thumbs below are fully visible */}
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
                            Click or drag images to upload
                        </p>
                        <p
                            className="ant-upload-hint"
                            style={{ margin: 0, fontSize: 11 }}
                        >
                            Up to {MAX_IMAGES_PER_UPLOAD} images — PNG/JPG/JPEG,
                            max 10MB each
                        </p>
                    </Dragger>

                    {/* Custom thumbnail grid with view + remove */}
                    {<StagedThumbs />}
                </Form.Item>
                <Form.Item className="gal-modal-actions">
                    <Space wrap>
                        <Button onClick={requestCloseUploadModal}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={uploading}
                            icon={<CloudUploadOutlined />}
                            disabled={fileList.length === 0}
                        >
                            Create Gallery{" "}
                            {fileList.length > 0
                                ? `(${fileList.length} photos)`
                                : ""}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}
