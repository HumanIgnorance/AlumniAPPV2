import { useCallback, useEffect } from "react";
import {
    CheckCircleOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import dayjs from "dayjs";
import {
    GALLERY_EDIT_DRAFT_KEY,
    GALLERY_UPLOAD_DRAFT_KEY,
    dataUrlToFile,
    fileToDataUrl,
    safeClearDraft,
    safeGetDraft,
    safeSetDraft,
} from "~/pages/admin/Gallery/galleryHelpers";

export default function useGalleryDrafts({
    suppressAutoSaveRef,
    form,
    fileList,
    uploadSaveTimerRef,
    setFileList,
    selectedGallery,
    editForm,
    removedExistingIndexes,
    editSaveTimerRef,
    uploadModalVisible,
    editModalVisible,
    resumeHandledRef,
    setUploadModalVisible,
}) {
    // ===== Draft Auto-Save: serialize / restore for UPLOAD modal =====
    const buildFileListFromDraftFiles = (draftFiles) => {
        if (!Array.isArray(draftFiles)) return [];
        return draftFiles
            .map((f, i) => {
                const file = dataUrlToFile(
                    f.dataUrl,
                    f.name || `image-${i + 1}.jpg`,
                    f.type,
                );
                if (!file) return null;
                return {
                    uid: f.uid || `restored-${i}-${Date.now()}`,
                    name: f.name || file.name,
                    status: "done",
                    type: file.type,
                    size: file.size,
                    originFileObj: file,
                    thumbUrl: f.dataUrl,
                    url: f.dataUrl,
                };
            })
            .filter(Boolean);
    };

    const serializeFileList = async (list) => {
        const out = [];
        for (const f of list) {
            const blob =
                f.originFileObj ||
                (f.url && f.url.startsWith("data:") ? null : null);
            // Prefer existing data URL on the file entry (already restored items)
            if (
                f.url &&
                typeof f.url === "string" &&
                f.url.startsWith("data:")
            ) {
                out.push({
                    uid: f.uid,
                    name: f.name,
                    type: f.type,
                    dataUrl: f.url,
                });
                continue;
            }
            if (blob) {
                const dataUrl = await fileToDataUrl(blob);
                if (dataUrl)
                    out.push({
                        uid: f.uid,
                        name: f.name,
                        type: blob.type,
                        dataUrl,
                    });
            }
        }
        return out;
    };

    const saveUploadDraft = useCallback(async () => {
        if (suppressAutoSaveRef.current) return;
        try {
            const values = form.getFieldsValue();
            const title = (values.title || "").trim();
            const eventDate = values.event_date
                ? values.event_date.format("YYYY-MM-DD")
                : null;
            const files = await serializeFileList(fileList);
            const hasContent = !!(title || eventDate || files.length > 0);
            if (!hasContent) {
                safeClearDraft(GALLERY_UPLOAD_DRAFT_KEY);
                return;
            }
            safeSetDraft(GALLERY_UPLOAD_DRAFT_KEY, {
                mode: "create",
                title,
                event_date: eventDate,
                files,
                savedAt: new Date().toISOString(),
            });
        } catch (e) {
            // ignore
        }
    }, [form, fileList]);

    const scheduleSaveUploadDraft = useCallback(() => {
        if (uploadSaveTimerRef.current)
            clearTimeout(uploadSaveTimerRef.current);
        uploadSaveTimerRef.current = setTimeout(() => {
            saveUploadDraft();
        }, 500);
    }, [saveUploadDraft]);

    const restoreUploadDraft = (draft) => {
        suppressAutoSaveRef.current = true;
        try {
            form.setFieldsValue({
                title: draft.title || "",
                event_date: draft.event_date ? dayjs(draft.event_date) : null,
            });
            const restored = buildFileListFromDraftFiles(draft.files || []);
            setFileList(restored);
        } finally {
            // Re-enable after a tick so the change events from setFieldsValue/setFileList don't immediately re-save
            setTimeout(() => {
                suppressAutoSaveRef.current = false;
            }, 250);
        }
    };

    const hasUploadDirtyContent = () => {
        const values = form.getFieldsValue();
        const title = (values.title || "").trim();
        return !!(
            title ||
            values.event_date ||
            (fileList && fileList.length > 0)
        );
    };

    // ===== Draft Auto-Save: serialize / restore for EDIT modal =====
    const saveEditDraft = useCallback(async () => {
        if (suppressAutoSaveRef.current) return;
        if (!selectedGallery) return;
        try {
            const values = editForm.getFieldsValue();
            const title = (values.title || "").trim();
            const eventDate = values.event_date
                ? values.event_date.format("YYYY-MM-DD")
                : null;
            const files = await serializeFileList(fileList);
            const baseTitle = selectedGallery.title || "";
            const baseDate = selectedGallery.event_date
                ? dayjs(selectedGallery.event_date).format("YYYY-MM-DD")
                : null;
            const dirty =
                title !== baseTitle ||
                eventDate !== baseDate ||
                files.length > 0 ||
                (removedExistingIndexes && removedExistingIndexes.length > 0);
            if (!dirty) {
                safeClearDraft(GALLERY_EDIT_DRAFT_KEY);
                return;
            }
            safeSetDraft(GALLERY_EDIT_DRAFT_KEY, {
                mode: "edit",
                galleryId: selectedGallery.id,
                title,
                event_date: eventDate,
                files,
                removedExistingIndexes: removedExistingIndexes || [],
                savedAt: new Date().toISOString(),
            });
        } catch (e) {
            // ignore
        }
    }, [editForm, fileList, selectedGallery, removedExistingIndexes]);

    const scheduleSaveEditDraft = useCallback(() => {
        if (editSaveTimerRef.current) clearTimeout(editSaveTimerRef.current);
        editSaveTimerRef.current = setTimeout(() => {
            saveEditDraft();
        }, 500);
    }, [saveEditDraft]);

    const hasEditDirtyContent = () => {
        if (!selectedGallery) return false;
        const values = editForm.getFieldsValue();
        const title = (values.title || "").trim();
        const eventDate = values.event_date
            ? values.event_date.format("YYYY-MM-DD")
            : null;
        const baseTitle = selectedGallery.title || "";
        const baseDate = selectedGallery.event_date
            ? dayjs(selectedGallery.event_date).format("YYYY-MM-DD")
            : null;
        return (
            title !== baseTitle ||
            eventDate !== baseDate ||
            (fileList && fileList.length > 0) ||
            (removedExistingIndexes && removedExistingIndexes.length > 0)
        );
    };

    // ===== Draft Auto-Save: auto-save when modal contents change =====
    useEffect(() => {
        if (!uploadModalVisible) return;
        scheduleSaveUploadDraft();
        return () => {
            if (uploadSaveTimerRef.current)
                clearTimeout(uploadSaveTimerRef.current);
        };
    }, [uploadModalVisible, fileList, scheduleSaveUploadDraft]);

    useEffect(() => {
        if (!editModalVisible) return;
        scheduleSaveEditDraft();
        return () => {
            if (editSaveTimerRef.current)
                clearTimeout(editSaveTimerRef.current);
        };
    }, [
        editModalVisible,
        fileList,
        removedExistingIndexes,
        scheduleSaveEditDraft,
    ]);

    // ===== Draft Auto-Save: on mount, prompt to resume if unsaved upload draft exists =====
    useEffect(() => {
        if (resumeHandledRef.current) return;
        resumeHandledRef.current = true;
        const draft = safeGetDraft(GALLERY_UPLOAD_DRAFT_KEY);
        if (!draft || draft.mode !== "create") return;
        const hasAny =
            (draft.title && draft.title.length > 0) ||
            draft.event_date ||
            (Array.isArray(draft.files) && draft.files.length > 0);
        if (!hasAny) return;

        Modal.confirm({
            title: "Resume your unsaved gallery?",
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>
                        You have an unfinished gallery draft
                        {draft.savedAt
                            ? ` from ${dayjs(draft.savedAt).format("MMM D, YYYY h:mm A")}`
                            : ""}
                        .
                    </p>
                    <p style={{ marginBottom: 0 }}>
                        <strong>Continue</strong> to restore your fields and
                        images, or <strong>Discard</strong> to delete the draft.
                    </p>
                </div>
            ),
            okText: "Continue",
            cancelText: "Discard",
            okButtonProps: { icon: <CheckCircleOutlined /> },
            cancelButtonProps: { danger: true, icon: <DeleteOutlined /> },
            onOk: () => {
                restoreUploadDraft(draft);
                setUploadModalVisible(true);
            },
            onCancel: () => {
                safeClearDraft(GALLERY_UPLOAD_DRAFT_KEY);
            },
        });
        // Run only once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        hasUploadDirtyContent,
        saveUploadDraft,
        hasEditDirtyContent,
        saveEditDraft,
        buildFileListFromDraftFiles,
        scheduleSaveUploadDraft,
        scheduleSaveEditDraft,
    };
}
