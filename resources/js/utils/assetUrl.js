/**
 * Protected images (alumni profile photos, documents…) are served by
 * authenticated endpoints under /api/ and rely on the HttpOnly auth cookie,
 * which the browser only sends to the SAME origin as the page.
 *
 * The backend builds those URLs with route(), which can disagree with the
 * address the person actually browsed to (http vs https behind a proxy,
 * localhost vs 127.0.0.1, a LAN/tunnel host). A cross-origin <img> then
 * arrives without the cookie, gets a 401, and shows as a broken image.
 *
 * This rewrites ONLY same-app /api/ URLs onto the current origin. External
 * URLs (e.g. a Google profile photo), data: and blob: URLs pass through.
 */
export const toSameOriginUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    if (/^(data|blob):/i.test(url)) return url;

    try {
        const parsed = new URL(url, window.location.origin);
        if (parsed.pathname.startsWith("/api/")) {
            return window.location.origin + parsed.pathname + parsed.search;
        }
        return url;
    } catch {
        return url;
    }
};
