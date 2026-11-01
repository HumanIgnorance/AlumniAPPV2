import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of the Login page.
const LoginContext = createContext(null);

export const LoginProvider = LoginContext.Provider;

export function useLoginContext() {
    const ctx = useContext(LoginContext);
    if (!ctx) throw new Error("useLoginContext must be used inside <Login>");
    return ctx;
}
