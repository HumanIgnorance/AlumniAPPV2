import React from "react";
import { Layout } from "~/components";
import "./styles";
import { GalleryProvider } from "./GalleryContext";
import useGalleryController from "./hooks/useGalleryController";
import GalleryHero from "./parts/GalleryHero";
import SelectionActions from "./parts/SelectionActions";
import GalleryFilters from "./parts/GalleryFilters";
import GalleryGridSection from "./parts/GalleryGridSection";
import UploadModal from "./parts/UploadModal";
import EditModal from "./parts/EditModal";
import DeleteModal from "./parts/DeleteModal";
import BulkDeleteModal from "./parts/BulkDeleteModal";
import GalleryLightbox from "./parts/GalleryLightbox";
import CaptionOverlay from "./parts/CaptionOverlay";
import ViewAllLightbox from "./parts/ViewAllLightbox";

/**
 * Gallery page (admin + alumni).
 *   hooks/  state, data loading, upload/edit drafts, create/edit/delete, downloads, view helpers
 *   parts/  hero, filters, grid, every modal and lightbox
 */
const GalleryPage = () => {
    const ctx = useGalleryController();
    const { revealed } = ctx;

    return (
        <GalleryProvider value={ctx}>
            <Layout>
                <div
                    className={`gallery-page ${revealed ? "is-revealed" : ""}`}
                >
                    <div className="gallery-page-container">
                        <GalleryHero />
                        <SelectionActions />
                        <GalleryFilters />
                        <GalleryGridSection />
                        <UploadModal />
                        <EditModal />
                        <DeleteModal />
                        <BulkDeleteModal />
                        <GalleryLightbox />
                        <CaptionOverlay />
                        <ViewAllLightbox />
                    </div>
                </div>
            </Layout>
        </GalleryProvider>
    );
};

export default GalleryPage;
