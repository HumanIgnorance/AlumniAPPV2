import secureLocalStorage from "react-secure-storage";
import avatarGuidance from "~/assets/images/avatar_guidance.png";
import avatarBEED from "~/assets/images/beed-logo.png";
import avatarBSBA from "~/assets/images/bsba-logo.png";
import avatarBSIT from "~/assets/images/bsit-logo.jpg";
import avatarBSED from "~/assets/images/educ-logo.png";
import { STORAGE_KEYS } from "~/config/storageKeys";
import axiosConfig from "~/utils/axiosConfig";
import { BASE_URL } from "~/utils/constant";
import { setCookie } from "~/utils/helper";

// ============ END THEME SYSTEM ============

export const logout = async () => {
    try {
        // Call backend logout endpoint to set user offline
        await axiosConfig.post(BASE_URL + "api/logout");
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        // Clear all local storage items (Phase 6: access_token is no
        // longer stored here — it's an HttpOnly cookie; the /logout
        // call above already revoked it and cleared the cookie
        // server-side).
        secureLocalStorage.removeItem(STORAGE_KEYS.FACULTY_ID);
        secureLocalStorage.removeItem(STORAGE_KEYS.USER_ID);
        secureLocalStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        secureLocalStorage.removeItem(STORAGE_KEYS.EMAIL);
        secureLocalStorage.removeItem(STORAGE_KEYS.NAME);
        secureLocalStorage.removeItem(STORAGE_KEYS.COURSE_ID);

        // Redirect to login page
        setCookie(["userLogin", ""]);
        window.location = "/login";
    }
};

export const getDepartmentHeadAvatar = () => {
    const courseId = secureLocalStorage.getItem(STORAGE_KEYS.COURSE_ID);
    switch (courseId) {
        case 1:
        case "1":
            return avatarBSIT;
        case 2:
        case "2":
            return avatarBSED;
        case 3:
        case "3":
            return avatarBEED;
        case 4:
        case "4":
            return avatarBSBA;
        default:
            return avatarGuidance;
    }
};
