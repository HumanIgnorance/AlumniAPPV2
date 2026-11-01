import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of the Messages page.
const MessagesContext = createContext(null);

export const MessagesProvider = MessagesContext.Provider;

export function useMessagesContext() {
    const ctx = useContext(MessagesContext);
    if (!ctx)
        throw new Error(
            "useMessagesContext must be used inside <AdminAlumniMessages>",
        );
    return ctx;
}
