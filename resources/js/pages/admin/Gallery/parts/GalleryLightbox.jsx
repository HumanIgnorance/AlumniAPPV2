import React from "react";
import {
    DownloadOutlined,
    LeftOutlined,
    RightOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    SwapOutlined,
    UndoOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
} from "@ant-design/icons";
import { Button, Image, Space, Tooltip } from "antd";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";

export default function GalleryLightbox() {
    const {
        selectedGallery,
        previewOrientation,
        previewVisible,
        currentImageIndex,
        setPreviewVisible,
        closePreview,
        setCurrentImageIndex,
        previewImages,
        handleDownload,
        handleDownloadGallery,
    } = useGalleryContext();

    return (
        selectedGallery && (
            <div style={{ display: "none" }}>
                <Image.PreviewGroup
                    key={`gallery-preview-${previewOrientation}`}
                    preview={{
                        visible: previewVisible,
                        current: currentImageIndex,
                        onVisibleChange: (v) => {
                            setPreviewVisible(v);
                            if (!v) closePreview();
                        },
                        onChange: (idx) => setCurrentImageIndex(idx),
                        rootClassName: "gal-preview-root",
                        toolbarRender: (
                            _,
                            {
                                transform: { scale },
                                actions: {
                                    onActive,
                                    onFlipY,
                                    onFlipX,
                                    onRotateLeft,
                                    onRotateRight,
                                    onZoomOut,
                                    onZoomIn,
                                    onReset,
                                },
                            },
                        ) => (
                            <div
                                className="gal-preview-toolbar-scroll"
                                style={{
                                    maxWidth: "96vw",
                                    overflowX: "auto",
                                    overflowY: "hidden",
                                    WebkitOverflowScrolling: "touch",
                                    scrollbarWidth: "thin",
                                    padding: "8px 12px",
                                    borderRadius: 999,
                                    background:
                                        "var(--overlay, rgba(2,6,23,0.55))",
                                    backdropFilter: "blur(10px)",
                                    WebkitBackdropFilter: "blur(10px)",
                                    touchAction: "pan-x",
                                    cursor: "grab",
                                }}
                                onWheel={(e) => {
                                    if (e.deltaY !== 0) {
                                        e.currentTarget.scrollLeft += e.deltaY;
                                    }
                                }}
                                // rc-image sets touch-action:none on the preview wrap so it can
                                // implement its own pinch/pan gestures on the image. That swallows
                                // native touch-scrolling here too (taps still register, swipes don't).
                                // So: stop the gesture from reaching rc-image's handlers, and drive
                                // scrollLeft ourselves instead of relying on native touch scrolling.
                                onTouchStart={(e) => {
                                    e.stopPropagation();
                                    const el = e.currentTarget;
                                    el.dataset.dragX = String(
                                        e.touches[0].clientX,
                                    );
                                    el.dataset.dragScroll = String(
                                        el.scrollLeft,
                                    );
                                }}
                                onTouchMove={(e) => {
                                    e.stopPropagation();
                                    const el = e.currentTarget;
                                    const startX = Number(
                                        el.dataset.dragX || 0,
                                    );
                                    const startScroll = Number(
                                        el.dataset.dragScroll || 0,
                                    );
                                    const dx = e.touches[0].clientX - startX;
                                    el.scrollLeft = startScroll - dx;
                                }}
                                onTouchEnd={(e) => e.stopPropagation()}
                            >
                                <Space
                                    size={10}
                                    className="gal-preview-toolbar"
                                    style={{
                                        flexWrap: "nowrap",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <Tooltip title="Previous">
                                        <Button
                                            shape="circle"
                                            icon={<LeftOutlined />}
                                            onClick={() => onActive?.(-1)}
                                            disabled={previewImages.length <= 1}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Next">
                                        <Button
                                            shape="circle"
                                            icon={<RightOutlined />}
                                            onClick={() => onActive?.(1)}
                                            disabled={previewImages.length <= 1}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Flip Y">
                                        <Button
                                            shape="circle"
                                            icon={<SwapOutlined rotate={90} />}
                                            onClick={onFlipY}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Flip X">
                                        <Button
                                            shape="circle"
                                            icon={<SwapOutlined />}
                                            onClick={onFlipX}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Rotate Left">
                                        <Button
                                            shape="circle"
                                            icon={<RotateLeftOutlined />}
                                            onClick={onRotateLeft}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Rotate Right">
                                        <Button
                                            shape="circle"
                                            icon={<RotateRightOutlined />}
                                            onClick={onRotateRight}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Zoom Out">
                                        <Button
                                            shape="circle"
                                            icon={<ZoomOutOutlined />}
                                            onClick={onZoomOut}
                                            disabled={scale <= 1}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Zoom In">
                                        <Button
                                            shape="circle"
                                            icon={<ZoomInOutlined />}
                                            onClick={onZoomIn}
                                            disabled={scale >= 50}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Reset">
                                        <Button
                                            shape="circle"
                                            icon={<UndoOutlined />}
                                            onClick={onReset}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Download this photo only">
                                        <Button
                                            type="primary"
                                            shape="round"
                                            icon={<DownloadOutlined />}
                                            onClick={() =>
                                                handleDownload(
                                                    selectedGallery,
                                                    currentImageIndex,
                                                )
                                            }
                                        >
                                            Download this photo only
                                        </Button>
                                    </Tooltip>
                                    {previewImages.length > 1 && (
                                        <Tooltip
                                            title={`Download all ${previewImages.length}`}
                                        >
                                            <Button
                                                shape="round"
                                                icon={<DownloadOutlined />}
                                                onClick={() =>
                                                    handleDownloadGallery(
                                                        selectedGallery,
                                                    )
                                                }
                                            >
                                                All ({previewImages.length})
                                            </Button>
                                        </Tooltip>
                                    )}
                                </Space>
                            </div>
                        ),
                        imageRender: (originalNode) => originalNode,
                    }}
                >
                    {previewImages.map((imgUrl, idx) => (
                        <Image
                            key={idx}
                            src={imgUrl}
                            alt={`${selectedGallery.title} - ${idx + 1}`}
                        />
                    ))}
                </Image.PreviewGroup>
            </div>
        )
    );
}
