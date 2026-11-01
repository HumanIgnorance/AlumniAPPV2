import React from "react";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { Image, Modal, Space, Typography } from "antd";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";

const { Text } = Typography;

export default function BulkDeleteModal() {
    const {
        bulkDeleteModalVisible,
        setBulkDeleteModalVisible,
        confirmBulkDelete,
        selectedImages,
        galleries,
        getGalleryImages,
    } = useGalleryContext();

    return (
        <Modal
            title={
                <Space>
                    <ExclamationCircleOutlined
                        style={{ color: "var(--danger, #ef4444)" }}
                    />
                    <span>Delete Selected Galleries</span>
                </Space>
            }
            open={bulkDeleteModalVisible}
            onCancel={() => setBulkDeleteModalVisible(false)}
            onOk={confirmBulkDelete}
            okText={`Delete ${selectedImages.length} Gallery(s)`}
            okButtonProps={{ danger: true, icon: <DeleteOutlined /> }}
            className="gal-delete-modal"
            centered
        >
            <p>
                Are you sure you want to delete{" "}
                <strong>{selectedImages.length}</strong> selected gallery(s)?
            </p>
            <div className="gal-bulk-delete-preview">
                <div className="gal-bulk-delete-grid">
                    <Image.PreviewGroup>
                        {selectedImages.slice(0, 6).map((galleryId) => {
                            const gallery = galleries.find(
                                (g) => g.id === galleryId,
                            );
                            if (!gallery) return null;
                            const images = getGalleryImages(gallery);
                            return (
                                <div
                                    key={galleryId}
                                    className="gal-bulk-delete-item"
                                >
                                    <Image
                                        src={images[0]}
                                        alt={gallery.title}
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
                                    <Text
                                        ellipsis
                                        className="gal-bulk-delete-title"
                                    >
                                        {gallery.title}
                                    </Text>
                                </div>
                            );
                        })}
                    </Image.PreviewGroup>
                    {selectedImages.length > 6 && (
                        <div className="gal-bulk-delete-more">
                            +{selectedImages.length - 6} more
                        </div>
                    )}
                </div>
            </div>
            <p className="gal-delete-warning">
                This action cannot be undone. All images in these galleries will
                be permanently deleted.
            </p>
        </Modal>
    );
}
