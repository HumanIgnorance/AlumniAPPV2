import React from "react";
import { AlumniDetailsProvider } from "./details/AlumniDetailsContext";
import useAlumniDetailsController from "./details/hooks/useAlumniDetailsController";
import AlumniDetailsDrawer from "./details/parts/AlumniDetailsDrawer";
import DetailsZoomModal from "./details/parts/DetailsZoomModal";
import { alumniDetailsCss } from "./AlumniDetails.styles";

/**
 * Alumni profile / registration preview drawer.
 *   details/hooks/  access rules, derived data, uploads
 *   details/parts/  header, main + sidebar columns, notices, zoom modal
 *   AlumniDetails.styles.js  the page styles (was a 900-line <style> block here)
 */
const AlumniDetails = ({
    visible,
    onCancel,
    onSubmit,
    previewData,
    loading = false,
    viewOnly = false,
    refetchAlumni,
    viewOwnProfile = false, // when true, alumni can see their own full details
}) => {
    const ctx = useAlumniDetailsController({
        visible,
        onCancel,
        onSubmit,
        previewData,
        loading,
        viewOnly,
        refetchAlumni,
        viewOwnProfile,
    });

    if (!previewData) return null;

    return (
        <AlumniDetailsProvider value={ctx}>
            <AlumniDetailsDrawer />
            <DetailsZoomModal />
            <style jsx>{alumniDetailsCss}</style>
        </AlumniDetailsProvider>
    );
};

export default AlumniDetails;
