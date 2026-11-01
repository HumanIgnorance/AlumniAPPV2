import { useEffect, useRef } from "react";

/**
 * Attach a DOM event listener that is ALWAYS removed on unmount.
 * The handler is kept in a ref, so you can pass an inline function
 * without re-subscribing on every render.
 *
 *   useEventListener("scroll", () => setScrolled(window.scrollY > 8));
 *   useEventListener("keydown", onKey, { target: document });
 */
export default function useEventListener(
    eventName,
    handler,
    { target, options, enabled = true } = {},
) {
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    useEffect(() => {
        const el = target === undefined ? window : target;
        if (!enabled || !el || !el.addEventListener) return undefined;
        const listener = (event) => handlerRef.current?.(event);
        el.addEventListener(eventName, listener, options);
        return () => el.removeEventListener(eventName, listener, options);
        // options is intentionally compared by identity-less value use; pass a
        // stable object (or a module-level constant) if you need to change it.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventName, target, enabled]);
}
