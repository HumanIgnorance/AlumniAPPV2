// ============================================================
// saveImage.jsx — ONE place that downloads / saves photos for the
// whole app (admin gallery, alumni messages, alumni details zoom,
// job-post photos, documents…), on every platform:
//
//   iPhone / iPad (Safari + installed PWA)
//       -> the native share sheet, which has "Save Image" (Photos).
//          `<a download>` on iOS only ever offers "Save to Files",
//          and does nothing at all inside an installed PWA.
//          If iOS refuses to open the sheet (it needs a fresh tap),
//          an in-app "Photo ready" dialog with a "Save to Photos"
//          button appears instead, so the sheet opens from a real tap.
//   Android (Chrome + installed PWA) and desktop
//       -> normal file download (appears in Downloads / Gallery).
//
// Why downloads used to say "could not reach the server":
//   Laravel built http:// image URLs behind the HTTPS proxy, and the
//   page (https) is not allowed to fetch them (mixed content / cross
//   origin). Here every /api/ and /storage/ URL is forced onto the
//   page's own origin before fetching, with retries and clear errors.
// ============================================================
import React from "react";
import { Modal, message } from "antd";

const MSG_KEY = "save-image";
const SHEET_CHUNK = 25; // photos per iOS share sheet
const CACHE_LIMIT = 12;

const EXT_BY_TYPE = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/avif": "avif",
    "image/bmp": "bmp",
};
const TYPE_BY_EXT = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
    avif: "image/avif",
    bmp: "image/bmp",
};

// ------------------------------------------------------------
// Platform detection
// ------------------------------------------------------------
export const isIOS = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    // iPadOS 13+ reports itself as a Mac, but has a touch screen.
    return (
        /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
};

export const isStandalonePwa = () => {
    if (typeof window === "undefined") return false;
    return (
        window.navigator.standalone === true ||
        !!window.matchMedia?.("(display-mode: standalone)")?.matches
    );
};

const canShareFiles = (files) => {
    try {
        return (
            typeof navigator !== "undefined" &&
            typeof navigator.share === "function" &&
            typeof navigator.canShare === "function" &&
            navigator.canShare({ files })
        );
    } catch {
        return false;
    }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class SaveImageError extends Error {
    constructor(code, text) {
        super(text || code);
        this.code = code;
    }
}

// ------------------------------------------------------------
// URL handling
// ------------------------------------------------------------
// Forces this app's own /api/ and /storage/ URLs onto the page origin
// (fixes http-vs-https, www, localhost and tunnel-host mismatches).
// Anything else (external URLs, blob:, data:) is left alone.
export const toSameOriginMedia = (url) => {
    if (!url || typeof url !== "string") return url;
    if (/^(data|blob):/i.test(url)) return url;
    try {
        const parsed = new URL(url, window.location.origin);
        const own =
            parsed.pathname.startsWith("/api/") ||
            parsed.pathname.startsWith("/storage/");
        if (own && parsed.origin !== window.location.origin) {
            return window.location.origin + parsed.pathname + parsed.search;
        }
        return parsed.href;
    } catch {
        return url;
    }
};

const isSameOrigin = (url) => {
    try {
        return new URL(url, window.location.origin).origin === window.location.origin;
    } catch {
        return false;
    }
};

// ------------------------------------------------------------
// Blob fetching (with image validation, retries, small cache)
// ------------------------------------------------------------
const readBytes = (blob) =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = () => resolve(new Uint8Array(0));
        reader.readAsArrayBuffer(blob.slice(0, 16));
    });

// Real image type from the first bytes, so a mislabelled response
// (octet-stream, or an HTML login/error page) is caught early.
const sniffImageType = async (blob) => {
    const b = await readBytes(blob);
    if (b.length < 4) return null;
    if (b[0] === 0xff && b[1] === 0xd8) return "image/jpeg";
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
    if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "image/gif";
    if (b[0] === 0x42 && b[1] === 0x4d) return "image/bmp";
    if (b.length >= 12) {
        const tag = String.fromCharCode(...b.slice(0, 4));
        const brand = String.fromCharCode(...b.slice(8, 12));
        if (tag === "RIFF" && brand === "WEBP") return "image/webp";
        if (String.fromCharCode(...b.slice(4, 8)) === "ftyp") {
            if (/^(heic|heix|hevc|mif1|msf1)/.test(brand)) return "image/heic";
            if (/^avi[fs]/.test(brand)) return "image/avif";
        }
    }
    return null;
};

const normalizeBlob = async (blob, headerType) => {
    const sniffed = await sniffImageType(blob);
    const declared = (headerType || blob.type || "").split(";")[0].trim().toLowerCase();
    const type = sniffed || (declared.startsWith("image/") ? declared : null);
    if (!type) {
        throw new SaveImageError(
            "notimage",
            "The server did not return an image.",
        );
    }
    return blob.type === type ? blob : new Blob([blob], { type });
};

const fetchImageBlob = async (url, { retries = 2, timeoutMs = 60000 } = {}) => {
    const target = toSameOriginMedia(url);
    const sameOrigin = isSameOrigin(target) || /^(blob|data):/i.test(target);
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await fetch(target, {
                credentials: sameOrigin ? "same-origin" : "omit",
                signal: controller.signal,
            });
            if (res.status === 401 || res.status === 419) {
                throw new SaveImageError("auth", "Session expired.");
            }
            if (res.status === 403) throw new SaveImageError("forbidden", "Not allowed.");
            if (res.status === 404) throw new SaveImageError("notfound", "Not found.");
            if (!res.ok) {
                throw new SaveImageError("http", `Server responded with ${res.status}`);
            }
            return await normalizeBlob(await res.blob(), res.headers.get("content-type"));
        } catch (err) {
            lastError =
                err?.name === "AbortError"
                    ? new SaveImageError("timeout", "Timed out.")
                    : err;
            const retryable =
                !(lastError instanceof SaveImageError) ||
                lastError.code === "timeout" ||
                lastError.code === "http";
            if (!retryable || attempt === retries) break;
            await sleep(600 * (attempt + 1));
        } finally {
            clearTimeout(timer);
        }
    }
    throw lastError;
};

// Tiny cache so a photo that is already open in a lightbox can be saved
// instantly — which keeps the tap "fresh" for the iOS share sheet.
const cache = new Map(); // url -> { promise, blob }

const getImageBlob = (url) => {
    const key = toSameOriginMedia(url);
    const hit = cache.get(key);
    if (hit) return hit.promise;

    const entry = { promise: null, blob: null };
    entry.promise = fetchImageBlob(key).then(
        (blob) => {
            entry.blob = blob;
            return blob;
        },
        (err) => {
            cache.delete(key);
            throw err;
        },
    );
    cache.set(key, entry);
    while (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value);
    return entry.promise;
};

const isCached = (url) => !!cache.get(toSameOriginMedia(url))?.blob;

/** Start loading a photo in the background (call when a lightbox opens). */
export const prefetchImage = (url) => {
    if (!url) return;
    getImageBlob(url).catch(() => {});
};

// ------------------------------------------------------------
// File naming
// ------------------------------------------------------------
const knownExt = (name) => {
    const m = /\.([A-Za-z0-9]{2,5})$/.exec(name || "");
    return m && TYPE_BY_EXT[m[1].toLowerCase()] ? m[1].toLowerCase() : null;
};

const urlBaseName = (url) => {
    try {
        let base = String(url).split(/[?#]/)[0].split("/").pop() || "";
        try {
            base = decodeURIComponent(base);
        } catch {
            /* keep raw */
        }
        return base;
    } catch {
        return "";
    }
};

export const buildFileName = (name, blob, fallbackBase = "photo") => {
    const raw = String(name || "").trim();
    const ext = knownExt(raw);
    let stem = ext ? raw.slice(0, -(ext.length + 1)) : raw;
    stem = stem
        // eslint-disable-next-line no-control-regex
        .replace(/[\\/:*?"<>|%\u0000-\u001f]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80);
    if (!stem) stem = fallbackBase;
    return `${stem}.${EXT_BY_TYPE[blob.type] || ext || "jpg"}`;
};

const toFile = (blob, name) =>
    new File([blob], name, { type: blob.type, lastModified: Date.now() });

// ------------------------------------------------------------
// Delivery
// ------------------------------------------------------------
const downloadViaAnchor = (file) => {
    const objectUrl = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = file.name;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(objectUrl);
    }, 60000);
};

// Opens the iOS share sheet ("Save Image"). Returns "shared" | "cancelled".
const shareFiles = async (files) => {
    try {
        await navigator.share({ files });
        return "shared";
    } catch (err) {
        if (err?.name === "AbortError") return "cancelled";
        throw err;
    }
};

// "Photo ready" dialog: its button is a real tap, so iOS lets the share
// sheet open. Without share support it explains press-and-hold instead
// (the images are real <img> elements, so Safari's own menu works).
const openSaveSheet = (files, part, parts) =>
    new Promise((resolve) => {
        const urls = files.map((f) => URL.createObjectURL(f));
        const done = (result) => {
            urls.forEach((u) => URL.revokeObjectURL(u));
            resolve(result);
        };
        const shareable = canShareFiles(files);
        const many = files.length > 1;

        Modal.confirm({
            className: "save-image-sheet",
            centered: true,
            icon: null,
            maskClosable: false,
            title:
                (many ? `${files.length} photos ready` : "Photo ready") +
                (parts > 1 ? ` (${part} of ${parts})` : ""),
            content: (
                <div data-allow-save="true">
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: many ? "repeat(3, 1fr)" : "1fr",
                            gap: 6,
                            maxHeight: "50vh",
                            overflowY: "auto",
                            margin: "8px 0 12px",
                        }}
                    >
                        {urls.map((u, i) => (
                            <img
                                key={u}
                                src={u}
                                alt={files[i].name}
                                data-allow-save="true"
                                draggable={false}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    objectFit: many ? "cover" : "contain",
                                    aspectRatio: many ? "1 / 1" : "auto",
                                    maxHeight: many ? undefined : "45vh",
                                    WebkitTouchCallout: "default",
                                    WebkitUserSelect: "auto",
                                    userSelect: "auto",
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>
                        {shareable
                            ? "Tap “Save to Photos”, then choose “Save Image” in the menu that opens."
                            : "Press and hold the photo, then choose “Add to Photos”."}
                    </div>
                </div>
            ),
            okText: shareable ? "Save to Photos" : "Done",
            cancelText: "Close",
            onOk: () => {
                if (!shareable) {
                    done("manual");
                    return undefined;
                }
                // Called synchronously from the tap — keeps iOS happy.
                return shareFiles(files)
                    .then((r) => done(r))
                    .catch(() => {
                        message.info(
                            "Press and hold the photo, then choose “Add to Photos”.",
                        );
                        done("failed");
                    });
            },
            onCancel: () => done("cancelled"),
        });
    });

const friendlyError = (err) => {
    switch (err?.code) {
        case "auth":
            return "Your session expired. Please sign in again, then retry.";
        case "forbidden":
            return "You don't have permission to download this photo.";
        case "notfound":
            return "This photo is no longer available.";
        case "notimage":
            return "The server did not send an image. Please refresh and try again.";
        case "timeout":
            return "The photo took too long to load. Check your connection and try again.";
        case "http":
            return "The photo could not be loaded right now. Please try again.";
        default:
            return "The photo could not be loaded. Check your connection and try again.";
    }
};

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------
/**
 * Save several photos. items: [{ url, filename? }]
 * Returns { status: "saved" | "shared" | "cancelled" | "failed", saved, failed }.
 */
export async function saveImages(items, { onProgress } = {}) {
    const list = (items || []).filter((i) => i && i.url);
    if (!list.length) {
        message.warning("No photos to save.");
        return { status: "failed", saved: 0, failed: 0 };
    }

    const startedAt = Date.now();
    const alreadyLoaded = list.every((i) => isCached(i.url));
    if (!alreadyLoaded) {
        message.loading({
            content: list.length > 1 ? `Preparing ${list.length} photos…` : "Preparing photo…",
            key: MSG_KEY,
            duration: 0,
        });
    }

    const files = [];
    let failed = 0;
    let firstError = null;

    for (let i = 0; i < list.length; i++) {
        try {
            const blob = await getImageBlob(list[i].url);
            const urlName = knownExt(urlBaseName(list[i].url)) ? urlBaseName(list[i].url) : "";
            files.push(
                toFile(blob, buildFileName(list[i].filename || urlName, blob, `photo-${i + 1}`)),
            );
        } catch (err) {
            failed++;
            firstError = firstError || err;
            console.error("Photo load failed:", list[i].url, err);
        }
        onProgress?.(i + 1, list.length);
        if (!alreadyLoaded && list.length > 1) {
            message.loading({
                content: `Preparing photos… ${i + 1}/${list.length}`,
                key: MSG_KEY,
                duration: 0,
            });
        }
    }

    if (!files.length) {
        message.error({ content: friendlyError(firstError), key: MSG_KEY });
        return { status: "failed", saved: 0, failed };
    }

    // ---------------- iPhone / iPad ----------------
    if (isIOS()) {
        message.destroy(MSG_KEY);
        const tapStillFresh = Date.now() - startedAt < 800;
        let result = "failed";
        const parts = Math.ceil(files.length / SHEET_CHUNK);

        for (let p = 0; p < parts; p++) {
            const chunk = files.slice(p * SHEET_CHUNK, (p + 1) * SHEET_CHUNK);

            if (p === 0 && tapStillFresh && canShareFiles(chunk)) {
                try {
                    result = await shareFiles(chunk);
                    if (result === "cancelled") return { status: "cancelled", saved: 0, failed };
                    if (parts === 1) return { status: "shared", saved: files.length, failed };
                    continue;
                } catch {
                    /* iOS wants a fresh tap — fall through to the dialog */
                }
            }

            result = await openSaveSheet(chunk, p + 1, parts);
            if (result === "cancelled") break;
        }

        if (failed) message.warning(`${failed} photo(s) could not be loaded.`);
        return {
            status: result === "cancelled" ? "cancelled" : "shared",
            saved: files.length,
            failed,
        };
    }

    // ---------------- Android / desktop ----------------
    for (let i = 0; i < files.length; i++) {
        downloadViaAnchor(files[i]);
        if (i < files.length - 1) await sleep(400);
    }

    const where = isStandalonePwa() ? "your Downloads" : "your downloads";
    if (failed) {
        message.warning({
            content: `Saved ${files.length} photo(s); ${failed} could not be loaded.`,
            key: MSG_KEY,
        });
    } else {
        message.success({
            content:
                files.length > 1
                    ? `${files.length} photos saved to ${where}.`
                    : `Photo saved to ${where}.`,
            key: MSG_KEY,
        });
    }
    return { status: "saved", saved: files.length, failed };
}

/** Save one photo. source: URL string, or { url, filename? }. */
export function saveImage(source, options) {
    const item = typeof source === "string" ? { url: source } : source;
    return saveImages([item], options);
}

export default saveImage;
