import { useEffect, useState } from "react";

export default function useDeviceInfo() {
    const [isMobilePhone, setIsMobilePhone] = useState(false);

    const [showMobileNotice, setShowMobileNotice] = useState(true);

    const [isStandalonePWA, setIsStandalonePWA] = useState(false);

    useEffect(() => {
        const checkStandalone = () => {
            const displayModeStandalone =
                typeof window.matchMedia === "function" &&
                window.matchMedia("(display-mode: standalone)").matches;

            // iOS Safari doesn't support the display-mode media query the
            // same way; this is its own long-standing flag for "launched
            // from the home screen icon".
            const iosStandalone = window.navigator.standalone === true;

            // Android TWA / apps that launched via an installed intent.
            const androidTwa =
                document.referrer &&
                document.referrer.startsWith("android-app://");

            setIsStandalonePWA(
                Boolean(displayModeStandalone || iosStandalone || androidTwa),
            );
        };

        checkStandalone();

        // If display-mode flips while the page is open (rare, but possible
        // right after an install), hide the notice immediately instead of
        // waiting for a reload.
        let mql;
        if (typeof window.matchMedia === "function") {
            mql = window.matchMedia("(display-mode: standalone)");
            const handleChange = () => checkStandalone();
            if (mql.addEventListener)
                mql.addEventListener("change", handleChange);
            else if (mql.addListener) mql.addListener(handleChange);

            window.addEventListener("appinstalled", checkStandalone);

            return () => {
                if (mql.removeEventListener)
                    mql.removeEventListener("change", handleChange);
                else if (mql.removeListener) mql.removeListener(handleChange);
                window.removeEventListener("appinstalled", checkStandalone);
            };
        }
    }, []);

    useEffect(() => {
        const detectMobilePhone = () => {
            const userAgent =
                navigator.userAgent || navigator.vendor || window.opera;
            const isMobile =
                /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    userAgent,
                );
            const isTablet =
                /iPad|Android(?!.*Mobile)/i.test(userAgent) ||
                (navigator.maxTouchPoints > 0 && window.innerWidth >= 768);
            const isSmallScreen = window.innerWidth < 768;
            const isMobilePhoneDevice = isMobile && !isTablet && isSmallScreen;
            setIsMobilePhone(isMobilePhoneDevice);
        };

        detectMobilePhone();
        window.addEventListener("resize", detectMobilePhone);
        return () => window.removeEventListener("resize", detectMobilePhone);
    }, []);

    const getDeviceType = () => {
        const userAgent =
            navigator.userAgent || navigator.vendor || window.opera;
        if (/iPhone|iPod/i.test(userAgent)) return "iphone";
        if (/Android/i.test(userAgent)) return "android";
        return "other";
    };

    const handleRegisterRedirect = () => {
        window.location.href = "/register";
    };

    const maskEmail = (email) => {
        if (!email) return "";
        const [localPart, domain] = email.split("@");
        const maskedLocal =
            localPart.charAt(0) +
            "*".repeat(Math.max(localPart.length - 2, 1)) +
            localPart.charAt(localPart.length - 1);
        return `${maskedLocal}@${domain}`;
    };

    const maskName = (name) => {
        if (!name) return "";
        const parts = name.split(" ");
        return parts
            .map((part) => {
                if (part.length <= 1) return part;
                return part.charAt(0) + "*".repeat(part.length - 1);
            })
            .join(" ");
    };

    return {
        handleRegisterRedirect,
        maskName,
        maskEmail,
        isMobilePhone,
        showMobileNotice,
        isStandalonePWA,
        getDeviceType,
        setShowMobileNotice,
    };
}
