import useDepartmentDashboardLogic1 from "~/pages/admin/department-heads/department-dashboard-page/hooks/useDepartmentDashboardLogic1";
import useDepartmentDashboardLogic2 from "~/pages/admin/department-heads/department-dashboard-page/hooks/useDepartmentDashboardLogic2";

// Runs the page logic in the same order as the original component body.
// Each logicN hook receives everything produced before it.
export default function useDepartmentDashboardController() {
    const logic1 = useDepartmentDashboardLogic1();
    const logic2 = useDepartmentDashboardLogic2({ ...logic1 });

    return { ...logic1, ...logic2 };
}
