import { useCallback, useEffect, useRef } from "react";

/**
 * Create blob: preview URLs without leaking them.
 * Each File/Blob gets ONE url (cached), and every url is revoked on unmount.
 *
 *   const urlFor = useObjectUrl();
 *   <img src={urlFor(file)} />   // safe to call on every render
 */
export default function useObjectUrl() {
    const cache = useRef(new WeakMap());
    const all = useRef(new Set());

    useEffect(() => {
        const urls = all.current;
        return () => {
            urls.forEach((u) => URL.revokeObjectURL(u));
            urls.clear();
        };
    }, []);

    return useCallback((blob) => {
        if (!blob) return "";
        const hit = cache.current.get(blob);
        if (hit) return hit;
        try {
            const url = URL.createObjectURL(blob);
            cache.current.set(blob, url);
            all.current.add(url);
            return url;
        } catch (e) {
            return "";
        }
    }, []);
}
