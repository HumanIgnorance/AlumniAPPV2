import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import avatarGuidance from "~/assets/images/avatar_guidance.png";
import { getDepartmentHeadAvatar } from "~/components/layout/utils/sessionActions";
import { ROLES } from "~/config/roles";
import { STORAGE_KEYS } from "~/config/storageKeys";
import { useAppTheme } from "~/hooks/useAppTheme";
import { getUserRole } from "~/utils/session";

export default function useLayoutUser({ profile }) {
    // ============ THEME SYSTEM (shared with FormLogin) ============
    // Was previously its own local implementation using "default"/"black"
    // as the stored values — incompatible with useAppTheme's "white"/"black"
    // convention. Any time someone picked "Light" here, it silently wrote
    // "default" into the very same secureLocalStorage["app-theme"] key the
    // rest of the app reads, which useAppTheme() doesn't recognize as a
    // valid theme — so it fell back to the OS dark-mode preference on every
    // other page. Using the shared hook here closes that gap for good.
    const { theme: currentTheme, setTheme: handleThemeChange } = useAppTheme();

    const [userData, setUserData] = useState(() => {
        const role = getUserRole();
        return {
            name: secureLocalStorage.getItem(STORAGE_KEYS.NAME) || "User Name",
            email: secureLocalStorage.getItem(STORAGE_KEYS.EMAIL) || "",
            avatar:
                role === ROLES.DEPARTMENT_HEAD
                    ? getDepartmentHeadAvatar()
                    : avatarGuidance,
            role: role || "user",
        };
    });

    useEffect(() => {
        if (profile?.alumni) {
            const fullName = `${profile.alumni.first_name || "User"} ${profile.alumni.last_name || "Name"}`;

            setUserData((prev) => ({
                ...prev,
                name: fullName,
                email: profile.alumni.email || prev.email,
                avatar: profile.alumni.profile_image_url || prev.avatar,
            }));

            secureLocalStorage.setItem(STORAGE_KEYS.NAME, fullName);
            secureLocalStorage.setItem(
                STORAGE_KEYS.EMAIL,
                profile.alumni.email || "",
            );
        }
    }, [profile]);

    useEffect(() => {
        const role = getUserRole();
        if (role === ROLES.DEPARTMENT_HEAD) {
            setUserData((prev) => ({
                ...prev,
                avatar: getDepartmentHeadAvatar(),
            }));
        }
    }, []);

    return { currentTheme, userData, handleThemeChange };
}
