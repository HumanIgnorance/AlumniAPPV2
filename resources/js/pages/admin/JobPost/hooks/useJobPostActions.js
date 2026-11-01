import { useCallback } from "react";
import { Modal, message } from "antd";
import moment from "moment";
import {
    buildImageUrl,
    getAuthHeaders,
} from "~/pages/admin/JobPost/parts/jobPostUtils";
import axios from "~/utils/axiosConfig";

export default function useJobPostActions({
    setWithdrawLoading,
    fetchMyApplications,
    handleApiError,
    currentUser,
    setEditingPost,
    setFileList,
    bannerFileListRef,
    form,
    setIsModalVisible,
}) {
    // Alumni: Withdraw application
    const handleWithdrawApplication = useCallback(
        async (applicationId) => {
            Modal.confirm({
                title: "Withdraw Application",
                content: "Are you sure you want to withdraw this application?",
                onOk: async () => {
                    try {
                        setWithdrawLoading((prev) => ({
                            ...prev,
                            [applicationId]: true,
                        }));
                        await axios.delete(
                            `/job-applications/${applicationId}`,
                            {
                                headers: getAuthHeaders(),
                            },
                        );
                        message.success("Application withdrawn!");
                        fetchMyApplications();
                    } catch (error) {
                        handleApiError(error, "Error withdrawing application");
                    } finally {
                        setWithdrawLoading((prev) => ({
                            ...prev,
                            [applicationId]: false,
                        }));
                    }
                },
            });
        },
        [fetchMyApplications, handleApiError],
    );

    // Check if current user is the creator of the job post
    const isJobCreator = useCallback(
        (job) => {
            try {
                // Validate currentUser exists and has an ID
                if (!currentUser || !currentUser.id) return false;
                if (!job) return false;

                const userId = Number(currentUser.id);
                const creatorId =
                    Number(job.created_by_user_id) || Number(job.user_id);

                // Validate both IDs are valid numbers and not 0
                if (!userId || isNaN(userId) || userId === 0) return false;
                if (!creatorId || isNaN(creatorId) || creatorId === 0)
                    return false;

                return userId === creatorId;
            } catch (error) {
                console.error("Error checking job creator:", error);
                return false;
            }
        },
        [currentUser],
    );

    // ============ HANDLE EDIT WITH PRE-LOADED IMAGE (SAME AS AlumniEvents.js) ============
    const handleEditPost = useCallback(
        (post) => {
            try {
                setEditingPost(post);

                // Pre-load existing banner image (same pattern as AlumniEvents.js)
                const existingImages = [];
                if (post.banner_image || post.banner_image_url) {
                    const imageUrl = buildImageUrl(
                        post.banner_image || post.banner_image_url,
                    );
                    existingImages.push({
                        uid: "existing-banner",
                        name: "Banner Image",
                        status: "done",
                        url: imageUrl,
                        thumbUrl: imageUrl,
                    });
                }
                setFileList(existingImages);
                bannerFileListRef.current = existingImages;

                // Calculate expiration days from expires_at if exists
                let expirationDays = null;
                if (post.expires_at) {
                    const expiresAt = moment(post.expires_at);
                    const now = moment();
                    if (expiresAt.isAfter(now)) {
                        expirationDays = expiresAt.diff(now, "days");
                        // Round to nearest option
                        const options = [7, 14, 21, 30, 60, 90, 180, 365];
                        expirationDays = options.reduce((prev, curr) =>
                            Math.abs(curr - expirationDays) <
                            Math.abs(prev - expirationDays)
                                ? curr
                                : prev,
                        );
                    }
                }

                form.setFieldsValue({
                    title: post.title,
                    description: post.description,
                    company: post.company,
                    requirements: post.requirements,
                    job_type: post.job_type,
                    location: post.location,
                    salary_min: post.salary_min,
                    salary_max: post.salary_max,
                    capacity: post.capacity,
                    expiration_days: expirationDays,
                    reference_source_type: post.reference_source_type,
                    reference_url: post.reference_url,
                    verification_notes: post.verification_notes,
                });

                setIsModalVisible(true);
            } catch (error) {
                console.error("Error editing post:", error);
                message.error("Error opening edit form");
            }
        },
        [form],
    );

    return { handleEditPost, handleWithdrawApplication, isJobCreator };
}
