import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of the app shell.
const LayoutContext = createContext(null);

export const LayoutProvider = LayoutContext.Provider;

export function useLayoutContext() {
    const ctx = useContext(LayoutContext);
    if (!ctx)
        throw new Error("useLayoutContext must be used inside <MainLayout>");
    return ctx;
}
