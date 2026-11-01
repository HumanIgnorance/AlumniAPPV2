import React from "react";
import "./FormLogin-styles";
import { LoginProvider } from "./login/LoginContext";
import useLoginController from "./login/hooks/useLoginController";
import MobilePhoneNotice from "./login/parts/MobilePhoneNotice";
import ThemeSwitcher from "./login/parts/ThemeSwitcher";
import LoginPage from "./login/parts/LoginPage";
import ZoomWarningModal from "./login/parts/ZoomWarningModal";
import PendingApprovalModal from "./login/parts/PendingApprovalModal";
import RejectedAccountModal from "./login/parts/RejectedAccountModal";
import LoginSuccessModal from "./login/parts/LoginSuccessModal";

/**
 * Login screen (login, forgot password, find account, reset password).
 *   login/hooks/  state, status messages, device info, password reset flow, animations
 *   login/parts/  one file per form / modal plus the page layout
 */
const Formlogin = () => {
    const ctx = useLoginController();

    return (
        <LoginProvider value={ctx}>
            <MobilePhoneNotice />
            <ThemeSwitcher />
            <LoginPage />
            <ZoomWarningModal />
            <PendingApprovalModal />
            <RejectedAccountModal />
            <LoginSuccessModal />
        </LoginProvider>
    );
};

export default Formlogin;
