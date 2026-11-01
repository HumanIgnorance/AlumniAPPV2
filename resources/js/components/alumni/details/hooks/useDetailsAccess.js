import React, { useState } from "react";
import { ROLES } from "~/config/roles";
import axios from "~/utils/axiosConfig";
import { getUserRole } from "~/utils/session";

export default function useDetailsAccess({
    viewOwnProfile,
    previewData,
    visible,
    refetchAlumni,
}) {
    const [zoomImage, setZoomImage] = useState(null);

    const [zoomVisible, setZoomVisible] = useState(false);

    const [uploadLoading, setUploadLoading] = useState(false);

    const [zoomDocumentType, setZoomDocumentType] = useState(null);

    const [localDocuments, setLocalDocuments] = useState([]);

    const [localProfileImage, setLocalProfileImage] = useState(null);

    const role = getUserRole();

    const isAdmin = role === ROLES.ADMIN;

    // NEW: Determine if full details should be shown (admin OR viewing own profile)
    const canViewFullDetails = isAdmin || viewOwnProfile;

    // Sync local state with previewData when it changes.
    // NOTE: the parent passes the image as `profileImage` (no underscore),
    // so we watch that field – not `profile_image` – to avoid a stale sync.
    React.useEffect(() => {
        if (previewData?.idDocuments) {
            setLocalDocuments(previewData.idDocuments);
        }
        // Accept both field name shapes so this works regardless of caller
        const img = previewData?.profileImage || previewData?.profile_image;
        if (img) {
            setLocalProfileImage(img);
        }
    }, [
        previewData?.idDocuments,
        previewData?.profileImage,
        previewData?.profile_image,
    ]);

    const alumniId =
        previewData?.id ?? previewData?.alumni_id ?? previewData?.alumni?.id;

    const handleImageZoom = (imageUrl, documentType = null) => {
        setZoomImage(imageUrl);
        setZoomDocumentType(documentType);
        setZoomVisible(true);
    };

    // 🔕 Silent auto-refresh every 1 second
    React.useEffect(() => {
        if (!visible || !alumniId || !refetchAlumni) return;

        const interval = setInterval(async () => {
            try {
                await axios.get(`/admin/alumni/${alumniId}`, {
                    silent: true, // 🔕 NO loading, NO modal
                });

                // re-sync parent data
                await refetchAlumni();
            } catch (err) {
                // fail silently
            }
        }, 1000); // ⏱ 1 second

        return () => clearInterval(interval);
    }, [visible, alumniId, refetchAlumni]);

    return {
        alumniId,
        setUploadLoading,
        setZoomVisible,
        setLocalDocuments,
        setLocalProfileImage,
        localProfileImage,
        handleImageZoom,
        canViewFullDetails,
        localDocuments,
        isAdmin,
        uploadLoading,
        zoomVisible,
        zoomImage,
        zoomDocumentType,
    };
}
