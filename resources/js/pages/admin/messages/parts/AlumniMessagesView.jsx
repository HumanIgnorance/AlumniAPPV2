import React from "react";
import { createPortal } from "react-dom";
import { Layout } from "~/components";
import { ROLES } from "~/config/roles";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";
import DeleteConfirmModal from "~/pages/admin/messages/parts/DeleteConfirmModal";
import MessageActionModal from "~/pages/admin/messages/parts/MessageActionModal";

export default function AlumniMessagesView() {
    const {
        adminInfo,
        alumniUnreadCount,
        error,
        setError,
        isRestricted,
        initialLoading,
        messages,
        groupedMessages,
        formatDateSeparator,
        inlineEditMessageId,
        handleDoubleClick,
        handleLongPressStart,
        handleLongPressEnd,
        renderMessageImage,
        renderInlineEditInput,
        shouldShowEditIndicator,
        messageReactions,
        formatTime,
        messagesEndRef,
        sendAlumniMessage,
        imagePreview,
        clearImagePreview,
        imageInputRef,
        handleImageSelect,
        inputRef,
        newMessage,
        setNewMessage,
        sending,
        selectedImage,
        lightboxImage,
        closeLightbox,
    } = useMessagesContext();

    return (
        <Layout>
            <div className="alumni-messages-container">
                {/* Header */}
                <div className="alumni-messages-header">
                    <div className="alumni-header-left">
                        <img
                            src={adminInfo.avatar || "/placeholder.svg"}
                            alt="Guidance Counselor"
                            className="admin-header-avatar"
                        />
                        <div className="alumni-header-info">
                            <h2>{adminInfo.name}</h2>
                            <span className="admin-status">Admin</span>
                        </div>
                    </div>
                    {alumniUnreadCount > 0 && (
                        <span className="alumni-unread-badge">
                            {alumniUnreadCount} new
                        </span>
                    )}
                </div>

                {/* Error notice */}
                {error && (
                    <div className="alumni-error-notice">
                        <span>⚠️</span>
                        <p>{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="error-dismiss"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Restriction notice */}
                {isRestricted && (
                    <div className="restriction-notice">
                        <span>🔒</span>
                        <p>
                            You are currently restricted from sending messages.
                            Please contact the administration for assistance.
                        </p>
                    </div>
                )}

                {/* Messages Area */}
                <div className="alumni-messages-area">
                    {initialLoading ? (
                        <div className="alumni-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="no-alumni-messages">
                            <div className="no-messages-icon">💬</div>
                            <h3>No messages yet</h3>
                            <p>
                                Start a conversation with the Guidance Counselor
                                by sending a message below.
                            </p>
                        </div>
                    ) : (
                        groupedMessages.map((groupedItem, index) => {
                            if (groupedItem.type === "date") {
                                return (
                                    <div
                                        key={`date-${index}`}
                                        className="date-separator"
                                    >
                                        <span>
                                            {formatDateSeparator(
                                                groupedItem.date,
                                            )}
                                        </span>
                                    </div>
                                );
                            }

                            const isMyMessage =
                                groupedItem.sender_type === ROLES.ALUMNI;
                            const isEditing =
                                inlineEditMessageId === groupedItem.id;

                            return (
                                <div
                                    key={groupedItem.id}
                                    className={`alumni-message-wrapper ${isMyMessage ? "right" : "left"} ${groupedItem.isOptimistic ? "optimistic" : ""}`}
                                >
                                    {!isMyMessage && (
                                        <div className="alumni-message-sender-header">
                                            <img
                                                src={
                                                    adminInfo.avatar ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Guidance Counselor"
                                                className="alumni-avatar"
                                            />
                                            <span className="alumni-sender-name">
                                                Guidance Counselor (Admin)
                                            </span>
                                        </div>
                                    )}

                                    <div
                                        className={`alumni-message ${isMyMessage ? "sent" : "received"} ${isEditing ? "editing" : ""}`}
                                        onDoubleClick={() =>
                                            !isEditing &&
                                            handleDoubleClick(groupedItem.id)
                                        }
                                        onMouseDown={() =>
                                            !isEditing &&
                                            handleLongPressStart(
                                                groupedItem.id,
                                                groupedItem,
                                            )
                                        }
                                        onMouseUp={handleLongPressEnd}
                                        onMouseLeave={handleLongPressEnd}
                                        onTouchStart={() =>
                                            !isEditing &&
                                            handleLongPressStart(
                                                groupedItem.id,
                                                groupedItem,
                                            )
                                        }
                                        onTouchEnd={handleLongPressEnd}
                                    >
                                        {renderMessageImage(
                                            groupedItem.image_path,
                                            groupedItem.isOptimistic,
                                            groupedItem.image_url,
                                        )}

                                        {isEditing
                                            ? renderInlineEditInput(groupedItem)
                                            : groupedItem.message && (
                                                  <p>
                                                      {groupedItem.message}
                                                      {!!groupedItem.is_edited &&
                                                          shouldShowEditIndicator(
                                                              groupedItem,
                                                          ) && (
                                                              <span className="edited-indicator">
                                                                  {" "}
                                                                  (edited)
                                                              </span>
                                                          )}
                                                  </p>
                                              )}

                                        {/* Show reactions */}
                                        {messageReactions[groupedItem.id] &&
                                            messageReactions[groupedItem.id]
                                                .length > 0 && (
                                                <div className="message-reactions">
                                                    {messageReactions[
                                                        groupedItem.id
                                                    ].map((reaction, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="reaction-badge"
                                                        >
                                                            {reaction}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                        {!isEditing && (
                                            <div className="alumni-message-meta">
                                                <span className="alumni-message-time">
                                                    {formatTime(
                                                        groupedItem.created_at,
                                                    )}
                                                </span>
                                                {isMyMessage && (
                                                    <span className="alumni-read-status">
                                                        {groupedItem.isOptimistic
                                                            ? "⏳"
                                                            : groupedItem.is_read
                                                              ? "✓✓"
                                                              : "✓"}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input Form */}
                <form
                    className="alumni-message-input-form"
                    onSubmit={sendAlumniMessage}
                >
                    {imagePreview && (
                        <div className="image-preview">
                            <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="Preview"
                            />
                            <button
                                type="button"
                                onClick={clearImagePreview}
                                className="clear-image-btn"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <div className="message-input-wrapper">
                        <input
                            type="file"
                            ref={imageInputRef}
                            onChange={handleImageSelect}
                            accept="image/jpeg,image/png,image/jpg"
                            style={{ display: "none" }}
                        />
                        <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="image-upload-btn"
                            title="Upload image (JPG/PNG only, max 5MB)"
                            disabled={isRestricted}
                        >
                            📂
                        </button>

                        <textarea
                            ref={inputRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={
                                isRestricted
                                    ? "You are restricted from sending messages"
                                    : "Type a message..."
                            }
                            disabled={isRestricted || sending}
                            className="alumni-message-input"
                        />

                        <button
                            type="submit"
                            disabled={
                                (!newMessage.trim() && !selectedImage) ||
                                sending ||
                                isRestricted
                            }
                            className="send-btn"
                        >
                            {sending ? "Sending..." : "Send"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Lightbox — rendered via portal directly on <body> so it can
                never be trapped inside Layout's header stacking context
                (e.g. a transformed/contained ancestor) on mobile. */}
            {lightboxImage &&
                createPortal(
                    <div className="image-lightbox" onClick={closeLightbox}>
                        <div
                            className="lightbox-actions"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="lightbox-close"
                                onClick={closeLightbox}
                                title="Close image"
                                aria-label="Close image"
                            >
                                ×
                            </button>
                        </div>
                        <div className="lightbox-image-wrap">
                            <img
                                src={lightboxImage || "/placeholder.svg"}
                                alt="Full size"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>,
                    document.body,
                )}

            {/* Message Action Modal */}
            {<MessageActionModal />}

            {/* Delete Confirmation Modal (Black Theme) */}
            {<DeleteConfirmModal />}
        </Layout>
    );
}
