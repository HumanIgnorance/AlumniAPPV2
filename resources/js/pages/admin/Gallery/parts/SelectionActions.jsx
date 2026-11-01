import React from "react";
import {
    CheckCircleOutlined,
    DeleteOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";

const { Text } = Typography;

export default function SelectionActions() {
    const {
        selectionMode,
        selectedImages,
        selectAllImages,
        galleries,
        deselectAllImages,
        handleDownloadSelected,
        isAdmin,
        handleBulkDelete,
    } = useGalleryContext();

    return (
        selectionMode && (
            <section className="gal-section">
                <Card className="gal-selection-actions">
                    <Space wrap size="middle">
                        <Text strong className="selection-count">
                            <CheckCircleOutlined /> Selected:{" "}
                            {selectedImages.length} gallery(s)
                        </Text>
                        <Button size="small" onClick={selectAllImages}>
                            Select All ({galleries.length})
                        </Button>
                        <Button size="small" onClick={deselectAllImages}>
                            Deselect All
                        </Button>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadSelected}
                            disabled={selectedImages.length === 0}
                        >
                            Download Selected
                        </Button>
                        {isAdmin && (
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleBulkDelete}
                                disabled={selectedImages.length === 0}
                            >
                                Delete Selected
                            </Button>
                        )}
                    </Space>
                </Card>
            </section>
        )
    );
}
