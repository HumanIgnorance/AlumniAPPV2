import React from "react";
import { MobileOutlined } from "@ant-design/icons";
import { useLoginContext } from "~/components/login/LoginContext";

/* =========================================================
     MOBILE NOTICE
     ========================================================= */
export default function MobilePhoneNotice() {
    const {
        isMobilePhone,
        showMobileNotice,
        isStandalonePWA,
        getDeviceType,
        setShowMobileNotice,
    } = useLoginContext();

    if (!isMobilePhone || !showMobileNotice || isStandalonePWA) return null;
    const deviceType = getDeviceType();

    return (
        <div className="mobile-notice-overlay">
            <div className="mobile-notice-card">
                <div className="icon-circle">
                    <MobileOutlined />
                </div>
                <h3>📱 Mobile Device Detected</h3>

                <div className="info-box">
                    {deviceType === "iphone" ? (
                        <>
                            <p className="label">🍎 iPhone User</p>
                            <p className="body">
                                For the best experience and to see all features,
                                please{" "}
                                <strong>
                                    rotate your phone to landscape mode
                                </strong>{" "}
                                (horizontal orientation).
                            </p>
                            <p className="body">
                                Or install ATMS as an app: tap the{" "}
                                <strong>Share</strong> icon in Safari's toolbar,
                                then <strong>Add to Home Screen</strong>. This
                                notice won't show again once it's installed.
                            </p>
                        </>
                    ) : deviceType === "android" ? (
                        <>
                            <p className="label">🤖 Android User</p>
                            <p className="body">
                                For the best experience and to see all features,
                                please <strong>request desktop site</strong>{" "}
                                from your browser menu (tap the three dots →
                                "Desktop site").
                            </p>
                            <p className="body">
                                Or install ATMS as an app: tap the{" "}
                                <strong>⋮ (three dots)</strong> menu in Chrome,
                                then scroll down and tap{" "}
                                <strong>Install ATMS</strong>. This notice won't
                                show again once it's installed.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="label">📱 Mobile User</p>
                            <p className="body">
                                For the best experience, please use{" "}
                                <strong>landscape mode</strong> or{" "}
                                <strong>request desktop site</strong> from your
                                browser to see all features.
                            </p>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    className="login-btn-primary"
                    onClick={() => setShowMobileNotice(false)}
                    style={{ width: "100%" }}
                >
                    Got it, Continue
                </button>

                <p className="hint">
                    This notice only appears on mobile phones.
                </p>
            </div>
        </div>
    );
}
