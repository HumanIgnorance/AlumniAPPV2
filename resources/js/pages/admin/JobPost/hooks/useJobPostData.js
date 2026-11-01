import { useCallback, useMemo } from "react";
import { message } from "antd";
import { STATUS } from "~/config/status";
import { getAuthHeaders } from "~/pages/admin/JobPost/parts/jobPostUtils";
import axios from "~/utils/axiosConfig";

export default function useJobPostData({
    isMountedRef,
    setJobPosts,
    prevJobPostsRef,
    setPendingPosts,
    prevPendingPostsRef,
    setFullOrExpiredPosts,
    prevFullOrExpiredPostsRef,
    setStatsData,
    setMyPostings,
    prevMyPostingsRef,
    setMyApplications,
    prevMyApplicationsRef,
    setApplicationsLoading,
    setApplicationsVisible,
    setJobApplications,
    setProfileLoading,
    setCurrentAlumniProfile,
    jobPosts,
    activeTab,
    searchText,
    filterJobType,
    filterStatus,
    sortBy,
}) {
    // Centralized error handler
    const handleApiError = useCallback((error, defaultMessage) => {
        try {
            console.error(defaultMessage, error);
            if (error.response) {
                if (error.response.status === 401) {
                    message.error("Session expired. Please login again.");
                } else if (error.response.status === 403) {
                    message.error(
                        "You don't have permission to access this resource",
                    );
                } else {
                    message.error(
                        error.response.data?.message || defaultMessage,
                    );
                }
            } else if (error.request) {
                message.error("Network error. Please check your connection.");
            } else {
                message.error(defaultMessage);
            }
        } catch (err) {
            console.error("Error in error handler:", err);
            message.error(defaultMessage);
        }
    }, []);

    // ✅ Safely extract array from ANY Laravel response
    const extractArray = useCallback((response) => {
        try {
            if (!response) return [];

            // Direct array
            if (Array.isArray(response)) return response;

            // Axios response object
            const data = response.data ?? response;

            // Laravel resource / pagination
            if (Array.isArray(data?.data)) return data.data;

            // Fallback
            return [];
        } catch (error) {
            console.error("Error extracting array:", error);
            return [];
        }
    }, []);

    // ============ SMART STATE UPDATE TO PREVENT FLICKERING ============
    const updateStateWithoutFlicker = useCallback(
        (setter, prevRef, newData) => {
            try {
                // Only update if data actually changed
                const prevDataStr = JSON.stringify(
                    prevRef.current.map((p) => p.id),
                );
                const newDataStr = JSON.stringify(newData.map((p) => p.id));

                if (prevDataStr !== newDataStr) {
                    prevRef.current = newData;
                    setter(newData);
                } else {
                    // Even if IDs are same, update the data in case other fields changed
                    // but do it without causing a re-render flash
                    setter((current) => {
                        const currentIds = current.map((p) => p.id).join(",");
                        const newIds = newData.map((p) => p.id).join(",");
                        if (currentIds === newIds) {
                            // Merge updates without changing order
                            return current.map((item) => {
                                const updated = newData.find(
                                    (n) => n.id === item.id,
                                );
                                return updated || item;
                            });
                        }
                        return newData;
                    });
                }
            } catch (error) {
                console.error("Error updating state:", error);
                setter(newData);
            }
        },
        [],
    );

    const fetchJobPosts = useCallback(async () => {
        try {
            // silent: true — this runs on every poll tick (every 10s) in the
            // background. It must never pop a blocking error modal; a slow
            // or briefly-down backend would otherwise spam the whole screen.
            const response = await axios.get("/job-posts", {
                headers: getAuthHeaders(),
                silent: true,
            });

            if (!isMountedRef.current) return;
            const posts = extractArray(response);
            updateStateWithoutFlicker(setJobPosts, prevJobPostsRef, posts);
            updateStats(posts);
        } catch (error) {
            if (!isMountedRef.current) return;
            console.error("Error fetching job posts:", error);
            if (prevJobPostsRef.current.length === 0) {
                setJobPosts([]);
            }
        }
    }, [extractArray, updateStateWithoutFlicker]);

    const fetchPendingPosts = useCallback(async () => {
        try {
            const response = await axios.get("/job-posts/admin/pending", {
                headers: getAuthHeaders(),
                silent: true,
            });

            if (!isMountedRef.current) return;
            const pending = extractArray(response);
            updateStateWithoutFlicker(
                setPendingPosts,
                prevPendingPostsRef,
                pending,
            );
        } catch (error) {
            if (!isMountedRef.current) return;
            console.error("Error fetching pending posts:", error);
            if (prevPendingPostsRef.current.length === 0) {
                setPendingPosts([]);
            }
        }
    }, [extractArray, updateStateWithoutFlicker]);

    const fetchFullOrExpiredPosts = useCallback(async () => {
        try {
            const response = await axios.get("/job-posts/full-or-expired", {
                headers: getAuthHeaders(),
                silent: true,
            });

            if (!isMountedRef.current) return;
            const posts = extractArray(response);
            updateStateWithoutFlicker(
                setFullOrExpiredPosts,
                prevFullOrExpiredPostsRef,
                posts,
            );

            // Update stats with full/expired count
            setStatsData((prev) => ({ ...prev, fullOrExpired: posts.length }));
        } catch (error) {
            if (!isMountedRef.current) return;
            console.error("Error fetching full/expired posts:", error);
            if (prevFullOrExpiredPostsRef.current.length === 0) {
                setFullOrExpiredPosts([]);
            }
        }
    }, [extractArray, updateStateWithoutFlicker]);

    // Alumni: Fetch approved jobs - FIXED: Now updates stats for alumni
    const fetchApprovedJobs = useCallback(async () => {
        try {
            // silent: true — background polling call, see fetchJobPosts above.
            const response = await axios.get("/job-posts?status=approved", {
                headers: getAuthHeaders(),
                silent: true,
            });
            if (!isMountedRef.current) return;
            const data = response.data.data || response.data;
            const jobs = Array.isArray(data) ? data : [];
            updateStateWithoutFlicker(setJobPosts, prevJobPostsRef, jobs);

            // ✅ FIX: Update stats for alumni with approved jobs count
            setStatsData((prev) => ({
                ...prev,
                total: jobs.filter((job) => !job.is_full && !job.is_expired)
                    .length,
            }));
        } catch (error) {
            if (!isMountedRef.current) return;
            console.error("Error fetching jobs:", error);
        }
    }, [updateStateWithoutFlicker]);

    // Alumni: Fetch my postings
    const fetchMyPostings = useCallback(async () => {
        try {
            const response = await axios.get("/job-posts/my-postings", {
                headers: getAuthHeaders(),
                silent: true,
            });
            if (!isMountedRef.current) return;
            const data = response.data.data || response.data;
            const postings = Array.isArray(data) ? data : [];
            updateStateWithoutFlicker(
                setMyPostings,
                prevMyPostingsRef,
                postings,
            );
        } catch (error) {
            if (!isMountedRef.current) return;
            console.error("Error fetching your postings:", error);
        }
    }, [updateStateWithoutFlicker]);

    // Alumni: Fetch my applications
    const fetchMyApplications = useCallback(async () => {
        try {
            const response = await axios.get(
                "/job-applications/my-applications",
                {
                    headers: getAuthHeaders(),
                    silent: true,
                },
            );

            if (!isMountedRef.current) return;
            // ✅ SAFELY extract array
            const applications = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                  ? response.data.data
                  : [];

            updateStateWithoutFlicker(
                setMyApplications,
                prevMyApplicationsRef,
                applications,
            );
        } catch (error) {
            if (!isMountedRef.current) return;
            console.error("Error fetching your applications:", error);
        }
    }, [updateStateWithoutFlicker]);

    // Fetch applications for a job post (for review)
    const fetchJobApplications = useCallback(
        async (jobPostId) => {
            try {
                setApplicationsLoading(true);
                setApplicationsVisible(true);

                const response = await axios.get(
                    `/job-applications/job-post/${jobPostId}`,
                    { headers: getAuthHeaders() },
                );

                // ✅ SAFELY extract array
                const applications = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.data)
                      ? response.data.data
                      : [];

                setJobApplications(applications);
            } catch (error) {
                handleApiError(error, "Error fetching applications");
                setJobApplications([]); // safety
            } finally {
                setApplicationsLoading(false);
            }
        },
        [handleApiError],
    );

    // ============ NEW: FETCH CURRENT ALUMNI PROFILE FOR APPLICATION MODAL ============
    const fetchCurrentAlumniProfile = useCallback(async () => {
        try {
            setProfileLoading(true);
            const response = await axios.get("/profile", {
                headers: getAuthHeaders(),
            });
            const profileData =
                response.data?.alumni ||
                response.data?.data?.alumni ||
                response.data;
            setCurrentAlumniProfile(profileData);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setCurrentAlumniProfile(null);
        } finally {
            setProfileLoading(false);
        }
    }, []);

    const updateStats = useCallback((posts) => {
        try {
            const total = posts.length;
            const pending = posts.filter(
                (p) => p.status === STATUS.PENDING,
            ).length;
            const approved = posts.filter(
                (p) => p.status === STATUS.APPROVED,
            ).length;
            const fullOrExpired = posts.filter(
                (p) => p.is_full || p.is_expired,
            ).length;
            setStatsData({ total, pending, approved, fullOrExpired });
        } catch (error) {
            console.error("Error updating stats:", error);
        }
    }, []);

    // Filter and sort jobs (exclude full/expired from browse)
    const filteredAndSortedJobs = useMemo(() => {
        try {
            let result = [...jobPosts];

            // Exclude full or expired jobs from browse tab
            if (activeTab === "browse") {
                result = result.filter(
                    (job) => !job.is_full && !job.is_expired,
                );
            }

            // Filter by search text
            if (searchText) {
                const search = searchText.toLowerCase();
                result = result.filter(
                    (job) =>
                        job.title?.toLowerCase().includes(search) ||
                        job.company?.toLowerCase().includes(search) ||
                        job.location?.toLowerCase().includes(search),
                );
            }

            // Filter by job type
            if (filterJobType !== "all") {
                result = result.filter((job) => job.job_type === filterJobType);
            }

            // Filter by status (admin only)
            if (filterStatus !== "all") {
                result = result.filter((job) => job.status === filterStatus);
            }

            // Sort
            result.sort((a, b) => {
                switch (sortBy) {
                    case "date-desc":
                        return new Date(b.created_at) - new Date(a.created_at);
                    case "date-asc":
                        return new Date(a.created_at) - new Date(b.created_at);
                    case "salary-desc":
                        return (b.salary_min || 0) - (a.salary_min || 0);
                    case "salary-asc":
                        return (a.salary_min || 0) - (b.salary_min || 0);
                    case "title-asc":
                        return (a.title || "").localeCompare(b.title || "");
                    case "title-desc":
                        return (b.title || "").localeCompare(a.title || "");
                    default:
                        return 0;
                }
            });

            return result;
        } catch (error) {
            console.error("Error filtering/sorting jobs:", error);
            return jobPosts;
        }
    }, [jobPosts, searchText, filterJobType, filterStatus, sortBy, activeTab]);

    return {
        fetchJobPosts,
        fetchPendingPosts,
        fetchFullOrExpiredPosts,
        fetchApprovedJobs,
        fetchMyApplications,
        fetchMyPostings,
        handleApiError,
        fetchCurrentAlumniProfile,
        fetchJobApplications,
        filteredAndSortedJobs,
    };
}
