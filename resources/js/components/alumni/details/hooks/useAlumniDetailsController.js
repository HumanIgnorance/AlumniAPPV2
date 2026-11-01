import useDetailsAccess from "~/components/alumni/details/hooks/useDetailsAccess";
import useDetailsData from "~/components/alumni/details/hooks/useDetailsData";
import useDetailsUploads from "~/components/alumni/details/hooks/useDetailsUploads";

/**
 * All state, effects and handlers of the AlumniDetails page. Each sub-hook gets what
 * the hooks above it produced (ctx) and adds its own values, so order matters.
 * The result is shared with every part through AlumniDetailsContext.
 */
export default function useAlumniDetailsController(props) {
    const ctx = {};
    Object.assign(ctx, props);
    Object.assign(ctx, useDetailsAccess(ctx));
    Object.assign(ctx, useDetailsData(ctx));
    Object.assign(ctx, useDetailsUploads(ctx));
    return ctx;
}
