import React from "react";
import { ROLES } from "~/config/roles";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

export default function ChatArea() {
    const {
        selectedConversation,
        setSelectedConversation,
        searchPanelOpen,
        toggleSearchPanel,
        openRestrictModal,
        msgSearchQuery,
        setMsgSearchQuery,
        gotoSearchResult,
        searchResultIds,
        searchActiveIndex,
        loading,
        messages,
        groupedMessages,
        formatDateSeparator,
        inlineEditMessageId,
        activeSearchId,
        handleDoubleClick,
        handleLongPressStart,
        handleLongPressEnd,
        renderMessageImage,
        renderInlineEditInput,
        highlightMatch,
        shouldShowEditIndicator,
        messageReactions,
        formatTime,
        formatReadReceipt,
        messagesEndRef,
        requestSendAdminMessage,
        imagePreview,
        clearImagePreview,
        inputRef,
        newMessage,
        setNewMessage,
        handleAdminTyping,
        sending,
        imageInputRef,
        handleImageSelect,
        sendToEmail,
        setSendToEmail,
        selectedImage,
        activeTab,
    } = useMessagesContext();

    return (
        <div className="chat-area">
            {selectedConversation ? (
                <>
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <button
                                className="chat-back-btn"
                                onClick={() => setSelectedConversation(null)}
                                title="Back to conversations"
                                aria-label="Back to conversations"
                            >
                                <span aria-hidden="true">‹</span>
                            </button>

                            {selectedConversation.alumni_avatar ? (
                                <img
                                    src={
                                        selectedConversation.alumni_avatar ||
                                        "/placeholder.svg"
                                    }
                                    alt={selectedConversation.alumni_name}
                                    className="chat-avatar-img"
                                />
                            ) : (
                                <div className="chat-avatar">
                                    {selectedConversation.alumni_name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>
                            )}
                            <div className="chat-header-text">
                                <h3>{selectedConversation.alumni_name}</h3>
                                <p className="alumni-email">
                                    {selectedConversation.alumni_email}
                                </p>
                            </div>
                        </div>

                        <div className="chat-header-actions">
                            <button
                                className={`chat-search-toggle ${searchPanelOpen ? "active" : ""}`}
                                onClick={toggleSearchPanel}
                                title="Search in conversation"
                            >
                                🔍
                            </button>
                            <button
                                className={`restrict-btn ${selectedConversation.is_restricted ? "restricted" : ""}`}
                                onClick={() =>
                                    openRestrictModal(selectedConversation)
                                }
                                title={
                                    selectedConversation.is_restricted
                                        ? "Remove restriction"
                                        : "Restrict alumni from messaging"
                                }
                            >
                                {selectedConversation.is_restricted
                                    ? "Unrestrict"
                                    : "Restrict"}
                            </button>
                        </div>
                    </div>

                    {/* Message Search Panel */}
                    {searchPanelOpen && (
                        <div className="message-search-panel">
                            <input
                                type="text"
                                className="message-search-input"
                                placeholder="Search in this conversation..."
                                value={msgSearchQuery}
                                autoFocus
                                onChange={(e) =>
                                    setMsgSearchQuery(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        gotoSearchResult(e.shiftKey ? -1 : 1);
                                    }
                                }}
                            />
                            <span className="message-search-count">
                                {msgSearchQuery.trim()
                                    ? searchResultIds.length > 0
                                        ? `${searchActiveIndex + 1} / ${searchResultIds.length}`
                                        : "0 results"
                                    : ""}
                            </span>
                            <button
                                className="message-search-nav"
                                onClick={() => gotoSearchResult(-1)}
                                disabled={searchResultIds.length === 0}
                                title="Previous result"
                            >
                                ↑
                            </button>
                            <button
                                className="message-search-nav"
                                onClick={() => gotoSearchResult(1)}
                                disabled={searchResultIds.length === 0}
                                title="Next result"
                            >
                                ↓
                            </button>
                            <button
                                className="message-search-close"
                                onClick={toggleSearchPanel}
                                title="Close search"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {!!selectedConversation.is_restricted && (
                        <div className="restricted-notice">
                            <span>⚠️</span>
                            <p>
                                This alumni is restricted from sending messages.
                                You can still send messages to them.
                            </p>
                        </div>
                    )}

                    <div className="messages-area">
                        {loading ? (
                            <div className="loading-messages">
                                Loading messages...
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="no-messages">
                                <p>No messages yet. Start the conversation!</p>
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

                                const isAdminMessage =
                                    groupedItem.sender_type === ROLES.ADMIN;
                                const isEditing =
                                    inlineEditMessageId === groupedItem.id;

                                return (
                                    <div
                                        key={groupedItem.id}
                                        id={`admin-msg-${groupedItem.id}`}
                                        className={`message-wrapper ${isAdminMessage ? "admin-side" : "alumni-side"} ${activeSearchId === groupedItem.id ? "search-active" : ""}`}
                                    >
                                        <div
                                            className={`message-row ${isAdminMessage ? "admin-side" : "alumni-side"}`}
                                        >
                                            <div
                                                className={`message-bubble ${isAdminMessage ? "admin-bubble" : "alumni-bubble"} ${isEditing ? "editing" : ""}`}
                                                onDoubleClick={() =>
                                                    !isEditing &&
                                                    handleDoubleClick(
                                                        groupedItem.id,
                                                    )
                                                }
                                                onMouseDown={() =>
                                                    !isEditing &&
                                                    handleLongPressStart(
                                                        groupedItem.id,
                                                        groupedItem,
                                                    )
                                                }
                                                onMouseUp={handleLongPressEnd}
                                                onMouseLeave={
                                                    handleLongPressEnd
                                                }
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
                                                    ? renderInlineEditInput(
                                                          groupedItem,
                                                      )
                                                    : groupedItem.message && (
                                                          <p>
                                                              {highlightMatch(
                                                                  groupedItem.message,
                                                              )}
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
                                                {messageReactions[
                                                    groupedItem.id
                                                ] &&
                                                    messageReactions[
                                                        groupedItem.id
                                                    ].length > 0 && (
                                                        <div className="message-reactions">
                                                            {messageReactions[
                                                                groupedItem.id
                                                            ].map(
                                                                (
                                                                    reaction,
                                                                    idx,
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="reaction-badge"
                                                                    >
                                                                        {
                                                                            reaction
                                                                        }
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}

                                                {!isEditing && (
                                                    <div className="message-meta">
                                                        <span className="message-time">
                                                            {formatTime(
                                                                groupedItem.created_at,
                                                            )}
                                                        </span>
                                                        {isAdminMessage && (
                                                            <span
                                                                className="read-status"
                                                                title={formatReadReceipt(
                                                                    groupedItem,
                                                                )}
                                                            >
                                                                {groupedItem.is_read
                                                                    ? "✓✓"
                                                                    : "✓"}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        className="message-input-form composer-v2"
                        onSubmit={requestSendAdminMessage}
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

                        <div className="composer-stack">
                            {/* TOP: text area so chat + typing stay visible */}
                            <textarea
                                ref={inputRef}
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    handleAdminTyping();
                                }}
                                placeholder="Type a message..."
                                disabled={sending}
                                className="alumni-message-input composer-textarea"
                                rows={1}
                            />

                            {/* BOTTOM: actions row */}
                            <div className="composer-actions">
                                <input
                                    type="file"
                                    ref={imageInputRef}
                                    onChange={handleImageSelect}
                                    accept="image/jpeg,image/png,image/jpg"
                                    style={{ display: "none" }}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        imageInputRef.current?.click()
                                    }
                                    className="image-upload-btn composer-icon-btn"
                                    title="Upload image (JPG/PNG only, max 5MB)"
                                    aria-label="Attach image"
                                >
                                    📂
                                </button>

                                <label
                                    className="email-checkbox-label composer-email-toggle"
                                    title="Also send this message to the alumni's email"
                                >
                                    <input
                                        type="checkbox"
                                        id="sendToEmail"
                                        checked={sendToEmail}
                                        onChange={(e) =>
                                            setSendToEmail(e.target.checked)
                                        }
                                    />
                                    <span className="email-checkbox-text">
                                        <span
                                            className="composer-email-icon"
                                            aria-hidden="true"
                                        >
                                            ✉️
                                        </span>
                                        <span className="composer-email-label">
                                            Notify via email
                                        </span>
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={
                                        (!newMessage.trim() &&
                                            !selectedImage) ||
                                        sending
                                    }
                                    className="send-btn composer-send-btn"
                                    aria-label="Send message"
                                >
                                    {sending ? "…" : "➤"}
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            ) : (
                <div className="no-chat-selected">
                    <div className="no-chat-icon">💬</div>
                    <h3>
                        {activeTab === ROLES.ALUMNI
                            ? "Select an alumni to view details or start messaging"
                            : "Select a conversation to continue"}
                    </h3>
                    <p>
                        {activeTab === ROLES.ALUMNI
                            ? "Click on an alumni from the list to view their profile details"
                            : "Choose a conversation from the list to view and send messages"}
                    </p>
                </div>
            )}
        </div>
    );
}
