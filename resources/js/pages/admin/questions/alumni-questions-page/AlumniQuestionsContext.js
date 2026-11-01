import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of this page.
const AlumniQuestionsContext = createContext(null);

export const AlumniQuestionsProvider = AlumniQuestionsContext.Provider;

export function useAlumniQuestionsContext() {
    const ctx = useContext(AlumniQuestionsContext);
    if (!ctx)
        throw new Error(
            "useAlumniQuestionsContext must be used inside <AlumniQuestionsPage>",
        );
    return ctx;
}
