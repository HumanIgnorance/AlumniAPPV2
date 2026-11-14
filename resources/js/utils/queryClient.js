import { QueryClient } from "react-query";

// Do not retry client errors (4xx: validation, auth, not found…) — only one
// quick retry for network hiccups / 5xx.
const shouldRetry = (failureCount, error) => {
    const status = error?.response?.status;
    if (status && status < 500) return false;
    return failureCount < 1;
};

// Shared by Main.jsx (provider) and axiosConfig.jsx (invalidate-after-save).
//
// Previously: staleTime 5 min + refetchOnMount/WindowFocus/Reconnect all
// disabled, so a list only ever updated after a full page refresh. Now:
//   • data is considered fresh for 15 s, then refetched on mount / tab focus /
//     reconnect (instant when a fresh copy is cached),
//   • every successful POST/PUT/PATCH/DELETE invalidates the cache (see
//     axiosConfig.jsx) so lists update right after add / edit / delete,
//   • individual hooks may add a refetchInterval for live lists.
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 15 * 1000,
            cacheTime: 5 * 60 * 1000,
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: shouldRetry,
            retryDelay: (attempt) => Math.min(800 * 2 ** attempt, 4000),
        },
    },
});

export default queryClient;
