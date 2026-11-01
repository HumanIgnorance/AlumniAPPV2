import useAlumniQuestionsLogic1 from "~/pages/admin/questions/alumni-questions-page/hooks/useAlumniQuestionsLogic1";
import useAlumniQuestionsLogic2 from "~/pages/admin/questions/alumni-questions-page/hooks/useAlumniQuestionsLogic2";

// Runs the page logic in the same order as the original component body.
// Each logicN hook receives everything produced before it.
export default function useAlumniQuestionsController() {
    const logic1 = useAlumniQuestionsLogic1();
    const logic2 = useAlumniQuestionsLogic2({ ...logic1 });

    return { ...logic1, ...logic2 };
}
