import React from "react";
import SettingsMenu from "~/components/SettingsMenu";
import { useLoginContext } from "~/components/login/LoginContext";

// Theme switcher — now rendered as a settings gear icon that opens a
// dropdown (theme toggle + FAQ + About). The theme toggle logic itself
// (handleThemeToggle/currentTheme above) is untouched — it's just passed
// down as props, so there is a single source of truth and no risk of
// desyncing/duplicating the toggle behaviour.
export default function ThemeSwitcher() {
    const { currentTheme, handleThemeToggle } = useLoginContext();

    return (
        <SettingsMenu
            currentTheme={currentTheme}
            onThemeToggle={handleThemeToggle}
        />
    );
}
