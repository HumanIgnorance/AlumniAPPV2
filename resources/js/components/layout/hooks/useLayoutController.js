import useLayoutBase from "~/components/layout/hooks/useLayoutBase";
import usePageTitle from "~/components/layout/hooks/usePageTitle";
import useNotificationState from "~/components/layout/hooks/useNotificationState";
import useLayoutModalState from "~/components/layout/hooks/useLayoutModalState";
import useFeedbackFlow from "~/components/layout/hooks/useFeedbackFlow";
import useLayoutUser from "~/components/layout/hooks/useLayoutUser";
import useNotificationSettings from "~/components/layout/hooks/useNotificationSettings";
import useRoleAccess from "~/components/layout/hooks/useRoleAccess";
import useResponsiveShell from "~/components/layout/hooks/useResponsiveShell";
import useNotificationFeed from "~/components/layout/hooks/useNotificationFeed";
import usePresenceHeartbeat from "~/components/layout/hooks/usePresenceHeartbeat";
import useNotificationNavigation from "~/components/layout/hooks/useNotificationNavigation";

/**
 * All state, effects and handlers of the app shell in one place.
 * Each sub-hook receives what the earlier ones produced (ctx) and adds its own
 * values; the order below matters (a hook can only use values from hooks above it).
 * The result is shared with every layout part through LayoutContext.
 */
export default function useLayoutController() {
    const ctx = {};
    Object.assign(ctx, useLayoutBase());
    usePageTitle(ctx);
    Object.assign(ctx, useNotificationState());
    Object.assign(ctx, useLayoutModalState());
    Object.assign(ctx, useFeedbackFlow());
    Object.assign(ctx, useLayoutUser(ctx));
    Object.assign(ctx, useNotificationSettings());
    Object.assign(ctx, useRoleAccess());
    Object.assign(ctx, useResponsiveShell());
    Object.assign(ctx, useNotificationFeed(ctx));
    usePresenceHeartbeat();
    Object.assign(ctx, useNotificationNavigation(ctx));
    return ctx;
}
