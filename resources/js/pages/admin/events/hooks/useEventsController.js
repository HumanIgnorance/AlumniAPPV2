import useEventsState from "~/pages/admin/events/hooks/useEventsState";
import useEventsFilters from "~/pages/admin/events/hooks/useEventsFilters";
import useEventDraft from "~/pages/admin/events/hooks/useEventDraft";
import useEventForm from "~/pages/admin/events/hooks/useEventForm";

/**
 * All state, effects and handlers of the Events page. Each sub-hook gets what
 * the hooks above it produced (ctx) and adds its own values, so order matters.
 * The result is shared with every part through EventsContext.
 */
export default function useEventsController() {
    const ctx = {};
    Object.assign(ctx, useEventsState());
    Object.assign(ctx, useEventsFilters(ctx));
    Object.assign(ctx, useEventDraft(ctx));
    Object.assign(ctx, useEventForm(ctx));
    return ctx;
}
