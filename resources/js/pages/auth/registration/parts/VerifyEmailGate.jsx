import React, { useEffect, useState } from "react";
import { message } from "antd";
import Modal from "~/components/shared/AppModal";
import VerifyEmailModal from "~/components/shared/VerifyEmailModal";

export const OPEN_VERIFY_EMAIL_EVENT = "atms:verify-email";

/**
 * Opens the "verify your email" pop-up right after a successful registration.
 * useRegistrationFlow dispatches OPEN_VERIFY_EMAIL_EVENT, which keeps that hook
 * free of extra state wiring.
 */
export default function VerifyEmailGate() {
    const [state, setState] = useState(null); // { email, applicationId, sent }

    useEffect(() => {
        const onOpen = (e) => setState(e.detail || null);
        window.addEventListener(OPEN_VERIFY_EMAIL_EVENT, onOpen);
        return () => window.removeEventListener(OPEN_VERIFY_EMAIL_EVENT, onOpen);
    }, []);

    const finish = (verified) => {
        const appId = state?.applicationId;
        setState(null);
        Modal.success({
            title: verified ? "Email verified" : "Registration submitted",
            centered: true,
            okText: "Go to login",
            content: (
                <div>
                    {appId && (
                        <p>
                            <strong>Application ID:</strong> {appId}
                        </p>
                    )}
                    <p>
                        {verified
                            ? "Your registration now waits for administrator approval. You will be emailed once it is approved."
                            : "Please verify your email before signing in: open the link we emailed you, or sign in to enter the 6-digit code. Your registration also needs administrator approval."}
                    </p>
                </div>
            ),
            onOk: () => {
                window.location.href = "/login";
            },
        });
    };

    return (
        <VerifyEmailModal
            open={!!state}
            email={state?.email}
            initialSent={!!state?.sent}
            onVerified={() => {
                message.success("Email verified.");
                finish(true);
            }}
            onClose={() => finish(false)}
            title="Verify your email to finish registering"
        />
    );
}
