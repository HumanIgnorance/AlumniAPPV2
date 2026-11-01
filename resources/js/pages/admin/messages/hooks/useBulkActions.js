import { message } from "antd";
import axios from "~/utils/axiosConfig";

export default function useBulkActions({
    setBulkMode,
    setBulkSelectedIds,
    bulkSelectedIds,
    setBulkConfirm,
    bulkConfirm,
    setBulkLoading,
    archivedIds,
    setArchivedIds,
    persistArchived,
    setConversations,
    setAllAlumni,
    clearMessageDraft,
    selectedConversation,
    setSelectedConversation,
    setMessages,
    fetchConversations,
    fetchAllAlumni,
}) {
    // ---------------------------------------------------------------------------
    // BULK CONVERSATION ACTIONS
    // ---------------------------------------------------------------------------
    const toggleBulkMode = () => {
        setBulkMode((m) => !m);
        setBulkSelectedIds([]);
    };

    const toggleBulkSelect = (alumniId) => {
        setBulkSelectedIds((prev) =>
            prev.includes(alumniId)
                ? prev.filter((id) => id !== alumniId)
                : [...prev, alumniId],
        );
    };

    const requestBulkAction = (action) => {
        if (bulkSelectedIds.length === 0) {
            message.info("Select at least one conversation");
            return;
        }
        setBulkConfirm({ action, count: bulkSelectedIds.length });
    };

    const executeBulkAction = async () => {
        if (!bulkConfirm) return;
        const { action } = bulkConfirm;
        const ids = [...bulkSelectedIds];
        setBulkLoading(true);
        try {
            if (action === "archive") {
                const next = Array.from(new Set([...archivedIds, ...ids]));
                setArchivedIds(next);
                persistArchived(next);
                message.success(`Archived ${ids.length} conversation(s)`);
            } else if (action === "delete") {
                await Promise.all(
                    ids.map((id) =>
                        axios
                            .delete(`/admin/messages/conversation/${id}`)
                            .catch((err) => err),
                    ),
                );
                setConversations((prev) =>
                    prev.filter((c) => !ids.includes(c.alumni_id)),
                );
                setAllAlumni((prev) =>
                    prev.map((a) =>
                        ids.includes(a.alumni_id)
                            ? {
                                  ...a,
                                  has_conversation: false,
                                  last_message: null,
                                  unread_count: 0,
                              }
                            : a,
                    ),
                );
                ids.forEach((id) => clearMessageDraft(id));
                if (
                    selectedConversation &&
                    ids.includes(selectedConversation.alumni_id)
                ) {
                    setSelectedConversation(null);
                    setMessages([]);
                }
                message.success(`Deleted ${ids.length} conversation(s)`);
            } else if (action === "restrict") {
                await Promise.all(
                    ids.map((id) =>
                        axios
                            .post(`/admin/messages/restrict/${id}`, {
                                restrict: true,
                            })
                            .catch((err) => err),
                    ),
                );
                setConversations((prev) =>
                    prev.map((c) =>
                        ids.includes(c.alumni_id)
                            ? { ...c, is_restricted: true }
                            : c,
                    ),
                );
                setAllAlumni((prev) =>
                    prev.map((a) =>
                        ids.includes(a.alumni_id)
                            ? { ...a, is_restricted: true }
                            : a,
                    ),
                );
                message.success(`Restricted ${ids.length} alumni`);
            } else if (action === "read") {
                await Promise.all(
                    ids.map((id) =>
                        axios
                            .post(`/admin/messages/${id}/mark-read`)
                            .catch((err) => err),
                    ),
                );
                setConversations((prev) =>
                    prev.map((c) =>
                        ids.includes(c.alumni_id)
                            ? { ...c, unread_count: 0 }
                            : c,
                    ),
                );
                setAllAlumni((prev) =>
                    prev.map((a) =>
                        ids.includes(a.alumni_id)
                            ? { ...a, unread_count: 0 }
                            : a,
                    ),
                );
                message.success(`Marked ${ids.length} conversation(s) as read`);
            }
        } catch (err) {
            console.error("Bulk action failed:", err);
            message.error("Some actions could not be completed");
        } finally {
            setBulkLoading(false);
            setBulkConfirm(null);
            setBulkSelectedIds([]);
            setBulkMode(false);
            fetchConversations();
            fetchAllAlumni();
        }
    };

    const bulkActionLabel = (action) => {
        switch (action) {
            case "delete":
                return "delete";
            case "restrict":
                return "restrict";
            case "read":
                return "mark as read";
            case "archive":
                return "archive";
            default:
                return action;
        }
    };

    return {
        toggleBulkMode,
        requestBulkAction,
        toggleBulkSelect,
        bulkActionLabel,
        executeBulkAction,
    };
}
