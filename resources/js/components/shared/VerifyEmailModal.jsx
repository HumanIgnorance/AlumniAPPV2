import React from "react";
import Modal from "~/components/shared/AppModal";
import VerifyEmailPanel from "./VerifyEmailPanel";

/** Pop-up wrapper used by the login screen and the registration success flow. */
export default function VerifyEmailModal({ open, email, initialSent, onVerified, onClose, title = "Verify your email" }) {
    return (
        <Modal
            open={open}
            title={title}
            onCancel={onClose}
            footer={null}
            centered
            destroyOnClose
            maskClosable={false}
            width={420}
            className="verify-email-modal"
        >
            {open && <VerifyEmailPanel email={email} initialSent={initialSent} onVerified={onVerified} />}
        </Modal>
    );
}
