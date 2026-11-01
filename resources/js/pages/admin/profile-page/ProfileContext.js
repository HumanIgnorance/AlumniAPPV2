import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of this page.
const ProfileContext = createContext(null);

export const ProfileProvider = ProfileContext.Provider;

export function useProfileContext() {
    const ctx = useContext(ProfileContext);
    if (!ctx)
        throw new Error("useProfileContext must be used inside <ProfilePage>");
    return ctx;
}
