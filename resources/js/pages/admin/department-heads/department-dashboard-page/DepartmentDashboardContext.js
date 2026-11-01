import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of this page.
const DepartmentDashboardContext = createContext(null);

export const DepartmentDashboardProvider = DepartmentDashboardContext.Provider;

export function useDepartmentDashboardContext() {
    const ctx = useContext(DepartmentDashboardContext);
    if (!ctx)
        throw new Error(
            "useDepartmentDashboardContext must be used inside <DepartmentDashboardPage>",
        );
    return ctx;
}
