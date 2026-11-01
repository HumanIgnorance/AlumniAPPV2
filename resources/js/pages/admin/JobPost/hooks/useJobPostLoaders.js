import { useEffect } from "react";
import { ROLES } from "~/config/roles";
import {
    getAuthToken,
    getCurrentUser,
} from "~/pages/admin/JobPost/parts/jobPostUtils";
import { getUserRole } from "~/utils/session";

export default function useJobPostLoaders({
    setUserRole,
    setCurrentUser,
    setActiveTab,
    setInitialLoading,
    userRole,
    fetchJobPosts,
    fetchPendingPosts,
    fetchFullOrExpiredPosts,
    fetchApprovedJobs,
    fetchMyApplications,
    fetchMyPostings,
}) {
    // Detect user role from auth or context
    useEffect(() => {
        try {
            const role = getUserRole() || "alumni";
            setUserRole(role);
            setCurrentUser(getCurrentUser());
            // ✅ ADD THIS LINE: Set default activeTab based on role
            setActiveTab(role === ROLES.ADMIN ? "all-posts" : "browse");
            setInitialLoading(false);
        } catch (error) {
            console.error("Error detecting user role:", error);
            setUserRole("alumni");
            setActiveTab("browse");
            setInitialLoading(false);
        }
    }, []);

    // ============ INITIAL DATA FETCH FOR BADGE COUNTS ============
    // Fetch all data on mount to display badge counts immediately
    useEffect(() => {
        try {
            const token = getAuthToken();
            if (!token) {
                console.error(
                    "No token available, skipping initial data fetch",
                );
                return;
            }

            // Fetch all data for badge counts regardless of active tab
            if (userRole === ROLES.ADMIN) {
                fetchJobPosts();
                fetchPendingPosts();
                fetchFullOrExpiredPosts();
            } else {
                // Alumni: Fetch all data for badges on initial load
                fetchApprovedJobs();
                fetchMyApplications();
                fetchMyPostings();
                fetchFullOrExpiredPosts();
            }
        } catch (error) {
            console.error("Error in initial data fetch:", error);
        }
    }, [userRole]);

    // Polling mechanism for real-time updates - continues to update active tab
    useEffect(() => {
        try {
            const token = getAuthToken();
            if (!token) {
                console.error("No token available, skipping data fetch");
                return;
            }

            // ✅ FIX: guard against overlapping poll cycles. Without this,
            // if the backend is slow and a batch of requests takes longer
            // than the 10s interval to resolve, every tick queues ANOTHER
            // batch on top of the ones still in flight — the number of
            // concurrent requests grows without bound the longer the
            // backend stays slow, which is what was freezing/crashing the tab.
            let isFetching = false;
            let cancelled = false;

            const fetchData = async () => {
                if (isFetching || cancelled) return;
                isFetching = true;
                try {
                    if (userRole === ROLES.ADMIN) {
                        // Always fetch all data for badge counts
                        await Promise.allSettled([
                            fetchJobPosts(),
                            fetchPendingPosts(),
                            fetchFullOrExpiredPosts(),
                        ]);
                    } else {
                        // Alumni: Always fetch all data for badge counts
                        await Promise.allSettled([
                            fetchApprovedJobs(),
                            fetchMyApplications(),
                            fetchMyPostings(),
                            fetchFullOrExpiredPosts(),
                        ]);
                    }
                } catch (error) {
                    console.error("Error in fetchData:", error);
                } finally {
                    isFetching = false;
                }
            };

            // Set up polling interval (less frequent since we fetch all data)
            const interval = setInterval(fetchData, 10000); // 10 seconds instead of 5
            return () => {
                cancelled = true;
                clearInterval(interval);
            };
        } catch (error) {
            console.error("Error setting up polling:", error);
        }
    }, [userRole]);
}
