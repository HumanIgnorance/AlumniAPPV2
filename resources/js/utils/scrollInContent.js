/**
 * Scroll helpers for the signed-in app shell.
 *
 * In the shell ONLY  #content  is supposed to scroll; the header, sidebar and
 * footer are fixed in place. Element.scrollIntoView() is unsafe there: it
 * scrolls EVERY scrollable ancestor, including the "overflow: hidden" shell
 * wrappers and the <html>/<body> element. On iPhone Safari / installed PWAs
 * that pushes the whole app (header + footer included) up out of view.
 *
 * Always use scrollToInContent() instead of el.scrollIntoView() on signed-in
 * pages. It only ever moves #content (or the scroll container you pass in).
 */

const SHELL_SELECTORS = [".app-shell-root", ".site-layout"];

export const getShellScroller = () =>
    typeof document === "undefined" ? null : document.getElementById("content");

/** Put the shell wrappers + document back at 0 (they must never be scrolled). */
export function resetShellScroll() {
    if (typeof document === "undefined") return;
    SHELL_SELECTORS.forEach((sel) => {
        const node = document.querySelector(sel);
        if (node && node.scrollTop !== 0) node.scrollTop = 0;
        if (node && node.scrollLeft !== 0) node.scrollLeft = 0;
    });
    const root = document.scrollingElement || document.documentElement;
    if (root && root.scrollTop !== 0) root.scrollTop = 0;
    if (document.body && document.body.scrollTop !== 0) document.body.scrollTop = 0;
    if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);
}

/**
 * Smoothly scroll `target` into view INSIDE its scroll container only.
 *
 * @param {Element|{current: Element}} target  element or React ref
 * @param {object} [opts]
 * @param {Element} [opts.container]  defaults to #content (or the closest scrollable parent)
 * @param {number}  [opts.offset=12]  breathing room above the target
 * @param {"smooth"|"auto"} [opts.behavior="smooth"]
 */
export function scrollToInContent(target, opts = {}) {
    const el = target && "current" in target ? target.current : target;
    if (!el || typeof el.getBoundingClientRect !== "function") return;

    const { offset = 12, behavior = "smooth" } = opts;
    const container = opts.container || getShellScroller() || closestScrollable(el);

    if (!container) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior });
        return;
    }

    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const top = container.scrollTop + (eRect.top - cRect.top) - offset;
    container.scrollTo({ top: Math.max(0, top), behavior });

    // Belt and braces: nothing outside #content may have moved.
    resetShellScroll();
}

function closestScrollable(el) {
    let node = el.parentElement;
    while (node && node !== document.body) {
        const { overflowY } = window.getComputedStyle(node);
        if (/(auto|scroll)/.test(overflowY) && node.scrollHeight > node.clientHeight) return node;
        node = node.parentElement;
    }
    return null;
}

export default scrollToInContent;

/**
 * Drop-in replacement for el.scrollIntoView({ block }) that only moves the
 * element's OWN nearest scrollable parent (e.g. a chat message list) and
 * never the page / shell.
 */
export function scrollWithin(target, { block = "center", behavior = "smooth" } = {}) {
    const el = target && "current" in target ? target.current : target;
    if (!el) return;
    const container = closestScrollable(el);
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    let top = container.scrollTop + (eRect.top - cRect.top);
    if (block === "center") top -= (container.clientHeight - eRect.height) / 2;
    if (block === "end") top -= container.clientHeight - eRect.height;
    container.scrollTo({ top: Math.max(0, top), behavior });
    resetShellScroll();
}
