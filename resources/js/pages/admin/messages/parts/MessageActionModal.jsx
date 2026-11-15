import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { message as antMessage } from "antd";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

// Copy text without relying on text selection (bubbles are non-selectable now).
async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        /* fall through to the legacy path */
    }
    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:-1000px;opacity:0;";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
    } catch {
        return false;
    }
}

// Crisp vector icons (emoji icons were bitmap-scaled and looked soft).
const ICONS = {
    copy: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
        </svg>
    ),
    edit: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
    ),
    trash: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h18" />
            <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
        </svg>
    ),
};

const EDGE = 8; // min distance kept from the screen edges
const GAP = 8; // space between reaction bar, bubble and action list

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi));

// ============================
// MESSAGE ACTION MENU (Messenger style)
//   reactions bar  -> above the pressed message
//   the message    -> lifted copy, in place
//   actions        -> under the message
// Works for long-press (phone / tablet / PWA), right-click and double-tap.
// Rendered in a portal so no parent (overflow, transform, stacking context,
// pinned full-screen chat) can clip or blur it.
// ============================
export default function MessageActionModal() {
    const {
        showMessageActionModal,
        actionMessageData,
        menuAnchor,
        canModifyMessage,
        canEditMessage,
        closeMessageActionModal,
        EMOJI_REACTIONS,
        addReaction,
        startInlineEdit,
        openDeleteConfirmModal,
    } = useMessagesContext();

    const overlayRef = useRef(null);
    const barRef = useRef(null);
    const menuRef = useRef(null);
    const returnFocusRef = useRef(null);
    const [layout, setLayout] = useState(null);

    // The menu opens while the finger / mouse is still down. The release that
    // follows must not count as a tap on the overlay, so ignore the first beat.
    const openedAtRef = useRef(0);
    const open = !!(showMessageActionModal && actionMessageData);

    useEffect(() => {
        if (!open) return undefined;
        openedAtRef.current = Date.now();
        returnFocusRef.current = document.activeElement;
        return () => {
            const el = returnFocusRef.current;
            if (el && el.focus && document.contains(el)) {
                try {
                    el.focus({ preventScroll: true });
                } catch {
                    /* ignore */
                }
            }
        };
    }, [open]);

    // ---- position everything before the first paint (no flash, no jump) ----
    const place = useCallback(() => {
        const overlay = overlayRef.current;
        const bar = barRef.current;
        if (!overlay || !bar) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cs = getComputedStyle(overlay); // env(safe-area-*) resolves here
        const minX = (parseFloat(cs.paddingLeft) || 0) + EDGE;
        const maxX = vw - (parseFloat(cs.paddingRight) || 0) - EDGE;
        const minY = (parseFloat(cs.paddingTop) || 0) + EDGE;
        const maxY = vh - (parseFloat(cs.paddingBottom) || 0) - EDGE;

        const barW = bar.offsetWidth;
        const barH = bar.offsetHeight;
        const menu = menuRef.current;
        const menuW = menu ? menu.offsetWidth : 0;
        const menuH = menu ? menu.offsetHeight : 0;

        const a = menuAnchor;
        const alignEnd = a ? a.side === "end" : false;

        // horizontal: line the bar / list up with the bubble's own edge
        const alignX = (w) => {
            if (!a) return (vw - w) / 2;
            const r = a.rect;
            const x = alignEnd ? r.left + r.width - w : r.left;
            return clamp(x, minX, maxX - w);
        };

        const stackH = a
            ? barH + GAP + a.rect.height + (menu ? GAP + menuH : 0)
            : 0;
        const fits = !!a && stackH <= maxY - minY;

        let top;
        let clone = null;
        if (fits) {
            // keep the bubble where it is when possible, otherwise slide the
            // whole stack just enough to stay on screen
            top = clamp(a.rect.top - barH - GAP, minY, maxY - stackH);
            const cloneTop = top + barH + GAP;
            const cw = Math.min(a.rect.width, maxX - minX);
            clone = {
                top: cloneTop,
                left: clamp(a.rect.left, minX, maxX - cw),
                width: cw,
                height: a.rect.height,
            };
        } else {
            // no anchor (or a very tall bubble): centred bar + list
            const h = barH + (menu ? GAP + menuH : 0);
            top = minY + Math.max(0, (maxY - minY - h) / 2);
        }

        const barTop = top;
        const menuTop = clone
            ? clone.top + clone.height + GAP
            : barTop + barH + GAP;

        setLayout({
            clone,
            bar: { top: Math.round(barTop), left: Math.round(alignX(barW)) },
            menu: menu
                ? { top: Math.round(menuTop), left: Math.round(alignX(menuW)) }
                : null,
        });
    }, [menuAnchor]);

    useLayoutEffect(() => {
        if (!open) {
            setLayout(null);
            return undefined;
        }
        place();
        window.addEventListener("resize", place);
        window.addEventListener("orientationchange", place);
        const vv = window.visualViewport;
        if (vv) vv.addEventListener("resize", place);
        return () => {
            window.removeEventListener("resize", place);
            window.removeEventListener("orientationchange", place);
            if (vv) vv.removeEventListener("resize", place);
        };
    }, [open, place]);

    // ---- keyboard: Esc closes, arrows move through reactions, Tab stays inside ----
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                closeMessageActionModal();
                return;
            }
            const root = overlayRef.current;
            if (!root) return;
            const items = [...root.querySelectorAll("button:not([disabled])")];
            if (!items.length) return;

            if (e.key === "Tab") {
                const i = items.indexOf(document.activeElement);
                e.preventDefault();
                const next = e.shiftKey
                    ? items[(i <= 0 ? items.length : i) - 1]
                    : items[(i + 1) % items.length];
                next.focus();
            } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const emojis = [...root.querySelectorAll(".mam-emoji")];
                const i = emojis.indexOf(document.activeElement);
                e.preventDefault();
                if (i === -1) {
                    emojis[0].focus(); // first arrow press enters the reactions
                    return;
                }
                const d = e.key === "ArrowRight" ? 1 : -1;
                emojis[(i + d + emojis.length) % emojis.length].focus();
            } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                const i = items.indexOf(document.activeElement);
                e.preventDefault();
                const d = e.key === "ArrowDown" ? 1 : -1;
                items[(i + d + items.length) % items.length].focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, closeMessageActionModal]);

    // Focus moves into the dialog (so Esc / arrows / Tab work straight away)
    // but onto the dialog itself, not a button - otherwise mouse and touch
    // users would see a focus ring on the first emoji as if it were chosen.
    useEffect(() => {
        if (open && layout && overlayRef.current) {
            overlayRef.current.focus({ preventScroll: true });
        }
    }, [open, !!layout]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!open) return null;

    const msg = actionMessageData;
    const canModify = canModifyMessage(msg);
    const hasText = !!(msg.message && msg.message.trim());
    const canEdit = canModify && hasText && canEditMessage(msg);
    const hasActions = hasText || canEdit || canModify;

    const guard = (fn) => (e) => {
        if (Date.now() - openedAtRef.current < 350) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        fn(e);
    };

    const handleCopy = async () => {
        const ok = await copyText(msg.message);
        if (ok) antMessage.success("Message copied");
        else antMessage.error("Couldn't copy the message");
        closeMessageActionModal();
    };

    const side = menuAnchor ? menuAnchor.side : "end";
    const pos = (p) =>
        p
            ? { top: p.top, left: p.left }
            : { top: 0, left: 0 };

    return createPortal(
        <div
            ref={overlayRef}
            className={`mam-overlay${layout ? " is-ready" : ""}`}
            role="presentation"
            tabIndex={-1}
            onClick={guard(closeMessageActionModal)}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* the pressed message, lifted out of the chat */}
            {layout && layout.clone && menuAnchor && (
                <div
                    className={`mam-clone message-row ${side === "end" ? "admin-side" : "alumni-side"}`}
                    style={{
                        top: layout.clone.top,
                        left: layout.clone.left,
                        width: layout.clone.width,
                    }}
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: menuAnchor.html }}
                />
            )}

            {/* reactions */}
            <div
                ref={barRef}
                className="mam-bar"
                role="toolbar"
                aria-label="React to message"
                style={pos(layout && layout.bar)}
                onClick={(e) => e.stopPropagation()}
            >
                {EMOJI_REACTIONS.map((emoji) => (
                    <button
                        type="button"
                        key={emoji}
                        className="mam-emoji"
                        aria-label={`React with ${emoji}`}
                        onClick={guard(() => addReaction(msg.id, emoji))}
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            {/* actions */}
            {hasActions && (
                <div
                    ref={menuRef}
                    className="mam-menu"
                    role="menu"
                    aria-label="Message actions"
                    style={pos(layout && layout.menu)}
                    onClick={(e) => e.stopPropagation()}
                >
                    {hasText && (
                        <button
                            type="button"
                            role="menuitem"
                            className="mam-item"
                            onClick={guard(handleCopy)}
                        >
                            {ICONS.copy}
                            <span>Copy</span>
                        </button>
                    )}
                    {canEdit && (
                        <button
                            type="button"
                            role="menuitem"
                            className="mam-item"
                            onClick={guard(() => startInlineEdit(msg))}
                        >
                            {ICONS.edit}
                            <span>Edit</span>
                        </button>
                    )}
                    {canModify && (
                        <button
                            type="button"
                            role="menuitem"
                            className="mam-item mam-item-danger"
                            onClick={guard(() => openDeleteConfirmModal(msg))}
                        >
                            {ICONS.trash}
                            <span>Unsend for everyone</span>
                        </button>
                    )}
                </div>
            )}
        </div>,
        document.body,
    );
}
