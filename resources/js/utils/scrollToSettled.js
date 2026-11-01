/**
 * Deep-link landings can look like they "jump back up" a moment after
 * arriving: images / carousels / web fonts keep resizing the page after the
 * first scrollIntoView. This re-issues scrollIntoView on a short interval
 * until the page height stops changing, then stops. It also backs off at once
 * if the visitor scrolls or touches the screen.
 *
 * Returns a `stop()` function. It clears the pending timer and removes the
 * wheel/touch/key listeners (so call it from your effect cleanup).
 */
export default function scrollToSettled(
    getTarget,
    { maxAttempts = 30, stableTicksNeeded = 3, intervalMs = 90 } = {},
) {
    let cancelled = false;
    let lastHeight = -1;
    let stableCount = 0;
    let attempts = 0;
    let timer = null;

    const stop = () => {
        cancelled = true;
        if (timer) clearTimeout(timer);
        timer = null;
        window.removeEventListener("wheel", stop);
        window.removeEventListener("touchmove", stop);
        window.removeEventListener("keydown", stop);
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("keydown", stop);

    const tick = () => {
        if (cancelled) return;
        const el = getTarget();
        if (!el) return stop();

        el.scrollIntoView({ behavior: "auto", block: "start" });

        const currentHeight = document.body.scrollHeight;
        if (currentHeight === lastHeight) {
            stableCount += 1;
        } else {
            stableCount = 0;
            lastHeight = currentHeight;
        }

        attempts += 1;
        if (stableCount >= stableTicksNeeded || attempts >= maxAttempts) {
            return stop();
        }
        timer = setTimeout(tick, intervalMs);
    };

    tick();
    return stop;
}
