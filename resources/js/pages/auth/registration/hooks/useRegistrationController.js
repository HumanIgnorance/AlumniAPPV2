import useRegistrationState from "~/pages/auth/registration/hooks/useRegistrationState";
import useRegistrationDraft from "~/pages/auth/registration/hooks/useRegistrationDraft";
import useRegistrationUploads from "~/pages/auth/registration/hooks/useRegistrationUploads";
import useRegistrationFlow from "~/pages/auth/registration/hooks/useRegistrationFlow";

/**
 * All state, effects and handlers of the Registration page. Each sub-hook gets what
 * the hooks above it produced (ctx) and adds its own values, so order matters.
 * The result is shared with every part through RegistrationContext.
 */
export default function useRegistrationController() {
    const ctx = {};
    Object.assign(ctx, useRegistrationState());
    Object.assign(ctx, useRegistrationDraft(ctx));
    Object.assign(ctx, useRegistrationUploads(ctx));
    Object.assign(ctx, useRegistrationFlow(ctx));
    return ctx;
}
