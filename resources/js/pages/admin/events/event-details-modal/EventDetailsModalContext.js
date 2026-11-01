import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of this page.
const EventDetailsModalContext = createContext(null);

export const EventDetailsModalProvider = EventDetailsModalContext.Provider;

export function useEventDetailsModalContext() {
    const ctx = useContext(EventDetailsModalContext);
    if (!ctx)
        throw new Error(
            "useEventDetailsModalContext must be used inside <EventDetailsModal>",
        );
    return ctx;
}
