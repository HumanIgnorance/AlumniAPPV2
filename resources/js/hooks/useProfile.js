import { useQuery } from "react-query";
import axiosConfig from "~/utils/axiosConfig";

const profile = async () => {
    const { data } = await axiosConfig.get(`/profile`);
    return data || [];
};

export default function useProfile() {
    return useQuery(["profile"], () => profile(), {
        keepPreviousData: true,
        // The profile feeds the header avatar/name. Refetching it on every tab
        // focus or after every save made the header re-render ("blink"), so it
        // is only refreshed on a slow clock or when something explicitly
        // invalidates ["profile"] (e.g. after editing the profile / photo).
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}
