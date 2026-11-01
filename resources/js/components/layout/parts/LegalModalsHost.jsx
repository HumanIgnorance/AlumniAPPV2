import React from "react";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import LegalModals from "~/components/layout/LegalModals";

export default function LegalModalsHost() {
    const {
        isPrivacyModalOpen,
        setIsPrivacyModalOpen,
        isTermsModalOpen,
        setIsTermsModalOpen,
    } = useLayoutContext();

    return (
        <LegalModals
            isPrivacyModalOpen={isPrivacyModalOpen}
            setIsPrivacyModalOpen={setIsPrivacyModalOpen}
            isTermsModalOpen={isTermsModalOpen}
            setIsTermsModalOpen={setIsTermsModalOpen}
        />
    );
}
