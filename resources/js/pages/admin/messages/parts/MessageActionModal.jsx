import React from "react";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

// ============================
// RENDER MESSAGE ACTION MODAL (UPDATED)
// ============================
export default function MessageActionModal() {
    const {
        showMessageActionModal,
        actionMessageData,
        canModifyMessage,
        canEditMessage,
        closeMessageActionModal,
        EMOJI_REACTIONS,
        addReaction,
        startInlineEdit,
        openDeleteConfirmModal,
    } = useMessagesContext();

    if (!showMessageActionModal || !actionMessageData) return null;

    const canModify = canModifyMessage(actionMessageData);
    const hasTextMessage =
        actionMessageData.message && actionMessageData.message.trim();
    const canEdit =
        canModify && hasTextMessage && canEditMessage(actionMessageData);

    return (
        <div
            className="message-action-modal-overlay"
            onClick={closeMessageActionModal}
        >
            <div
                className="message-action-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Emoji Reactions Row */}
                <div className="message-action-emoji-row">
                    {EMOJI_REACTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() =>
                                addReaction(actionMessageData.id, emoji)
                            }
                            className="message-action-emoji-btn"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                {/* Action Buttons - Only show for own messages */}
                {canModify && (
                    <div className="message-action-buttons">
                        {/* Edit - Only for text messages within 3 minutes */}
                        {canEdit && (
                            <button
                                className="message-action-btn edit"
                                onClick={() =>
                                    startInlineEdit(actionMessageData)
                                }
                            >
                                <span className="action-icon">✏️</span>
                                <span>Edit</span>
                            </button>
                        )}

                        {/* Delete/Unsend */}
                        <button
                            className="message-action-btn delete"
                            onClick={() =>
                                openDeleteConfirmModal(actionMessageData)
                            }
                        >
                            <span className="action-icon">🗑️</span>
                            <span>Unsend for Everyone</span>
                        </button>
                    </div>
                )}

                {/* Cancel Button */}
                <button
                    className="message-action-cancel"
                    onClick={closeMessageActionModal}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
