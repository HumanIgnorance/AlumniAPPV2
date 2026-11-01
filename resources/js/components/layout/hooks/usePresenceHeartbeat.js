import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEYS } from "~/config/storageKeys";
import axiosConfig from "~/utils/axiosConfig";
import { BASE_URL } from "~/utils/constant";

export default function usePresenceHeartbeat() {
    // ============ GLOBAL HEARTBEAT & ONLINE-STATUS TRACKING ============
    // Lives in MainLayout so it runs on EVERY page, not just AlumniList.
    // Rules:
    //  • Logged in + browsing any page   → is_online = true  (heartbeat every 2 min)
    //  • Tab becomes visible again        → immediate heartbeat
    //  • Network reconnects               → immediate heartbeat
    //  • Browser tab / window closes      → set-offline via keepalive fetch (fires
    //                                        even while the page is unloading)
    //  • Explicit logout                  → is_online = false via /api/logout
    useEffect(() => {
        // Phase 6: the bearer token is no longer readable by JS at all
        // (HttpOnly cookie) — userID is just cached, non-secret profile
        // display data, so it's a safe stand-in for "is someone logged
        // in" here. It carries no authentication weight of its own; the
        // actual heartbeat/set-offline requests below authenticate via
        // the auth_token cookie, which the browser attaches
        // automatically.
        const userID = secureLocalStorage.getItem(STORAGE_KEYS.USER_ID);
        if (!userID) return; // Guest / unauthenticated — nothing to track

        const sendHeartbeat = async () => {
            try {
                await axiosConfig.post(BASE_URL + "api/heartbeat");
            } catch (_err) {
                // Silently ignore — could be a transient network blip.
                // The next scheduled tick will retry automatically.
            }
        };

        // Uses fetch keepalive so the request completes even after the JS
        // context is torn down (tab close, browser close, navigation away).
        // `credentials: "include"` sends the HttpOnly auth_token cookie
        // automatically — this used to manually attach a bearer token
        // read from secureLocalStorage, which no longer exists there.
        const markOfflineOnUnload = () => {
            fetch(BASE_URL + "api/set-offline", {
                method: "POST",
                keepalive: true, // ← survives page unload
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }).catch(() => {});
        };

        // Re-establish online status when the user switches back to this tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                sendHeartbeat();
            }
            // We do NOT set offline on "hidden" — user may just Alt-Tab to
            // another app or open DevTools; they are still in the system.
        };

        // Re-establish online status after a network reconnect
        const handleNetworkOnline = () => sendHeartbeat();

        // --- Start ---
        sendHeartbeat(); // Immediate heartbeat on mount
        const heartbeatInterval = setInterval(sendHeartbeat, 2 * 60 * 1000); // Every 2 min

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("online", handleNetworkOnline);
        window.addEventListener("beforeunload", markOfflineOnUnload);

        return () => {
            clearInterval(heartbeatInterval);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            window.removeEventListener("online", handleNetworkOnline);
            window.removeEventListener("beforeunload", markOfflineOnUnload);
        };
    }, []);
}
