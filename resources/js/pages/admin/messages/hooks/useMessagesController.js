import useMessagesState from "~/pages/admin/messages/hooks/useMessagesState";
import useMessageMedia from "~/pages/admin/messages/hooks/useMessageMedia";
import useMessageDrafts from "~/pages/admin/messages/hooks/useMessageDrafts";
import useMessageSearch from "~/pages/admin/messages/hooks/useMessageSearch";
import useMessageFormatters from "~/pages/admin/messages/hooks/useMessageFormatters";
import useMessagesApi from "~/pages/admin/messages/hooks/useMessagesApi";
import useMessagesUi from "~/pages/admin/messages/hooks/useMessagesUi";
import useBulkActions from "~/pages/admin/messages/hooks/useBulkActions";
import useSendConfirm from "~/pages/admin/messages/hooks/useSendConfirm";
import useMessageLists from "~/pages/admin/messages/hooks/useMessageLists";
import useMessageRenderers from "~/pages/admin/messages/hooks/useMessageRenderers";

/**
 * All state, effects and handlers of the Messages page. Each sub-hook gets what
 * the hooks above it produced (ctx) and adds its own values, so order matters.
 * The result is shared with every part through MessagesContext.
 */
export default function useMessagesController() {
    const ctx = {};
    Object.assign(ctx, useMessagesState());
    Object.assign(ctx, useMessageMedia(ctx));
    Object.assign(ctx, useMessageDrafts(ctx));
    Object.assign(ctx, useMessageSearch(ctx));
    Object.assign(ctx, useMessageFormatters(ctx));
    Object.assign(ctx, useMessagesApi(ctx));
    Object.assign(ctx, useMessagesUi(ctx));
    Object.assign(ctx, useBulkActions(ctx));
    Object.assign(ctx, useSendConfirm(ctx));
    Object.assign(ctx, useMessageLists(ctx));
    Object.assign(ctx, useMessageRenderers(ctx));
    return ctx;
}
