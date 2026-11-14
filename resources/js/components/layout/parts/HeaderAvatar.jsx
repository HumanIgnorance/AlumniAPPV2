import React, { memo, useEffect, useRef, useState } from "react";
import { Avatar } from "antd";

// URLs already downloaded + decoded during this session — swapping to one of
// these is instant, so it can never flash.
const decoded = new Set();

/**
 * Header / account-menu avatar that never "blinks".
 *
 * - It only re-renders when `src` really changes (memo), not on every layout
 *   update (notification poll, bell animation, resize…).
 * - When `src` changes it keeps showing the current picture until the new one
 *   has fully loaded, then swaps — no empty circle / placeholder flash.
 * - If the new picture fails to load it simply keeps the current one.
 */
function HeaderAvatar({ src, size = 24, style, className }) {
    const [shown, setShown] = useState(src);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!src || src === shown) return undefined;

        if (decoded.has(src)) {
            setShown(src);
            return undefined;
        }

        const img = new Image();
        img.onload = () => {
            decoded.add(src);
            if (mounted.current) setShown(src);
        };
        img.onerror = () => {
            /* keep the picture we already show */
        };
        img.src = src;

        return () => {
            // abandon a stale preload so it cannot hold memory or set state
            img.onload = null;
            img.onerror = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return (
        <Avatar
            size={size}
            src={shown}
            style={style}
            className={className}
            draggable={false}
        />
    );
}

export default memo(HeaderAvatar);
