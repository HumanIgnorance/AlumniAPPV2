import { Upload, message } from "antd";
import axiosConfig from "~/utils/axiosConfig";

export default function useEventForm({
    isSubmitting,
    form,
    setValidationErrors,
    setIsValidationModalVisible,
    setIsSubmitting,
    selectedEvent,
    fileList,
    setIsModalVisible,
    setFileList,
    fileListRef,
    setSelectedEvent,
    clearEventDraft,
    fetchEvents,
    events,
    isRestoringDraftRef,
    persistEventDraft,
}) {
    const handleFormSubmit = async () => {
        if (isSubmitting) return; // Prevent double-submit while a save is already in progress
        try {
            const values = await form.validateFields();
            // If validation passes, call the original create event handler
            handleCreateEvent(values);
        } catch (errorInfo) {
            // Extract error messages from validation
            const errors =
                errorInfo.errorFields?.map((field) => field.errors[0]) || [];
            setValidationErrors(errors);
            setIsValidationModalVisible(true);
        }
    };

    const handleCreateEvent = async (values) => {
        setIsSubmitting(true); // Saving...
        try {
            const formData = new FormData();

            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("event_type", values.event_type);
            formData.append("category", values.category);
            formData.append("date", values.date.format("YYYY-MM-DD"));
            formData.append(
                "timeRange[0]",
                values.timeRange[0].format("HH:mm"),
            );
            formData.append(
                "timeRange[1]",
                values.timeRange[1].format("HH:mm"),
            );
            formData.append("location", values.location);
            formData.append("price", values.price || 0);
            formData.append("capacity", values.capacity);
            formData.append("organizer", values.organizer);
            formData.append("contact_number", values.contact_number || "");
            formData.append("contact_email", values.contact_email || "");
            formData.append("agenda", values.agenda || "");
            formData.append("earlyBirdPrice", values.earlyBirdPrice || 0);
            if (values.earlyBirdEndDate) {
                formData.append(
                    "earlyBirdEndDate",
                    values.earlyBirdEndDate.format("YYYY-MM-DD"),
                );
            }

            // ⭐ THE IMPORTANT PART ⭐
            formData.append("featured", values.featured ? 1 : 0);

            // Handle tags
            if (values.tags && values.tags.length > 0) {
                values.tags.forEach((tag, index) => {
                    formData.append(`tags[${index}]`, tag);
                });
            }

            // When editing, tell the backend which existing images to KEEP.
            // Any existing image the user removed will NOT appear in this list,
            // so the backend will drop it from the stored paths.
            if (selectedEvent) {
                fileList.forEach((file) => {
                    if (!file.originFileObj && file.url) {
                        formData.append(`existing_images[]`, file.url);
                    }
                });
            }

            // Handle new uploaded images
            fileList.forEach((file, index) => {
                if (file.originFileObj) {
                    // New file being uploaded
                    formData.append(`images[]`, file.originFileObj);
                }
            });

            const isEditing = !!selectedEvent;
            let response;
            if (isEditing) {
                // Update existing event
                response = await axiosConfig.post(
                    `/events/${selectedEvent.id}?_method=PUT`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    },
                );
            } else {
                // Create new event
                response = await axiosConfig.post("/events", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            if (response.data.success) {
                // Distinct, explicit confirmation for create vs. update
                const defaultMessage = isEditing
                    ? "Event updated successfully!"
                    : "Event created successfully!";
                message.success(response.data.message || defaultMessage);

                setIsModalVisible(false);
                form.resetFields();
                setFileList([]);
                fileListRef.current = [];
                setSelectedEvent(null);
                clearEventDraft(); // Auto-clear draft after successful event creation
                fetchEvents(); // Refresh event list so the new/updated event displays immediately
            }
        } catch (error) {
            console.error("Error creating/updating event:", error);
            message.error(
                error.response?.data?.message || "Failed to save event",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRegistrationProgress = (registered, capacity) => {
        return (registered / capacity) * 100;
    };

    const stats = {
        total: events.length,
        upcoming: events.filter((e) => e.status === "upcoming").length,
        ongoing: events.filter((e) => e.status === "ongoing").length,
        completed: events.filter((e) => e.status === "completed").length,
        featured: events.filter((e) => e.featured).length,
        totalRegistrations: events.reduce(
            (sum, event) => sum + event.registered,
            0,
        ),
    };

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        fileListRef.current = newFileList;
        // Save uploaded banner/poster immediately after upload (drafts only on create).
        if (!selectedEvent && !isRestoringDraftRef.current) {
            persistEventDraft(form.getFieldsValue(), newFileList);
        }
    };

    const handleBeforeUpload = (file) => {
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
    };

    return {
        stats,
        handleCreateEvent,
        handleUploadChange,
        handleBeforeUpload,
        handleFormSubmit,
    };
}
