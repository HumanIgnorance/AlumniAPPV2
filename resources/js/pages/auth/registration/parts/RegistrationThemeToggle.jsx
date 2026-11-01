import React from "react";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";

export default function RegistrationThemeToggle() {
    const { toggleTheme, currentTheme } = useRegistrationContext();

    return (
        <div className="page-theme-toggle">
            <button
                type="button"
                className="page-theme-toggle__btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                {currentTheme === "black" ? <MoonOutlined /> : <SunOutlined />}
            </button>
        </div>
    );
}
