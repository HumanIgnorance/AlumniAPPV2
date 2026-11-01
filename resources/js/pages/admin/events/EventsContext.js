import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of the Events page.
const EventsContext = createContext(null);

export const EventsProvider = EventsContext.Provider;

export function useEventsContext() {
    const ctx = useContext(EventsContext);
    if (!ctx)
        throw new Error("useEventsContext must be used inside <AlumniEvents>");
    return ctx;
}
