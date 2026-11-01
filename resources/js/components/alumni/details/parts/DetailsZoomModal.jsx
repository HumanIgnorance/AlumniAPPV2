import React from "react";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Image, Modal, Upload } from "antd";
import { useAlumniDetailsContext } from "~/components/alumni/details/AlumniDetailsContext";

export default function DetailsZoomModal() {
    const {
        zoomVisible,
        setZoomVisible,
        zoomImage,
        isAdmin,
        downloadImage,
        uploadLoading,
        zoomDocumentType,
        handleUploadProfileImage,
        handleUploadDocument,
    } = useAlumniDetailsContext();

    return (
        <Modal
            open={zoomVisible}
            onCancel={() => setZoomVisible(false)}
            footer={null}
            width="auto"
            className="image-zoom-modal"
            closable
            style={{ top: 20 }}
        >
            {zoomImage && (
                <div className="zoom-container">
                    <Image
                        src={zoomImage}
                        alt="Zoomed"
                        style={{ maxWidth: "100%", maxHeight: "80vh" }}
                        preview={false}
                    />

                    <div className="zoom-actions">
                        {isAdmin && (
                            <>
                                {/* DOWNLOAD (always allowed) */}
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    onClick={() => downloadImage(zoomImage)}
                                    loading={uploadLoading}
                                >
                                    Download
                                </Button>

                                {/* ✅ PROFILE IMAGE UPLOAD (only if NOT a document) */}
                                {zoomDocumentType === null && (
                                    <Upload
                                        showUploadList={false}
                                        accept="image/*"
                                        beforeUpload={handleUploadProfileImage}
                                        disabled={uploadLoading}
                                    >
                                        <Button
                                            icon={<UploadOutlined />}
                                            loading={uploadLoading}
                                        >
                                            Replace Profile Image
                                        </Button>
                                    </Upload>
                                )}

                                {/* ✅ DOCUMENT UPLOAD (only if documentType exists) */}
                                {zoomDocumentType && (
                                    <Upload
                                        showUploadList={false}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        beforeUpload={(file) =>
                                            handleUploadDocument(
                                                file,
                                                zoomDocumentType,
                                            )
                                        }
                                        disabled={uploadLoading}
                                    >
                                        <Button
                                            icon={<UploadOutlined />}
                                            loading={uploadLoading}
                                        >
                                            Replace Document
                                        </Button>
                                    </Upload>
                                )}
                            </>
                        )}

                        {/* CLOSE */}
                        <Button onClick={() => setZoomVisible(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
