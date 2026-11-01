import useAnswerQuizLogic1 from "~/pages/auth/answer-quiz-page/hooks/useAnswerQuizLogic1";
import useAnswerQuizLogic2 from "~/pages/auth/answer-quiz-page/hooks/useAnswerQuizLogic2";

// Runs the page logic in the same order as the original component body.
// Each logicN hook receives everything produced before it.
export default function useAnswerQuizController() {
    const logic1 = useAnswerQuizLogic1();
    const logic2 = useAnswerQuizLogic2({ ...logic1 });

    return { ...logic1, ...logic2 };
}
