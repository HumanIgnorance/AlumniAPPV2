import { useEffect, useRef } from "react";
import { message } from "antd";
import axios from "~/utils/axiosConfig";

export default function useDetailsUploads({
    alumniId,
    setUploadLoading,
    setZoomVisible,
    setLocalDocuments,
    refetchAlumni,
    setLocalProfileImage,
    previewData,
}) {
    // blob: preview URLs are only a fallback when the server sends no URL.
    // They were never revoked, so every upload leaked the whole image in
    // memory. Keep one per kind, revoke the replaced one and all on unmount.
    const blobUrls = useRef({});
    const makeBlobUrl = (kind, file) => {
        const previous = blobUrls.current[kind];
        if (previous) URL.revokeObjectURL(previous);
        const url = URL.createObjectURL(file);
        blobUrls.current[kind] = url;
        return url;
    };
    useEffect(() => {
        const urls = blobUrls.current;
        return () => {
            Object.values(urls).forEach((u) => URL.revokeObjectURL(u));
        };
    }, []);

    const handleUploadDocument = async (file, documentType) => {
        if (!alumniId) {
            message.error("Alumni ID not found");
            // console.log("[v0] Alumni ID is missing for document upload:", alumniId);
            return false;
        }

        try {
            // Phase 6: removed a console.log here that included the
            // alumni ID and document type on every upload attempt.
            setUploadLoading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("document_type", documentType);

            const uploadUrl = `/admin/alumni/${alumniId}/upload-document`;

            const response = await axios.post(uploadUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                message.success(`${documentType} uploaded successfully`);
                setZoomVisible(false);

                // Immediately update local state with the new document
                const newDocUrl =
                    response.data.file_url ||
                    response.data.data?.file_url ||
                    makeBlobUrl(`doc:${documentType}`, file);
                setLocalDocuments((prev) => {
                    const filtered = prev.filter(
                        (doc) =>
                            doc.document_type !== documentType &&
                            doc.type !== documentType,
                    );
                    return [
                        ...filtered,
                        {
                            document_type: documentType,
                            type: documentType,
                            file_url: newDocUrl,
                        },
                    ];
                });

                if (refetchAlumni) {
                    try {
                        await refetchAlumni();
                    } catch (refetchError) {
                        // Refetch error - local state already updated
                    }
                }
            } else {
                message.error(response.data.message || "Upload failed");
            }
        } catch (error) {
            message.error(
                error.response?.data?.message ||
                    `Failed to upload ${documentType}`,
            );
        } finally {
            setUploadLoading(false);
        }

        return false;
    };

    const handleUploadProfileImage = async (file) => {
        if (!alumniId) {
            message.error("Alumni ID not found");
            return false;
        }

        try {
            setUploadLoading(true);
            const formData = new FormData();
            formData.append("profile_image", file);

            const uploadUrl = `/admin/alumni/${alumniId}/profile-image`;

            const response = await axios.post(uploadUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                message.success("Profile image updated successfully");
                setZoomVisible(false);

                // Resolve the new URL (server URL preferred, blob as fallback)
                const newImageUrl =
                    response.data.profile_image ||
                    response.data.data?.profile_image ||
                    response.data.profile_image_url ||
                    response.data.data?.profile_image_url ||
                    makeBlobUrl("profile-image", file);

                // Immediately update local state
                setLocalProfileImage(newImageUrl);

                // 🔔 Broadcast to other components (e.g. Layout notifications)
                //    so cached avatars referencing this alumni update instantly.
                window.dispatchEvent(
                    new CustomEvent("alumni-profile-image-updated", {
                        detail: {
                            alumniId,
                            userId:
                                previewData?.user_id || previewData?.user?.id,
                            newImageUrl,
                        },
                    }),
                );

                if (refetchAlumni) {
                    try {
                        await refetchAlumni();
                    } catch (refetchError) {
                        // Refetch error - local state already updated
                    }
                }
            } else {
                message.error(response.data.message || "Upload failed");
            }
        } catch (error) {
            message.error(
                error.response?.data?.message ||
                    "Failed to upload profile image",
            );
        } finally {
            setUploadLoading(false);
        }

        return false;
    };

    return { handleUploadDocument, handleUploadProfileImage };
}
