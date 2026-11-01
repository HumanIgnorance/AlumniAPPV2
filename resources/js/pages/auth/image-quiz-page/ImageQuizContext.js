import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of this page.
const ImageQuizContext = createContext(null);

export const ImageQuizProvider = ImageQuizContext.Provider;

export function useImageQuizContext() {
    const ctx = useContext(ImageQuizContext);
    if (!ctx)
        throw new Error(
            "useImageQuizContext must be used inside <ImageQuizPage>",
        );
    return ctx;
}
