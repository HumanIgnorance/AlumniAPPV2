"use client";

import React from "react";
import "./AlumniRegistration-styles";
import AuthAppBar from "~/components/shared/AuthAppBar";
import { InspectGuard } from "~/hooks/usePreventInspect";
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
                {/* Portrait-phone app bar: one shared component, identical on every auth page */}
                <AuthAppBar />
                <InspectGuard />
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
