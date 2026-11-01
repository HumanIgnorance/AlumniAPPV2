import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of this page.
const HomeContext = createContext(null);

export const HomeProvider = HomeContext.Provider;

export function useHomeContext() {
    const ctx = useContext(HomeContext);
    if (!ctx) throw new Error("useHomeContext must be used inside <HomePage>");
    return ctx;
}
