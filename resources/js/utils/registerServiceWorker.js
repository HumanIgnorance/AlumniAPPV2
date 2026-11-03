// Registers /sw.js (offline app shell + update flow). Same idea as SCLF's
// registerServiceWorker(). Registering never prompts for any permission.
//
// Skipped on the Vite dev server (npm run dev) so hot reload is never cached.
export const registerServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) return null;
    if (import.meta.env && import.meta.env.DEV) return null;
    try {
        return await navigator.serviceWorker.register("/sw.js");
    } catch (err) {
        console.error("ATMS: service worker registration failed", err);
        return null;
    }
};
