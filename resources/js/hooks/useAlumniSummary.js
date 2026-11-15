import { useQuery } from "react-query";
import axiosConfig from "../utils/axiosConfig";

// GET /alumni/summary -> { total, employed, unemployed }.
// Counts only, open to every authenticated role. Use this for stat cards on
// pages that alumni also see: GET /alumni is admin-only, so alumni accounts
// that relied on it always saw 0.
const fetchSummary = async () => {
    const { data } = await axiosConfig.get(`/alumni/summary`);
    return {
        total: Number(data?.total) || 0,
        employed: Number(data?.employed) || 0,
        unemployed: Number(data?.unemployed) || 0,
    };
};

export default function useAlumniSummary(options = {}) {
    return useQuery(["alumni-summary"], fetchSummary, {
        staleTime: 30000,
        refetchOnWindowFocus: true,
        enabled: options.enabled ?? true,
        ...options,
    });
}
