import { Typography } from "antd";
import { COLORS } from "~/config/theme";

export const { Title, Text, Paragraph } = Typography;

// ============ THEMED MODAL HELPERS ============
// Reusable modal theme that mirrors the rest of the app (white/black).
export const getModalTheme = (theme) => {
    const isDark = theme === "black";
    return {
        backgroundColor: isDark ? COLORS.ink14 : COLORS.white,
        color: isDark ? COLORS.white : COLORS.black,
        border: isDark ? "1px solid #303746" : "1px solid #e2e8f0",
    };
};

// Returns props you can spread onto <Modal/> or Modal.method({...}) calls.
export const getThemedModalProps = (theme) => {
    const isDark = theme === "black";
    const surface = isDark ? COLORS.ink14 : COLORS.white;
    const bodySurface = isDark ? COLORS.c1a1f2b : COLORS.slate50;
    const borderColor = isDark ? COLORS.c303746 : COLORS.slate200;
    return {
        className: isDark
            ? "themed-modal themed-modal--dark"
            : "themed-modal themed-modal--light",
        styles: {
            content: {
                background: surface,
                color: isDark ? COLORS.white : COLORS.black,
                border: `1px solid ${borderColor}`,
                borderRadius: "12px",
                padding: 0,
            },
            header: {
                background: surface,
                borderBottom: `1px solid ${borderColor}`,
            },
            body: {
                background: bodySurface,
                color: isDark ? COLORS.e7ecf3 : COLORS.black,
            },
            footer: {
                background: surface,
                borderTop: `1px solid ${borderColor}`,
            },
            mask: { backdropFilter: "blur(2px)" },
        },
    };
};

// Inline container style for any custom content inside a Modal body.
export const getModalContentStyle = (theme) => ({
    background: theme === "black" ? COLORS.ink14 : COLORS.white,
    color: theme === "black" ? COLORS.white : COLORS.black,
    borderRadius: "12px",
    border: theme === "black" ? "1px solid #303746" : "1px solid #e2e8f0",
    padding: "16px",
});

// ============ END THEMED MODAL HELPERS ============

// ===== Constants for Time Expiration & Auto-Save =====
export const QUIZ_DURATION = 10 * 60;
// 10 minutes (in seconds)
export const STORAGE_KEY = "imageQuizProgress";

export const LOGOUT_COUNTDOWN = 10;
