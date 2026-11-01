import React from "react";
import AlumniDetails from "~/components/alumni/AlumniDetails";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";

export default function AlumniDetailsHost() {
    const {
        showAlumniDetailsModal,
        alumniPreviewData,
        closeAlumniDetailsModal,
    } = useMessagesContext();

    return (
        showAlumniDetailsModal &&
        alumniPreviewData && (
            <AlumniDetails
                visible={showAlumniDetailsModal}
                onCancel={closeAlumniDetailsModal}
                previewData={alumniPreviewData}
                viewOnly={true}
            />
        )
    );
}
