import React from "react";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

export default function MessagePromptModals() {
    const {
        draftRestorePrompt,
        discardDraft,
        continueDraft,
        pendingSwitch,
        confirmSwitchContinueEditing,
        confirmSwitchSaveDraft,
        confirmSwitchDiscard,
        sendConfirm,
        setSendConfirm,
        imagePreview,
        selectedImage,
        selectedConversation,
        newMessage,
        sending,
        confirmSendNow,
        archivePrompt,
        setArchivePrompt,
        confirmArchive,
        bulkConfirm,
        bulkLoading,
        setBulkConfirm,
        bulkActionLabel,
        executeBulkAction,
    } = useMessagesContext();

    return (
        <>
            {draftRestorePrompt && (
                <div className="modal-overlay" onClick={discardDraft}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <span className="modal-icon">📝</span>
                            <h3>Unsent Message Found</h3>
                        </div>
                        <div className="modal-body">
                            <p>
                                You have an unsent draft for this conversation.
                                Would you like to continue where you left off?
                            </p>
                            {draftRestorePrompt.draft?.text && (
                                <p className="modal-info draft-preview">
                                    “
                                    {draftRestorePrompt.draft.text.slice(
                                        0,
                                        140,
                                    )}
                                    {draftRestorePrompt.draft.text.length > 140
                                        ? "…"
                                        : ""}
                                    ”
                                </p>
                            )}
                            {draftRestorePrompt.draft?.imagePreview && (
                                <p className="modal-info">
                                    📎 Includes an image attachment
                                </p>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel"
                                onClick={discardDraft}
                            >
                                Discard Draft
                            </button>
                            <button
                                className="modal-btn primary"
                                onClick={continueDraft}
                            >
                                Continue Draft
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {pendingSwitch && (
                <div
                    className="modal-overlay"
                    onClick={confirmSwitchContinueEditing}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <span className="modal-icon">✉️</span>
                            <h3>Unsent Message</h3>
                        </div>
                        <div className="modal-body">
                            <p>
                                You have an unsent message in the current
                                conversation. What would you like to do before
                                switching?
                            </p>
                        </div>
                        <div className="modal-actions modal-actions-stacked">
                            <button
                                className="modal-btn cancel"
                                onClick={confirmSwitchContinueEditing}
                            >
                                Continue Editing
                            </button>
                            <button
                                className="modal-btn primary"
                                onClick={confirmSwitchSaveDraft}
                            >
                                Save as Draft & Switch
                            </button>
                            <button
                                className="modal-btn danger"
                                onClick={confirmSwitchDiscard}
                            >
                                Discard & Switch
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {sendConfirm && (
                <div
                    className="modal-overlay"
                    onClick={() => setSendConfirm(null)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <span className="modal-icon">📨</span>
                            <h3>Send Message?</h3>
                        </div>
                        <div className="modal-body">
                            {imagePreview && (
                                <div className="send-confirm-preview">
                                    <img
                                        src={imagePreview || "/placeholder.svg"}
                                        alt="Attachment preview"
                                    />
                                </div>
                            )}
                            <p>
                                Send this message
                                {selectedImage
                                    ? " with the attached image"
                                    : ""}{" "}
                                to{" "}
                                <strong>
                                    {selectedConversation?.alumni_name}
                                </strong>
                                {selectedConversation?.alumni_email
                                    ? ` (${selectedConversation.alumni_email})`
                                    : ""}
                                ?
                            </p>
                            {newMessage.trim() && (
                                <p className="modal-info">
                                    “{newMessage.trim().slice(0, 140)}”
                                </p>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel"
                                onClick={() => setSendConfirm(null)}
                                disabled={sending}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn primary"
                                onClick={confirmSendNow}
                                disabled={sending}
                            >
                                {sending ? "Sending..." : "Send Now"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {archivePrompt != null && (
                <div
                    className="modal-overlay"
                    onClick={() => setArchivePrompt(null)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <span className="modal-icon">🗄️</span>
                            <h3>Archive Conversation?</h3>
                        </div>
                        <div className="modal-body">
                            <p>
                                This conversation will be moved to the Archive
                                tab. No messages will be deleted.
                            </p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel"
                                onClick={() => setArchivePrompt(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn primary"
                                onClick={confirmArchive}
                            >
                                Archive
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {bulkConfirm && (
                <div
                    className="modal-overlay"
                    onClick={() => !bulkLoading && setBulkConfirm(null)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <span className="modal-icon">⚙️</span>
                            <h3>Confirm Bulk Action</h3>
                        </div>
                        <div className="modal-body">
                            <p>
                                Are you sure you want to{" "}
                                <strong>
                                    {bulkActionLabel(bulkConfirm.action)}
                                </strong>{" "}
                                <strong>{bulkConfirm.count}</strong> selected
                                conversation(s)?
                            </p>
                            {bulkConfirm.action === "delete" && (
                                <p className="modal-warning">
                                    This action cannot be undone.
                                </p>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel"
                                onClick={() => setBulkConfirm(null)}
                                disabled={bulkLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className={`modal-btn ${bulkConfirm.action === "delete" ? "danger" : "primary"}`}
                                onClick={executeBulkAction}
                                disabled={bulkLoading}
                            >
                                {bulkLoading ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
