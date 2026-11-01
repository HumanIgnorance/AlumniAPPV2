import { useEffect, useState } from "react";

// On touch devices (phones/tablets, portrait or landscape), antd Tooltip
// has no real "hover" to leave, so tapping an icon leaves the tooltip
// popup stuck open on top of the page — it never gets a mouseleave to
// close it. Same fix already used in index.js / AlumniList.js: detect
// touch capability and force the tooltip off (trigger=[] / open=false)
// instead of relying on hover, since these devices don't need hover
// tooltips anyway.
export const useIsTouchDevice = () => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const hasTouch =
            typeof window !== "undefined" &&
            ("ontouchstart" in window ||
                (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0));
        setIsTouchDevice(!!hasTouch);
    }, []);

    return isTouchDevice;
};
export default useIsTouchDevice;
