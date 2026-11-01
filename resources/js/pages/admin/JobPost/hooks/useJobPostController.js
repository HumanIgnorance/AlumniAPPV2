import useJobPostState from "~/pages/admin/JobPost/hooks/useJobPostState";
import useJobPostDraft from "~/pages/admin/JobPost/hooks/useJobPostDraft";
import useJobPostData from "~/pages/admin/JobPost/hooks/useJobPostData";
import useJobPostLoaders from "~/pages/admin/JobPost/hooks/useJobPostLoaders";
import useJobPostForm from "~/pages/admin/JobPost/hooks/useJobPostForm";
import useApplications from "~/pages/admin/JobPost/hooks/useApplications";
import useApplicationDraft from "~/pages/admin/JobPost/hooks/useApplicationDraft";
import useJobPostActions from "~/pages/admin/JobPost/hooks/useJobPostActions";

/**
 * All state, effects and handlers of the Job Posts page. Each sub-hook gets what
 * the hooks above it produced (ctx) and adds its own values, so order matters.
 * The result is shared with every part through JobPostContext.
 */
export default function useJobPostController() {
    const ctx = {};
    Object.assign(ctx, useJobPostState());
    Object.assign(ctx, useJobPostDraft(ctx));
    Object.assign(ctx, useJobPostData(ctx));
    useJobPostLoaders(ctx);
    Object.assign(ctx, useJobPostForm(ctx));
    Object.assign(ctx, useApplications(ctx));
    Object.assign(ctx, useApplicationDraft(ctx));
    Object.assign(ctx, useJobPostActions(ctx));
    return ctx;
}
