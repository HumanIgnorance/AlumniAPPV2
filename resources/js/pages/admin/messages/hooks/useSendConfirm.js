export default function useSendConfirm({
    newMessage,
    selectedImage,
    selectedConversation,
    setSendConfirm,
    sendAdminMessage,
}) {
    // ---------------------------------------------------------------------------
    // SEND CONFIRMATION (only for messages containing an image attachment)
    // ---------------------------------------------------------------------------
    const requestSendAdminMessage = (e) => {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        if ((!newMessage.trim() && !selectedImage) || !selectedConversation)
            return;
        if (selectedImage) {
            setSendConfirm({ ts: Date.now() });
            return;
        }
        sendAdminMessage(e || { preventDefault: () => {} });
    };

    const confirmSendNow = () => {
        setSendConfirm(null);
        sendAdminMessage({ preventDefault: () => {} });
    };

    return { requestSendAdminMessage, confirmSendNow };
}
