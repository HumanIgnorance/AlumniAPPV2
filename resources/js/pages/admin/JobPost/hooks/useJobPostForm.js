import { useCallback } from "react";
import { Modal, Upload, message } from "antd";
import { ROLES } from "~/config/roles";
import { VALID_ID_TYPES } from "~/pages/admin/JobPost/parts/jobPostConstants";
import { clearJobPostDraft } from "~/pages/admin/JobPost/parts/jobPostStorage";
import {
    buildImageUrl,
    getAuthHeaders,
} from "~/pages/admin/JobPost/parts/jobPostUtils";
import axios from "~/utils/axiosConfig";

export default function useJobPostForm({
    bannerFileListRef,
    setFileList,
    editingPost,
    draftSaveTimerRef,
    persistDraftNow,
    setIdDocuments,
    setOtherDocuments,
    idDocuments,
    userRole,
    setPendingFormValues,
    setSubmitWarningModalVisible,
    setJobPostSubmitLoading,
    setDraftLastSaved,
    setIsModalVisible,
    setEditingPost,
    form,
    setLastCreatedJob,
    setSuccessModalVisible,
    setJobPosts,
    fetchJobPosts,
    setMyPostings,
    fetchMyPostings,
    handleApiError,
    fileList,
    fetchFullOrExpiredPosts,
    fetchPendingPosts,
    setRejectJobPostId,
    setRejectJobPostNotes,
    setRejectJobPostModalVisible,
    rejectJobPostNotes,
    setRejectJobPostLoading,
    rejectJobPostId,
}) {
    // ============ IMAGE UPLOAD HANDLERS (SAME AS AlumniEvents.js) ============
    const handleUploadChange = useCallback(
        ({ fileList: newFileList }) => {
            bannerFileListRef.current = newFileList;
            setFileList(newFileList);
            // ENHANCEMENT: persist draft when banner changes (new posts only)
            if (!editingPost) {
                if (draftSaveTimerRef.current)
                    clearTimeout(draftSaveTimerRef.current);
                draftSaveTimerRef.current = setTimeout(
                    () => persistDraftNow(),
                    400,
                );
            }
        },
        [editingPost, persistDraftNow],
    );

    const handleBeforeUpload = useCallback((file) => {
        try {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                message.error("You can only upload image files!");
                return Upload.LIST_IGNORE;
            }
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error("Image must be smaller than 5MB!");
                return Upload.LIST_IGNORE;
            }
            return false;
        } catch (error) {
            console.error("Error in beforeUpload:", error);
            return Upload.LIST_IGNORE;
        }
    }, []);

    // ============ ID DOCUMENT UPLOAD HANDLERS ============
    const handleIdDocumentAdd = useCallback(() => {
        setIdDocuments((prev) => [...prev, { type: "", fileList: [] }]);
    }, []);

    const handleIdDocumentRemove = useCallback((index) => {
        setIdDocuments((prev) => {
            const newDocs = [...prev];
            newDocs.splice(index, 1);
            return newDocs;
        });
    }, []);

    const handleIdDocumentTypeChange = useCallback((index, value) => {
        setIdDocuments((prev) => {
            const newDocs = [...prev];
            newDocs[index] = { ...newDocs[index], type: value };
            return newDocs;
        });
    }, []);

    const handleIdDocumentFileChange = useCallback((index, { fileList }) => {
        setIdDocuments((prev) => {
            const newDocs = [...prev];
            newDocs[index] = { ...newDocs[index], fileList };
            return newDocs;
        });
    }, []);

    const handleOtherDocumentsChange = useCallback(({ fileList }) => {
        setOtherDocuments(fileList);
    }, []);

    // Validate ID documents - at least 2 required
    const validateIdDocuments = useCallback(() => {
        try {
            const validDocs = idDocuments.filter(
                (doc) => doc.type && doc.fileList.length > 0,
            );
            return validDocs.length >= 2;
        } catch (error) {
            console.error("Error validating ID documents:", error);
            return false;
        }
    }, [idDocuments]);

    // Get available ID types (exclude already selected ones)
    const getAvailableIdTypes = useCallback(
        (currentIndex) => {
            try {
                const selectedTypes = idDocuments
                    .filter((_, idx) => idx !== currentIndex)
                    .map((doc) => doc.type)
                    .filter(Boolean);
                return VALID_ID_TYPES.filter(
                    (type) => !selectedTypes.includes(type.value),
                );
            } catch (error) {
                console.error("Error getting available ID types:", error);
                return VALID_ID_TYPES;
            }
        },
        [idDocuments],
    );

    // ============ FORM SUBMIT WITH IMAGE - WITH WARNING MODAL FOR ALUMNI ============
    const handleFormSubmit = useCallback(
        async (values) => {
            // If alumni is creating a NEW post (not editing), show warning modal first
            if (userRole !== ROLES.ADMIN && !editingPost) {
                setPendingFormValues(values);
                setSubmitWarningModalVisible(true);
                return;
            }

            // Continue with actual submission
            await performFormSubmit(values);
        },
        [userRole, editingPost],
    );

    // ============ FIX: Actual form submission logic - Updated to properly handle image and refresh ============
    const performFormSubmit = useCallback(
        async (values) => {
            setJobPostSubmitLoading(true);
            try {
                const formData = new FormData();

                formData.append("title", values.title);
                formData.append("description", values.description);
                formData.append("company", values.company);
                formData.append("requirements", values.requirements);
                formData.append("job_type", values.job_type);
                formData.append("location", values.location || "");
                formData.append("salary_min", values.salary_min || "");
                formData.append("salary_max", values.salary_max || "");

                // Handle capacity
                if (values.capacity) {
                    formData.append("capacity", values.capacity);
                }

                // Handle expiration days
                if (values.expiration_days) {
                    formData.append("expiration_days", values.expiration_days);
                }

                formData.append(
                    "reference_source_type",
                    values.reference_source_type ?? "",
                );
                formData.append("reference_url", values.reference_url ?? "");
                formData.append(
                    "verification_notes",
                    values.verification_notes ?? "",
                );

                const currentBannerList = bannerFileListRef.current || [];
                const firstItem = currentBannerList[0];

                // antd Upload stores the real File here
                const bannerFile = firstItem?.originFileObj;

                if (bannerFile instanceof File) {
                    formData.append(
                        "banner_image",
                        bannerFile,
                        bannerFile.name,
                    );
                }
                // If editing and only URL exists (no originFileObj), do nothing (keeps old image)
                // ===============================================================

                let response;
                if (editingPost) {
                    // Update existing post
                    response = await axios.post(
                        `/job-posts/${editingPost.id}?_method=PUT`,
                        formData,
                        {
                            headers: {
                                ...getAuthHeaders(),
                            },
                        },
                    );
                } else {
                    // Create new post
                    response = await axios.post("/job-posts", formData, {
                        headers: {
                            ...getAuthHeaders(),
                        },
                    });
                }

                message.success(
                    userRole === ROLES.ADMIN
                        ? "Job post saved!"
                        : "Job post submitted for approval!",
                );

                // ENHANCEMENT: capture created job + clear draft + show success modal (new posts only)
                const createdJob =
                    response?.data?.data || response?.data || null;
                const wasCreating = !editingPost;
                if (wasCreating) {
                    clearJobPostDraft();
                    setDraftLastSaved(null);
                }

                setIsModalVisible(false);
                setEditingPost(null);
                form.resetFields();
                setFileList([]);
                bannerFileListRef.current = [];

                if (wasCreating && createdJob) {
                    setLastCreatedJob(createdJob);
                    setSuccessModalVisible(true);
                }

                // ============ FIX: Add newly created/updated post immediately ============
                if (response.data) {
                    const newPost = response.data.data || response.data;

                    // Ensure banner_image_url exists for immediate UI rendering
                    if (newPost.banner_image && !newPost.banner_image_url) {
                        newPost.banner_image_url = buildImageUrl(
                            newPost.banner_image,
                        );
                    }

                    if (userRole === ROLES.ADMIN) {
                        if (editingPost) {
                            setJobPosts((prev) =>
                                prev.map((p) =>
                                    p.id === newPost.id ? newPost : p,
                                ),
                            );
                        } else {
                            setJobPosts((prev) => [newPost, ...prev]);
                        }

                        // Sync with backend
                        setTimeout(() => {
                            fetchJobPosts();
                        }, 500);
                    } else {
                        if (editingPost) {
                            setMyPostings((prev) =>
                                prev.map((p) =>
                                    p.id === newPost.id ? newPost : p,
                                ),
                            );
                        } else {
                            setMyPostings((prev) => [newPost, ...prev]);
                        }

                        setTimeout(() => {
                            fetchMyPostings();
                        }, 500);
                    }
                } else {
                    // Fallback
                    if (userRole === ROLES.ADMIN) {
                        fetchJobPosts();
                    } else {
                        fetchMyPostings();
                    }
                }
            } catch (error) {
                handleApiError(error, "Error saving job post");
            } finally {
                setJobPostSubmitLoading(false);
            }
        },
        [
            editingPost,
            fileList,
            form,
            userRole,
            fetchJobPosts,
            fetchMyPostings,
            handleApiError,
        ],
    );

    // Delete job post
    const handleDeletePost = useCallback(
        (postId) => {
            Modal.confirm({
                title: "Delete Job Post",
                content: "Are you sure you want to delete this job post?",
                okText: "Yes",
                cancelText: "No",
                onOk: async () => {
                    try {
                        await axios.delete(`/job-posts/${postId}`, {
                            headers: getAuthHeaders(),
                        });
                        message.success("Job post deleted!");
                        if (userRole === ROLES.ADMIN) {
                            fetchJobPosts();
                            fetchFullOrExpiredPosts();
                        } else {
                            fetchMyPostings();
                            fetchFullOrExpiredPosts();
                        }
                    } catch (error) {
                        handleApiError(error, "Error deleting job post");
                    }
                },
            });
        },
        [
            userRole,
            fetchJobPosts,
            fetchFullOrExpiredPosts,
            fetchMyPostings,
            handleApiError,
        ],
    );

    // Admin: Approve job post - UPDATED: Now sends email notification
    const handleApprovePost = useCallback(
        (postId) => {
            Modal.confirm({
                title: "Approve Job Post",
                content:
                    "Are you sure you want to approve this job post? An email notification will be sent to the alumni who created it.",
                onOk: async () => {
                    try {
                        await axios.post(
                            `/job-posts/${postId}/approve`,
                            {},
                            {
                                headers: getAuthHeaders(),
                            },
                        );
                        message.success(
                            "Job post approved! Email notification sent to the creator.",
                        );
                        fetchPendingPosts();
                        fetchJobPosts();
                    } catch (error) {
                        handleApiError(error, "Error approving job post");
                    }
                },
            });
        },
        [fetchPendingPosts, fetchJobPosts, handleApiError],
    );

    // ============ NEW: Admin: Reject job post - Opens modal for notes ============
    const handleRejectPost = useCallback((postId) => {
        setRejectJobPostId(postId);
        setRejectJobPostNotes("");
        setRejectJobPostModalVisible(true);
    }, []);

    // ============ NEW: Confirm rejection with notes ============
    const confirmRejectJobPost = useCallback(async () => {
        if (!rejectJobPostNotes.trim()) {
            message.error("Please provide a reason for rejection");
            return;
        }
        if (rejectJobPostNotes.trim().length < 10) {
            message.error("Rejection notes must be at least 10 characters");
            return;
        }

        try {
            setRejectJobPostLoading(true);
            await axios.post(
                `/job-posts/${rejectJobPostId}/reject`,
                { admin_notes: rejectJobPostNotes },
                {
                    headers: getAuthHeaders(),
                },
            );
            message.success(
                "Job post rejected! Email notification sent to the creator.",
            );
            setRejectJobPostModalVisible(false);
            setRejectJobPostId(null);
            setRejectJobPostNotes("");
            fetchPendingPosts();
            fetchJobPosts();
        } catch (error) {
            handleApiError(error, "Error rejecting job post");
        } finally {
            setRejectJobPostLoading(false);
        }
    }, [
        rejectJobPostId,
        rejectJobPostNotes,
        fetchPendingPosts,
        fetchJobPosts,
        handleApiError,
    ]);

    return {
        validateIdDocuments,
        handleDeletePost,
        handleApprovePost,
        handleRejectPost,
        confirmRejectJobPost,
        handleFormSubmit,
        handleUploadChange,
        handleBeforeUpload,
        handleIdDocumentRemove,
        handleIdDocumentTypeChange,
        getAvailableIdTypes,
        handleIdDocumentFileChange,
        handleIdDocumentAdd,
        performFormSubmit,
    };
}
