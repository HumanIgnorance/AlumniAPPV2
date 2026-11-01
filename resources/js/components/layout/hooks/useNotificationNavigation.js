import { message } from "antd";
import axiosConfig from "~/utils/axiosConfig";

export default function useNotificationNavigation({
    setEventRegistrationsLoading,
    setEventRegistrations,
    setSelectedEventForRegistrations,
    setEventRegistrationsModalVisible,
    setEventDetailsLoading,
    setSelectedEventDetails,
    setEventDetailsModalVisible,
    history,
    setFeedbackDetailLoading,
    setFeedbackDetailModalVisible,
    setSelectedFeedbackReport,
    setAlumniDetailsLoading,
    setAlumniPreviewData,
    setAlumniDetailsVisible,
}) {
    const handleViewEventRegistrations = async (eventId, alumniId) => {
        if (!eventId) {
            message.error("Event ID not found");
            return;
        }
        try {
            setEventRegistrationsLoading(true);
            const response = await axiosConfig.get(
                `/events/${eventId}/registrations`,
            );
            if (response.data.success) {
                setEventRegistrations(response.data.data);
                setSelectedEventForRegistrations(response.data.event);
                setEventRegistrations((prev) =>
                    prev.map((reg) => ({
                        ...reg,
                        isHighlighted: reg.alumni_id === alumniId,
                    })),
                );
                setEventRegistrationsModalVisible(true);
            }
        } catch (error) {
            console.error("Failed to fetch event registrations:", error);
            message.error("Failed to load event registrations");
        } finally {
            setEventRegistrationsLoading(false);
        }
    };

    const handleViewEventDetails = async (eventId) => {
        if (!eventId) {
            message.error("Event ID not found");
            return;
        }
        try {
            setEventDetailsLoading(true);
            const response = await axiosConfig.get(`/events/${eventId}`);
            if (response.data) {
                setSelectedEventDetails(response.data);
                setEventDetailsModalVisible(true);
            }
        } catch (error) {
            console.error("Failed to fetch event details:", error);
            message.error("Failed to load event details");
        } finally {
            setEventDetailsLoading(false);
        }
    };

    const handleViewAnnouncement = (announcementId) => {
        history.push(
            announcementId
                ? `/announcements?id=${announcementId}`
                : "/announcements",
        );
    };

    // Opens the "view admin note" modal for a resolved/dismissed feedback
    // report. Fetches the live report so status/notes are current even
    // if they've changed since the notification was created; falls back
    // to whatever was snapshotted on the notification itself if the
    // report was since deleted.
    const handleViewFeedbackReport = async (feedbackReportId, fallback) => {
        if (!feedbackReportId) return;
        try {
            setFeedbackDetailLoading(true);
            setFeedbackDetailModalVisible(true);
            const response = await axiosConfig.get(
                `/atms-feedback/${feedbackReportId}`,
                // The report may have since been deleted by an admin (404) —
                // that's an expected, gracefully-handled case here (we fall
                // back to the snapshot baked into the notification below),
                // not a surprise failure, so skip the generic axios error
                // modal that would otherwise pop up the raw Laravel
                // "No query results for model [...]" message.
                { suppressGenericModal: true },
            );
            setSelectedFeedbackReport(response.data?.data || fallback || null);
        } catch (error) {
            console.error("Failed to fetch feedback report:", error);
            if (fallback) {
                setSelectedFeedbackReport(fallback);
                if (error?.response?.status === 404) {
                    message.info(
                        "This feedback report has since been deleted. Showing the details from your notification.",
                    );
                }
            } else {
                message.error("Failed to load this feedback report");
                setFeedbackDetailModalVisible(false);
            }
        } finally {
            setFeedbackDetailLoading(false);
        }
    };

    const handleViewAlumniProfile = async (alumniId) => {
        try {
            setAlumniDetailsLoading(true);
            const response = await axiosConfig.get(`/alumni/${alumniId}`);
            const values = response.data?.data || response.data;
            const previewData = {
                id: values.id,
                first_name: values.first_name,
                last_name: values.last_name,
                middle_name: values.middle_name,
                suffix: values.suffix,
                email: values.email,
                phone: values.phone,
                address: values.address,
                birth_date: values.birth_date,
                gender: values.gender,
                bio: values.bio,
                course_id: values.course_id,
                student_id: values.student_id,
                graduation_year: values.graduation_year,
                enrollment_year: values.enrollment_year,
                honors:
                    typeof values.honors === "string" &&
                    values.honors.trim() !== ""
                        ? JSON.parse(values.honors)
                        : Array.isArray(values.honors)
                          ? values.honors
                          : [],
                thesis_title: values.thesis_title,
                academic_achievements: values.academic_achievements,
                extracurricular: values.extracurricular,
                continue_education: values.continue_education,
                employment_status_id: values.employment_status_id,
                current_company: values.current_company,
                job_title: values.job_title,
                industry: values.industry,
                years_experience: values.years_experience,
                salary_range: values.salary_range,
                work_location: values.work_location,
                career_goals: values.career_goals,
                previous_companies: values.previous_companies,
                linkedin: values.linkedin,
                github: values.github,
                portfolio: values.portfolio,
                twitter: values.twitter,
                newsletter: values.newsletter,
                contactPermission: values.contactPermission,
                agreement: values.agreement,
                profileImage: values?.profile_image_url,
                idDocuments: values?.documents || [],
            };
            setAlumniPreviewData(previewData);
            setAlumniDetailsVisible(true);
        } catch (error) {
            // console.error("Failed to fetch alumni details:", error)
            message.error("Failed to load alumni profile");
        } finally {
            setAlumniDetailsLoading(false);
        }
    };

    return {
        handleViewAlumniProfile,
        handleViewEventRegistrations,
        handleViewEventDetails,
        handleViewAnnouncement,
        handleViewFeedbackReport,
    };
}
