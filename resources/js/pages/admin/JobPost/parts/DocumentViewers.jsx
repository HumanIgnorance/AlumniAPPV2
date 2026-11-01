import { useEffect, useState } from "react";
import {
    DownloadOutlined,
    EyeOutlined,
    FileImageOutlined,
    FileOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    IdcardOutlined,
    LinkOutlined,
    PictureOutlined,
} from "@ant-design/icons";
import { Button, Card, Modal, Space, Spin, Tooltip, Typography } from "antd";
import { COLORS } from "~/config/theme";
import { GalleryPhotoLightbox } from "~/pages/admin/JobPost/parts/GalleryPhotoLightbox";
import { getIdTypeLabel } from "~/pages/admin/JobPost/parts/jobPostHelpers";
import { buildImageUrl } from "~/pages/admin/JobPost/parts/jobPostUtils";
import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";

const { Text } = Typography;

// ============================================================
// ======= INLINE DOCUMENT VIEWER (PDF / DOC / DOCX) ==========
// ============================================================
export const DocumentViewerModal = ({
    visible,
    onClose,
    fileUrl,
    fileName = "Resume",
}) => {
    // ✅ ALL hooks before any early return
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (visible) {
            setLoading(true);
            setError(false);
        }
    }, [visible, fileUrl]);

    // Derive metadata safely — even when fileUrl is empty/null
    const safeUrl = fileUrl || "";
    const ext = (safeUrl.split("?")[0].split(".").pop() || "").toLowerCase();
    const isPdf = ext === "pdf";
    const isDoc = ext === "doc" || ext === "docx";
    const viewerUrl = safeUrl
        ? `https://docs.google.com/gview?url=${encodeURIComponent(safeUrl)}&embedded=true`
        : "";

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={
                <Space>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        href={fileUrl}
                        target="_blank"
                        download
                    >
                        Download {fileName}
                    </Button>
                    <Button
                        icon={<LinkOutlined />}
                        href={fileUrl}
                        target="_blank"
                    >
                        Open in New Tab
                    </Button>
                    <Button onClick={onClose}>Close</Button>
                </Space>
            }
            title={
                <Space>
                    {isPdf ? (
                        <FilePdfOutlined style={{ color: COLORS.antdRed }} />
                    ) : isDoc ? (
                        <FileWordOutlined style={{ color: COLORS.antdBlue }} />
                    ) : (
                        <FileOutlined style={{ color: COLORS.antdGreen }} />
                    )}
                    <span>{fileName}</span>
                </Space>
            }
            width="80vw"
            style={{ top: 20, maxWidth: 1100 }}
            bodyStyle={{
                padding: 0,
                height: "75vh",
                overflow: "hidden",
                position: "relative",
            }}
            destroyOnClose
        >
            {loading && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: COLORS.slate50,
                        zIndex: 2,
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    <Spin size="large" />
                    <Text type="secondary">Loading document...</Text>
                </div>
            )}
            {error ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        gap: 16,
                        padding: 32,
                    }}
                >
                    <FilePdfOutlined
                        style={{ fontSize: 48, color: COLORS.antdRed }}
                    />
                    <Text strong>Unable to preview this document</Text>
                    <Text type="secondary" style={{ textAlign: "center" }}>
                        The document could not be loaded in the viewer. You can
                        download it or open it in a new tab.
                    </Text>
                    <Space>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            href={fileUrl}
                            target="_blank"
                            download
                        >
                            Download
                        </Button>
                        <Button
                            icon={<LinkOutlined />}
                            href={fileUrl}
                            target="_blank"
                        >
                            Open in New Tab
                        </Button>
                    </Space>
                </div>
            ) : (
                <iframe
                    src={viewerUrl}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        display: "block",
                    }}
                    title={fileName}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        setError(true);
                    }}
                    allow="fullscreen"
                />
            )}
        </Modal>
    );
};

// ============================================================
// ======= RESUME / DOCUMENT VIEWER BUTTON ====================
// ============================================================
export const ResumeViewer = ({ fileUrl, fileName = "Resume" }) => {
    // ✅ ALL hooks MUST come before any early return (Rules of Hooks)
    const [modalVisible, setModalVisible] = useState(false);
    const isTouchDevice = useIsTouchDevice();

    // Derive file metadata — safe even when fileUrl is empty or has UUID-like paths
    const ext = fileUrl
        ? (() => {
              const clean = fileUrl.split("?")[0]; // strip query strings
              const parts = clean.split(".");
              const last = parts[parts.length - 1] || ""; // last segment
              // Only treat as extension if short (max 5 chars) — avoids treating UUIDs as ext
              return last.length <= 5 ? last.toLowerCase() : "";
          })()
        : "";
    const isPdf = ext === "pdf";
    const isDoc = ext === "doc" || ext === "docx";
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);

    // Early return AFTER hooks
    if (!fileUrl) return null;

    const iconEl = isPdf ? (
        <FilePdfOutlined style={{ color: COLORS.antdRed }} />
    ) : isDoc ? (
        <FileWordOutlined style={{ color: COLORS.antdBlue }} />
    ) : isImage ? (
        <FileImageOutlined style={{ color: COLORS.antdGreen }} />
    ) : (
        <FileOutlined />
    );

    const extLabel = ext ? ext.toUpperCase() + " File" : "Document";

    return (
        <>
            <div className="resume-viewer-card">
                <div
                    className={`resume-viewer-icon-bg resume-viewer-icon-bg--${isPdf ? "pdf" : isDoc ? "doc" : isImage ? "image" : "default"}`}
                >
                    {iconEl}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: "block", fontSize: 13 }}>
                        {fileName}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {extLabel}
                    </Text>
                </div>
                <Space>
                    {(isPdf || isDoc) && (
                        <Tooltip
                            title="View document in-page"
                            trigger={isTouchDevice ? [] : ["hover"]}
                            open={isTouchDevice ? false : undefined}
                        >
                            <Button
                                type="primary"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => setModalVisible(true)}
                                style={{ borderRadius: 6 }}
                            >
                                Preview
                            </Button>
                        </Tooltip>
                    )}
                    {isImage && (
                        <Tooltip
                            title="View image"
                            trigger={isTouchDevice ? [] : ["hover"]}
                            open={isTouchDevice ? false : undefined}
                        >
                            <Button
                                type="primary"
                                size="small"
                                icon={<EyeOutlined />}
                                href={fileUrl}
                                target="_blank"
                                style={{ borderRadius: 6 }}
                            >
                                View
                            </Button>
                        </Tooltip>
                    )}
                    {/* Always show Download — covers unknown extensions too */}
                    <Tooltip
                        title="Download file"
                        trigger={isTouchDevice ? [] : ["hover"]}
                        open={isTouchDevice ? false : undefined}
                    >
                        <Button
                            size="small"
                            icon={<DownloadOutlined />}
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ borderRadius: 6 }}
                        >
                            Download
                        </Button>
                    </Tooltip>
                </Space>
            </div>

            <DocumentViewerModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                fileUrl={fileUrl}
                fileName={fileName}
            />
        </>
    );
};

// ============================================================
// ======= APPLICANT PHOTO GRID (Gallery-style thumbnails) ====
// ============================================================
export const ApplicantPhotoGrid = ({
    photos = [],
    applicantName = "Applicant",
}) => {
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    if (!photos || photos.length === 0) return null;

    const photoUrls = photos
        .map((p) =>
            buildImageUrl(p.file_path || p.file_url || p.path || p.url || p),
        )
        .filter(Boolean);

    if (photoUrls.length === 0) return null;

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxVisible(true);
    };

    const MAX_VISIBLE = 4;
    const visiblePhotos = photoUrls.slice(0, MAX_VISIBLE);
    const remaining = photoUrls.length - MAX_VISIBLE;

    return (
        <>
            <div style={{ marginBottom: 12 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                    <PictureOutlined
                        style={{ marginRight: 6, color: COLORS.brand }}
                    />
                    Photos ({photoUrls.length})
                </Text>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {visiblePhotos.map((src, i) => (
                        <div
                            key={i}
                            onClick={() => openLightbox(i)}
                            style={{
                                width: 88,
                                height: 88,
                                borderRadius: 10,
                                overflow: "hidden",
                                cursor: "pointer",
                                position: "relative",
                                border: "2px solid #e5e7eb",
                                transition: "all 0.2s",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.border =
                                    "2px solid #667eea";
                                e.currentTarget.style.transform = "scale(1.04)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.border =
                                    "2px solid #e5e7eb";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            <img
                                src={src}
                                alt={`${applicantName} photo ${i + 1}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                                onError={(e) => {
                                    e.target.style.opacity = 0.3;
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "rgba(0,0,0,0)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                        "rgba(0,0,0,0.25)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background =
                                        "rgba(0,0,0,0)";
                                }}
                            >
                                <EyeOutlined
                                    style={{
                                        color: COLORS.white,
                                        fontSize: 18,
                                        opacity: 0,
                                        transition: "opacity 0.2s",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    {remaining > 0 && (
                        <div
                            onClick={() => openLightbox(MAX_VISIBLE)}
                            style={{
                                width: 88,
                                height: 88,
                                borderRadius: 10,
                                background:
                                    "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: COLORS.white,
                                fontWeight: 700,
                                fontSize: 16,
                                boxShadow: "0 2px 8px rgba(79,70,229,0.25)",
                                transition: "transform 0.2s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform =
                                    "scale(1.04)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                        >
                            <span>+{remaining}</span>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 400,
                                    opacity: 0.85,
                                    marginTop: 2,
                                }}
                            >
                                more
                            </span>
                        </div>
                    )}
                </div>
                <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => openLightbox(0)}
                    style={{ padding: 0, marginTop: 4 }}
                >
                    View all photos
                </Button>
            </div>

            <GalleryPhotoLightbox
                images={photoUrls}
                visible={lightboxVisible}
                currentIndex={lightboxIndex}
                onClose={() => setLightboxVisible(false)}
                onChange={setLightboxIndex}
                title={`${applicantName} — Photos`}
            />
        </>
    );
};

// ============================================================
// ======= ID DOCUMENT CARD with gallery-style image view =====
// ============================================================
export const IdDocumentCard = ({ doc, index }) => {
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const fileUrl = buildImageUrl(doc.file_path || doc.file_url || doc.path);
    if (!fileUrl) return null;

    const ext = (fileUrl.split("?")[0].split(".").pop() || "").toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
    const isPdf = ext === "pdf";

    return (
        <>
            <Card
                size="small"
                className="id-doc-card"
                style={{ borderRadius: 10, overflow: "hidden" }}
                bodyStyle={{ padding: 0 }}
            >
                {/* Image thumbnail if it's a JPG/PNG */}
                {isImage && (
                    <div
                        style={{
                            width: "100%",
                            height: 100,
                            overflow: "hidden",
                            cursor: "pointer",
                            position: "relative",
                            background: COLORS.antdGray3,
                        }}
                        onClick={() => setLightboxVisible(true)}
                    >
                        <img
                            src={fileUrl}
                            alt={`ID ${index + 1}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                            onError={(e) => {
                                e.target.style.opacity = 0.3;
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.0)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    "rgba(0,0,0,0.28)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "rgba(0,0,0,0)";
                            }}
                        >
                            <EyeOutlined
                                style={{ color: COLORS.white, fontSize: 22 }}
                            />
                        </div>
                    </div>
                )}
                {/* PDF thumbnail placeholder */}
                {isPdf && (
                    <div
                        style={{
                            width: "100%",
                            height: 80,
                            background:
                                "linear-gradient(135deg,#fff1f0,#ffe4e1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => setLightboxVisible(true)}
                    >
                        <FilePdfOutlined
                            style={{ fontSize: 36, color: COLORS.antdRed }}
                        />
                    </div>
                )}
                <div style={{ padding: "8px 10px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 6,
                        }}
                    >
                        <IdcardOutlined style={{ color: COLORS.brand }} />
                        <Text strong style={{ fontSize: 12 }}>
                            {getIdTypeLabel(doc.type)}
                        </Text>
                    </div>
                    <Space size={4}>
                        <Button
                            type="primary"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => setLightboxVisible(true)}
                            style={{ borderRadius: 6, fontSize: 11 }}
                        >
                            View
                        </Button>
                        <Button
                            size="small"
                            icon={<DownloadOutlined />}
                            href={fileUrl}
                            target="_blank"
                            download
                            style={{ borderRadius: 6, fontSize: 11 }}
                        >
                            Save
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Lightbox for image IDs, DocumentViewer for PDF IDs */}
            {isImage && (
                <GalleryPhotoLightbox
                    images={[fileUrl]}
                    visible={lightboxVisible}
                    currentIndex={0}
                    onClose={() => setLightboxVisible(false)}
                    title={`ID Document — ${getIdTypeLabel(doc.type)}`}
                />
            )}
            {isPdf && (
                <DocumentViewerModal
                    visible={lightboxVisible}
                    onClose={() => setLightboxVisible(false)}
                    fileUrl={fileUrl}
                    fileName={`ID — ${getIdTypeLabel(doc.type)}`}
                />
            )}
        </>
    );
};
