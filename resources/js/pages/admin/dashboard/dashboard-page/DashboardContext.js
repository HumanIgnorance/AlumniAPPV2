import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of this page.
const DashboardContext = createContext(null);

export const DashboardProvider = DashboardContext.Provider;

export function useDashboardContext() {
    const ctx = useContext(DashboardContext);
    if (!ctx)
        throw new Error(
            "useDashboardContext must be used inside <AlumniDashboard>",
        );
    return ctx;
}
