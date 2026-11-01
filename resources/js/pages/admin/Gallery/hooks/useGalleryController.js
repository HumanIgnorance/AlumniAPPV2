import useGalleryState from "~/pages/admin/Gallery/hooks/useGalleryState";
import useGalleryData from "~/pages/admin/Gallery/hooks/useGalleryData";
import useGalleryDrafts from "~/pages/admin/Gallery/hooks/useGalleryDrafts";
import useGalleryActions from "~/pages/admin/Gallery/hooks/useGalleryActions";
import useGalleryDownloads from "~/pages/admin/Gallery/hooks/useGalleryDownloads";
import useGalleryView from "~/pages/admin/Gallery/hooks/useGalleryView";

/**
 * All state, effects and handlers of the Gallery page. Each sub-hook gets what
 * the hooks above it produced (ctx) and adds its own values, so order matters.
 * The result is shared with every part through GalleryContext.
 */
export default function useGalleryController() {
    const ctx = {};
    Object.assign(ctx, useGalleryState());
    Object.assign(ctx, useGalleryData(ctx));
    Object.assign(ctx, useGalleryDrafts(ctx));
    Object.assign(ctx, useGalleryActions(ctx));
    Object.assign(ctx, useGalleryDownloads(ctx));
    Object.assign(ctx, useGalleryView(ctx));
    return ctx;
}
