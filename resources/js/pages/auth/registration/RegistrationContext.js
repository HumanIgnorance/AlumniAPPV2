import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of the Registration page.
const RegistrationContext = createContext(null);

export const RegistrationProvider = RegistrationContext.Provider;

export function useRegistrationContext() {
    const ctx = useContext(RegistrationContext);
    if (!ctx)
        throw new Error(
            "useRegistrationContext must be used inside <Registration>",
        );
    return ctx;
}
