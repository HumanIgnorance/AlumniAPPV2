import React from "react";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

// ============================
// RENDER DELETE CONFIRMATION MODAL (NEW - BLACK THEME)
// ============================
export default function DeleteConfirmModal() {
    const {
        showDeleteConfirmModal,
        deleteTargetMessage,
        closeDeleteConfirmModal,
        deleteMessageLoading,
        handleDeleteMessage,
    } = useMessagesContext();

    if (!showDeleteConfirmModal || !deleteTargetMessage) return null;

    return (
        <div
            className="delete-confirm-modal-overlay"
            onClick={closeDeleteConfirmModal}
        >
            <div
                className="delete-confirm-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="delete-confirm-icon">
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3 6H5H21"
                            stroke="#ff4757"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                            stroke="#ff4757"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M10 11V17"
                            stroke="#ff4757"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M14 11V17"
                            stroke="#ff4757"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <h3 className="delete-confirm-title">Unsend Message?</h3>
                <p className="delete-confirm-text">
                    This message will be removed for everyone in the chat. This
                    action cannot be undone.
                </p>
                <div className="delete-confirm-preview">
                    {deleteTargetMessage.message && (
                        <p className="preview-text">
                            "{deleteTargetMessage.message.substring(0, 50)}
                            {deleteTargetMessage.message.length > 50
                                ? "..."
                                : ""}
                            "
                        </p>
                    )}
                    {deleteTargetMessage.image_path &&
                        !deleteTargetMessage.message && (
                            <p className="preview-text">[Image]</p>
                        )}
                </div>
                <div className="delete-confirm-actions">
                    <button
                        className="delete-confirm-btn cancel"
                        onClick={closeDeleteConfirmModal}
                        disabled={deleteMessageLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className="delete-confirm-btn delete"
                        onClick={handleDeleteMessage}
                        disabled={deleteMessageLoading}
                    >
                        {deleteMessageLoading ? (
                            <span className="delete-loading">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </span>
                        ) : (
                            "Unsend"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
