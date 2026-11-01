import React from "react";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { Image, Modal, Space, Tooltip, Typography } from "antd";
import { COLORS } from "~/config/theme";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";

const { Text } = Typography;

export default function DeleteModal() {
    const {
        deleteModalVisible,
        setDeleteModalVisible,
        setSelectedGallery,
        confirmDelete,
        selectedGallery,
        getGalleryImages,
        getImageCount,
        openViewAll,
    } = useGalleryContext();

    return (
        <Modal
            title={
                <Space>
                    <ExclamationCircleOutlined
                        style={{ color: "var(--danger, #ef4444)" }}
                    />
                    <span>Delete Gallery</span>
                </Space>
            }
            open={deleteModalVisible}
            onCancel={() => {
                setDeleteModalVisible(false);
                setSelectedGallery(null);
            }}
            onOk={confirmDelete}
            okText="Delete"
            okButtonProps={{ danger: true, icon: <DeleteOutlined /> }}
            className="gal-delete-modal"
            centered
        >
            <p>Are you sure you want to delete this gallery?</p>
            {selectedGallery && (
                <div className="gal-delete-preview">
                    <div
                        className="gal-delete-images"
                        style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            marginBottom: 8,
                        }}
                    >
                        <Image.PreviewGroup>
                            {getGalleryImages(selectedGallery)
                                .slice(0, 3)
                                .map((imgUrl, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 8,
                                            overflow: "hidden",
                                            background: COLORS.black,
                                            boxShadow:
                                                "0 1px 4px rgba(0,0,0,0.15)",
                                        }}
                                    >
                                        <Image
                                            src={imgUrl}
                                            alt={`${selectedGallery.title} - ${idx + 1}`}
                                            preview={{ mask: <EyeOutlined /> }}
                                            fallback="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%231a1f2b%22/%3E%3Cpath d=%22M20 44l8-10 6 7 4-5 6 8H20z%22 fill=%22%23475569%22/%3E%3Ccircle cx=%2224%22 cy=%2224%22 r=%224%22 fill=%22%23475569%22/%3E%3C/svg%3E"
                                            rootClassName="gal-thumb-image"
                                            wrapperStyle={{
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
                                    </div>
                                ))}
                        </Image.PreviewGroup>
                        {getImageCount(selectedGallery) > 3 && (
                            <Tooltip title="View all images">
                                <div
                                    className="gal-delete-more"
                                    onClick={() =>
                                        openViewAll(selectedGallery, null, 3)
                                    }
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        background:
                                            "var(--accent-soft, rgba(79,70,229,.10))",
                                        border: "1px dashed var(--accent-ring, rgba(79,70,229,.35))",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                        color: "var(--accent, #4f46e5)",
                                        fontWeight: 700,
                                    }}
                                >
                                    <EyeOutlined />
                                    <span>
                                        +{getImageCount(selectedGallery) - 3}
                                    </span>
                                </div>
                            </Tooltip>
                        )}
                    </div>
                    <div>
                        <Text strong>{selectedGallery.title}</Text>
                        <br />
                        <Text type="secondary">
                            {getImageCount(selectedGallery)} image(s) •{" "}
                            {selectedGallery.formatted_size}
                        </Text>
                    </div>
                </div>
            )}
            <p className="gal-delete-warning">
                This action cannot be undone. All images in this gallery will be
                permanently deleted.
            </p>
        </Modal>
    );
}
