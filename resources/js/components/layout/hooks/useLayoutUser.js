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

    // Remember the last real profile picture per user, so after a refresh the
    // header shows it immediately instead of the placeholder and then
    // "blinking" over to the photo once /profile has loaded.
    const avatarCacheKey = () => {
        const uid = secureLocalStorage.getItem(STORAGE_KEYS.USER_ID);
        return uid ? `${STORAGE_KEYS.AVATAR}:${uid}` : null;
    };

    const [userData, setUserData] = useState(() => {
        const role = getUserRole();
        let cachedAvatar = null;
        try {
            const key = avatarCacheKey();
            const value = key ? secureLocalStorage.getItem(key) : null;
            if (typeof value === "string" && value) cachedAvatar = value;
        } catch (e) {
            /* ignore unreadable cache */
        }
        return {
            name: secureLocalStorage.getItem(STORAGE_KEYS.NAME) || "User Name",
            email: secureLocalStorage.getItem(STORAGE_KEYS.EMAIL) || "",
            avatar:
                role === ROLES.DEPARTMENT_HEAD
                    ? getDepartmentHeadAvatar()
                    : cachedAvatar || avatarGuidance,
            role: role || "user",
        };
    });

    useEffect(() => {
        if (!profile?.alumni) return;

        const fullName = `${profile.alumni.first_name || "User"} ${profile.alumni.last_name || "Name"}`;
        const nextEmail = profile.alumni.email;
        const nextAvatar = profile.alumni.profile_image_url;

        // Functional update that returns the SAME object when nothing changed,
        // so a background profile refetch never re-renders the header.
        setUserData((prev) => {
            const next = {
                ...prev,
                name: fullName,
                email: nextEmail || prev.email,
                avatar: nextAvatar || prev.avatar,
            };
            return next.name === prev.name &&
                next.email === prev.email &&
                next.avatar === prev.avatar
                ? prev
                : next;
        });

        secureLocalStorage.setItem(STORAGE_KEYS.NAME, fullName);
        secureLocalStorage.setItem(STORAGE_KEYS.EMAIL, nextEmail || "");
        try {
            const key = avatarCacheKey();
            if (key && nextAvatar) secureLocalStorage.setItem(key, nextAvatar);
        } catch (e) {
            /* storage full / blocked — not critical */
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        profile?.alumni?.first_name,
        profile?.alumni?.last_name,
        profile?.alumni?.email,
        profile?.alumni?.profile_image_url,
    ]);

    useEffect(() => {
        const role = getUserRole();
        if (role === ROLES.DEPARTMENT_HEAD) {
            const avatar = getDepartmentHeadAvatar();
            setUserData((prev) =>
                prev.avatar === avatar ? prev : { ...prev, avatar },
            );
        }
    }, []);

    return { currentTheme, userData, handleThemeChange };
}
