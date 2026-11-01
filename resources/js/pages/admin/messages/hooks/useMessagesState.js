import { useRef, useState } from "react";
import { ROLES } from "~/config/roles";
import useTimeout from "~/hooks/useTimeout";
import { getUserRole } from "~/utils/session";

export default function useMessagesState() {
    // timeouts created through `later` are cleared automatically on unmount
    const later = useTimeout();

    // Common state
    const [messages, setMessages] = useState([]);

    const [newMessage, setNewMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [sending, setSending] = useState(false);

    const [initialLoading, setInitialLoading] = useState(true);

    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);

    const [imagePreview, setImagePreview] = useState(null);

    const [messageReactions, setMessageReactions] = useState({});

    const [longPressedMessageId, setLongPressedMessageId] = useState(null);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [lightboxImage, setLightboxImage] = useState(null);

    const messagesEndRef = useRef(null);

    const inputRef = useRef(null);

    const imageInputRef = useRef(null);

    const emojiPickerRef = useRef(null);

    const longPressTimerRef = useRef(null);

    const [sendToEmail, setSendToEmail] = useState(false);

    // Message action modal states (delete/edit like Messenger)
    const [showMessageActionModal, setShowMessageActionModal] = useState(false);

    const [actionMessageData, setActionMessageData] = useState(null);

    const [deleteMessageLoading, setDeleteMessageLoading] = useState(false);

    // Inline edit states (NEW - Messenger style)
    const [inlineEditMessageId, setInlineEditMessageId] = useState(null);

    const [inlineEditText, setInlineEditText] = useState("");

    const [inlineEditLoading, setInlineEditLoading] = useState(false);

    const inlineEditRef = useRef(null);

    // Delete confirmation modal state (NEW - Professional black theme)
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

    const [deleteTargetMessage, setDeleteTargetMessage] = useState(null);

    // Timer for edit eligibility (force re-render every minute)
    const [, setTick] = useState(0);

    const EMOJI_REACTIONS = ["😍", "😂", "😮", "😢", "👍", "❤️"];

    // Edit time limit: 3 minutes in milliseconds
    const EDIT_TIME_LIMIT = 3 * 60 * 1000;

    // Role-based state
    const storedRole = getUserRole();

    const isAdmin = storedRole === ROLES.ADMIN;

    // Alumni-specific state
    const [isRestricted, setIsRestricted] = useState(false);

    const [alumniUnreadCount, setAlumniUnreadCount] = useState(0);

    const [alumniInfo, setAlumniInfo] = useState(null);

    // Admin-specific state
    const [allAlumni, setAllAlumni] = useState([]);

    const [conversations, setConversations] = useState([]);

    const [selectedConversation, setSelectedConversation] = useState(null);

    const [activeTab, setActiveTab] = useState("alumni");

    const [searchQuery, setSearchQuery] = useState("");

    const [showAlumniDetailsModal, setShowAlumniDetailsModal] = useState(false);

    const [alumniPreviewData, setAlumniPreviewData] = useState(null);

    const [alumniDetailsLoading, setAlumniDetailsLoading] = useState(false);

    const [openDropdown, setOpenDropdown] = useState(null);

    // Modal states for delete and restrict
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [showRestrictModal, setShowRestrictModal] = useState(false);

    const [pendingDeleteAlumniId, setPendingDeleteAlumniId] = useState(null);

    const [pendingRestrictAlumni, setPendingRestrictAlumni] = useState(null);

    const [modalLoading, setModalLoading] = useState(false);

    // ==========================================================================
    // ENHANCEMENTS (additive — none of the existing logic above is modified)
    // ==========================================================================

    // --- Storage keys ---
    const ALUMNI_MESSAGE_DRAFT_KEY = "admin-alumni-message-draft";

    const ARCHIVED_CONVERSATIONS_KEY = "admin-archived-conversations";

    // --- Draft auto-save state ---
    const [draftRestorePrompt, setDraftRestorePrompt] = useState(null);

    const draftSaveTimerRef = useRef(null);

    const suspendDraftSaveRef = useRef(false);

    // --- Conversation switch protection ---
    const [pendingSwitch, setPendingSwitch] = useState(null);

    // --- Message search ---
    const [searchPanelOpen, setSearchPanelOpen] = useState(false);

    const [msgSearchQuery, setMsgSearchQuery] = useState("");

    const [searchResultIds, setSearchResultIds] = useState([]);

    const [searchActiveIndex, setSearchActiveIndex] = useState(0);

    // --- Archive system ---
    const [archivedIds, setArchivedIds] = useState([]);

    const [archivePrompt, setArchivePrompt] = useState(null);

    // --- Send confirmation ---
    const [sendConfirm, setSendConfirm] = useState(null);

    // --- Typing indicator ---
    const [adminTyping, setAdminTyping] = useState(false);

    const typingTimerRef = useRef(null);

    // --- Bulk actions ---
    const [bulkMode, setBulkMode] = useState(false);

    const [bulkSelectedIds, setBulkSelectedIds] = useState([]);

    const [bulkConfirm, setBulkConfirm] = useState(null);

    const [bulkLoading, setBulkLoading] = useState(false);

    // --- Message recovery protection ---
    const [recoveryConfirm, setRecoveryConfirm] = useState(null);

    return {
        messagesEndRef,
        imageInputRef,
        setSelectedImage,
        setImagePreview,
        setLightboxImage,
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
        setDraftRestorePrompt,
        setSelectedConversation,
        setOpenDropdown,
        setSearchPanelOpen,
        setMsgSearchQuery,
        setSearchResultIds,
        setAdminTyping,
        setPendingSwitch,
        pendingSwitch,
        searchPanelOpen,
        msgSearchQuery,
        setSearchActiveIndex,
        messages,
        later,
        searchResultIds,
        searchActiveIndex,
        ARCHIVED_CONVERSATIONS_KEY,
        setArchivedIds,
        archivedIds,
        archivePrompt,
        setMessages,
        setArchivePrompt,
        adminTyping,
        typingTimerRef,
        EDIT_TIME_LIMIT,
        setTick,
        setError,
        setIsRestricted,
        setAlumniInfo,
        setMessageReactions,
        setAlumniUnreadCount,
        setInitialLoading,
        selectedImage,
        isRestricted,
        sending,
        setSending,
        alumniInfo,
        inputRef,
        searchQuery,
        setAllAlumni,
        setConversations,
        setLoading,
        allAlumni,
        setPendingRestrictAlumni,
        setShowRestrictModal,
        pendingRestrictAlumni,
        setModalLoading,
        setPendingDeleteAlumniId,
        setRecoveryConfirm,
        setShowDeleteModal,
        pendingDeleteAlumniId,
        setAlumniDetailsLoading,
        setAlumniPreviewData,
        setShowAlumniDetailsModal,
        setLongPressedMessageId,
        setShowEmojiPicker,
        setShowMessageActionModal,
        longPressTimerRef,
        setActionMessageData,
        setDeleteTargetMessage,
        setShowDeleteConfirmModal,
        deleteTargetMessage,
        setDeleteMessageLoading,
        setInlineEditMessageId,
        setInlineEditText,
        inlineEditRef,
        inlineEditMessageId,
        inlineEditText,
        setInlineEditLoading,
        emojiPickerRef,
        openDropdown,
        setBulkMode,
        setBulkSelectedIds,
        bulkSelectedIds,
        setBulkConfirm,
        bulkConfirm,
        setBulkLoading,
        setSendConfirm,
        activeTab,
        conversations,
        inlineEditLoading,
        showMessageActionModal,
        actionMessageData,
        EMOJI_REACTIONS,
        showDeleteConfirmModal,
        deleteMessageLoading,
        showDeleteModal,
        modalLoading,
        recoveryConfirm,
        showRestrictModal,
        alumniUnreadCount,
        error,
        initialLoading,
        messageReactions,
        lightboxImage,
        setSearchQuery,
        setActiveTab,
        bulkMode,
        loading,
        showAlumniDetailsModal,
        alumniPreviewData,
        sendConfirm,
        bulkLoading,
    };
}
