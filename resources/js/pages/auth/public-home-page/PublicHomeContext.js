import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of this page.
const PublicHomeContext = createContext(null);

export const PublicHomeProvider = PublicHomeContext.Provider;

export function usePublicHomeContext() {
    const ctx = useContext(PublicHomeContext);
    if (!ctx)
        throw new Error(
            "usePublicHomeContext must be used inside <PublicHomePage>",
        );
    return ctx;
}
