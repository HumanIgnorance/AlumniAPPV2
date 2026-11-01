import React from "react";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

// ============================
// RENDER MODALS
// ============================
export default function DeleteConversationModal() {
    const {
        showDeleteModal,
        selectedConversation,
        pendingDeleteAlumniId,
        messages,
        modalLoading,
        setShowDeleteModal,
        recoveryConfirm,
        setRecoveryConfirm,
        confirmDeleteConversation,
    } = useMessagesContext();

    if (!showDeleteModal) return null;

    // Recovery protection: show affected records & content preview when available.
    const isCurrent = selectedConversation?.alumni_id === pendingDeleteAlumniId;
    const affectedCount = isCurrent ? messages.length : null;
    const previewMsg =
        isCurrent && messages.length > 0
            ? messages[messages.length - 1]?.message
            : null;

    return (
        <div
            className="modal-overlay"
            onClick={() => !modalLoading && setShowDeleteModal(false)}
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-icon danger">🗑️</span>
                    <h3>This Action Cannot Be Undone</h3>
                </div>
                <div className="modal-body">
                    <p>
                        Are you sure you want to permanently delete this
                        conversation?
                    </p>
                    {affectedCount != null && (
                        <p className="modal-info">
                            Affected records: <strong>{affectedCount}</strong>{" "}
                            message(s)
                        </p>
                    )}
                    {previewMsg && (
                        <p className="modal-info draft-preview">
                            Last message: “{previewMsg.slice(0, 120)}”
                        </p>
                    )}
                    <p className="modal-warning">
                        This action cannot be undone. All messages will be
                        permanently deleted.
                    </p>
                    <label className="recovery-ack-label">
                        <input
                            type="checkbox"
                            checked={!!recoveryConfirm}
                            onChange={(e) =>
                                setRecoveryConfirm(e.target.checked)
                            }
                        />
                        <span>
                            I understand this will permanently delete the
                            conversation.
                        </span>
                    </label>
                </div>
                <div className="modal-actions">
                    <button
                        className="modal-btn cancel"
                        onClick={() => {
                            setShowDeleteModal(false);
                            setRecoveryConfirm(null);
                        }}
                        disabled={modalLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className="modal-btn danger"
                        onClick={confirmDeleteConversation}
                        disabled={modalLoading || !recoveryConfirm}
                    >
                        {modalLoading ? "Deleting..." : "Confirm Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
