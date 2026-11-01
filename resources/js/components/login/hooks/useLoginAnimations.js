import React, { useEffect, useRef } from "react";
import { useRive } from "@rive-app/react-canvas";

export default function useLoginAnimations({
    setCurrentView,
    setForgotEmail,
    setResetToken,
}) {
    // ===== Portfolio-style particle background for .login-brand =====
    const brandParticlesRef = useRef(null);

    useEffect(() => {
        const canvas = brandParticlesRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let raf;
        let particles = [];
        let w = 0,
            h = 0;

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(90, Math.floor((w * h) / 14000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 1.6 + 0.4,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i],
                        b = particles[j];
                    const dx = a.x - b.x,
                        dy = a.y - b.y;
                    const d = Math.hypot(dx, dy);
                    if (d < 120) {
                        ctx.strokeStyle = `rgba(167, 139, 250, ${0.18 * (1 - d / 120)})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.fillStyle = "rgba(186, 200, 255, 0.65)";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };

        resize();
        draw();
        const ro = new ResizeObserver(resize);
        if (canvas.parentElement) ro.observe(canvas.parentElement);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, []);

    /* =========================================================
     URL-driven reset entry
     ========================================================= */
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const email = params.get("email");

        if (token && email) {
            setCurrentView("reset-password");
            // URLSearchParams has already decoded these once.
            setForgotEmail(email);
            setResetToken(token);
            // Keep the one-time token out of the address bar / history.
            try {
                const clean = new URL(window.location.href);
                clean.searchParams.delete("token");
                clean.searchParams.delete("email");
                window.history.replaceState(
                    {},
                    document.title,
                    clean.pathname + clean.search + clean.hash,
                );
            } catch (e) {
                /* ignore */
            }
        }
    }, []);

    // Floating Interactive
    const { rive: floatingRive, RiveComponent: FloatingRiveComponent } =
        useRive({
            src: "/astro-assets/rive-files/floating-interactive.riv",
            autoplay: true,
            useDevicePixelRatio: true,
        });

    useEffect(() => {
        if (!floatingRive) return;

        const names = floatingRive.stateMachineNames;
        if (names?.length) {
            floatingRive.play(names[0]);
        } else {
            const anims = floatingRive.animationNames;
            if (anims?.length) floatingRive.play(anims[0]);
        }
    }, [floatingRive]);

    // Drag Background
    const { rive: dragBgRive, RiveComponent: DragBgRiveComponent } = useRive({
        src: "/astro-assets/rive-files/dragBg.riv",
        autoplay: true,
        useDevicePixelRatio: true,
    });

    useEffect(() => {
        if (!dragBgRive) return;

        const names = dragBgRive.stateMachineNames;
        if (names?.length) {
            dragBgRive.play(names[0]);
        } else {
            const anims = dragBgRive.animationNames;
            if (anims?.length) dragBgRive.play(anims[0]);
        }
    }, [dragBgRive]);

    const riveStageRef = useRef(null);

    const lookAtPoint = (cx, cy) => {
        const stage = riveStageRef.current;
        if (!stage) return;
        const canvas = stage.querySelector("canvas");
        if (!canvas) return;
        try {
            canvas.dispatchEvent(
                new PointerEvent("pointermove", {
                    clientX: cx,
                    clientY: cy,
                    bubbles: true,
                    pointerType: "mouse",
                }),
            );
            canvas.dispatchEvent(
                new MouseEvent("mousemove", {
                    clientX: cx,
                    clientY: cy,
                    bubbles: true,
                }),
            );
        } catch (_) {
            /* no-op */
        }
    };

    const lookAtElement = (el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        lookAtPoint(r.left + r.width / 2, r.top + r.height / 2);
    };

    const handleFeatureEnter = (e) => {
        lookAtPoint(e.clientX, e.clientY);
    };

    const handleFeatureMove = (e) => {
        lookAtPoint(e.clientX, e.clientY);
    };

    const handleFeatureLeave = (e) => {
        lookAtElement(e.currentTarget);
    };

    return {
        brandParticlesRef,
        riveStageRef,
        FloatingRiveComponent,
        handleFeatureEnter,
        handleFeatureMove,
        handleFeatureLeave,
    };
}
