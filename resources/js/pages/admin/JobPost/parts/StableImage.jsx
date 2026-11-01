import { useCallback, useEffect, useRef, useState } from "react";
import { BankOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { COLORS } from "~/config/theme";

// ============ STABLE IMAGE COMPONENT TO PREVENT FLICKERING ============
export const StableImage = ({ src, alt, className, style, fallbackIcon }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imgRef = useRef(null);
    const previousSrc = useRef(src);

    // Only reset loading state if src actually changed
    useEffect(() => {
        if (previousSrc.current !== src) {
            setImageLoaded(false);
            setImageError(false);
            previousSrc.current = src;
        }
    }, [src]);

    const handleLoad = useCallback(() => {
        setImageLoaded(true);
        setImageError(false);
    }, []);

    const handleError = useCallback(() => {
        setImageError(true);
        setImageLoaded(true); // Mark as loaded to remove skeleton
    }, []);

    if (!src || imageError) {
        return (
            <div
                className={`job-card-image-placeholder ${className || ""}`}
                style={style}
            >
                {fallbackIcon || (
                    <BankOutlined
                        style={{ fontSize: 36, color: COLORS.bfbfbf }}
                    />
                )}
            </div>
        );
    }

    return (
        <div style={{ position: "relative", ...style }}>
            {!imageLoaded && (
                <div
                    className={`job-card-image-placeholder ${className || ""}`}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: COLORS.neutral100,
                    }}
                >
                    <Spin size="small" />
                </div>
            )}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={className}
                style={{
                    ...style,
                    opacity: imageLoaded ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                }}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
};
