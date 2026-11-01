import { useEffect, useState } from "react";

export default function useResponsiveShell() {
    const [collapsed, setCollapsed] = useState(true);

    const [isMobile, setIsMobile] = useState(false);

    const [isTouchDevice, setIsTouchDevice] = useState(false);

    const [drawerVisible, setDrawerVisible] = useState(false);

    // Flags <html>/<body> with a class only while THIS admin shell is
    // mounted, so the mobile "lock the page, only #content scrolls"
    // CSS rule (index.css) can be scoped to it instead of applying to
    // every route. Without this, that lock was being applied
    // site-wide, including on the public pages (PublicHomePage,
    // PublicEventsPage, etc.) that rely on normal document scrolling
    // and don't use this shell at all - which is why those pages
    // stopped being able to scroll on phones. Removed again on
    // unmount so navigating to a public page restores normal scroll.
    useEffect(() => {
        document.documentElement.classList.add("app-shell-active");
        document.body.classList.add("app-shell-active");
        return () => {
            document.documentElement.classList.remove("app-shell-active");
            document.body.classList.remove("app-shell-active");
        };
    }, []);

    useEffect(() => {
        // window.innerWidth alone misses phones running in "Request Desktop
        // Site" mode — the browser reports a wide layout viewport there
        // (often 980–1280px), so a plain `< 768` check stays false even
        // though the device is still a small, touch-only phone screen.
        //
        // We can't just OR in "has touch", though — that would also catch
        // touch-capable laptops/desktops/all-in-ones at full 1920px width
        // and incorrectly force the mobile layout on them. Instead we use
        // window.screen.width (the device's actual physical screen size,
        // which "Request Desktop Site" does NOT change) together with
        // touch capability: only flag as mobile when the device both has
        // touch AND its real screen is phone-sized.
        //
        // IMPORTANT: all of this must be recomputed on every resize, not
        // just once when the effect mounts. window.screen.width and
        // navigator.maxTouchPoints can both change at runtime — e.g. when
        // Chrome DevTools device emulation (or any window resize) is
        // toggled on/off. If these are read once and captured in the
        // handleResize closure, the device's "is this a phone" verdict
        // gets stuck at whatever it was on mount and never updates again
        // (which is what was locking the sidebar into mobile/drawer mode
        // even after returning to a normal desktop-sized window).
        //
        // ORIENTATION: Math.min(screen.width, screen.height) is intentionally
        // rotation-invariant (stays e.g. 414 whether the phone is portrait
        // or landscape) so "is this device a phone" doesn't flip-flop as you
        // rotate. But that alone would force the mobile <Drawer> in landscape
        // too — and all of the Drawer/menu CSS (sizing, font, padding) only
        // targets `max-width: 768px`, which a landscape phone's actual width
        // (often 700–950px) does NOT satisfy. The Drawer would then render
        // with antd's bare defaults and clipped labels, while unrelated
        // `min-width: 769px` desktop CSS rules apply on top of it — exactly
        // the "collapses like desktop" symptom. The old, stable version
        // sidestepped this entirely by only ever checking window.innerWidth,
        // so a landscape phone (wide viewport) always fell back to the
        // normal desktop Sider. To match that proven behavior, we keep the
        // phone-sized-touch-device override for portrait (where width alone
        // would wrongly say "desktop" under Request Desktop Site), but let
        // landscape fall back to window.innerWidth like the old version —
        // i.e. only treat it as mobile in landscape if it's ALSO narrow by
        // viewport width.
        const handleResize = () => {
            const hasTouch =
                typeof window !== "undefined" &&
                ("ontouchstart" in window ||
                    (navigator.maxTouchPoints &&
                        navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints &&
                        navigator.msMaxTouchPoints > 0));

            const physicalScreenWidth =
                typeof window !== "undefined" && window.screen
                    ? Math.min(window.screen.width, window.screen.height)
                    : window.innerWidth;

            const isPortrait =
                typeof window !== "undefined"
                    ? window.innerHeight >= window.innerWidth
                    : true;

            // Only apply the "Request Desktop Site" phone override in
            // portrait. In landscape, behave like the old stable code and
            // trust window.innerWidth alone, so a rotated phone gets the
            // normal desktop sidebar instead of the narrow mobile Drawer.
            const isPhoneSizedTouchDevice =
                hasTouch && physicalScreenWidth < 768 && isPortrait;

            setIsMobile(window.innerWidth < 768 || isPhoneSizedTouchDevice);

            // Deliberately NOT gated by isPortrait/orientation — a touch
            // screen is a touch screen whichever way the phone is held.
            setIsTouchDevice(Boolean(hasTouch));
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
        };
    }, []);

    // ============ END GLOBAL HEARTBEAT ============

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    return {
        isMobile,
        isTouchDevice,
        setDrawerVisible,
        toggleDrawer,
        drawerVisible,
        collapsed,
    };
}
