"use client";

import React from "react";
import { Layout } from "~/components";
import "./styles";
import { MessagesProvider } from "./MessagesContext";
import useMessagesController from "./hooks/useMessagesController";
import AlumniMessagesView from "./parts/AlumniMessagesView";
import ConversationsSidebar from "./parts/ConversationsSidebar";
import ChatArea from "./parts/ChatArea";
import AlumniDetailsHost from "./parts/AlumniDetailsHost";
import ImageLightbox from "./parts/ImageLightbox";
import DeleteConversationModal from "./parts/DeleteConversationModal";
import RestrictModal from "./parts/RestrictModal";
import MessageActionModal from "./parts/MessageActionModal";
import DeleteConfirmModal from "./parts/DeleteConfirmModal";
import MessagePromptModals from "./parts/MessagePromptModals";

/**
 * Messages page.
 *   hooks/  state, drafts, search, API calls, bulk actions ... (useMessagesController composes them)
 *   parts/  alumni view, admin conversation list, chat area and every modal
 * Alumni members get a single-thread view; admins get the full inbox.
 */
const AdminAlumniMessages = () => {
    const ctx = useMessagesController();
    const { isAdmin, selectedConversation } = ctx;

    if (!isAdmin) {
        return (
            <MessagesProvider value={ctx}>
                <AlumniMessagesView />
            </MessagesProvider>
        );
    }

    return (
        <MessagesProvider value={ctx}>
            <Layout>
                <div className="messages-container">
                    <div
                        className={`messages-layout ${selectedConversation ? "chat-open" : ""}`}
                    >
                        <ConversationsSidebar />
                        <ChatArea />
                    </div>

                    <AlumniDetailsHost />
                    <ImageLightbox />
                    <DeleteConversationModal />
                    <RestrictModal />
                    <MessageActionModal />
                    <DeleteConfirmModal />
                    <MessagePromptModals />
                </div>
            </Layout>
        </MessagesProvider>
    );
};

export default AdminAlumniMessages;
