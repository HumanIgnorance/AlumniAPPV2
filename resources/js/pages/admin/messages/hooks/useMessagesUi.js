import { useEffect } from "react";
import { message } from "antd";
import { ROLES } from "~/config/roles";
import axios from "~/utils/axiosConfig";

export default function useMessagesUi({
    isAdmin,
    selectedConversation,
    hasUnsentChanges,
    setPendingSwitch,
    setOpenDropdown,
    performConversationSwitch,
    setMessageReactions,
    setLongPressedMessageId,
    setShowEmojiPicker,
    setShowMessageActionModal,
    longPressTimerRef,
    setActionMessageData,
    setDeleteTargetMessage,
    setShowDeleteConfirmModal,
    deleteTargetMessage,
    setDeleteMessageLoading,
    setMessages,
    fetchConversations,
    fetchAdminMessages,
    fetchAlumniMessages,
    canEditMessage,
    setInlineEditMessageId,
    setInlineEditText,
    inlineEditRef,
    inlineEditMessageId,
    inlineEditText,
    setInlineEditLoading,
    fetchAllAlumni,
    setInitialLoading,
    fetchAlumniUnreadCount,
    later,
    scrollToBottom,
    emojiPickerRef,
    openDropdown,
}) {
    const handleConversationClick = (alumniId, alumniData) => {
        // Conversation switch protection: warn if the current composer has unsent content.
        if (
            isAdmin &&
            selectedConversation &&
            selectedConversation.alumni_id !== alumniData.alumni_id &&
            hasUnsentChanges()
        ) {
            setPendingSwitch({
                alumni_id: alumniData.alumni_id,
                data: alumniData,
            });
            setOpenDropdown(null);
            return;
        }

        // No unsent changes (or same conversation): switch immediately and offer draft restore.
        performConversationSwitch(alumniData);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours < 24) {
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } else if (diffHours < 48) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
    };

    const groupMessagesByDate = (messages) => {
        const groups = [];
        let currentDate = null;

        messages.forEach((msg) => {
            const msgDate = new Date(msg.created_at).toDateString();
            if (msgDate !== currentDate) {
                currentDate = msgDate;
                groups.push({ type: "date", date: msg.created_at });
            }
            groups.push({ type: "message", ...msg });
        });

        return groups;
    };

    const formatDateSeparator = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year:
                    date.getFullYear() !== today.getFullYear()
                        ? "numeric"
                        : undefined,
            });
        }
    };

    // ============================
    // REACTION FUNCTIONS
    // ============================

    const addReaction = async (messageId, emoji) => {
        try {
            const endpoint = isAdmin
                ? `/admin/messages/${messageId}/reactions`
                : `/messages/${messageId}/reactions`;

            const response = await axios.post(endpoint, { emoji });
            if (response.data.success) {
                setMessageReactions((prev) => ({
                    ...prev,
                    [messageId]: response.data.reactions || [],
                }));
            }
        } catch (error) {
            console.error("Error adding reaction:", error);
            message.error("Failed to add reaction");
        }
        setLongPressedMessageId(null);
        setShowEmojiPicker(false);
        setShowMessageActionModal(false);
    };

    const handleDoubleClick = (messageId) => {
        addReaction(messageId, "❤️");
    };

    const handleLongPressStart = (messageId, msgData) => {
        longPressTimerRef.current = setTimeout(() => {
            setLongPressedMessageId(messageId);
            setActionMessageData(msgData);
            setShowMessageActionModal(true);
            setShowEmojiPicker(true);
        }, 500);
    };

    const handleLongPressEnd = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const handleLongPress = (messageId, msgData) => {
        setLongPressedMessageId(messageId);
        setActionMessageData(msgData);
        setShowMessageActionModal(true);
        setShowEmojiPicker(true);
    };

    // ============================
    // MESSAGE DELETE/EDIT FUNCTIONS (UPDATED)
    // ============================

    const closeMessageActionModal = () => {
        setShowMessageActionModal(false);
        setShowEmojiPicker(false);
        setLongPressedMessageId(null);
        setActionMessageData(null);
    };

    // NEW: Open delete confirmation modal (black theme)
    const openDeleteConfirmModal = (msgData) => {
        setDeleteTargetMessage(msgData);
        setShowDeleteConfirmModal(true);
        setShowMessageActionModal(false);
    };

    // NEW: Close delete confirmation modal
    const closeDeleteConfirmModal = () => {
        setShowDeleteConfirmModal(false);
        setDeleteTargetMessage(null);
    };

    // UPDATED: Handle delete message with confirmation
    const handleDeleteMessage = async () => {
        if (!deleteTargetMessage) return;

        try {
            setDeleteMessageLoading(true);
            const endpoint = isAdmin
                ? `/admin/messages/${deleteTargetMessage.id}/delete`
                : `/alumni/messages/${deleteTargetMessage.id}/delete`;

            // Optimistic update
            const deletedId = deleteTargetMessage.id;
            setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));

            const response = await axios.delete(endpoint);

            if (response.data.success) {
                message.success("Message deleted for everyone");
                closeDeleteConfirmModal();

                if (isAdmin) {
                    fetchConversations();
                }
            } else {
                // Revert optimistic update
                fetchAdminMessages(selectedConversation?.alumni_id, true);
                message.error(
                    response.data.message || "Failed to delete message",
                );
            }
        } catch (error) {
            console.error("Failed to delete message:", error);
            // Revert optimistic update
            if (isAdmin && selectedConversation) {
                fetchAdminMessages(selectedConversation.alumni_id, true);
            } else {
                fetchAlumniMessages();
            }
            message.error("Failed to delete message");
        } finally {
            setDeleteMessageLoading(false);
            closeDeleteConfirmModal();
        }
    };

    // NEW: Start inline edit (Messenger style)
    const startInlineEdit = (msgData) => {
        if (!msgData.message) {
            message.warning("Cannot edit image-only messages");
            return;
        }

        if (!canEditMessage(msgData)) {
            message.warning(
                "You can only edit messages within 3 minutes of sending",
            );
            return;
        }

        setInlineEditMessageId(msgData.id);
        setInlineEditText(msgData.message);
        setShowMessageActionModal(false);

        // Focus the input after render
        setTimeout(() => {
            if (inlineEditRef.current) {
                inlineEditRef.current.focus();
                inlineEditRef.current.setSelectionRange(
                    inlineEditRef.current.value.length,
                    inlineEditRef.current.value.length,
                );
            }
        }, 50);
    };

    // NEW: Cancel inline edit
    const cancelInlineEdit = () => {
        setInlineEditMessageId(null);
        setInlineEditText("");
    };

    // NEW: Save inline edit
    const saveInlineEdit = async () => {
        if (!inlineEditMessageId || !inlineEditText.trim()) return;

        try {
            setInlineEditLoading(true);
            const endpoint = isAdmin
                ? `/admin/messages/${inlineEditMessageId}/edit`
                : `/alumni/messages/${inlineEditMessageId}/edit`;

            // Optimistic update
            const editedId = inlineEditMessageId;
            const editedText = inlineEditText.trim();
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === editedId
                        ? {
                              ...msg,
                              message: editedText,
                              is_edited: true,
                              updated_at: new Date().toISOString(),
                          }
                        : msg,
                ),
            );

            const response = await axios.put(endpoint, {
                message: editedText,
            });

            if (response.data.success) {
                message.success("Message edited");
                cancelInlineEdit();
            } else {
                // Revert optimistic update
                if (isAdmin && selectedConversation) {
                    fetchAdminMessages(selectedConversation.alumni_id, true);
                } else {
                    fetchAlumniMessages();
                }
                message.error(
                    response.data.message || "Failed to edit message",
                );
            }
        } catch (error) {
            console.error("Failed to edit message:", error);
            // Revert optimistic update
            if (isAdmin && selectedConversation) {
                fetchAdminMessages(selectedConversation.alumni_id, true);
            } else {
                fetchAlumniMessages();
            }
            message.error("Failed to edit message");
        } finally {
            setInlineEditLoading(false);
        }
    };

    // Handle inline edit key press
    const handleInlineEditKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            saveInlineEdit();
        } else if (e.key === "Escape") {
            cancelInlineEdit();
        }
    };

    // Check if current user can edit/delete the message
    const canModifyMessage = (msg) => {
        if (isAdmin) {
            return msg.sender_type === ROLES.ADMIN;
        } else {
            return msg.sender_type === ROLES.ALUMNI;
        }
    };

    // ============================
    // EFFECTS
    // ============================

    useEffect(() => {
        if (isAdmin) {
            fetchAllAlumni();
            fetchConversations();
            setInitialLoading(false);
        } else {
            fetchAlumniMessages();
            fetchAlumniUnreadCount();
        }

        const interval = setInterval(() => {
            if (isAdmin) {
                fetchAllAlumni(true);
                fetchConversations(true);

                if (selectedConversation) {
                    fetchAdminMessages(selectedConversation.alumni_id, true);
                }
            } else {
                fetchAlumniMessages(true);
                fetchAlumniUnreadCount(true);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [
        isAdmin,
        selectedConversation,
        fetchAlumniMessages,
        fetchAlumniUnreadCount,
        fetchAllAlumni,
        fetchConversations,
        fetchAdminMessages,
    ]);

    useEffect(() => {
        if (isAdmin && selectedConversation) {
            fetchAdminMessages(selectedConversation.alumni_id);
            later(() => scrollToBottom(), 100);
        }
    }, [selectedConversation, isAdmin, fetchAdminMessages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
                setLongPressedMessageId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                openDropdown &&
                !e.target.closest(".actions-dropdown-container")
            ) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [openDropdown]);

    useEffect(() => {
        return () => {
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
            }
        };
    }, []);

    return {
        groupMessagesByDate,
        handleInlineEditKeyDown,
        cancelInlineEdit,
        saveInlineEdit,
        canModifyMessage,
        closeMessageActionModal,
        addReaction,
        startInlineEdit,
        openDeleteConfirmModal,
        closeDeleteConfirmModal,
        handleDeleteMessage,
        formatDateSeparator,
        handleDoubleClick,
        handleLongPressStart,
        handleLongPressEnd,
        formatTime,
        handleConversationClick,
    };
}
