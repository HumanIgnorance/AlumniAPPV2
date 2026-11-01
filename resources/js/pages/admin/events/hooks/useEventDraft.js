import { useEffect } from "react";
import moment from "moment";
import secureLocalStorage from "react-secure-storage";
import {
    EVENT_DRAFT_STORAGE_KEY,
    draftDataURLtoFile,
    draftFileToBase64,
} from "~/pages/admin/events/parts/eventDraftStorage";

export default function useEventDraft({
    setDraftLastSaved,
    form,
    fileListRef,
    selectedEvent,
    isRestoringDraftRef,
    draftSaveTimer,
    setFileList,
    setIsModalVisible,
    setSelectedEvent,
    setValidationErrors,
    setIsValidationModalVisible,
    setCurrentStep,
    setIsDraftPromptVisible,
    setIsDiscardConfirmVisible,
    isModalVisible,
}) {
    // ===== Draft Auto-Save: serialization helpers =====
    const serializeDraftValues = (values = {}) => {
        const v = { ...values };
        if (v.date) v.date = moment(v.date).toISOString();
        if (
            v.timeRange &&
            v.timeRange.length === 2 &&
            v.timeRange[0] &&
            v.timeRange[1]
        ) {
            v.timeRange = [
                moment(v.timeRange[0]).format("HH:mm"),
                moment(v.timeRange[1]).format("HH:mm"),
            ];
        }
        if (v.earlyBirdEndDate)
            v.earlyBirdEndDate = moment(v.earlyBirdEndDate).toISOString();
        return v;
    };

    const buildDraftFileList = async (list = []) => {
        const out = [];
        for (const f of list) {
            try {
                if (f.originFileObj) {
                    const b64 = await draftFileToBase64(f.originFileObj);
                    out.push({
                        uid: f.uid,
                        name: f.name,
                        status: "done",
                        url: b64,
                        thumbUrl: b64,
                        __draftFile: true,
                    });
                } else if (f.url) {
                    // Existing/already-uploaded image (e.g. while editing) — keep its URL.
                    out.push({
                        uid: f.uid,
                        name: f.name,
                        status: "done",
                        url: f.url,
                        thumbUrl: f.thumbUrl || f.url,
                    });
                }
            } catch (err) {
                console.error("Failed to serialize draft file:", err);
            }
        }
        return out;
    };

    const persistEventDraft = async (values, list) => {
        try {
            const draft = {
                values: serializeDraftValues(values || {}),
                fileList: await buildDraftFileList(list || []),
                savedAt: new Date().toISOString(),
            };
            secureLocalStorage.setItem(EVENT_DRAFT_STORAGE_KEY, draft);
            setDraftLastSaved(moment(draft.savedAt).format("HH:mm:ss"));
        } catch (err) {
            console.error("Failed to save event draft:", err);
        }
    };

    const clearEventDraft = () => {
        try {
            secureLocalStorage.removeItem(EVENT_DRAFT_STORAGE_KEY);
        } catch (err) {
            console.error("Failed to clear event draft:", err);
        }
        setDraftLastSaved(null);
    };

    // Determine if the create form holds any user-entered data.
    const isCreateFormDirty = () => {
        const v = form.getFieldsValue();
        const hasFieldValues = Object.keys(v || {}).some((key) => {
            const val = v[key];
            if (val === undefined || val === null) return false;
            if (typeof val === "boolean") return false; // e.g. featured default
            if (Array.isArray(val)) return val.length > 0;
            if (typeof val === "string") return val.trim() !== "";
            return true;
        });
        return (
            hasFieldValues ||
            (fileListRef.current && fileListRef.current.length > 0)
        );
    };

    // Debounced auto-save whenever the create form changes.
    const handleFormValuesChange = () => {
        if (selectedEvent) return; // drafts are only for creating new events
        if (isRestoringDraftRef.current) return;
        if (draftSaveTimer.current) clearTimeout(draftSaveTimer.current);
        draftSaveTimer.current = setTimeout(() => {
            persistEventDraft(form.getFieldsValue(), fileListRef.current);
        }, 700);
    };

    const restoreEventDraft = async () => {
        try {
            const draft = secureLocalStorage.getItem(EVENT_DRAFT_STORAGE_KEY);
            if (!draft) return;
            isRestoringDraftRef.current = true;

            const v = { ...(draft.values || {}) };
            if (v.date) v.date = moment(v.date);
            if (v.timeRange && v.timeRange.length === 2) {
                v.timeRange = [
                    moment(v.timeRange[0], "HH:mm"),
                    moment(v.timeRange[1], "HH:mm"),
                ];
            }
            if (v.earlyBirdEndDate)
                v.earlyBirdEndDate = moment(v.earlyBirdEndDate);
            form.setFieldsValue(v);

            const restoredList = (draft.fileList || []).map((f) => {
                if (f.__draftFile && f.url) {
                    const file = draftDataURLtoFile(f.url, f.name);
                    return {
                        uid: f.uid,
                        name: f.name,
                        status: "done",
                        url: f.url,
                        thumbUrl: f.thumbUrl || f.url,
                        originFileObj: file,
                    };
                }
                return {
                    uid: f.uid,
                    name: f.name,
                    status: "done",
                    url: f.url,
                    thumbUrl: f.thumbUrl || f.url,
                };
            });
            setFileList(restoredList);
            fileListRef.current = restoredList;

            if (draft.savedAt)
                setDraftLastSaved(moment(draft.savedAt).format("HH:mm:ss"));
            setTimeout(() => {
                isRestoringDraftRef.current = false;
            }, 0);
        } catch (err) {
            console.error("Failed to restore event draft:", err);
            isRestoringDraftRef.current = false;
        }
    };

    // Performs the actual modal close/reset (original handleCancel behavior).
    const performCreateModalClose = () => {
        setIsModalVisible(false);
        form.resetFields();
        setSelectedEvent(null);
        setFileList([]);
        fileListRef.current = [];
        setValidationErrors([]); // Clear validation errors on cancel
        setIsValidationModalVisible(false); // Close validation modal if open
    };

    const showCreateModal = () => {
        setIsModalVisible(true);
        setCurrentStep(0);
        setSelectedEvent(null);
        form.resetFields();
        setFileList([]);
        fileListRef.current = [];
        setValidationErrors([]); // Clear previous validation errors
        setIsValidationModalVisible(false); // Close validation modal if open
        // Draft Restore Prompt: if a saved draft exists, ask the user.
        try {
            const existingDraft = secureLocalStorage.getItem(
                EVENT_DRAFT_STORAGE_KEY,
            );
            if (existingDraft) {
                setIsDraftPromptVisible(true);
            } else {
                setDraftLastSaved(null);
            }
        } catch (err) {
            console.error("Failed to read event draft:", err);
        }
    };

    const handleContinueDraft = () => {
        setIsDraftPromptVisible(false);
        restoreEventDraft();
    };

    const handleStartNewDraft = () => {
        clearEventDraft();
        form.resetFields();
        setFileList([]);
        fileListRef.current = [];
        setIsDraftPromptVisible(false);
    };

    // Smart Close Confirmation
    const handleCancel = () => {
        // Only guard new-event creation; editing keeps original behavior.
        if (!selectedEvent && isCreateFormDirty()) {
            setIsDiscardConfirmVisible(true);
            return;
        }
        performCreateModalClose();
    };

    const handleContinueEditing = () => {
        setIsDiscardConfirmVisible(false);
    };

    const handleDiscardChanges = () => {
        clearEventDraft();
        setIsDiscardConfirmVisible(false);
        performCreateModalClose();
    };

    // Unsaved Changes Protection: warn before refresh/tab close.
    useEffect(() => {
        const beforeUnloadHandler = (e) => {
            if (isModalVisible && !selectedEvent && isCreateFormDirty()) {
                e.preventDefault();
                e.returnValue = "You have unsaved changes.";
                return "You have unsaved changes.";
            }
        };
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () =>
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalVisible, selectedEvent]);

    return {
        clearEventDraft,
        persistEventDraft,
        showCreateModal,
        handleCancel,
        handleFormValuesChange,
        handleStartNewDraft,
        handleContinueDraft,
        handleContinueEditing,
        handleDiscardChanges,
    };
}
