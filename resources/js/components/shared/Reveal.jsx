import { useEffect, useRef, useState } from "react";

/**
 * Fade/slide-in once when scrolled into view (uses the .ph-reveal /
 * .is-visible CSS classes from the public pages). The IntersectionObserver
 * is disconnected after first reveal and on unmount.
 */
const Reveal = ({ children, as: As = "div", className = "", threshold = 0.12, ...rest }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold]);

    return (
        <As
            ref={ref}
            className={`ph-reveal ${visible ? "is-visible" : ""} ${className}`}
            {...rest}
        >
            {children}
        </As>
    );
};

export default Reveal;
