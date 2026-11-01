import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEYS } from "~/config/storageKeys";

/**
 * Read-only helpers for the logged-in user's session (kept in
 * react-secure-storage by the login flow). Use these instead of reading
 * storage keys by hand so key names live in one place (config/storageKeys.js).
 */
export const getUserRole = () => secureLocalStorage.getItem(STORAGE_KEYS.USER_ROLE);

