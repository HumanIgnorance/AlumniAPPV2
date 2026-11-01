import { useCallback, useEffect } from "react";
import {
    clearJobPostDraft,
    loadJobPostDraft,
    saveJobPostDraft,
} from "~/pages/admin/JobPost/parts/jobPostStorage";
import { isValidHttpUrl } from "~/pages/admin/JobPost/parts/jobPostUtils";

export default function useJobPostDraft({
    form,
    bannerFileListRef,
    editingPost,
    isModalVisible,
    setDraftLastSaved,
    draftSaveTimerRef,
    setReferenceUrlValid,
    setFileList,
    setPendingDraft,
    setDraftRestoreModalVisible,
    setIsModalVisible,
    setEditingPost,
    setDiscardConfirmVisible,
}) {
    // ============================================================
    // ENHANCEMENT: Helpers for draft / smart close / form snapshot
    // ============================================================
    const getCurrentFormSnapshot = useCallback(() => {
        try {
            const values = form.getFieldsValue() || {};
            return {
                ...values,
                // capture banner preview info (we cannot persist a File object reliably,
                // but we keep filename + url so the user knows to re-upload if it was new)
                _banner: (bannerFileListRef.current || []).map((f) => ({
                    uid: f.uid,
                    name: f.name,
                    url: f.url || f.thumbUrl || null,
                    status: f.status,
                })),
            };
        } catch {
            return {};
        }
    }, [form]);

    const hasAnyFormValue = useCallback(() => {
        const snap = getCurrentFormSnapshot();
        const banner = snap._banner || [];
        delete snap._banner;
        const hasValues = Object.values(snap).some(
            (v) =>
                v !== undefined &&
                v !== null &&
                v !== "" &&
                !(Array.isArray(v) && v.length === 0),
        );
        return hasValues || banner.length > 0;
    }, [getCurrentFormSnapshot]);

    const persistDraftNow = useCallback(() => {
        // Never auto-save when editing an existing post — drafts are for NEW posts.
        if (editingPost) return;
        if (!isModalVisible) return;
        if (!hasAnyFormValue()) return;
        const snap = getCurrentFormSnapshot();
        const ok = saveJobPostDraft(snap);
        if (ok) setDraftLastSaved(new Date());
    }, [editingPost, isModalVisible, hasAnyFormValue, getCurrentFormSnapshot]);

    // Debounced auto-save on any form change
    const handleFormValuesChange = useCallback(() => {
        if (editingPost) return;
        if (draftSaveTimerRef.current) clearTimeout(draftSaveTimerRef.current);
        draftSaveTimerRef.current = setTimeout(persistDraftNow, 400);
    }, [editingPost, persistDraftNow]);

    // Restore draft values into the form
    const applyDraftToForm = useCallback(
        (draft) => {
            if (!draft) return;
            try {
                const { _banner, _savedAt, ...values } = draft;
                form.setFieldsValue(values);
                // Restore reference URL validity indicator
                if (values.reference_url) {
                    setReferenceUrlValid(isValidHttpUrl(values.reference_url));
                }
                // Restore banner placeholders (URL-only items survive; freshly uploaded
                // File blobs cannot be persisted by localStorage and must be re-attached)
                if (Array.isArray(_banner) && _banner.length > 0) {
                    const restored = _banner
                        .filter((b) => b.url)
                        .map((b) => ({
                            uid: b.uid || `draft-${Date.now()}`,
                            name: b.name || "banner",
                            status: "done",
                            url: b.url,
                        }));
                    if (restored.length > 0) {
                        setFileList(restored);
                        bannerFileListRef.current = restored;
                    }
                }
                setDraftLastSaved(_savedAt ? new Date(_savedAt) : new Date());
            } catch (e) {
                console.warn("applyDraftToForm failed:", e);
            }
        },
        [form],
    );

    // When the create modal opens for a NEW post, offer to restore an existing draft.
    useEffect(() => {
        if (!isModalVisible) return;
        if (editingPost) return;
        const draft = loadJobPostDraft();
        if (
            draft &&
            Object.keys(draft).some((k) => k !== "_savedAt" && k !== "_banner")
        ) {
            setPendingDraft(draft);
            setDraftRestoreModalVisible(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible, editingPost]);

    // Smart close: confirm if there is unsaved data, otherwise close immediately.
    const requestCloseCreateModal = useCallback(() => {
        if (editingPost) {
            // Preserve original edit-close behavior (no draft system for edits)
            setIsModalVisible(false);
            setEditingPost(null);
            form.resetFields();
            setFileList([]);
            bannerFileListRef.current = [];
            return;
        }
        if (hasAnyFormValue()) {
            setDiscardConfirmVisible(true);
        } else {
            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
            bannerFileListRef.current = [];
        }
    }, [editingPost, hasAnyFormValue, form]);

    const confirmDiscardChanges = useCallback(() => {
        clearJobPostDraft();
        setDraftLastSaved(null);
        setDiscardConfirmVisible(false);
        setIsModalVisible(false);
        setEditingPost(null);
        form.resetFields();
        setFileList([]);
        bannerFileListRef.current = [];
    }, [form]);

    // Browser unsaved-changes warning
    useEffect(() => {
        const handler = (e) => {
            if (isModalVisible && !editingPost && hasAnyFormValue()) {
                e.preventDefault();
                e.returnValue = "You have unsaved changes.";
                return "You have unsaved changes.";
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isModalVisible, editingPost, hasAnyFormValue]);

    return {
        persistDraftNow,
        requestCloseCreateModal,
        handleFormValuesChange,
        confirmDiscardChanges,
        applyDraftToForm,
    };
}
