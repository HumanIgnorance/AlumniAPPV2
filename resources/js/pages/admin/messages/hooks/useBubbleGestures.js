import { useCallback, useEffect, useRef } from "react";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

/**
 * One gesture layer for every chat bubble (admin ChatArea + alumni view),
 * on phones, PWA, tablets AND desktop/laptop:
 *
 *   long press (touch, pen or held mouse)  -> open the reaction / action menu
 *   right-click (desktop)                  -> open the same menu
 *   double tap / double click              -> quick ❤️ reaction
 *
 * It replaces the old onMouseDown/onTouchStart pair, which
 *   - fired on touch AND on the emulated mouse events,
 *   - never cancelled when the finger moved (scrolling opened the menu),
 *   - let the browser select the text / show its own copy menu, so the
 *     "Cancel" and "Unsend for Everyone" labels got highlighted.
 * Selection is blocked in CSS (12-gesture-safe.css) and cleared here as a
 * safety net. Text can still be copied from the "Copy" button in the menu.
 */

const LONG_PRESS_MS = 450;
const MOVE_TOLERANCE_PX = 10; // finger/mouse drift allowed during a press
const DOUBLE_TAP_MS = 320;
const DOUBLE_TAP_DISTANCE_PX = 32;

// Things inside a bubble that must keep their own behaviour.
const INTERACTIVE = "input, textarea, select, button, a, [contenteditable='true']";

function clearSelection() {
    try {
        const sel = window.getSelection && window.getSelection();
        if (sel && sel.rangeCount > 0) sel.removeAllRanges();
    } catch {
        /* ignore */
    }
}

export default function useBubbleGestures() {
    const { handleLongPress, handleDoubleClick } = useMessagesContext();

    const s = useRef({
        timer: null,
        pointerId: null,
        startX: 0,
        startY: 0,
        fired: false, // a long press already opened the menu for this touch
        lastTapAt: 0,
        lastTapX: 0,
        lastTapY: 0,
        lastTapId: null,
    });

    const cancelTimer = useCallback(() => {
        if (s.current.timer) {
            clearTimeout(s.current.timer);
            s.current.timer = null;
        }
    }, []);

    useEffect(() => cancelTimer, [cancelTimer]);

    const openMenu = useCallback(
        (msg) => {
            s.current.fired = true;
            s.current.lastTapAt = 0;
            clearSelection();
            try {
                if (navigator.vibrate) navigator.vibrate(12);
            } catch {
                /* ignore */
            }
            handleLongPress(msg.id, msg);
        },
        [handleLongPress],
    );

    /**
     * Spread on the bubble:  <div {...getBubbleProps(msg, isEditing)} />
     * `disabled` = editing, or an optimistic message with no server id yet.
     */
    const getBubbleProps = useCallback(
        (msg, disabled = false) => {
            if (disabled || !msg || msg.isOptimistic) return {};

            return {
                onPointerDown: (e) => {
                    if (e.target.closest && e.target.closest(INTERACTIVE)) return;
                    if (e.pointerType === "mouse" && e.button !== 0) return;

                    const st = s.current;
                    cancelTimer();
                    st.fired = false;
                    st.pointerId = e.pointerId;
                    st.startX = e.clientX;
                    st.startY = e.clientY;
                    st.timer = setTimeout(() => {
                        st.timer = null;
                        openMenu(msg);
                    }, LONG_PRESS_MS);
                },

                onPointerMove: (e) => {
                    const st = s.current;
                    if (!st.timer || e.pointerId !== st.pointerId) return;
                    const dx = Math.abs(e.clientX - st.startX);
                    const dy = Math.abs(e.clientY - st.startY);
                    if (dx > MOVE_TOLERANCE_PX || dy > MOVE_TOLERANCE_PX) {
                        cancelTimer(); // the person is scrolling / selecting, not pressing
                    }
                },

                onPointerUp: (e) => {
                    const st = s.current;
                    const hadTimer = !!st.timer;
                    cancelTimer();

                    if (st.fired) return; // long press already handled
                    if (!hadTimer) return; // moved away or ignored target
                    if (e.target.closest && e.target.closest(INTERACTIVE)) return;

                    // double tap / double click
                    const now = Date.now();
                    const near =
                        Math.abs(e.clientX - st.lastTapX) <= DOUBLE_TAP_DISTANCE_PX &&
                        Math.abs(e.clientY - st.lastTapY) <= DOUBLE_TAP_DISTANCE_PX;

                    if (
                        st.lastTapId === msg.id &&
                        now - st.lastTapAt <= DOUBLE_TAP_MS &&
                        near
                    ) {
                        st.lastTapAt = 0;
                        st.lastTapId = null;
                        clearSelection();
                        handleDoubleClick(msg.id);
                    } else {
                        st.lastTapAt = now;
                        st.lastTapId = msg.id;
                        st.lastTapX = e.clientX;
                        st.lastTapY = e.clientY;
                    }
                },

                onPointerCancel: cancelTimer, // browser took over (scroll / pinch)
                onPointerLeave: (e) => {
                    if (e.pointerType === "mouse") cancelTimer();
                },

                // desktop: a second mouse-down must not start a word selection
                onMouseDown: (e) => {
                    if (e.detail > 1 && !(e.target.closest && e.target.closest(INTERACTIVE))) {
                        e.preventDefault();
                    }
                },

                // iOS/Android long-press callout + desktop right-click
                onContextMenu: (e) => {
                    if (e.target.closest && e.target.closest("input, textarea")) return;
                    e.preventDefault();
                    if (!s.current.fired) {
                        cancelTimer();
                        openMenu(msg);
                    }
                },

                onDragStart: (e) => e.preventDefault(),

                // swallow the click that follows a long press (e.g. image lightbox)
                onClickCapture: (e) => {
                    if (s.current.fired) {
                        e.preventDefault();
                        e.stopPropagation();
                        s.current.fired = false;
                    }
                },
            };
        },
        [cancelTimer, openMenu, handleDoubleClick],
    );

    return { getBubbleProps };
}
