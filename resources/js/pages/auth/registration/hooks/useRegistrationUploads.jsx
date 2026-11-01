import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Upload, message } from "antd";
import { ID_TYPES } from "~/config/alumniOptions";

export default function useRegistrationUploads({
    setProfileImage,
    setIdDocuments,
}) {
    // Profile Image Upload
    const handleProfileImageUpload = (info) => {
        if (info.file.status === "uploading") {
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj, (url) => {
                setProfileImage(url);
                message.success("Profile image uploaded successfully!");
            });
        }
    };

    // ID Documents Upload
    const handleIdDocumentsUpload = (info, documentType) => {
        if (info.file.status === "uploading") {
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj, (url) => {
                const newDocument = {
                    id: Date.now(),
                    type: documentType,
                    url: url,
                    name: info.file.name,
                    status: "pending",
                    uploadDate: new Date().toISOString(),
                };

                setIdDocuments((prev) => {
                    const filtered = prev.filter(
                        (doc) => doc.type !== documentType,
                    );
                    return [...filtered, newDocument];
                });

                message.success(
                    `${ID_TYPES.find((doc) => doc.value === documentType)?.label} uploaded successfully!`,
                );
            });
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const ALLOWED_IMAGE_MIMES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "webp"];

    const verifyImageMagicBytes = (file) =>
        new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = (e) => {
                const bytes = new Uint8Array(e.target.result);
                if (bytes.length < 12) return resolve(false);
                // JPEG: FF D8 FF
                const isJpeg =
                    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
                // PNG: 89 50 4E 47 0D 0A 1A 0A
                const isPng =
                    bytes[0] === 0x89 &&
                    bytes[1] === 0x50 &&
                    bytes[2] === 0x4e &&
                    bytes[3] === 0x47 &&
                    bytes[4] === 0x0d &&
                    bytes[5] === 0x0a &&
                    bytes[6] === 0x1a &&
                    bytes[7] === 0x0a;
                // WEBP: "RIFF"...."WEBP"
                const isWebp =
                    bytes[0] === 0x52 &&
                    bytes[1] === 0x49 &&
                    bytes[2] === 0x46 &&
                    bytes[3] === 0x46 &&
                    bytes[8] === 0x57 &&
                    bytes[9] === 0x45 &&
                    bytes[10] === 0x42 &&
                    bytes[11] === 0x50;
                resolve(isJpeg || isPng || isWebp);
            };
            reader.onerror = () => resolve(false);
            reader.readAsArrayBuffer(file.slice(0, 16));
        });

    const beforeUpload = async (file) => {
        // 1) Extension / MIME quick check
        const ext = (file.name?.split(".").pop() || "").toLowerCase();
        const mimeOk = ALLOWED_IMAGE_MIMES.includes(file.type);
        const extOk = ALLOWED_IMAGE_EXTS.includes(ext);
        if (!mimeOk || !extOk) {
            message.error("Only JPG, PNG, or WEBP image files are allowed.");
            return Upload.LIST_IGNORE;
        }

        // 2) Size guard (5MB)
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error("Image must be smaller than 5MB!");
            return Upload.LIST_IGNORE;
        }

        // 3) Filename sanity — block suspicious double extensions / scripts
        const suspicious =
            /\.(exe|js|jsx|ts|tsx|php|sh|bat|cmd|html?|svg|pdf|zip|rar)(\.|$)/i;
        if (suspicious.test(file.name)) {
            message.error("This file name looks unsafe and was rejected.");
            return Upload.LIST_IGNORE;
        }

        // 4) Magic-byte verification — defeats files that lie about their type
        const realImage = await verifyImageMagicBytes(file);
        if (!realImage) {
            message.error(
                "File contents do not match a real image. Upload rejected.",
            );
            return Upload.LIST_IGNORE;
        }

        return true;
    };

    const profileUploadProps = {
        beforeUpload,
        accept: "image/jpeg,image/jpg,image/png,image/webp",
        multiple: false,
        maxCount: 1,
        customRequest: ({ file, onSuccess }) => {
            setTimeout(() => {
                onSuccess("ok");
            }, 0);
        },
        onChange: handleProfileImageUpload,
        showUploadList: false,
    };

    const idUploadProps = (documentType) => ({
        beforeUpload,
        accept: "image/jpeg,image/jpg,image/png,image/webp",
        multiple: false,
        maxCount: 1,
        customRequest: ({ file, onSuccess }) => {
            setTimeout(() => {
                onSuccess("ok");
            }, 0);
        },
        onChange: (info) => handleIdDocumentsUpload(info, documentType),
        showUploadList: false,
    });

    const removeDocument = (documentId) => {
        setIdDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        message.success("Document removed successfully!");
    };

    const updateDocumentStatus = (documentId, status) => {
        setIdDocuments((prev) =>
            prev.map((doc) =>
                doc.id === documentId ? { ...doc, status } : doc,
            ),
        );
    };

    const profileUploadButton = (
        <div className="upload-button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload Photo</div>
        </div>
    );

    const idUploadButton = (documentType) => (
        <div className="id-upload-button">
            <UploadOutlined />
            <div style={{ marginTop: 4, fontSize: "12px" }}>
                Upload{" "}
                {ID_TYPES.find((doc) => doc.value === documentType)?.label}
            </div>
        </div>
    );

    // Helper function to convert data URL to Blob
    const dataURLToBlobSync = (dataURL) => {
        try {
            const arr = dataURL.split(",");
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new Blob([u8arr], { type: mime });
        } catch (error) {
            console.error("Error converting data URL to blob:", error);
            throw error;
        }
    };

    // Async version of dataURLToBlob
    const dataURLToBlob = async (dataURL) => {
        return dataURLToBlobSync(dataURL);
    };

    const getDocumentStatus = (status) => {
        const statusConfig = {
            pending: {
                color: "orange",
                text: "Pending Review",
                icon: <ClockCircleOutlined />,
            },
            approved: {
                color: "green",
                text: "Approved",
                icon: <CheckCircleOutlined />,
            },
            rejected: {
                color: "red",
                text: "Rejected",
                icon: <DeleteOutlined />,
            },
        };
        return statusConfig[status] || statusConfig.pending;
    };

    return {
        dataURLToBlobSync,
        profileUploadProps,
        profileUploadButton,
        removeDocument,
        idUploadProps,
        idUploadButton,
        getDocumentStatus,
    };
}
