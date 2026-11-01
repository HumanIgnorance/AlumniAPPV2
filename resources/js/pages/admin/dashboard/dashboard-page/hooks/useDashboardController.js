import useDashboardLogic1 from "~/pages/admin/dashboard/dashboard-page/hooks/useDashboardLogic1";
import useDashboardLogic2 from "~/pages/admin/dashboard/dashboard-page/hooks/useDashboardLogic2";

// Runs the page logic in the same order as the original component body.
// Each logicN hook receives everything produced before it.
export default function useDashboardController() {
    const logic1 = useDashboardLogic1();
    const logic2 = useDashboardLogic2({ ...logic1 });

    return { ...logic1, ...logic2 };
}
