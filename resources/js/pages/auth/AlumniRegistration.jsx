"use client";

import React from "react";
import "./AlumniRegistration-styles";
import logo from "~/assets/images/site-logo.png";
import ScrollProgressOrb from "../admin/ScrollProgress/ScrollProgressOrb";
import { RegistrationProvider } from "./registration/RegistrationContext";
import useRegistrationController from "./registration/hooks/useRegistrationController";
import RegistrationThemeToggle from "./registration/parts/RegistrationThemeToggle";
import RegistrationCard from "./registration/parts/RegistrationCard";
import RegistrationPreview from "./registration/parts/RegistrationPreview";
import AgreementModal from "./registration/parts/AgreementModal";
import PrivacyPolicyModal from "./registration/parts/PrivacyPolicyModal";
import TermsOfServiceModal from "./registration/parts/TermsOfServiceModal";

/**
 * Alumni registration wizard (5 steps).
 *   registration/hooks/  state, draft auto-save, uploads, step flow + submit
 *   registration/parts/  one file per step, the card shell and each modal
 */
const AlumniRegistration = () => {
    const ctx = useRegistrationController();

    return (
        <RegistrationProvider value={ctx}>
            <div className="alumni-registration">
                <ScrollProgressOrb />
                {/* Portrait-phone app bar (hidden on desktop / tablet / landscape via CSS) */}
                <header className="auth-appbar">
                    <a href="/PublicHomePage" className="auth-appbar__brand">
                        <img src={logo || "/placeholder.svg"} alt="OCC Alumni Logo" />
                        <span>
                            <span className="auth-appbar__name">ATMS | Alumni Association</span>
                            <span className="auth-appbar__sub">Opol Community College</span>
                        </span>
                    </a>
                </header>
                <RegistrationThemeToggle />
                <RegistrationCard />
                <RegistrationPreview />
                <AgreementModal />
                <PrivacyPolicyModal />
                <TermsOfServiceModal />
            </div>
        </RegistrationProvider>
    );
};

export default AlumniRegistration;
