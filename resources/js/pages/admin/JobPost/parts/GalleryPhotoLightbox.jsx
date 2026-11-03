import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { COLORS } from "~/config/theme";
import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";
import { saveImage, prefetchImage } from "~/utils/saveImage";

// ============================================================
// ======= GALLERY-STYLE PHOTO LIGHTBOX (like galleryPage.js) =
// ============================================================
export const GalleryPhotoLightbox = ({
    images = [],
    visible,
    currentIndex = 0,
    onClose,
    onChange,
    title = "",
}) => {
    const isTouchDevice = useIsTouchDevice();
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [flipX, setFlipX] = useState(false);
    const [flipY, setFlipY] = useState(false);
    const [idx, setIdx] = useState(currentIndex);

    useEffect(() => {
        setIdx(currentIndex);
        setScale(1);
        setRotation(0);
        setFlipX(false);
        setFlipY(false);
    }, [currentIndex, visible]);

    // Load the open photo in the background so Save is instant (iOS needs that).
    useEffect(() => {
        if (visible && images[idx]) prefetchImage(images[idx]);
    }, [visible, idx, images]);

    if (!visible || images.length === 0) return null;

    const handlePrev = () => {
        const newIdx = (idx - 1 + images.length) % images.length;
        setIdx(newIdx);
        setScale(1);
        setRotation(0);
        setFlipX(false);
        setFlipY(false);
        onChange?.(newIdx);
    };
    const handleNext = () => {
        const newIdx = (idx + 1) % images.length;
        setIdx(newIdx);
        setScale(1);
        setRotation(0);
        setFlipX(false);
        setFlipY(false);
        onChange?.(newIdx);
    };
    const handleDownload = () => {
        const url = images[idx];
        if (!url) return;
        saveImage({
            url,
            filename: `${title || "photo"}-${idx + 1}`,
        });
    };

    const imgTransform = [
        `scale(${scale})`,
        `rotate(${rotation}deg)`,
        `scaleX(${flipX ? -1 : 1})`,
        `scaleY(${flipY ? -1 : 1})`,
    ].join(" ");

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(2, 6, 23, 0.92)",
                backdropFilter: "blur(10px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            {/* Close */}
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 10,
                    background: "rgba(255,255,255,0.12)",
                    border: "none",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    cursor: "pointer",
                    color: COLORS.white,
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                ✕
            </button>

            {/* Caption top */}
            <div
                style={{
                    color: COLORS.slate200,
                    fontSize: 14,
                    marginBottom: 12,
                    textAlign: "center",
                    opacity: 0.85,
                }}
            >
                {title && <span style={{ fontWeight: 600 }}>{title}</span>}
                {images.length > 1 && (
                    <span style={{ marginLeft: 8, opacity: 0.65 }}>
                        {idx + 1} / {images.length}
                    </span>
                )}
            </div>

            {/* Image area */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    flex: 1,
                }}
            >
                {images.length > 1 && (
                    <button
                        onClick={handlePrev}
                        style={{
                            position: "absolute",
                            left: 16,
                            zIndex: 5,
                            background: "rgba(255,255,255,0.12)",
                            border: "none",
                            borderRadius: "50%",
                            width: 44,
                            height: 44,
                            cursor: "pointer",
                            color: COLORS.white,
                            fontSize: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background 0.2s",
                        }}
                    >
                        ‹
                    </button>
                )}
                <img
                    src={images[idx]}
                    alt={`Photo ${idx + 1}`}
                    style={{
                        maxWidth: "80vw",
                        maxHeight: "65vh",
                        objectFit: "contain",
                        borderRadius: 8,
                        transform: imgTransform,
                        transition: "transform 0.25s ease",
                        boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
                    }}
                    onError={(e) => {
                        e.target.style.opacity = 0.4;
                    }}
                />
                {images.length > 1 && (
                    <button
                        onClick={handleNext}
                        style={{
                            position: "absolute",
                            right: 16,
                            zIndex: 5,
                            background: "rgba(255,255,255,0.12)",
                            border: "none",
                            borderRadius: "50%",
                            width: 44,
                            height: 44,
                            cursor: "pointer",
                            color: COLORS.white,
                            fontSize: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background 0.2s",
                        }}
                    >
                        ›
                    </button>
                )}
            </div>

            {/* Toolbar */}
            <div
                style={{
                    marginTop: 16,
                    padding: "8px 16px",
                    borderRadius: 999,
                    background: "rgba(2,6,23,0.55)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: "96vw",
                    overflowX: "auto",
                }}
            >
                {[
                    {
                        title: "Zoom Out",
                        icon: "−",
                        onClick: () => setScale((s) => Math.max(0.5, s - 0.25)),
                        disabled: scale <= 0.5,
                    },
                    {
                        title: "Zoom In",
                        icon: "+",
                        onClick: () => setScale((s) => Math.min(5, s + 0.25)),
                        disabled: scale >= 5,
                    },
                    {
                        title: "Rotate Left",
                        icon: "↺",
                        onClick: () => setRotation((r) => r - 90),
                    },
                    {
                        title: "Rotate Right",
                        icon: "↻",
                        onClick: () => setRotation((r) => r + 90),
                    },
                    {
                        title: "Flip X",
                        icon: "⇔",
                        onClick: () => setFlipX((f) => !f),
                    },
                    {
                        title: "Flip Y",
                        icon: "⇕",
                        onClick: () => setFlipY((f) => !f),
                    },
                    {
                        title: "Reset",
                        icon: "⟳",
                        onClick: () => {
                            setScale(1);
                            setRotation(0);
                            setFlipX(false);
                            setFlipY(false);
                        },
                    },
                ].map((btn) => (
                    <Tooltip
                        key={btn.title}
                        title={btn.title}
                        trigger={isTouchDevice ? [] : ["hover"]}
                        open={isTouchDevice ? false : undefined}
                    >
                        <button
                            onClick={btn.onClick}
                            disabled={btn.disabled}
                            style={{
                                background: btn.disabled
                                    ? "rgba(255,255,255,0.05)"
                                    : "rgba(255,255,255,0.12)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: 8,
                                color: btn.disabled
                                    ? "rgba(255,255,255,0.3)"
                                    : COLORS.slate200,
                                width: 36,
                                height: 36,
                                cursor: btn.disabled
                                    ? "not-allowed"
                                    : "pointer",
                                fontSize: 15,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {btn.icon}
                        </button>
                    </Tooltip>
                ))}
                <div
                    style={{
                        width: 1,
                        height: 24,
                        background: "rgba(255,255,255,0.15)",
                        margin: "0 4px",
                    }}
                />
                <Tooltip
                    title="Download this photo"
                    trigger={isTouchDevice ? [] : ["hover"]}
                    open={isTouchDevice ? false : undefined}
                >
                    <button
                        onClick={handleDownload}
                        style={{
                            background:
                                "linear-gradient(135deg,#4f46e5,#7c3aed)",
                            border: "none",
                            borderRadius: 8,
                            color: COLORS.white,
                            padding: "0 14px",
                            height: 36,
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 13,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        ⬇ Download
                    </button>
                </Tooltip>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 14,
                        padding: "4px 8px",
                        overflowX: "auto",
                        maxWidth: "90vw",
                    }}
                >
                    {images.map((src, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setIdx(i);
                                setScale(1);
                                setRotation(0);
                                setFlipX(false);
                                setFlipY(false);
                                onChange?.(i);
                            }}
                            style={{
                                width: 56,
                                height: 56,
                                flexShrink: 0,
                                borderRadius: 8,
                                overflow: "hidden",
                                border:
                                    i === idx
                                        ? "2px solid #818cf8"
                                        : "2px solid rgba(255,255,255,0.15)",
                                cursor: "pointer",
                                opacity: i === idx ? 1 : 0.6,
                                transition: "all 0.2s",
                            }}
                        >
                            <img
                                src={src}
                                alt={`thumb ${i}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
