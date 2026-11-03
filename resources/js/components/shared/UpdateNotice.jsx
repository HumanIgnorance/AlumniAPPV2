import React, { useCallback, useEffect, useRef, useState } from "react";

// UpdateNotice — tells the person when a NEW VERSION of the app is ready, in the
// browser tab or the installed app, and lets them update with one tap.
//
// Two signals (either one shows the pop-up):
//   1. A new service worker finished installing and is waiting (sw.js changed).
//   2. /build/manifest.json differs from the one this page started with — i.e.
//      a new build was deployed (works even when sw.js itself did not change).
// It re-checks when the app comes back to the screen, when the connection
// returns and every 30 minutes. It never checks while offline and does nothing
// on the Vite dev server (no build manifest there).

const MANIFEST_URL = "/build/manifest.json";
const CHECK_EVERY_MS = 30 * 60 * 1000;
const REMIND_AFTER_MS = 10 * 60 * 1000;

const CSS = `
    .atms-upd {
        position: fixed; z-index: 2500; left: 50%; transform: translateX(-50%);
        bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
        width: min(440px, calc(100vw - 24px)); box-sizing: border-box;
        display: flex; align-items: center; gap: 12px; padding: 12px 14px;
        border-radius: 16px; color: #f8fafc; background: #0f172a;
        border: 1px solid rgba(148,163,184,0.35);
        box-shadow: 0 12px 36px rgba(2,6,23,0.45);
        font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        animation: atms-upd-in .28s ease both;
    }
    @keyframes atms-upd-in { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
    .atms-upd-icon { flex: 0 0 auto; width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #2563eb; font-size: 18px; }
    .atms-upd-body { flex: 1 1 auto; min-width: 0; }
    .atms-upd-title { font-weight: 700; font-size: 13.5px; }
    .atms-upd-text { opacity: .78; margin-top: 2px; overflow-wrap: anywhere; }
    .atms-upd-actions { flex: 0 0 auto; display: flex; flex-direction: column; gap: 6px; }
    .atms-upd button { font: inherit; font-weight: 700; border: 0; border-radius: 10px; cursor: pointer; padding: 8px 14px; white-space: nowrap; }
    .atms-upd-now { background: #2563eb; color: #fff; }
    .atms-upd-later { background: transparent; color: #cbd5e1; padding: 4px 14px !important; font-weight: 600 !important; }
    /* Phones: sit above the bottom navigation bar. */
    @media (max-width: 767px) { html.has-bottom-nav .atms-upd { bottom: calc(env(safe-area-inset-bottom, 0px) + 80px); } }
    @media (max-width: 380px) { .atms-upd { flex-wrap: wrap; } .atms-upd-actions { flex-direction: row; width: 100%; justify-content: flex-end; } }
`;

export default function UpdateNotice() {
    const [ready, setReady] = useState(false);
    const [busy, setBusy] = useState(false);
    const baseline = useRef(null);       // manifest text this page started with
    const dismissedAt = useRef(0);
    const readyRef = useRef(false);

    const show = useCallback(() => {
        if (readyRef.current) return;
        if (dismissedAt.current && Date.now() - dismissedAt.current < REMIND_AFTER_MS) return;
        readyRef.current = true;
        setReady(true);
    }, []);

    const fetchManifest = useCallback(async () => {
        try {
            const res = await fetch(MANIFEST_URL, { cache: "no-store" });
            if (!res.ok) return null;
            const text = await res.text();
            return text.trim().startsWith("{") ? text : null; // ignore the SPA fallback page
        } catch { return null; }
    }, []);

    const check = useCallback(async () => {
        if (typeof navigator !== "undefined" && navigator.onLine === false) return;
        try {
            if ("serviceWorker" in navigator) {
                const reg = await navigator.serviceWorker.getRegistration();
                if (reg) {
                    reg.update().catch(() => {});
                    if (reg.waiting && navigator.serviceWorker.controller) show();
                }
            }
        } catch { /* ignore */ }
        if (baseline.current) {
            const now = await fetchManifest();
            if (now && now !== baseline.current) show();
        }
    }, [fetchManifest, show]);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;
        let cancelled = false;

        (async () => {
            baseline.current = await fetchManifest();
            if (cancelled) return;
            if ("serviceWorker" in navigator) {
                try {
                    const reg = await navigator.serviceWorker.getRegistration();
                    if (reg) {
                        if (reg.waiting && navigator.serviceWorker.controller) show();
                        reg.addEventListener("updatefound", () => {
                            const w = reg.installing;
                            if (!w) return;
                            w.addEventListener("statechange", () => {
                                if (w.state === "installed" && navigator.serviceWorker.controller) show();
                            });
                        });
                    }
                } catch { /* ignore */ }
            }
        })();

        const onVisible = () => { if (document.visibilityState === "visible") check(); };
        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("online", check);
        const id = setInterval(check, CHECK_EVERY_MS);
        const first = setTimeout(check, 15000);
        return () => {
            cancelled = true;
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("online", check);
            clearInterval(id);
            clearTimeout(first);
        };
    }, [check, fetchManifest, show]);

    const update = useCallback(async () => {
        setBusy(true);
        let reloaded = false;
        const reload = () => { if (!reloaded) { reloaded = true; window.location.reload(); } };
        try {
            if ("serviceWorker" in navigator) {
                const reg = await navigator.serviceWorker.getRegistration();
                if (reg && reg.waiting) {
                    navigator.serviceWorker.addEventListener("controllerchange", reload, { once: true });
                    reg.waiting.postMessage({ type: "SKIP_WAITING" });
                    setTimeout(reload, 2000); // safety net
                    return;
                }
            }
        } catch { /* fall through */ }
        reload();
    }, []);

    const later = useCallback(() => {
        dismissedAt.current = Date.now();
        readyRef.current = false;
        setReady(false);
    }, []);

    if (!ready) return null;

    return (
        <>
            <style>{CSS}</style>
            <div className="atms-upd" role="alertdialog" aria-live="polite" aria-label={"A new version is available"}>
                <div className="atms-upd-icon" aria-hidden="true">⬆</div>
                <div className="atms-upd-body">
                    <div className="atms-upd-title">{"A new version is available"}</div>
                    <div className="atms-upd-text">{"Update now to get the latest improvements. It only takes a moment."}</div>
                </div>
                <div className="atms-upd-actions">
                    <button type="button" className="atms-upd-now" onClick={update} disabled={busy}>{"Update now"}</button>
                    <button type="button" className="atms-upd-later" onClick={later}>{"Later"}</button>
                </div>
            </div>
        </>
    );
}
