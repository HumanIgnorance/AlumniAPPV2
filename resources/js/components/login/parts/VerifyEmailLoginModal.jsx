import React from "react";
import { message } from "antd";
import VerifyEmailModal from "~/components/shared/VerifyEmailModal";
import { useLoginContext } from "~/components/login/LoginContext";

/** Shown when sign-in is refused because the alumnus has not verified their email yet. */
export default function VerifyEmailLoginModal() {
    const { verifyModalOpen, setVerifyModalOpen, verifyEmail } = useLoginContext();

    return (
        <VerifyEmailModal
            open={verifyModalOpen}
            email={verifyEmail}
            onVerified={() => {
                setVerifyModalOpen(false);
                message.success("Email verified. Your registration now waits for administrator approval.", 6);
            }}
            onClose={() => setVerifyModalOpen(false)}
        />
    );
}
