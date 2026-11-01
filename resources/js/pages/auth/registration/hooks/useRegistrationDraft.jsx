import { useEffect } from "react";
import { WarningOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import secureLocalStorage from "react-secure-storage";
import { COLORS } from "~/config/theme";

export default function useRegistrationDraft({
    profileImage,
    idDocuments,
    form,
    DEFAULT_INITIAL_VALUES,
    setProfileImage,
    setIdDocuments,
    setCurrentStep,
    setSelectedGradYear,
    setIsUnemployed,
    STORAGE_KEY,
    currentStep,
    selectedGradYear,
    isUnemployed,
}) {
    const hasAnyFilledField = () => {
        try {
            // 1) Uploaded profile image or ID documents count as user input
            if (profileImage) return true;
            if (Array.isArray(idDocuments) && idDocuments.length > 0)
                return true;

            const values = form.getFieldsValue(true) || {};

            return Object.entries(values).some(([key, v]) => {
                if (v === null || v === undefined) return false;

                // Ignore unchanged defaults from <Form initialValues={...}>
                if (
                    Object.prototype.hasOwnProperty.call(
                        DEFAULT_INITIAL_VALUES,
                        key,
                    ) &&
                    v === DEFAULT_INITIAL_VALUES[key]
                ) {
                    return false;
                }

                if (typeof v === "string") return v.trim() !== "";
                if (typeof v === "number") return true;
                if (typeof v === "boolean") return v === true;
                if (dayjs.isDayjs && dayjs.isDayjs(v)) return true;
                if (moment.isMoment && moment.isMoment(v)) return true;
                if (Array.isArray(v)) return v.length > 0;
                if (typeof v === "object") {
                    if (Array.isArray(v.fileList)) return v.fileList.length > 0;
                    return Object.keys(v).length > 0;
                }
                return Boolean(v);
            });
        } catch (e) {
            return false;
        }
    };

    const handleBackToLogin = () => {
        if (!hasAnyFilledField()) {
            window.location.href = "/login";
            return;
        }
        Modal.confirm({
            title: (
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <WarningOutlined style={{ color: COLORS.amber500 }} />
                    Discard your registration?
                </span>
            ),
            content: (
                <div style={{ lineHeight: 1.6 }}>
                    <p style={{ margin: 0 }}>
                        You've already filled in some details. If you go back to
                        the login page now,{" "}
                        <strong>
                            all the information you entered will be lost
                        </strong>{" "}
                        and cannot be recovered.
                    </p>
                    <p
                        style={{
                            marginTop: 8,
                            marginBottom: 0,
                            color: COLORS.c5b6677,
                        }}
                    >
                        Are you sure you want to leave and discard your
                        progress?
                    </p>
                </div>
            ),
            icon: null,
            centered: true,
            okText: "Discard & Go to Login",
            okButtonProps: { danger: true },
            cancelText: "Continue Filling Up",
            onOk: () => {
                try {
                    form.resetFields();
                } catch (e) {}
                // Clear the actual draft key used by the auto-save effect (STORAGE_KEY)
                // as well as the legacy key, so "Discard" really discards.
                try {
                    secureLocalStorage.removeItem("alumni-registration-form");
                } catch (e) {}
                try {
                    secureLocalStorage.removeItem("alumni_registration_draft");
                } catch (e) {}
                // Reset local component state so nothing lingers if navigation is intercepted.
                setProfileImage(null);
                setIdDocuments([]);
                setCurrentStep(0);
                setSelectedGradYear(null);
                setIsUnemployed(false);
                window.location.href = "/login";
            },
        });
    };

    // Load saved data on refresh
    useEffect(() => {
        const savedData = secureLocalStorage.getItem(STORAGE_KEY);

        if (savedData) {
            try {
                const parsedData =
                    typeof savedData === "string"
                        ? JSON.parse(savedData)
                        : savedData;

                // Restore form fields
                form.setFieldsValue({
                    ...parsedData.formValues,

                    // restore date properly
                    birth_date: parsedData.formValues?.birth_date
                        ? dayjs(parsedData.formValues.birth_date)
                        : null,
                });

                // Restore states
                if (parsedData.profileImage) {
                    setProfileImage(parsedData.profileImage);
                }

                if (parsedData.idDocuments) {
                    setIdDocuments(parsedData.idDocuments);
                }

                if (parsedData.currentStep !== undefined) {
                    setCurrentStep(parsedData.currentStep);
                }

                if (parsedData.selectedGradYear) {
                    setSelectedGradYear(parsedData.selectedGradYear);
                }

                if (parsedData.isUnemployed !== undefined) {
                    setIsUnemployed(parsedData.isUnemployed);
                }
            } catch (error) {
                console.error("Error loading saved form data:", error);
            }
        }
    }, [form]);

    // Save form automatically whenever fields change
    const saveFormData = () => {
        try {
            const values = form.getFieldsValue(true);

            const dataToSave = {
                formValues: {
                    ...values,

                    // convert dayjs date to string
                    birth_date: values.birth_date
                        ? values.birth_date.format("YYYY-MM-DD")
                        : null,
                },

                profileImage,
                idDocuments,
                currentStep,
                selectedGradYear,
                isUnemployed,
            };

            secureLocalStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

            //     // ADD THIS HERE
            // message.destroy()
            // message.success(
            //   "Your registration data has been automatically saved.",
            //   0.5
            // )
        } catch (error) {
            console.error("Error saving form data:", error);
        }
    };

    // Auto-save when something changes
    useEffect(() => {
        saveFormData();
    }, [
        profileImage,
        idDocuments,
        currentStep,
        selectedGradYear,
        isUnemployed,
    ]);

    return { handleBackToLogin, saveFormData };
}
