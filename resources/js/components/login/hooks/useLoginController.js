import useLoginState from "~/components/login/hooks/useLoginState";
import useLoginStatus from "~/components/login/hooks/useLoginStatus";
import useDeviceInfo from "~/components/login/hooks/useDeviceInfo";
import useForgotPassword from "~/components/login/hooks/useForgotPassword";
import useLoginAnimations from "~/components/login/hooks/useLoginAnimations";

/**
 * All state, effects and handlers of the Login page. Each sub-hook gets what
 * the hooks above it produced (ctx) and adds its own values, so order matters.
 * The result is shared with every part through LoginContext.
 */
export default function useLoginController() {
    const ctx = {};
    Object.assign(ctx, useLoginState());
    Object.assign(ctx, useLoginStatus(ctx));
    Object.assign(ctx, useDeviceInfo());
    Object.assign(ctx, useForgotPassword(ctx));
    Object.assign(ctx, useLoginAnimations(ctx));
    return ctx;
}
