import { theme as antd } from "antd";
import { BRAND, SEMANTIC } from "~/config/theme";

/**
 * antd ConfigProvider theme for the current app theme ("white" | "black").
 * Values come from SEMANTIC (mirror of css/tokens.css) so antd components,
 * custom CSS and charts all agree. Light keeps its previous look; dark uses
 * antd's dark algorithm with the app's own surfaces instead of hard-coded white.
 */
export function getAntdTheme(mode) {
    const dark = mode === "black";
    const c = dark ? SEMANTIC.dark : SEMANTIC.light;

    return {
        algorithm: dark ? antd.darkAlgorithm : antd.defaultAlgorithm,
        token: {
            colorPrimary: c.accent,
            colorSuccess: c.success,
            colorWarning: c.warning,
            colorError: c.danger,
            colorInfo: c.info,
            colorBgLayout: c.bg,
            colorBgContainer: dark ? c.surface : "#f9fafb",
            colorBgElevated: dark ? c.surface2 : c.surface,
            colorBorder: c.borderStrong,
            colorBorderSecondary: c.border,
            colorText: c.text,
            colorTextSecondary: c.textMuted,
            colorTextPlaceholder: c.textSubtle,
            borderRadius: 8,
            fontSize: 14,
            fontFamily: "var(--font-sans)",
        },
        components: {
            Table: { headerBg: dark ? c.surface2 : "#f3f4f6", borderColor: c.border },
            Input: { colorBgContainer: dark ? c.surface2 : c.surface, borderRadius: 6 },
            Modal: { colorBgElevated: dark ? c.surface : c.surface, borderRadiusLG: 12 },
        },
    };
}

export { BRAND };
