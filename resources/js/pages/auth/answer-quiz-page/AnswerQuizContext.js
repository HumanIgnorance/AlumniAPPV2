import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of this page.
const AnswerQuizContext = createContext(null);

export const AnswerQuizProvider = AnswerQuizContext.Provider;

export function useAnswerQuizContext() {
    const ctx = useContext(AnswerQuizContext);
    if (!ctx)
        throw new Error(
            "useAnswerQuizContext must be used inside <AnswerQuizPage>",
        );
    return ctx;
}
