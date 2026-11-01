import { ROLES } from "~/config/roles";

export default function useMessageLists({
    groupMessagesByDate,
    messages,
    activeTab,
    allAlumni,
    conversations,
    archivedIds,
}) {
    // ============================
    // COMPUTED VALUES
    // ============================

    const groupedMessages = groupMessagesByDate(messages);

    const baseList = activeTab === ROLES.ALUMNI ? allAlumni : conversations;

    // Archived conversations are hidden from active tabs and shown only in the Archive tab.
    const archivedConversations = conversations.filter((c) =>
        archivedIds.includes(c.alumni_id),
    );

    const currentList =
        activeTab === "archived"
            ? archivedConversations
            : (baseList || []).filter(
                  (item) => !archivedIds.includes(item.alumni_id),
              );

    const totalUnreadCount = conversations.reduce(
        (sum, conv) => sum + (conv.unread_count || 0),
        0,
    );

    return {
        groupedMessages,
        totalUnreadCount,
        archivedConversations,
        currentList,
    };
}
