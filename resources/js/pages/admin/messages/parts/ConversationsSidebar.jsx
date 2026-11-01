import React from "react";
import { Skeleton, message } from "antd";
import { ROLES } from "~/config/roles";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

export default function ConversationsSidebar() {
    const {
        totalUnreadCount,
        activeTab,
        searchQuery,
        setSearchQuery,
        setActiveTab,
        conversations,
        archivedConversations,
        bulkMode,
        toggleBulkMode,
        bulkSelectedIds,
        requestBulkAction,
        loading,
        currentList,
        getCourseCode,
        selectedConversation,
        handleConversationClick,
        formatTime,
        getEmploymentClass,
        getEmploymentStatusLabel,
        handleViewAlumniProfile,
        toggleBulkSelect,
        setOpenDropdown,
        openDropdown,
        openRestrictModal,
        openDeleteModal,
        isArchived,
        unarchiveConversation,
        setArchivePrompt,
    } = useMessagesContext();

    return (
        <div className="conversations-sidebar">
            <div className="conversations-header">
                <h2>Messages</h2>
                {totalUnreadCount > 0 && (
                    <span className="total-unread-badge">
                        {totalUnreadCount}
                    </span>
                )}
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder={
                        activeTab === ROLES.ALUMNI
                            ? "Search alumni..."
                            : "Search conversations..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === ROLES.ALUMNI ? "active" : ""}`}
                    onClick={() => setActiveTab("alumni")}
                >
                    👥 All Alumni
                </button>
                <button
                    className={`tab-btn ${activeTab === "conversations" ? "active" : ""}`}
                    onClick={() => setActiveTab("conversations")}
                >
                    💬 Conversations{" "}
                    {conversations.length > 0 && `${conversations.length}`}
                </button>
                <button
                    className={`tab-btn ${activeTab === "archived" ? "active" : ""}`}
                    onClick={() => setActiveTab("archived")}
                >
                    🗄️ Archive{" "}
                    {archivedConversations.length > 0 &&
                        `${archivedConversations.length}`}
                </button>
            </div>

            {/* Bulk conversation actions — compact pill + floating toolbar */}
            {(activeTab === "conversations" || activeTab === "archived") && (
                <>
                    {!bulkMode && (
                        <button
                            className="select-toggle"
                            onClick={toggleBulkMode}
                        >
                            ☑ Select
                        </button>
                    )}
                    <div
                        className={`bulk-toolbar ${bulkMode ? "is-active" : ""}`}
                        aria-hidden={!bulkMode}
                    >
                        <div className="bulk-toolbar__header">
                            <span className="bulk-toolbar__count">
                                {bulkSelectedIds.length} selected
                            </span>
                            <button
                                className="bulk-toolbar__cancel"
                                onClick={toggleBulkMode}
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="bulk-toolbar__actions">
                            <button
                                className="bulk-btn bulk-btn--primary"
                                onClick={() => requestBulkAction("read")}
                            >
                                Read
                            </button>
                            <button
                                className="bulk-btn"
                                onClick={() => requestBulkAction("archive")}
                            >
                                Archive
                            </button>
                            <button
                                className="bulk-btn bulk-btn--warn"
                                onClick={() => requestBulkAction("restrict")}
                            >
                                Restrict
                            </button>
                            <button
                                className="bulk-btn bulk-btn--danger"
                                onClick={() => requestBulkAction("delete")}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div
                className={`conversations-list ${activeTab === ROLES.ALUMNI ? "alumni-list-mode" : "conversations-list-mode"}`}
            >
                {loading && currentList.length === 0 ? (
                    <div className="conversation-skeleton-list">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="conversation-item">
                                <Skeleton
                                    avatar
                                    active
                                    title={false}
                                    paragraph={{
                                        rows: 2,
                                        width: ["60%", "40%"],
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : currentList.length === 0 ? (
                    <div className="no-conversations">
                        <p>
                            {activeTab === ROLES.ALUMNI
                                ? "No alumni found"
                                : "No conversations yet"}
                        </p>
                    </div>
                ) : activeTab === ROLES.ALUMNI ? (
                    /* ============================================
        RESPONSIVE ALUMNI CARD RENDER (redesigned)
        ============================================ */
                    <div className="alumni-cards-grid">
                        {currentList.map((item) => {
                            const __code = getCourseCode(item.course_id);
                            const __key = (__code || "")
                                .toString()
                                .toUpperCase();
                            const isActive =
                                selectedConversation?.alumni_id ===
                                item.alumni_id;
                            return (
                                <article
                                    key={item.alumni_id}
                                    className={`alumni-card conversation-item ${isActive ? "active" : ""} ${item.unread_count > 0 ? "unread" : ""} ${item.is_restricted ? "is-restricted" : ""}`}
                                    onClick={() =>
                                        handleConversationClick(
                                            item.alumni_id,
                                            item,
                                        )
                                    }
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            e.preventDefault();
                                            handleConversationClick(
                                                item.alumni_id,
                                                item,
                                            );
                                        }
                                    }}
                                >
                                    <div className="alumni-card__media">
                                        {item.alumni_avatar ? (
                                            <img
                                                src={
                                                    item.alumni_avatar ||
                                                    "/placeholder.svg"
                                                }
                                                alt={item.alumni_name}
                                                className="alumni-card__avatar conversation-avatar-img"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="alumni-card__avatar alumni-card__avatar--initial conversation-avatar">
                                                {item.alumni_name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        {!!item.is_restricted && (
                                            <span
                                                className="alumni-card__status-dot"
                                                title="Restricted"
                                            />
                                        )}
                                    </div>

                                    <div className="alumni-card__body conversation-info">
                                        <div className="alumni-card__head conversation-top">
                                            <h4
                                                className="alumni-card__name"
                                                title={item.alumni_name}
                                            >
                                                {item.alumni_name}
                                            </h4>
                                            {item.last_message_time && (
                                                <span className="alumni-card__time conversation-time">
                                                    {formatTime(
                                                        item.last_message_time,
                                                    )}
                                                </span>
                                            )}
                                        </div>

                                        <div className="alumni-card__meta conversation-bottom">
                                            <span
                                                className={`alumni-card__chip alumni-employment ${getEmploymentClass(item.employment_status_id)}`}
                                            >
                                                {getEmploymentStatusLabel(
                                                    item.employment_status_id,
                                                )}
                                            </span>
                                            <span
                                                className={`alumni-card__chip alumni-course course-pill course-${__key.toLowerCase()}`}
                                            >
                                                {__code}
                                            </span>
                                            {!!item.is_restricted && (
                                                <span className="alumni-card__chip restricted-badge">
                                                    Restricted
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="alumni-card__actions">
                                        <button
                                            className="alumni-card__btn view-details-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewAlumniProfile(item);
                                            }}
                                            title="View alumni details"
                                            aria-label={`View details for ${item.alumni_name}`}
                                        >
                                            <span
                                                className="alumni-card__btn-icon"
                                                aria-hidden="true"
                                            >
                                                👤
                                            </span>
                                            <span className="alumni-card__btn-label">
                                                View Details
                                            </span>
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    currentList.map((item) => (
                        <div
                            key={item.alumni_id}
                            className={`conversation-item ${selectedConversation?.alumni_id === item.alumni_id ? "active" : ""} ${item.unread_count > 0 ? "unread" : ""} ${bulkMode && bulkSelectedIds.includes(item.alumni_id) ? "bulk-selected" : ""}`}
                            onClick={() => {
                                if (bulkMode) {
                                    toggleBulkSelect(item.alumni_id);
                                } else {
                                    handleConversationClick(
                                        item.alumni_id,
                                        item,
                                    );
                                }
                            }}
                        >
                            {bulkMode && (
                                <input
                                    type="checkbox"
                                    className="bulk-select-checkbox"
                                    checked={bulkSelectedIds.includes(
                                        item.alumni_id,
                                    )}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleBulkSelect(item.alumni_id);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                            {item.alumni_avatar ? (
                                <img
                                    src={
                                        item.alumni_avatar || "/placeholder.svg"
                                    }
                                    alt={item.alumni_name}
                                    className="conversation-avatar-img"
                                />
                            ) : (
                                <div className="conversation-avatar">
                                    {item.alumni_name?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div className="conversation-info">
                                <div className="conversation-top">
                                    <h4>{item.alumni_name}</h4>
                                    {item.last_message_time && (
                                        <span className="conversation-time">
                                            {formatTime(item.last_message_time)}
                                        </span>
                                    )}
                                </div>

                                <div className="conversation-bottom">
                                    {item.last_message && (
                                        <p className="last-message">
                                            {item.last_message}
                                        </p>
                                    )}
                                    {item.unread_count > 0 && (
                                        <span className="unread-badge">
                                            {item.unread_count} new
                                        </span>
                                    )}
                                    {!!item.is_restricted && (
                                        <span className="restricted-badge">
                                            Restricted
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="actions-dropdown-container">
                                <button
                                    className="actions-dropdown-trigger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdown(
                                            openDropdown === item.alumni_id
                                                ? null
                                                : item.alumni_id,
                                        );
                                    }}
                                    title="Actions"
                                >
                                    ⋮
                                </button>
                                {openDropdown === item.alumni_id && (
                                    <div className="actions-dropdown-menu">
                                        <button
                                            className="dropdown-menu-item"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdown(null);
                                                handleViewAlumniProfile(item);
                                            }}
                                        >
                                            <span className="dropdown-icon">
                                                👤
                                            </span>
                                            <span>View Profile</span>
                                        </button>
                                        <button
                                            className="dropdown-menu-item"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdown(null);
                                                openRestrictModal(item);
                                            }}
                                        >
                                            <span className="dropdown-icon">
                                                {item.is_restricted
                                                    ? "✅"
                                                    : "🚫"}
                                            </span>
                                            <span>
                                                {item.is_restricted
                                                    ? "Unrestrict"
                                                    : "Restrict"}
                                            </span>
                                        </button>
                                        <button
                                            className="dropdown-menu-item danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdown(null);
                                                openDeleteModal(item.alumni_id);
                                            }}
                                        >
                                            <span className="dropdown-icon">
                                                🗑️
                                            </span>
                                            <span>Delete Conversation</span>
                                        </button>
                                        <button
                                            className="dropdown-menu-item"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdown(null);
                                                if (
                                                    isArchived(item.alumni_id)
                                                ) {
                                                    unarchiveConversation(
                                                        item.alumni_id,
                                                    );
                                                    message.success(
                                                        "Conversation unarchived",
                                                    );
                                                } else {
                                                    setArchivePrompt(
                                                        item.alumni_id,
                                                    );
                                                }
                                            }}
                                        >
                                            <span className="dropdown-icon">
                                                {isArchived(item.alumni_id)
                                                    ? "📤"
                                                    : "🗄️"}
                                            </span>
                                            <span>
                                                {isArchived(item.alumni_id)
                                                    ? "Unarchive"
                                                    : "Archive"}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
