import { useEffect } from "react";
import { message } from "antd";
import secureLocalStorage from "react-secure-storage";

export default function useMessageSearch({
    searchPanelOpen,
    msgSearchQuery,
    setSearchResultIds,
    setSearchActiveIndex,
    messages,
    later,
    searchResultIds,
    searchActiveIndex,
    setSearchPanelOpen,
    setMsgSearchQuery,
    ARCHIVED_CONVERSATIONS_KEY,
    setArchivedIds,
    archivedIds,
    archivePrompt,
    selectedConversation,
    setSelectedConversation,
    setMessages,
    setArchivePrompt,
    isAdmin,
    adminTyping,
    setAdminTyping,
    typingTimerRef,
}) {
    // ---------------------------------------------------------------------------
    // MESSAGE SEARCH
    // ---------------------------------------------------------------------------
    const scrollToMessageId = (id) => {
        const el = document.getElementById(`admin-msg-${id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    useEffect(() => {
        if (!searchPanelOpen) return;
        const q = msgSearchQuery.trim().toLowerCase();
        if (!q) {
            setSearchResultIds([]);
            setSearchActiveIndex(0);
            return;
        }
        const ids = messages
            .filter((m) => (m.message || "").toLowerCase().includes(q))
            .map((m) => m.id);
        setSearchResultIds(ids);
        setSearchActiveIndex(0);
        if (ids.length > 0) later(() => scrollToMessageId(ids[0]), 50);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [msgSearchQuery, searchPanelOpen, messages]);

    const gotoSearchResult = (dir) => {
        if (searchResultIds.length === 0) return;
        let next = searchActiveIndex + dir;
        if (next < 0) next = searchResultIds.length - 1;
        if (next >= searchResultIds.length) next = 0;
        setSearchActiveIndex(next);
        scrollToMessageId(searchResultIds[next]);
    };

    const toggleSearchPanel = () => {
        setSearchPanelOpen((open) => {
            const nextOpen = !open;
            if (!nextOpen) {
                setMsgSearchQuery("");
                setSearchResultIds([]);
                setSearchActiveIndex(0);
            }
            return nextOpen;
        });
    };

    const activeSearchId =
        searchResultIds.length > 0 ? searchResultIds[searchActiveIndex] : null;

    const highlightMatch = (text) => {
        const q = msgSearchQuery.trim();
        if (!searchPanelOpen || !q || !text) return text;
        try {
            const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const parts = text.split(new RegExp(`(${escaped})`, "gi"));
            return parts.map((part, i) =>
                part.toLowerCase() === q.toLowerCase() ? (
                    <mark key={i} className="msg-search-highlight">
                        {part}
                    </mark>
                ) : (
                    part
                ),
            );
        } catch {
            return text;
        }
    };

    // ---------------------------------------------------------------------------
    // ARCHIVE SYSTEM
    // ---------------------------------------------------------------------------
    useEffect(() => {
        try {
            const stored = secureLocalStorage.getItem(
                ARCHIVED_CONVERSATIONS_KEY,
            );
            if (Array.isArray(stored)) setArchivedIds(stored);
        } catch (err) {
            console.error("Failed to load archived conversations:", err);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const persistArchived = (ids) => {
        try {
            secureLocalStorage.setItem(ARCHIVED_CONVERSATIONS_KEY, ids);
        } catch (err) {
            console.error("Failed to persist archived conversations:", err);
        }
    };

    const isArchived = (alumniId) => archivedIds.includes(alumniId);

    const archiveConversation = (alumniId) => {
        setArchivedIds((prev) => {
            if (prev.includes(alumniId)) return prev;
            const next = [...prev, alumniId];
            persistArchived(next);
            return next;
        });
    };

    const unarchiveConversation = (alumniId) => {
        setArchivedIds((prev) => {
            const next = prev.filter((id) => id !== alumniId);
            persistArchived(next);
            return next;
        });
    };

    const confirmArchive = () => {
        if (archivePrompt == null) return;
        archiveConversation(archivePrompt);
        message.success("Conversation archived");
        if (selectedConversation?.alumni_id === archivePrompt) {
            setSelectedConversation(null);
            setMessages([]);
        }
        setArchivePrompt(null);
    };

    // ---------------------------------------------------------------------------
    // TYPING INDICATOR (debounced)
    // ---------------------------------------------------------------------------
    const handleAdminTyping = () => {
        if (!isAdmin || !selectedConversation) return;
        if (!adminTyping) setAdminTyping(true);
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => setAdminTyping(false), 1000);
    };

    useEffect(() => {
        return () => {
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        };
    }, []);

    return {
        unarchiveConversation,
        persistArchived,
        isArchived,
        toggleSearchPanel,
        gotoSearchResult,
        activeSearchId,
        highlightMatch,
        handleAdminTyping,
        confirmArchive,
    };
}
