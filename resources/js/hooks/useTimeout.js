import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a `schedule(fn, ms)` function. Every pending timeout it created
 * is cleared automatically when the component unmounts, so a late timer can
 * never call setState / scroll on an unmounted component.
 *
 *   const later = useTimeout();
 *   later(() => scrollToBottom(), 100);
 */
export default function useTimeout() {
    const ids = useRef(new Set());

    useEffect(() => {
        const set = ids.current;
        return () => {
            set.forEach((id) => clearTimeout(id));
            set.clear();
        };
    }, []);

    return useCallback((fn, ms = 0) => {
        const id = setTimeout(() => {
            ids.current.delete(id);
            fn();
        }, ms);
        ids.current.add(id);
        return () => {
            clearTimeout(id);
            ids.current.delete(id);
        };
    }, []);
}
