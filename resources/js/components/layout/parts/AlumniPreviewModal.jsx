import React from "react";
import AlumniDetails from "~/components/alumni/AlumniDetails";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import axiosConfig from "~/utils/axiosConfig";

export default function AlumniPreviewModal() {
    const {
        alumniDetailsVisible,
        setAlumniDetailsVisible,
        setAlumniPreviewData,
        alumniPreviewData,
        alumniDetailsLoading,
        fetchNotifications,
        refetch,
    } = useLayoutContext();

    return (
        <AlumniDetails
            visible={alumniDetailsVisible}
            onCancel={() => {
                setAlumniDetailsVisible(false);
                setAlumniPreviewData(null);
            }}
            onSubmit={() => {}}
            previewData={alumniPreviewData}
            viewOnly={true}
            loading={alumniDetailsLoading}
            refetchAlumni={async () => {
                // 1. Refresh the bell-notification list
                await fetchNotifications();

                // 2. Refresh the admin's own profile query (useProfile)
                if (refetch) refetch();

                // 3. Re-fetch the ALUMNI record being viewed right now and
                //    push the fresh data (including the new profile image)
                //    back into alumniPreviewData so the drawer updates
                //    immediately — no logout/login required.
                const currentAlumniId =
                    alumniPreviewData?.id ??
                    alumniPreviewData?.alumni_id ??
                    alumniPreviewData?.alumni?.id;

                if (currentAlumniId) {
                    try {
                        const response = await axiosConfig.get(
                            `/alumni/${currentAlumniId}`,
                        );
                        const values = response.data?.data || response.data;

                        setAlumniPreviewData((prev) => ({
                            ...prev,
                            // Update every field that could have changed
                            profileImage:
                                values?.profile_image_url || prev?.profileImage,
                            idDocuments:
                                values?.documents || prev?.idDocuments || [],
                            first_name: values?.first_name ?? prev?.first_name,
                            last_name: values?.last_name ?? prev?.last_name,
                            middle_name:
                                values?.middle_name ?? prev?.middle_name,
                            email: values?.email ?? prev?.email,
                            phone: values?.phone ?? prev?.phone,
                            address: values?.address ?? prev?.address,
                            bio: values?.bio ?? prev?.bio,
                            current_company:
                                values?.current_company ??
                                prev?.current_company,
                            job_title: values?.job_title ?? prev?.job_title,
                            employment_status_id:
                                values?.employment_status_id ??
                                prev?.employment_status_id,
                        }));
                    } catch (_err) {
                        // Fail silently — the local optimistic update in
                        // AlumniDetails already shows the new image.
                    }
                }
            }}
        />
    );
}
