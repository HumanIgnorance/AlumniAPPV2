import React from "react";
import { Image } from "antd";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";

export default function ViewAllLightbox() {
    const {
        viewAllGallery,
        previewOrientation,
        viewAllVisible,
        viewAllIndex,
        setViewAllVisible,
        setViewAllGallery,
        setViewAllIndex,
        getGalleryImages,
    } = useGalleryContext();

    return (
        viewAllGallery && (
            <div style={{ display: "none" }}>
                <Image.PreviewGroup
                    key={`viewall-preview-${previewOrientation}`}
                    preview={{
                        visible: viewAllVisible,
                        current: viewAllIndex,
                        onVisibleChange: (v) => {
                            setViewAllVisible(v);
                            if (!v) setViewAllGallery(null);
                        },
                        onChange: (idx) => setViewAllIndex(idx),
                        rootClassName: "gal-preview-root",
                    }}
                >
                    {(
                        viewAllGallery._filteredImages ||
                        getGalleryImages(viewAllGallery)
                    ).map((u, i) => (
                        <Image
                            key={i}
                            src={u}
                            alt={`${viewAllGallery.title || "image"} - ${i + 1}`}
                        />
                    ))}
                </Image.PreviewGroup>
            </div>
        )
    );
}
