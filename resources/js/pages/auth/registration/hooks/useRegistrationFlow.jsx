import { Modal, message } from "antd";
import secureLocalStorage from "react-secure-storage";
import axios from "~/utils/axiosConfig";
import { BASE_URL } from "~/utils/constant";

const UPLOAD_MSG_KEY = "registration-upload";

export default function useRegistrationFlow({
    form,
    setCurrentStep,
    currentStep,
    setIsAgreementModalVisible,
    courses,
    profileImage,
    idDocuments,
    setPreviewData,
    setIsModalVisible,
    steps,
    setLoading,
    dataURLToBlobSync,
    STORAGE_KEY,
    setProfileImage,
    setIdDocuments,
}) {
    const handleNext = () => {
        form.validateFields()
            .then(() => {
                setCurrentStep(currentStep + 1);
            })
            .catch((errorInfo) => {
                // Required fields not filled — antd already paints them red.
                // Scroll to the first invalid field and show a message.
                if (
                    errorInfo &&
                    errorInfo.errorFields &&
                    errorInfo.errorFields.length > 0
                ) {
                    const firstField = errorInfo.errorFields[0].name;
                    try {
                        form.scrollToField(firstField, {
                            behavior: "smooth",
                            block: "center",
                        });
                    } catch (e) {
                        // no-op
                    }
                    message.error(
                        "Please fill out all required fields highlighted in red before continuing.",
                    );
                }
            });
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handlePreview = async () => {
        // Check if agreement checkbox is checked
        const agreementValue = form.getFieldValue("agreement");
        if (!agreementValue) {
            setIsAgreementModalVisible(true);
            return;
        }

        setCurrentStep("all");
        setTimeout(() => {
            previewShow();
        }, 100);
    };

    const previewShow = async () => {
        const values = await form.validateFields();

        // Resolve the course_code from the courses list so AlumniDetails
        // can pick the correct header colour theme immediately.
        const selectedCourse = Array.isArray(courses)
            ? courses.find((c) => c.id === values.course_id)
            : null;
        const resolvedCourseCode = selectedCourse?.course_code || "";

        const previewData = {
            // Personal Information
            first_name: values.first_name,
            last_name: values.last_name,
            middle_name: values.middle_name,
            suffix: values.suffix,
            email: values.email,
            phone: values.phone,
            address: values.address,
            birth_date: values.birth_date
                ? values.birth_date.format("YYYY-MM-DD")
                : null,
            gender: values.gender,
            bio: values.bio,

            // Academic Information
            course_id: values.course_id,
            // Pass the resolved code so AlumniDetails theme lookup works
            // even before the server echoes back a nested course object.
            course_code: resolvedCourseCode,
            studentId: values.studentId,
            graduationYear: values.graduationYear,
            enrollmentYear: values.enrollmentYear,
            honors: values.honors || [],
            thesisTitle: values.thesisTitle,
            academicAchievements: values.academicAchievements,
            extracurricular: values.extracurricular,
            continueEducation: values.continueEducation,

            // Career Information
            employment_status_id: values.employment_status_id,
            currentCompany: values.currentCompany,
            jobTitle: values.jobTitle,
            industry: values.industry,
            yearsExperience: values.yearsExperience,
            salaryRange: values.salaryRange,
            workLocation: values.workLocation,
            careerGoals: values.careerGoals,
            previousCompanies: values.previousCompanies,

            // Social media
            linkedin: values.linkedin,
            github: values.github,
            portfolio: values.portfolio,
            twitter: values.twitter,

            // Preferences
            newsletter: values.newsletter,
            contactPermission: values.contactPermission,
            agreement: values.agreement,

            // Files
            profileImage,
            idDocuments,
        };
        setPreviewData(previewData);
        setIsModalVisible(true);
    };

    const calculateProgress = () => {
        // The preview/"all" view is not a numeric step: treat it as complete.
        if (typeof currentStep !== "number") return 100;
        return Math.min(100, ((currentStep + 1) / steps.length) * 100);
    };

    const handleSubmit = async () => {
        let loadingMessage = null;

        try {
            setLoading(true);

            // Validate all form fields first
            const values = await form.validateFields();

            // Additional validation for documents
            if (!profileImage) {
                message.error("Please upload a profile photo");
                return;
            }

            if (idDocuments.length === 0) {
                message.error("Please upload at least one ID document");
                return;
            }

            // Show loading message
            loadingMessage = message.loading({
                content: "Submitting your application...",
                key: UPLOAD_MSG_KEY,
                duration: 0,
            });

            const formData = new FormData();

            // Append all form fields with proper snake_case formatting
            const allFormValues = form.getFieldsValue(true);

            // Map field names from camelCase to snake_case
            const fieldMappings = {
                // Personal Information
                firstName: "first_name",
                lastName: "last_name",
                middleName: "middle_name",
                birthDate: "birth_date",
                profileImage: "profile_image",

                // Academic Information
                studentId: "student_id",
                graduationYear: "graduation_year",
                enrollmentYear: "enrollment_year",
                thesisTitle: "thesis_title",
                academicAchievements: "academic_achievements",
                continueEducation: "continue_education",

                // Career Information
                employmentStatus: "employment_status",
                currentCompany: "current_company",
                jobTitle: "job_title",
                yearsExperience: "years_experience",
                salaryRange: "salary_range",
                workLocation: "work_location",
                careerGoals: "career_goals",
                previousCompanies: "previous_companies",

                // Skills
                technicalSkills: "technical_skills",
                softSkills: "soft_skills",
                volunteerInterests: "volunteer_interests",
                willingToMentor: "willing_to_mentor",
                professionalInterests: "professional_interests",

                // Agreements
                contactPermission: "contact_permission",
            };

            // Format birthDate specifically
            const formattedValues = {
                ...allFormValues,
                birth_date: allFormValues.birth_date
                    ? allFormValues.birth_date.format("YYYY-MM-DD")
                    : null,
            };

            // Process each field
            Object.keys(formattedValues).forEach((key) => {
                const value = formattedValues[key];
                const snakeCaseKey = fieldMappings[key] || key;

                if (value === undefined || value === null || value === "") {
                    return; // Skip empty values
                }

                if (Array.isArray(value)) {
                    // Handle array fields (like honors, skills, etc.)
                    value.forEach((item, index) => {
                        if (item && item !== "") {
                            formData.append(
                                `${snakeCaseKey}[${index}]`,
                                item.toString(),
                            );
                        }
                    });
                } else if (typeof value === "boolean") {
                    // Handle boolean fields
                    formData.append(snakeCaseKey, value ? "1" : "0");
                } else if (typeof value === "object") {
                    // Handle object fields (stringify them)
                    try {
                        formData.append(snakeCaseKey, JSON.stringify(value));
                    } catch (error) {
                        console.warn(
                            `Could not stringify field ${snakeCaseKey}:`,
                            error,
                        );
                        formData.append(snakeCaseKey, value.toString());
                    }
                } else {
                    // Handle string/number fields
                    formData.append(snakeCaseKey, value.toString());
                }
            });

            // Append profile image
            if (profileImage) {
                try {
                    let profileBlob;
                    if (profileImage.startsWith("data:")) {
                        profileBlob = dataURLToBlobSync(profileImage);
                    } else {
                        profileBlob = profileImage;
                    }
                    formData.append(
                        "profile_image",
                        profileBlob,
                        "profile.jpg",
                    );
                } catch (error) {
                    console.error("Error processing profile image:", error);
                    throw new Error("Error processing profile image");
                }
            }

            // Append ID documents with metadata
            idDocuments.forEach((doc, index) => {
                try {
                    let documentBlob;

                    if (doc.url && doc.url.startsWith("data:")) {
                        documentBlob = dataURLToBlobSync(doc.url);
                    } else if (doc.file) {
                        documentBlob = doc.file;
                    } else {
                        console.warn(
                            `Document ${doc.type} has no valid file data`,
                        );
                        return;
                    }

                    // Append the actual file
                    formData.append(
                        `documents[${index}][file]`,
                        documentBlob,
                        doc.name || `document_${index}.jpg`,
                    );

                    // Append document metadata
                    formData.append(`documents[${index}][type]`, doc.type);
                    formData.append(
                        `documents[${index}][name]`,
                        doc.name || `document_${index}`,
                    );
                } catch (error) {
                    console.error(
                        `Error processing document ${doc.type}:`,
                        error,
                    );
                }
            });

            // Debug: Log form data (optional - remove in production)
            if (import.meta.env.DEV) {
                // console.log("FormData contents:")
                for (const [key, value] of formData.entries()) {
                    if (key.includes("file") || key.includes("image")) {
                        // console.log(key, `[File: ${value.name || "Blob"}]`)
                    } else {
                        // console.log(key, value)
                    }
                }
            }

            // Submit the form
            const response = await axios.post(
                BASE_URL + "api/alumni/register",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 60000, // 60 seconds timeout
                    onUploadProgress: (progressEvent) => {
                        // total can be undefined (e.g. compressed bodies)
                        if (!progressEvent.total) return;
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        );

                        // Update the SAME keyed message in place (no flicker,
                        // and no destroying unrelated messages).
                        if (percentCompleted < 100) {
                            message.loading({
                                content: `Uploading... ${percentCompleted}%`,
                                key: UPLOAD_MSG_KEY,
                                duration: 0,
                            });
                        }
                    },
                },
            );

            // Clear loading message
            if (loadingMessage) {
                message.destroy(UPLOAD_MSG_KEY);
            }

            if (response.data.success) {
                message.success(
                    response.data.message ||
                        "Alumni registration submitted successfully!",
                );

                secureLocalStorage.removeItem(STORAGE_KEY);

                // Reset form state
                form.resetFields();
                setProfileImage(null);
                setIdDocuments([]);
                setCurrentStep(0);
                setIsModalVisible(false);

                // Show success message with application ID if available
                if (response.data.application_id) {
                    Modal.success({
                        title: "Registration Successful!",
                        content: (
                            <div>
                                <p className="ant-typography">
                                    Your alumni registration has been submitted
                                    successfully.
                                </p>
                                <p className="ant-typography">
                                    <strong>Application ID:</strong>{" "}
                                    {response.data.application_id}
                                </p>
                                <p className="ant-typography">
                                    You will receive a confirmation email
                                    shortly.
                                </p>
                            </div>
                        ),
                        onOk() {
                            // Optional: Redirect to success page or dashboard
                            // console.log("Application ID:", response.data.application_id)
                        },
                    });
                }
            } else {
                message.error(
                    response.data.message ||
                        "Submission failed. Please try again.",
                );
            }
        } catch (error) {
            // Clear any existing loading messages
            if (loadingMessage) {
                message.destroy(UPLOAD_MSG_KEY);
            }

            console.error("Submission error:", error);

            // Handle different types of errors
            if (error.errorFields) {
                // Form validation errors
                const firstError = error.errorFields[0];
                message.error(`Please check: ${firstError.errors[0]}`);

                // Optional: Scroll to the first error field
                const errorElement = document.querySelector(
                    ".ant-form-item-has-error",
                );
                if (errorElement) {
                    errorElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            } else if (error.response) {
                // Server responded with error status
                const serverError = error.response.data;

                const status = error.response.status;
                if (status === 413) {
                    message.error(
                        "File size too large. Please upload smaller files.",
                    );
                } else if (status === 429) {
                    message.error("Too many requests. Please try again later.");
                } else if (serverError?.errors) {
                    // Laravel validation errors: show the first one
                    const firstErrorKey = Object.keys(serverError.errors)[0];
                    message.error(serverError.errors[firstErrorKey][0]);
                } else if (status >= 500) {
                    message.error(
                        serverError?.message ||
                            "Server error. Please try again later.",
                    );
                } else {
                    message.error(
                        serverError?.message ||
                            serverError?.error ||
                            "Server error occurred. Please try again.",
                    );
                }
            } else if (error.request) {
                // Network error - no response received
                message.error(
                    "Network error. Please check your internet connection and try again.",
                );
                console.error("Network error details:", error.request);
            } else if (error.code === "ECONNABORTED") {
                // Timeout error
                message.error("Request timeout. Please try again.");
            } else if (error.message) {
                // Other errors with message
                message.error(error.message);
            } else {
                // Unknown error
                message.error(
                    "An unexpected error occurred. Please try again.",
                );
            }

            // Log detailed error for debugging
            console.error("Detailed error:", {
                message: error.message,
                stack: error.stack,
                response: error.response?.data,
                status: error.response?.status,
            });
        } finally {
            // Always execute - clean up loading states
            setLoading(false);

            // Ensure loading message is cleared
            if (loadingMessage) {
                message.destroy(UPLOAD_MSG_KEY);
            }

            // Clear any other loading states if needed
            // console.log("Form submission process completed")
        }
    };

    return {
        handlePreview,
        calculateProgress,
        handlePrev,
        handleNext,
        handleSubmit,
    };
}
