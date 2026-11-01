import React from "react";
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Image, Tooltip } from "antd";
import { COLORS } from "~/config/theme";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";

// NEW: shared thumbnail grid for files staged in fileList (with view + remove)
export default function StagedThumbs() {
    const { fileList, getFileThumbUrl, setFileList } = useGalleryContext();

    if (fileList.length === 0) return null;
    return (
        <div
            className="gal-upload-thumbs"
            style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                gap: 8,
                maxHeight: 240,
                overflowY: "auto",
                padding: 8,
                border: "1px dashed var(--border, #e5e7eb)",
                borderRadius: 10,
                background: "var(--surface-2, #f3f4f6)",
            }}
        >
            <Image.PreviewGroup>
                {fileList.map((file) => {
                    const src = getFileThumbUrl(file);
                    return (
                        <div
                            key={file.uid}
                            style={{
                                position: "relative",
                                width: "100%",
                                paddingTop: "100%",
                                borderRadius: 8,
                                overflow: "hidden",
                                background: COLORS.black,
                                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Image
                                src={src}
                                alt={file.name}
                                preview={{
                                    mask: (
                                        <EyeOutlined style={{ fontSize: 18 }} />
                                    ),
                                }}
                                fallback="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%231a1f2b%22/%3E%3Cpath d=%22M20 44l8-10 6 7 4-5 6 8H20z%22 fill=%22%23475569%22/%3E%3Ccircle cx=%2224%22 cy=%2224%22 r=%224%22 fill=%22%23475569%22/%3E%3C/svg%3E"
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
                            <Tooltip title="Remove">
                                <Button
                                    size="small"
                                    danger
                                    shape="circle"
                                    icon={<CloseOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFileList((prev) =>
                                            prev.filter(
                                                (f) => f.uid !== file.uid,
                                            ),
                                        );
                                    }}
                                    style={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                        zIndex: 3,
                                    }}
                                />
                            </Tooltip>
                        </div>
                    );
                })}
            </Image.PreviewGroup>
        </div>
    );
}
