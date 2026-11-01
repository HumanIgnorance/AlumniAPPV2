import React from "react";
import { CalendarOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";

const { Text } = Typography;

export default function CaptionOverlay() {
    const {
        selectedGallery,
        previewVisible,
        previewImages,
        currentImageIndex,
    } = useGalleryContext();

    return (
        selectedGallery &&
        previewVisible && (
            <div className="gal-preview-caption-fixed">
                <Text strong className="gal-preview-caption-title">
                    {selectedGallery.title}
                </Text>
                <Text className="gal-preview-caption-meta">
                    <CalendarOutlined /> {selectedGallery.formatted_date}
                    {previewImages.length > 1 && (
                        <>
                            {" "}
                            • {currentImageIndex + 1} / {previewImages.length}
                        </>
                    )}
                </Text>
            </div>
        )
    );
}
