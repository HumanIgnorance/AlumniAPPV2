import React from "react";
import AlumniDetails from "~/components/alumni/AlumniDetails";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";

export default function RegistrationPreview() {
    const {
        isModalVisible,
        setCurrentStep,
        setIsModalVisible,
        handleSubmit,
        previewData,
        loading,
    } = useRegistrationContext();

    return (
        <AlumniDetails
            visible={isModalVisible}
            onCancel={() => {
                setCurrentStep(4);
                setIsModalVisible(false);
            }}
            onSubmit={handleSubmit}
            previewData={previewData}
            loading={loading}
            viewOwnProfile={true}
        />
    );
}
