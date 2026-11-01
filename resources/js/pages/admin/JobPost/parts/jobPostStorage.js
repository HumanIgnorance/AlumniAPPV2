import secureLocalStorage from "react-secure-storage";

// ============================================================
// ============ ENHANCEMENT: Draft Auto-Save Config ============
// ============================================================
export const JOB_DRAFT_STORAGE_KEY = "admin-jobpost-draft";

export const saveJobPostDraft = (draft) => {
    try {
        secureLocalStorage.setItem(JOB_DRAFT_STORAGE_KEY, {
            ...draft,
            _savedAt: new Date().toISOString(),
        });
        return true;
    } catch (e) {
        console.warn("Failed to save job post draft:", e);
        return false;
    }
};

export const loadJobPostDraft = () => {
    try {
        return secureLocalStorage.getItem(JOB_DRAFT_STORAGE_KEY) || null;
    } catch (e) {
        console.warn("Failed to load job post draft:", e);
        return null;
    }
};

export const clearJobPostDraft = () => {
    try {
        secureLocalStorage.removeItem(JOB_DRAFT_STORAGE_KEY);
    } catch (e) {
        console.warn("Failed to clear job post draft:", e);
    }
};

// ============================================================
// ====== ENHANCEMENT: Application Draft Auto-Save Helpers ======
// ============================================================
// Per-(job, user) storage key so each alumni's draft is isolated.
export const buildApplicationDraftKey = (jobId, userId) =>
    `job_application_draft_${jobId || "unknown"}_${userId || "anon"}`;

export const saveApplicationDraft = (jobId, userId, draft) => {
    try {
        if (!jobId || !userId) return false;
        secureLocalStorage.setItem(buildApplicationDraftKey(jobId, userId), {
            ...draft,
            _savedAt: new Date().toISOString(),
        });
        return true;
    } catch (e) {
        console.warn("Failed to save application draft:", e);
        return false;
    }
};

export const loadApplicationDraft = (jobId, userId) => {
    try {
        if (!jobId || !userId) return null;
        return (
            secureLocalStorage.getItem(
                buildApplicationDraftKey(jobId, userId),
            ) || null
        );
    } catch (e) {
        console.warn("Failed to load application draft:", e);
        return null;
    }
};

export const clearApplicationDraft = (jobId, userId) => {
    try {
        if (!jobId || !userId) return;
        secureLocalStorage.removeItem(buildApplicationDraftKey(jobId, userId));
    } catch (e) {
        console.warn("Failed to clear application draft:", e);
    }
};
