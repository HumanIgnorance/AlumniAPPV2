import { useCallback, useEffect } from "react";
import { message } from "antd";
import {
    clearApplicationDraft,
    saveApplicationDraft,
} from "~/pages/admin/JobPost/parts/jobPostStorage";

export default function useApplicationDraft({
    appForm,
    idDocuments,
    otherDocuments,
    applicationDraftCtxRef,
    isApplicationModalVisible,
    setApplicationDraftLastSaved,
    setApplicationFormDirty,
    applicationDraftTimerRef,
    setIdDocuments,
    setOtherDocuments,
    setApplicationDiscardConfirmVisible,
    setIsApplicationModalVisible,
}) {
    // ============================================================
    // ENHANCEMENT: Application auto-save + unsaved-changes guard
    // ============================================================

    // Build a snapshot of the application form (values + file metadata).
    // File blobs cannot be persisted in localStorage, so we store metadata
    // only (name/type/size) and let the user know to re-attach if needed.
    const buildApplicationSnapshot = useCallback(() => {
        try {
            const values = appForm.getFieldsValue() || {};
            const resumeMeta = (values.resume || []).map((f) => ({
                uid: f.uid,
                name: f.name,
                size: f.size,
                type: f.type,
                status: f.status,
            }));
            const idDocsMeta = (idDocuments || []).map((d) => ({
                type: d.type || "",
                file:
                    d.fileList && d.fileList[0]
                        ? {
                              uid: d.fileList[0].uid,
                              name: d.fileList[0].name,
                              size: d.fileList[0].size,
                              type: d.fileList[0].type,
                          }
                        : null,
            }));
            const otherDocsMeta = (otherDocuments || []).map((f) => ({
                uid: f.uid,
                name: f.name,
                size: f.size,
                type: f.type,
            }));
            return {
                cover_letter: values.cover_letter || "",
                _resume: resumeMeta,
                _idDocuments: idDocsMeta,
                _otherDocuments: otherDocsMeta,
            };
        } catch {
            return {};
        }
    }, [appForm, idDocuments, otherDocuments]);

    // Determine if the user has modified at least one application field.
    const isApplicationFormModified = useCallback(() => {
        try {
            const snap = buildApplicationSnapshot();
            const hasCover = (snap.cover_letter || "").trim().length > 0;
            const hasResume = (snap._resume || []).length > 0;
            const hasIdFiles = (snap._idDocuments || []).some(
                (d) => d.type || d.file,
            );
            const hasOther = (snap._otherDocuments || []).length > 0;
            return hasCover || hasResume || hasIdFiles || hasOther;
        } catch {
            return false;
        }
    }, [buildApplicationSnapshot]);

    const persistApplicationDraftNow = useCallback(() => {
        const { jobId, userId } = applicationDraftCtxRef.current || {};
        if (!jobId || !userId) return;
        if (!isApplicationModalVisible) return;
        if (!isApplicationFormModified()) return;
        const snap = buildApplicationSnapshot();
        const ok = saveApplicationDraft(jobId, userId, snap);
        if (ok) {
            setApplicationDraftLastSaved(new Date());
            setApplicationFormDirty(true);
        }
    }, [
        isApplicationModalVisible,
        isApplicationFormModified,
        buildApplicationSnapshot,
    ]);

    // Debounced auto-save on any application form change
    const handleApplicationFormValuesChange = useCallback(() => {
        setApplicationFormDirty(true);
        if (applicationDraftTimerRef.current)
            clearTimeout(applicationDraftTimerRef.current);
        applicationDraftTimerRef.current = setTimeout(
            persistApplicationDraftNow,
            400,
        );
    }, [persistApplicationDraftNow]);

    // Trigger auto-save whenever upload state changes (uploads are not part of
    // the antd Form.onValuesChange pipeline so we listen explicitly).
    useEffect(() => {
        if (!isApplicationModalVisible) return;
        if (applicationDraftTimerRef.current)
            clearTimeout(applicationDraftTimerRef.current);
        applicationDraftTimerRef.current = setTimeout(
            persistApplicationDraftNow,
            400,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idDocuments, otherDocuments, isApplicationModalVisible]);

    // Restore a saved application draft into the form (text fields only;
    // file blobs must be re-attached by the user since they cannot be persisted).
    const restoreApplicationDraft = useCallback(
        (draft) => {
            if (!draft) return;
            try {
                appForm.setFieldsValue({
                    cover_letter: draft.cover_letter || "",
                });
                if (
                    Array.isArray(draft._idDocuments) &&
                    draft._idDocuments.length > 0
                ) {
                    setIdDocuments(
                        draft._idDocuments.map((d) => ({
                            type: d.type || "",
                            fileList: [],
                        })),
                    );
                }
                // Other docs metadata only — user re-uploads files.
                setOtherDocuments([]);
                setApplicationFormDirty(true);
                if (draft._resume && draft._resume.length > 0) {
                    message.info(
                        "Draft restored. Please re-attach your resume and ID files — uploaded files can't be saved locally for security.",
                    );
                } else {
                    message.success("Application draft restored.");
                }
            } catch (err) {
                console.warn("Failed to restore application draft:", err);
            }
        },
        [appForm],
    );

    // Smart-close: prompt before discarding unsaved application data.
    const attemptCloseApplicationModal = useCallback(() => {
        if (isApplicationFormModified()) {
            setApplicationDiscardConfirmVisible(true);
            return false;
        }
        setIsApplicationModalVisible(false);
        appForm.resetFields();
        setIdDocuments([]);
        setOtherDocuments([]);
        return true;
    }, [isApplicationFormModified, appForm]);

    const confirmDiscardApplicationChanges = useCallback(() => {
        try {
            const { jobId, userId } = applicationDraftCtxRef.current || {};
            clearApplicationDraft(jobId, userId);
        } catch {}
        setApplicationDiscardConfirmVisible(false);
        setIsApplicationModalVisible(false);
        appForm.resetFields();
        setIdDocuments([]);
        setOtherDocuments([]);
        setApplicationFormDirty(false);
        setApplicationDraftLastSaved(null);
        applicationDraftCtxRef.current = { jobId: null, userId: null };
    }, [appForm]);

    // FEATURE 3: Warn the user on refresh / tab close when there are unsaved
    // application changes. Cleared automatically on successful submit / discard.
    useEffect(() => {
        if (!isApplicationModalVisible) return;
        const handler = (e) => {
            if (isApplicationFormModified()) {
                e.preventDefault();
                e.returnValue = "";
                return "";
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isApplicationModalVisible, isApplicationFormModified]);

    // Intercept ESC key while the application modal is open so we can prompt
    // instead of closing immediately when there are unsaved changes.
    useEffect(() => {
        if (!isApplicationModalVisible) return;
        const onKey = (e) => {
            if (e.key === "Escape" && isApplicationFormModified()) {
                e.stopPropagation();
                e.preventDefault();
                setApplicationDiscardConfirmVisible(true);
            }
        };
        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
    }, [isApplicationModalVisible, isApplicationFormModified]);

    return {
        attemptCloseApplicationModal,
        handleApplicationFormValuesChange,
        confirmDiscardApplicationChanges,
        restoreApplicationDraft,
    };
}
