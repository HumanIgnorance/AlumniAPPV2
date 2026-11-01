import { useEffect } from "react";

/**
 * Keeps the CSS variable --ph-header-h equal to the real height of the
 * sticky public header (so `scroll-margin-top` / sticky offsets stay right
 * when the header wraps or the phone rotates). All listeners are removed on
 * unmount.
 */
export default function useHeaderHeightVar(ref, cssVar = "--ph-header-h") {
    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        const applyHeight = () => {
            const height = node.offsetHeight;
            if (height > 0) {
                document.documentElement.style.setProperty(cssVar, `${height}px`);
            }
        };
        applyHeight();

        let observer;
        if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(applyHeight);
            observer.observe(node);
        }
        // safety net for browsers where ResizeObserver misses orientation changes
        window.addEventListener("resize", applyHeight);
        window.addEventListener("orientationchange", applyHeight);

        return () => {
            if (observer) observer.disconnect();
            window.removeEventListener("resize", applyHeight);
            window.removeEventListener("orientationchange", applyHeight);
        };
    }, [ref, cssVar]);
}
