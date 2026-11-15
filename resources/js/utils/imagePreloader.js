import { toSameOriginUrl } from "~/utils/assetUrl";

/**
 * Image preloading for the whole app.
 *
 * Every time a request made through react-query succeeds (galleries, events,
 * announcements, job posts, alumni lists, messages…), the response is scanned
 * for image URLs and each image is fetched in the background. By the time the
 * person scrolls to a card or opens a modal, the picture is already in the
 * browser's image cache and appears instantly, with no loading flash.
 *
 * What it does NOT touch (on purpose):
 *   - private documents: government ID images, resumes, alumni documents and
 *     feedback screenshots. Those stay on-demand so nothing sensitive is
 *     fetched or kept without the person opening it.
 *   - download endpoints and chat message images (served "no-store").
 *
 * Everything is memory only: nothing is written to disk by this file, and it
 * disappears when the tab is closed or the person signs out (page reload).
 */

const MAX_KEPT = 400; // images kept decoded in memory
const MAX_SCAN_NODES = 6000; // safety cap per response
const MAX_DEPTH = 8;
const CONCURRENCY = 4;

const IMAGE_FILE = /\.(png|jpe?g|gif|webp|avif|bmp)(\?|#|$)/i;
const PROFILE_IMAGE = /\/api\/alumni\/\d+\/profile-image/i;
const NEVER = /(id-image|alumni-documents|\/documents\/|\/resume|screenshots|\/download|\/messages\/)/i;

const kept = new Map(); // url -> HTMLImageElement
const queue = [];
let running = 0;

const idle = (fn) =>
    typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback(fn, { timeout: 1500 })
        : setTimeout(fn, 50);

const isPreloadable = (value) => {
    if (typeof value !== "string" || value.length < 5 || value.length > 600) return false;
    if (value.startsWith("data:") || value.startsWith("blob:")) return false;
    // Raw DB paths like "events/images/x.jpg" or "IMG_2225.png" are not URLs.
    // Only preload http(s):// or /root-relative URLs.
    if (!/^(https?:)?\/\//i.test(value) && !value.startsWith("/")) return false;
    if (NEVER.test(value)) return false;
    return IMAGE_FILE.test(value) || PROFILE_IMAGE.test(value);
};

const pump = () => {
    while (running < CONCURRENCY && queue.length) {
        const url = queue.shift();
        running += 1;
        const img = new Image();
        img.decoding = "async";
        const done = () => {
            running -= 1;
            pump();
        };
        img.onload = () => {
            if (typeof img.decode === "function") img.decode().catch(() => {});
            done();
        };
        img.onerror = () => {
            kept.delete(url); // never keep a broken one; it can be retried later
            done();
        };
        kept.set(url, img);
        img.src = url;
        while (kept.size > MAX_KEPT) kept.delete(kept.keys().next().value);
    }
};

/** Start loading one or more image URLs in the background. */
export const preloadImages = (urls) => {
    const list = Array.isArray(urls) ? urls : [urls];
    let added = false;
    list.forEach((raw) => {
        if (!isPreloadable(raw)) return;
        const url = toSameOriginUrl(raw);
        if (kept.has(url) || queue.includes(url)) return;
        queue.push(url);
        added = true;
    });
    if (added) idle(pump);
};

const collect = (data, out) => {
    const stack = [[data, 0]];
    let nodes = 0;
    while (stack.length && nodes < MAX_SCAN_NODES) {
        const [node, depth] = stack.pop();
        nodes += 1;
        if (typeof node === "string") {
            if (isPreloadable(node)) out.push(node);
        } else if (node && typeof node === "object" && depth < MAX_DEPTH) {
            const values = Array.isArray(node) ? node : Object.values(node);
            for (let i = 0; i < values.length; i += 1) stack.push([values[i], depth + 1]);
        }
    }
    return out;
};

/** Scan any API response and preload every image URL found in it. */
export const preloadImagesFrom = (data) => {
    if (!data) return;
    preloadImages(collect(data, []));
};

/** Hooks the preloader onto a react-query client (call once). */
export const startImagePreloading = (queryClient) => {
    if (typeof window === "undefined" || !queryClient) return;
    const seen = new Map(); // query hash -> last dataUpdatedAt we scanned
    queryClient.getQueryCache().subscribe((query) => {
        const state = query?.state;
        if (!state || state.status !== "success" || !state.data) return;
        if (seen.get(query.queryHash) === state.dataUpdatedAt) return;
        seen.set(query.queryHash, state.dataUpdatedAt);
        preloadImagesFrom(state.data);
    });
};

export const clearImagePreloadCache = () => {
    queue.length = 0;
    kept.clear();
};
