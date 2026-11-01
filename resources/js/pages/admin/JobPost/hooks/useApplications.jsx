import { useCallback } from "react";
import { Modal, message } from "antd";
import { STATUS } from "~/config/status";
import { COLORS } from "~/config/theme";
import { getIdTypeLabel } from "~/pages/admin/JobPost/parts/jobPostHelpers";
import {
    clearApplicationDraft,
    loadApplicationDraft,
} from "~/pages/admin/JobPost/parts/jobPostStorage";
import { getAuthHeaders } from "~/pages/admin/JobPost/parts/jobPostUtils";
import axios from "~/utils/axiosConfig";

export default function useApplications({
    setSelectedJob,
    fetchCurrentAlumniProfile,
    setIdDocuments,
    setOtherDocuments,
    setIsApplicationModalVisible,
    currentUser,
    applicationDraftCtxRef,
    setApplicationFormDirty,
    setApplicationDraftLastSaved,
    setPendingApplicationDraft,
    setApplicationDraftRestoreVisible,
    appForm,
    setJobDetailsVisible,
    fetchJobApplications,
    setRejectApplicationId,
    setRejectApplicationNotes,
    setRejectApplicationModalVisible,
    setApplicationActionLoading,
    selectedJob,
    handleApiError,
    rejectApplicationNotes,
    setRejectApplicationLoading,
    rejectApplicationId,
    idDocuments,
    validateIdDocuments,
    setSubmitApplicationLoading,
    otherDocuments,
    setApplicationSuccessModalVisible,
    fetchMyApplications,
}) {
    // ============ UPDATED: Alumni: Apply for job - Now fetches profile ============
    const handleApplyClick = useCallback(
        (job) => {
            try {
                // Check if job is full or expired before allowing application
                if (job.is_expired) {
                    message.error(
                        "This job post has expired and is no longer accepting applications",
                    );
                    return;
                }
                if (job.is_full) {
                    message.error(
                        "This job post has reached its application capacity limit",
                    );
                    return;
                }
                setSelectedJob(job);
                fetchCurrentAlumniProfile(); // ✅ NEW: Fetch profile when opening modal
                // Reset ID documents state
                setIdDocuments([
                    { type: "", fileList: [] },
                    { type: "", fileList: [] },
                ]); // Start with 2 empty slots
                setOtherDocuments([]);
                setIsApplicationModalVisible(true);
                // ============ ENHANCEMENT: Application Draft Restore ============
                // Track context for auto-save and look for an existing draft.
                try {
                    const uid = currentUser?.id;
                    applicationDraftCtxRef.current = {
                        jobId: job?.id || null,
                        userId: uid || null,
                    };
                    setApplicationFormDirty(false);
                    setApplicationDraftLastSaved(null);
                    const existing = loadApplicationDraft(job?.id, uid);
                    if (
                        existing &&
                        (existing.cover_letter ||
                            (existing._idDocuments &&
                                existing._idDocuments.length) ||
                            (existing._otherDocuments &&
                                existing._otherDocuments.length) ||
                            existing._resume)
                    ) {
                        setPendingApplicationDraft(existing);
                        setApplicationDraftRestoreVisible(true);
                    } else {
                        // Make sure form starts fresh
                        try {
                            appForm.resetFields();
                        } catch {}
                    }
                } catch (draftErr) {
                    console.warn(
                        "Application draft restore check failed:",
                        draftErr,
                    );
                }
            } catch (error) {
                console.error("Error handling apply click:", error);
                message.error("Error opening application form");
            }
        },
        [fetchCurrentAlumniProfile, currentUser, appForm],
    );

    const handleViewDetails = useCallback((job) => {
        setSelectedJob(job);
        setJobDetailsVisible(true);
    }, []);

    const handleReviewApplications = useCallback(
        (job) => {
            setSelectedJob(job);
            fetchJobApplications(job.id);
        },
        [fetchJobApplications],
    );

    // ============ UPDATED: Handle application status update - Now opens modal for rejection ============
    const handleUpdateApplicationStatus = useCallback(
        async (applicationId, status) => {
            if (status === STATUS.REJECTED) {
                // Open rejection modal instead of directly rejecting
                setRejectApplicationId(applicationId);
                setRejectApplicationNotes("");
                setRejectApplicationModalVisible(true);
                return;
            }

            try {
                setApplicationActionLoading((prev) => ({
                    ...prev,
                    [applicationId]: status,
                }));
                await axios.put(
                    `/job-applications/${applicationId}/status`,
                    { status },
                    { headers: getAuthHeaders() },
                );
                message.success(`Application ${status}!`);
                if (selectedJob) {
                    fetchJobApplications(selectedJob.id);
                }
            } catch (error) {
                handleApiError(error, "Error updating application");
            } finally {
                setApplicationActionLoading((prev) => ({
                    ...prev,
                    [applicationId]: null,
                }));
            }
        },
        [selectedJob, fetchJobApplications, handleApiError],
    );

    // ============ NEW: Confirm application rejection with notes ============
    const confirmRejectApplication = useCallback(async () => {
        if (!rejectApplicationNotes.trim()) {
            message.error("Please provide feedback for the applicant");
            return;
        }
        if (rejectApplicationNotes.trim().length < 10) {
            message.error("Feedback must be at least 10 characters");
            return;
        }

        try {
            setRejectApplicationLoading(true);
            await axios.put(
                `/job-applications/${rejectApplicationId}/status`,
                { status: "rejected", admin_feedback: rejectApplicationNotes },
                { headers: getAuthHeaders() },
            );
            message.success(
                "Application rejected! Email notification sent to the applicant.",
            );
            setRejectApplicationModalVisible(false);
            setRejectApplicationId(null);
            setRejectApplicationNotes("");
            if (selectedJob) {
                fetchJobApplications(selectedJob.id);
            }
        } catch (error) {
            handleApiError(error, "Error rejecting application");
        } finally {
            setRejectApplicationLoading(false);
        }
    }, [
        rejectApplicationId,
        rejectApplicationNotes,
        selectedJob,
        fetchJobApplications,
        handleApiError,
    ]);

    // ============ UPDATED: Application Submit with ID Documents ============
    const handleApplicationSubmit = useCallback(
        async (values) => {
            const validationErrors = [];

            // Validate Resume
            if (!values.resume || values.resume.length === 0) {
                validationErrors.push(
                    "Resume is required. Please upload your resume file.",
                );
            }

            // Validate Cover Letter
            if (!values.cover_letter || values.cover_letter.trim() === "") {
                validationErrors.push(
                    "Cover letter is required. Please write a brief introduction about yourself.",
                );
            } else if (values.cover_letter.trim().length < 50) {
                validationErrors.push(
                    "Cover letter must be at least 50 characters long.",
                );
            }

            // Validate ID Documents
            const validDocs = idDocuments.filter(
                (doc) => doc.type && doc.fileList.length > 0,
            );

            if (validDocs.length < 2) {
                validationErrors.push(
                    "At least 2 valid ID documents are required.",
                );
            }

            // Check each ID document
            idDocuments.forEach((doc, index) => {
                const docNum = index + 1;
                if (doc.type && (!doc.fileList || doc.fileList.length === 0)) {
                    validationErrors.push(
                        `ID Document ${docNum}: Please upload the file for "${getIdTypeLabel(doc.type)}".`,
                    );
                }
                if (!doc.type && doc.fileList && doc.fileList.length > 0) {
                    validationErrors.push(
                        `ID Document ${docNum}: Please select an ID type for the uploaded file.`,
                    );
                }
            });

            // Check for duplicate ID types
            const usedTypes = idDocuments
                .filter((d) => d.type)
                .map((d) => d.type);
            const duplicates = usedTypes.filter(
                (type, index) => usedTypes.indexOf(type) !== index,
            );
            if (duplicates.length > 0) {
                validationErrors.push(
                    "Each ID document must be of a different type. You have duplicate ID types selected.",
                );
            }

            // If there are validation errors, show them all in a modal
            if (validationErrors.length > 0) {
                Modal.error({
                    title: "Please fix the following errors before submitting:",
                    content: (
                        <div style={{ maxHeight: 300, overflowY: "auto" }}>
                            <ul style={{ paddingLeft: 20, margin: 0 }}>
                                {validationErrors.map((error, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            marginBottom: 8,
                                            color: COLORS.antdRed,
                                        }}
                                    >
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ),
                    okText: "OK",
                    width: 500,
                });
                return;
            }

            // Validate ID documents
            if (!validateIdDocuments()) {
                message.error("Please upload at least 2 valid ID documents");
                return;
            }

            setSubmitApplicationLoading(true);
            try {
                const formData = new FormData();

                if (values.resume?.[0]) {
                    formData.append("resume", values.resume[0].originFileObj);
                }

                formData.append("cover_letter", values.cover_letter || "");

                // Append ID documents with proper file naming for Laravel validation
                let docCounter = 0;
                idDocuments.forEach((doc) => {
                    if (
                        doc.type &&
                        doc.fileList.length > 0 &&
                        doc.fileList[0].originFileObj
                    ) {
                        formData.append(
                            `id_documents[${docCounter}][type]`,
                            doc.type,
                        );
                        formData.append(
                            `id_documents[${docCounter}][file]`,
                            doc.fileList[0].originFileObj,
                            doc.fileList[0].name,
                        );
                        docCounter++;
                    }
                });

                // Append other documents with proper file naming for Laravel validation
                let otherCounter = 0;
                otherDocuments.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append(
                            `other_documents[${otherCounter}]`,
                            file.originFileObj,
                            file.name,
                        );
                        otherCounter++;
                    }
                });

                await axios.post(
                    `/job-applications/${selectedJob.id}`,
                    formData,
                    {
                        headers: {
                            ...getAuthHeaders(),
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );

                setIsApplicationModalVisible(false);
                appForm.resetFields();
                setIdDocuments([]);
                setOtherDocuments([]);

                // Show success modal
                setApplicationSuccessModalVisible(true);

                // ============ ENHANCEMENT: Clear application draft on success ============
                try {
                    const { jobId, userId } =
                        applicationDraftCtxRef.current || {};
                    clearApplicationDraft(jobId, userId);
                    setApplicationFormDirty(false);
                    setApplicationDraftLastSaved(null);
                    applicationDraftCtxRef.current = {
                        jobId: null,
                        userId: null,
                    };
                } catch (clearErr) {
                    console.warn(
                        "Failed to clear application draft after submit:",
                        clearErr,
                    );
                }

                fetchMyApplications();
            } catch (error) {
                handleApiError(error, "Error submitting application");
            } finally {
                setSubmitApplicationLoading(false);
            }
        },
        [
            selectedJob,
            idDocuments,
            otherDocuments,
            validateIdDocuments,
            appForm,
            fetchMyApplications,
            handleApiError,
        ],
    );

    return {
        handleViewDetails,
        handleReviewApplications,
        handleApplyClick,
        confirmRejectApplication,
        handleUpdateApplicationStatus,
        handleApplicationSubmit,
    };
}
