import React, { useEffect, useRef } from "react";
import { message as antMessage } from "antd";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

// Copy text without relying on text selection (bubbles are non-selectable now).
async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        /* fall through to the legacy path */
    }
    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:-1000px;opacity:0;";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
    } catch {
        return false;
    }
}

// ============================
// RENDER MESSAGE ACTION MODAL
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

    // The menu opens while the finger / mouse is still down. The release that
    // follows must not count as a tap on the overlay, so ignore the first beat.
    const openedAtRef = useRef(0);
    useEffect(() => {
        if (showMessageActionModal) openedAtRef.current = Date.now();
    }, [showMessageActionModal]);

    useEffect(() => {
        if (!showMessageActionModal) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") closeMessageActionModal();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [showMessageActionModal, closeMessageActionModal]);

    if (!showMessageActionModal || !actionMessageData) return null;

    const canModify = canModifyMessage(actionMessageData);
    const hasTextMessage =
        actionMessageData.message && actionMessageData.message.trim();
    const canEdit =
        canModify && hasTextMessage && canEditMessage(actionMessageData);

    const guard = (fn) => (e) => {
        if (Date.now() - openedAtRef.current < 350) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        fn(e);
    };

    const handleCopy = async () => {
        const ok = await copyText(actionMessageData.message);
        if (ok) antMessage.success("Message copied");
        else antMessage.error("Couldn't copy the message");
        closeMessageActionModal();
    };

    return (
        <div
            className="message-action-modal-overlay"
            role="presentation"
            onClick={guard(closeMessageActionModal)}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div
                className="message-action-modal"
                role="dialog"
                aria-label="Message actions"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Emoji Reactions Row */}
                <div className="message-action-emoji-row">
                    {EMOJI_REACTIONS.map((emoji) => (
                        <button
                            type="button"
                            key={emoji}
                            onClick={guard(() =>
                                addReaction(actionMessageData.id, emoji),
                            )}
                            className="message-action-emoji-btn"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                <div className="message-action-buttons">
                    {/* Copy - any text message, sent or received */}
                    {hasTextMessage && (
                        <button
                            type="button"
                            className="message-action-btn copy"
                            onClick={guard(handleCopy)}
                        >
                            <span className="action-icon">📋</span>
                            <span>Copy</span>
                        </button>
                    )}

                    {/* Edit - Only for own text messages within the edit window */}
                    {canEdit && (
                        <button
                            type="button"
                            className="message-action-btn edit"
                            onClick={guard(() =>
                                startInlineEdit(actionMessageData),
                            )}
                        >
                            <span className="action-icon">✏️</span>
                            <span>Edit</span>
                        </button>
                    )}

                    {/* Delete/Unsend - Only for own messages */}
                    {canModify && (
                        <button
                            type="button"
                            className="message-action-btn delete"
                            onClick={guard(() =>
                                openDeleteConfirmModal(actionMessageData),
                            )}
                        >
                            <span className="action-icon">🗑️</span>
                            <span>Unsend for Everyone</span>
                        </button>
                    )}
                </div>

                {/* Cancel Button */}
                <button
                    type="button"
                    className="message-action-cancel"
                    onClick={guard(closeMessageActionModal)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
