import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of the AlumniDetails page.
const AlumniDetailsContext = createContext(null);

export const AlumniDetailsProvider = AlumniDetailsContext.Provider;

export function useAlumniDetailsContext() {
    const ctx = useContext(AlumniDetailsContext);
    if (!ctx)
        throw new Error(
            "useAlumniDetailsContext must be used inside <AlumniDetails>",
        );
    return ctx;
}
