import useImageQuizLogic1 from "~/pages/auth/image-quiz-page/hooks/useImageQuizLogic1";
import useImageQuizLogic2 from "~/pages/auth/image-quiz-page/hooks/useImageQuizLogic2";

// Runs the page logic in the same order as the original component body.
// Each logicN hook receives everything produced before it.
export default function useImageQuizController() {
    const logic1 = useImageQuizLogic1();
    const logic2 = useImageQuizLogic2({ ...logic1 });

    return { ...logic1, ...logic2 };
}
