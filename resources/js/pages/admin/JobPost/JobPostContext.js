import { createContext, useContext } from "react";

// One shared object (state + handlers) for every part of the Job Posts page.
const JobPostContext = createContext(null);

export const JobPostProvider = JobPostContext.Provider;

export function useJobPostContext() {
    const ctx = useContext(JobPostContext);
    if (!ctx)
        throw new Error(
            "useJobPostContext must be used inside <AdminAlumniJobPostPage>",
        );
    return ctx;
}
