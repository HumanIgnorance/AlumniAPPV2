import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEYS } from "~/config/storageKeys";
import { BASE_URL } from "~/utils/constant";

export const isValidHttpUrl = (value) => {
    if (!value || typeof value !== "string") return false;
    try {
        const u = new URL(value.trim());
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

// Configure axios base URL

// Phase 6: this file already imports the shared, pre-configured axios
// instance (`~/utils/axiosConfig`) as `axios` above, which now sends
// `withCredentials: true` — the browser attaches the HttpOnly
// auth_token cookie to every request automatically. These helpers
// previously read a bearer token out of secureLocalStorage and built an
// Authorization header manually; both are now no-ops kept so the ~17
// call sites below that spread `{...getAuthHeaders()}` into a request's
// headers keep working unchanged (spreading an empty object is a no-op).
export const getAuthToken = () => null;

// Helper function to get auth headers
export const getAuthHeaders = () => {
    return {};
};

export const getCurrentUser = () => {
    try {
        // Try to get user object first
        const userObj = secureLocalStorage.getItem(STORAGE_KEYS.USER);

        // Get ID from multiple possible storage keys for compatibility
        const userId =
            userObj?.id ||
            secureLocalStorage.getItem(STORAGE_KEYS.USER_ID_CAMEL) ||
            secureLocalStorage.getItem(STORAGE_KEYS.USER_ID) || // <-- This is the key your login uses
            secureLocalStorage.getItem(STORAGE_KEYS.USER_ID_SNAKE) ||
            secureLocalStorage.getItem(STORAGE_KEYS.ID);

        return {
            id: userId,
            name:
                userObj?.name ||
                secureLocalStorage.getItem(STORAGE_KEYS.USER_NAME) ||
                secureLocalStorage.getItem(STORAGE_KEYS.NAME),
            email:
                userObj?.email ||
                secureLocalStorage.getItem("userEmail") ||
                secureLocalStorage.getItem(STORAGE_KEYS.EMAIL),
            profile_image:
                userObj?.profile_image ||
                secureLocalStorage.getItem("userProfileImage"),
            phone: userObj?.phone || secureLocalStorage.getItem("userPhone"),
        };
    } catch (error) {
        console.error("Error getting current user:", error);
        return {
            id: null,
            name: null,
            email: null,
            profile_image: null,
            phone: null,
        };
    }
};

export const buildImageUrl = (imagePath) => {
    try {
        if (!imagePath) return null;

        const base = BASE_URL.replace(/\/$/, "");

        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {
            return imagePath;
        }

        if (imagePath.startsWith("data:")) {
            return imagePath;
        }

        const raw = String(imagePath);
        const noLeading = raw.replace(/^\/+/, "");

        if (raw.startsWith("/storage/")) {
            return `${base}${raw}`;
        }

        if (noLeading.startsWith("storage/")) {
            return `${base}/${noLeading}`;
        }

        return `${base}/storage/${noLeading}`;
    } catch (error) {
        console.error("Error building image URL:", error);
        return null;
    }
};
