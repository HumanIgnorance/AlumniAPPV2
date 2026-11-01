import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";

export default function useMessageDrafts({
    ALUMNI_MESSAGE_DRAFT_KEY,
    isAdmin,
    selectedConversation,
    suspendDraftSaveRef,
    draftSaveTimerRef,
    newMessage,
    imagePreview,
    sendToEmail,
    draftRestorePrompt,
    setNewMessage,
    setSendToEmail,
    setImagePreview,
    setSelectedImage,
    setDraftRestorePrompt,
    setSelectedConversation,
    setOpenDropdown,
    clearImagePreview,
    setSearchPanelOpen,
    setMsgSearchQuery,
    setSearchResultIds,
    setAdminTyping,
    setPendingSwitch,
    pendingSwitch,
}) {
    // ---------------------------------------------------------------------------
    // DRAFT AUTO-SAVE HELPERS
    // ---------------------------------------------------------------------------
    const draftKeyFor = (alumniId) => `${ALUMNI_MESSAGE_DRAFT_KEY}-${alumniId}`;

    const dataURLtoFile = (dataUrl, fileName) => {
        try {
            const arr = dataUrl.split(",");
            const mimeMatch = arr[0].match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : "image/png";
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            return new File([u8arr], fileName || "draft-image.png", {
                type: mime,
            });
        } catch (err) {
            console.error("Failed to rebuild draft image:", err);
            return null;
        }
    };

    const draftHasContent = (text, preview, email) =>
        Boolean((text && text.trim()) || preview || email);

    const persistMessageDraft = (
        alumniId,
        { text, imagePreview: preview, sendToEmail: email },
    ) => {
        try {
            if (!alumniId) return;
            if (!draftHasContent(text, preview, email)) {
                secureLocalStorage.removeItem(draftKeyFor(alumniId));
                return;
            }
            secureLocalStorage.setItem(draftKeyFor(alumniId), {
                text: text || "",
                imagePreview: preview || null,
                sendToEmail: !!email,
                savedAt: new Date().toISOString(),
            });
        } catch (err) {
            console.error("Failed to save message draft:", err);
        }
    };

    const loadMessageDraft = (alumniId) => {
        try {
            return alumniId
                ? secureLocalStorage.getItem(draftKeyFor(alumniId))
                : null;
        } catch (err) {
            console.error("Failed to load message draft:", err);
            return null;
        }
    };

    const clearMessageDraft = (alumniId) => {
        try {
            if (alumniId) secureLocalStorage.removeItem(draftKeyFor(alumniId));
        } catch (err) {
            console.error("Failed to clear message draft:", err);
        }
    };

    useEffect(() => {
        const setVH = () => {
            const h = window.visualViewport?.height ?? window.innerHeight;
            document.documentElement.style.setProperty("--app-vh", `${h}px`);
        };
        setVH();
        window.visualViewport?.addEventListener("resize", setVH);
        window.visualViewport?.addEventListener("scroll", setVH);
        window.addEventListener("orientationchange", setVH);
        window.addEventListener("resize", setVH);
        return () => {
            window.visualViewport?.removeEventListener("resize", setVH);
            window.visualViewport?.removeEventListener("scroll", setVH);
            window.removeEventListener("orientationchange", setVH);
            window.removeEventListener("resize", setVH);
        };
    }, []);

    // Debounced auto-save whenever the composer changes for the active conversation.
    useEffect(() => {
        if (!isAdmin || !selectedConversation) return;
        if (suspendDraftSaveRef.current) return;
        if (draftSaveTimerRef.current) clearTimeout(draftSaveTimerRef.current);
        draftSaveTimerRef.current = setTimeout(() => {
            persistMessageDraft(selectedConversation.alumni_id, {
                text: newMessage,
                imagePreview,
                sendToEmail,
            });
        }, 600);
        return () => {
            if (draftSaveTimerRef.current)
                clearTimeout(draftSaveTimerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMessage, imagePreview, sendToEmail, selectedConversation, isAdmin]);

    const hasUnsentChanges = () =>
        draftHasContent(newMessage, imagePreview, sendToEmail);

    const continueDraft = () => {
        if (!draftRestorePrompt) return;
        const { draft } = draftRestorePrompt;
        suspendDraftSaveRef.current = true;
        setNewMessage(draft.text || "");
        setSendToEmail(!!draft.sendToEmail);
        if (draft.imagePreview) {
            setImagePreview(draft.imagePreview);
            const file = dataURLtoFile(draft.imagePreview, "draft-image.png");
            if (file) setSelectedImage(file);
        }
        setDraftRestorePrompt(null);
        setTimeout(() => {
            suspendDraftSaveRef.current = false;
        }, 50);
    };

    const discardDraft = () => {
        if (!draftRestorePrompt) return;
        clearMessageDraft(draftRestorePrompt.alumniId);
        setDraftRestorePrompt(null);
        suspendDraftSaveRef.current = false;
    };

    // ---------------------------------------------------------------------------
    // CONVERSATION SWITCH PROTECTION
    // ---------------------------------------------------------------------------
    const applyConversationSelection = (alumniData) => {
        setSelectedConversation({
            alumni_id: alumniData.alumni_id,
            alumni_name: alumniData.alumni_name,
            alumni_email: alumniData.alumni_email,
            alumni_avatar: alumniData.alumni_avatar,
            is_restricted: alumniData.is_restricted,
        });
        setOpenDropdown(null);
    };

    const performConversationSwitch = (alumniData) => {
        suspendDraftSaveRef.current = true;
        setNewMessage("");
        setSendToEmail(false);
        clearImagePreview();
        setSearchPanelOpen(false);
        setMsgSearchQuery("");
        setSearchResultIds([]);
        setAdminTyping(false);
        applyConversationSelection(alumniData);

        const existingDraft = loadMessageDraft(alumniData.alumni_id);
        if (
            existingDraft &&
            draftHasContent(
                existingDraft.text,
                existingDraft.imagePreview,
                existingDraft.sendToEmail,
            )
        ) {
            setDraftRestorePrompt({
                alumniId: alumniData.alumni_id,
                draft: existingDraft,
            });
        } else {
            setTimeout(() => {
                suspendDraftSaveRef.current = false;
            }, 50);
        }
    };

    const confirmSwitchContinueEditing = () => setPendingSwitch(null);

    const confirmSwitchSaveDraft = () => {
        if (selectedConversation) {
            persistMessageDraft(selectedConversation.alumni_id, {
                text: newMessage,
                imagePreview,
                sendToEmail,
            });
        }
        const next = pendingSwitch;
        setPendingSwitch(null);
        if (next) performConversationSwitch(next.data);
    };

    const confirmSwitchDiscard = () => {
        if (selectedConversation)
            clearMessageDraft(selectedConversation.alumni_id);
        const next = pendingSwitch;
        setPendingSwitch(null);
        if (next) performConversationSwitch(next.data);
    };

    return {
        clearMessageDraft,
        hasUnsentChanges,
        performConversationSwitch,
        discardDraft,
        continueDraft,
        confirmSwitchContinueEditing,
        confirmSwitchSaveDraft,
        confirmSwitchDiscard,
    };
}
