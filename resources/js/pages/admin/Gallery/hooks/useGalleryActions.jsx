import {
    CheckCircleOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { Modal, message } from "antd";
import dayjs from "dayjs";
import { COLORS } from "~/config/theme";
import {
    GALLERY_EDIT_DRAFT_KEY,
    GALLERY_UPLOAD_DRAFT_KEY,
    MAX_IMAGES_PER_UPLOAD,
    safeClearDraft,
    safeGetDraft,
} from "~/pages/admin/Gallery/galleryHelpers";
import axiosConfig from "~/utils/axiosConfig";

export default function useGalleryActions({
    hasUploadDirtyContent,
    setUploadModalVisible,
    form,
    setFileList,
    saveUploadDraft,
    hasEditDirtyContent,
    setEditModalVisible,
    editForm,
    setRemovedExistingIndexes,
    setSelectedGallery,
    saveEditDraft,
    fileList,
    setUploading,
    fetchGalleries,
    fetchStatistics,
    suppressAutoSaveRef,
    buildFileListFromDraftFiles,
    removedExistingIndexes,
    selectedGallery,
    setDeleteModalVisible,
    selectedImages,
    setBulkDeleteModalVisible,
    setSelectionMode,
    setSelectedImages,
}) {
    // ===== Draft Auto-Save: confirm-on-close handlers =====
    const requestCloseUploadModal = () => {
        if (!hasUploadDirtyContent()) {
            setUploadModalVisible(false);
            form.resetFields();
            setFileList([]);
            safeClearDraft(GALLERY_UPLOAD_DRAFT_KEY);
            return;
        }
        Modal.confirm({
            title: "Keep your unsaved changes?",
            icon: <WarningOutlined style={{ color: COLORS.amber500 }} />,
            content:
                "You have unsaved fields or images. Continue editing later, or discard everything now?",
            okText: "Continue",
            cancelText: "Discard",
            okButtonProps: { icon: <CheckCircleOutlined /> },
            cancelButtonProps: { danger: true, icon: <DeleteOutlined /> },
            onOk: async () => {
                // Persist current state and close — user can resume later.
                await saveUploadDraft();
                setUploadModalVisible(false);
            },
            onCancel: () => {
                // Discard: clear fields, file list, and any saved draft.
                safeClearDraft(GALLERY_UPLOAD_DRAFT_KEY);
                form.resetFields();
                setFileList([]);
                setUploadModalVisible(false);
            },
        });
    };

    const requestCloseEditModal = () => {
        if (!hasEditDirtyContent()) {
            setEditModalVisible(false);
            editForm.resetFields();
            setFileList([]);
            setRemovedExistingIndexes([]);
            setSelectedGallery(null);
            safeClearDraft(GALLERY_EDIT_DRAFT_KEY);
            return;
        }
        Modal.confirm({
            title: "Keep your unsaved changes?",
            icon: <WarningOutlined style={{ color: COLORS.amber500 }} />,
            content:
                "You have unsaved edits on this gallery. Continue editing later, or discard the changes now?",
            okText: "Continue",
            cancelText: "Discard",
            okButtonProps: { icon: <CheckCircleOutlined /> },
            cancelButtonProps: { danger: true, icon: <DeleteOutlined /> },
            onOk: async () => {
                await saveEditDraft();
                setEditModalVisible(false);
            },
            onCancel: () => {
                safeClearDraft(GALLERY_EDIT_DRAFT_KEY);
                editForm.resetFields();
                setFileList([]);
                setRemovedExistingIndexes([]);
                setSelectedGallery(null);
                setEditModalVisible(false);
            },
        });
    };

    // Upload handlers
    const handleUpload = async (values) => {
        if (!values.title || !values.title.trim()) {
            message.error("Please enter a title");
            return;
        }

        if (!values.event_date) {
            message.error("Please select an event date");
            return;
        }

        if (fileList.length === 0) {
            message.error("Please select at least one image to upload");
            return;
        }

        if (fileList.length > MAX_IMAGES_PER_UPLOAD) {
            message.error(
                `You can only upload up to ${MAX_IMAGES_PER_UPLOAD} images at a time`,
            );
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("title", values.title.trim());
        formData.append("event_date", values.event_date.format("YYYY-MM-DD"));

        fileList.forEach((file, index) => {
            formData.append(`images[${index}]`, file.originFileObj);
        });

        try {
            const response = await axiosConfig.post("/galleries", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.success) {
                message.success(
                    `Gallery created with ${fileList.length} image(s)!`,
                );
                setUploadModalVisible(false);
                form.resetFields();
                setFileList([]);
                // Clear the saved draft now that it has been persisted to the server.
                safeClearDraft(GALLERY_UPLOAD_DRAFT_KEY);
                fetchGalleries();
                fetchStatistics();
            }
        } catch (error) {
            console.error("Upload error:", error);
            const errorMsg = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join(", ")
                : error.response?.data?.message || "Failed to upload images";
            message.error(errorMsg);
        } finally {
            setUploading(false);
        }
    };

    // Edit handlers
    const handleEdit = (gallery) => {
        setSelectedGallery(gallery);
        setRemovedExistingIndexes([]);
        setFileList([]);
        editForm.setFieldsValue({
            title: gallery.title,
            event_date: gallery.event_date ? dayjs(gallery.event_date) : null,
        });

        // If we have a saved edit draft for the same gallery, offer to restore it.
        const draft = safeGetDraft(GALLERY_EDIT_DRAFT_KEY);
        if (draft && draft.mode === "edit" && draft.galleryId === gallery.id) {
            Modal.confirm({
                title: "Resume your unsaved edits?",
                icon: <ExclamationCircleOutlined />,
                content: (
                    <div>
                        <p>
                            You have unsaved edits on this gallery
                            {draft.savedAt
                                ? ` from ${dayjs(draft.savedAt).format("MMM D, YYYY h:mm A")}`
                                : ""}
                            .
                        </p>
                        <p style={{ marginBottom: 0 }}>
                            <strong>Continue</strong> to restore your changes,
                            or <strong>Discard</strong> to start fresh.
                        </p>
                    </div>
                ),
                okText: "Continue",
                cancelText: "Discard",
                okButtonProps: { icon: <CheckCircleOutlined /> },
                cancelButtonProps: { danger: true, icon: <DeleteOutlined /> },
                onOk: () => {
                    suppressAutoSaveRef.current = true;
                    try {
                        editForm.setFieldsValue({
                            title: draft.title || gallery.title,
                            event_date: draft.event_date
                                ? dayjs(draft.event_date)
                                : gallery.event_date
                                  ? dayjs(gallery.event_date)
                                  : null,
                        });
                        setFileList(
                            buildFileListFromDraftFiles(draft.files || []),
                        );
                        setRemovedExistingIndexes(
                            Array.isArray(draft.removedExistingIndexes)
                                ? draft.removedExistingIndexes
                                : [],
                        );
                    } finally {
                        setTimeout(() => {
                            suppressAutoSaveRef.current = false;
                        }, 250);
                    }
                    setEditModalVisible(true);
                },
                onCancel: () => {
                    safeClearDraft(GALLERY_EDIT_DRAFT_KEY);
                    setEditModalVisible(true);
                },
            });
        } else {
            setEditModalVisible(true);
        }
    };

    const handleEditSubmit = async (values) => {
        if (!values.title || !values.title.trim()) {
            message.error("Please enter a title");
            return;
        }

        if (!values.event_date) {
            message.error("Please select an event date");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("title", values.title.trim());
        formData.append("event_date", values.event_date.format("YYYY-MM-DD"));

        if (fileList.length > 0) {
            fileList.forEach((file, index) => {
                formData.append(`images[${index}]`, file.originFileObj);
            });
        }

        // NEW: send indexes of existing images the admin chose to remove
        if (removedExistingIndexes.length > 0) {
            removedExistingIndexes.forEach((idx, i) => {
                formData.append(`removed_indexes[${i}]`, idx);
            });
        }

        try {
            const response = await axiosConfig.post(
                `/galleries/${selectedGallery.id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            if (response.data.success) {
                message.success("Gallery updated successfully!");
                setEditModalVisible(false);
                editForm.resetFields();
                setFileList([]);
                setRemovedExistingIndexes([]);
                setSelectedGallery(null);
                // Clear the edit draft now that the changes are saved on the server.
                safeClearDraft(GALLERY_EDIT_DRAFT_KEY);
                fetchGalleries();
            }
        } catch (error) {
            console.error("Edit error:", error);
            const errorMsg = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join(", ")
                : error.response?.data?.message || "Failed to update gallery";
            message.error(errorMsg);
        } finally {
            setUploading(false);
        }
    };

    // Delete handlers
    const handleDelete = (gallery) => {
        setSelectedGallery(gallery);
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await axiosConfig.delete(
                `/galleries/${selectedGallery.id}`,
            );
            if (response.data.success) {
                message.success("Gallery deleted successfully!");
                setDeleteModalVisible(false);
                setSelectedGallery(null);
                fetchGalleries();
                fetchStatistics();
            }
        } catch (error) {
            console.error("Delete error:", error);
            message.error(
                error.response?.data?.message || "Failed to delete gallery",
            );
        }
    };

    // Bulk delete handlers
    const handleBulkDelete = () => {
        if (selectedImages.length === 0) {
            message.warning("Please select at least one gallery to delete");
            return;
        }
        setBulkDeleteModalVisible(true);
    };

    const confirmBulkDelete = async () => {
        if (selectedImages.length === 0) return;

        message.loading({
            content: `Deleting ${selectedImages.length} gallery(s)...`,
            key: "bulk-delete",
            duration: 0,
        });

        let successCount = 0;
        let failCount = 0;

        for (const galleryId of selectedImages) {
            try {
                const response = await axiosConfig.delete(
                    `/galleries/${galleryId}`,
                );
                if (response.data.success) {
                    successCount++;
                } else {
                    failCount++;
                }
            } catch (error) {
                console.error("Delete error for gallery:", galleryId, error);
                failCount++;
            }
        }

        setBulkDeleteModalVisible(false);
        setSelectionMode(false);
        setSelectedImages([]);
        fetchGalleries();
        fetchStatistics();

        if (failCount === 0) {
            message.success({
                content: `Successfully deleted ${successCount} gallery(s)!`,
                key: "bulk-delete",
            });
        } else {
            message.warning({
                content: `Deleted ${successCount} gallery(s), ${failCount} failed.`,
                key: "bulk-delete",
            });
        }
    };

    return {
        handleBulkDelete,
        handleEdit,
        handleDelete,
        requestCloseUploadModal,
        handleUpload,
        requestCloseEditModal,
        handleEditSubmit,
        confirmDelete,
        confirmBulkDelete,
    };
}
