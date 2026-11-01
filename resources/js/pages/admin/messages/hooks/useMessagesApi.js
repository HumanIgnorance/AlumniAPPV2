import { useCallback } from "react";
import { message } from "antd";
import { STATUS } from "~/config/status";
import axios from "~/utils/axiosConfig";

export default function useMessagesApi({
    setError,
    setMessages,
    setIsRestricted,
    setAlumniInfo,
    setMessageReactions,
    setAlumniUnreadCount,
    scrollToBottom,
    setInitialLoading,
    newMessage,
    selectedImage,
    isRestricted,
    sending,
    setNewMessage,
    clearImagePreview,
    setSending,
    imagePreview,
    alumniInfo,
    inputRef,
    searchQuery,
    setAllAlumni,
    setConversations,
    setLoading,
    selectedConversation,
    sendToEmail,
    setSendToEmail,
    clearMessageDraft,
    setAdminTyping,
    allAlumni,
    setPendingRestrictAlumni,
    setShowRestrictModal,
    pendingRestrictAlumni,
    setModalLoading,
    setSelectedConversation,
    setPendingDeleteAlumniId,
    setRecoveryConfirm,
    setShowDeleteModal,
    pendingDeleteAlumniId,
    unarchiveConversation,
    setAlumniDetailsLoading,
    setAlumniPreviewData,
    setShowAlumniDetailsModal,
}) {
    // ============================
    // ALUMNI FUNCTIONS
    // ============================

    const fetchAlumniMessages = useCallback(async (silent = false) => {
        try {
            setError(null);
            const response = await axios.get("/alumni/messages", {
                suppressGenericModal: true, // the catch block below shows a specific message instead
            });

            if (response.data.success) {
                const messagesData = response.data.messages || [];
                setMessages(messagesData);
                setIsRestricted(response.data.is_restricted || false);
                setAlumniInfo(response.data.alumni_info || null);

                const reactionsMap = {};
                messagesData.forEach((msg) => {
                    if (msg.reactions && msg.reactions.length > 0) {
                        reactionsMap[msg.id] = msg.reactions.map(
                            (r) => r.emoji || r,
                        );
                    }
                });
                setMessageReactions(reactionsMap);

                await axios.post("/alumni/messages/mark-read");
                setAlumniUnreadCount(0);

                setTimeout(() => scrollToBottom(), 0);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            if (!silent) setError("Failed to load messages. Please try again.");
        } finally {
            setInitialLoading(false);
        }
    }, []);

    const fetchAlumniUnreadCount = useCallback(async (silent = false) => {
        try {
            const response = await axios.get("/alumni/messages/unread-count", {
                suppressGenericModal: true,
            });
            if (response.data.success) {
                setAlumniUnreadCount(response.data.unread_count || 0);
            }
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    }, []);

    const sendAlumniMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedImage) || isRestricted || sending)
            return;

        const messageText = newMessage.trim();
        setNewMessage("");
        clearImagePreview();
        setSending(true);

        const optimisticMessage = {
            id: `temp-${Date.now()}`,
            message: messageText,
            image_path: imagePreview,
            sender_type: "alumni",
            sender_id: alumniInfo?.id,
            created_at: new Date().toISOString(),
            is_read: false,
            isOptimistic: true,
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setTimeout(() => scrollToBottom(), 0);

        try {
            const formData = new FormData();
            formData.append("message", messageText);
            if (selectedImage) formData.append("image", selectedImage);

            const response = await axios.post(
                "/alumni/messages/send",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );

            if (response.data.success) {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === optimisticMessage.id
                            ? {
                                  ...response.data.data,
                                  sender_type:
                                      response.data.data.sender_type ||
                                      "alumni",
                              }
                            : msg,
                    ),
                );
                message.success("Message sent successfully");
            } else {
                setMessages((prev) =>
                    prev.filter((msg) => msg.id !== optimisticMessage.id),
                );
                setNewMessage(messageText);
                setError(response.data.message || "Failed to send message");
                message.error(
                    response.data.message || "Failed to send message",
                );
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== optimisticMessage.id),
            );
            setNewMessage(messageText);

            if (error.response?.status === 403) {
                setError("You are restricted from sending messages.");
                setIsRestricted(true);
                message.error("You are restricted from sending messages.");
            } else {
                setError("Failed to send message. Please try again.");
                message.error("Failed to send message. Please try again.");
            }
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    // ============================
    // ADMIN FUNCTIONS
    // ============================

    const fetchAllAlumni = useCallback(
        async (silent = false) => {
            try {
                const response = await axios.get("/admin/alumni/all", {
                    params: { search: searchQuery },
                    suppressGenericModal: true, // the catch block below shows a specific toast instead
                });
                if (response.data.success) {
                    // Rejected alumni accounts should not appear in the All Alumni list.
                    const activeAlumni = (response.data.data || []).filter(
                        (a) => a.status !== STATUS.REJECTED,
                    );
                    setAllAlumni(activeAlumni);
                }
            } catch (error) {
                console.error("Failed to fetch alumni:", error);
                if (!silent) message.error("Failed to fetch alumni list");
            }
        },
        [searchQuery],
    );

    const fetchConversations = useCallback(
        async (silent = false) => {
            try {
                const response = await axios.get("/admin/conversations", {
                    params: { search: searchQuery },
                    suppressGenericModal: true, // the catch block below shows a specific toast instead
                });

                if (response.data.success) {
                    setConversations(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
                if (!silent) message.error("Failed to fetch conversations");
            }
        },
        [searchQuery],
    );

    const fetchAdminMessages = useCallback(async (alumniId, silent = false) => {
        try {
            if (!silent) setLoading(true);

            const response = await axios.get(`/admin/messages/${alumniId}`, {
                suppressGenericModal: true, // the catch block below shows a specific toast instead
            });

            if (response.data.success) {
                const messagesData = response.data.data || [];
                const sortedMessages = Array.isArray(messagesData)
                    ? messagesData.sort(
                          (a, b) =>
                              new Date(a.created_at) - new Date(b.created_at),
                      )
                    : [];

                setMessages((prev) => {
                    if (prev.length === 0) return sortedMessages;

                    const lastPrevId = prev[prev.length - 1]?.id;
                    const lastNewId =
                        sortedMessages[sortedMessages.length - 1]?.id;

                    if (lastPrevId === lastNewId) return prev;

                    return sortedMessages;
                });

                const reactionsMap = {};
                sortedMessages.forEach((msg) => {
                    if (msg.reactions && msg.reactions.length > 0) {
                        reactionsMap[msg.id] = msg.reactions.map(
                            (r) => r.emoji || r,
                        );
                    }
                });
                setMessageReactions(reactionsMap);

                if (response.data.alumni_info) {
                    setAlumniInfo(response.data.alumni_info);
                }

                await axios.post(`/admin/messages/${alumniId}/mark-read`);

                setConversations((prev) =>
                    prev.map((conv) =>
                        conv.alumni_id === alumniId
                            ? { ...conv, unread_count: 0 }
                            : conv,
                    ),
                );

                setAllAlumni((prev) =>
                    prev.map((alum) =>
                        alum.alumni_id === alumniId
                            ? { ...alum, unread_count: 0 }
                            : alum,
                    ),
                );

                if (!silent) {
                    setTimeout(() => scrollToBottom(), 0);
                }
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            if (!silent) {
                setMessages([]);
                message.error("Failed to fetch messages");
            }
        } finally {
            if (!silent) setLoading(false);
            setInitialLoading(false);
        }
    }, []);

    const sendAdminMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedImage) || !selectedConversation)
            return;

        try {
            setSending(true);
            const formData = new FormData();
            formData.append("alumni_id", selectedConversation.alumni_id);
            formData.append("message", newMessage.trim());
            if (selectedImage) formData.append("image", selectedImage);
            formData.append("send_to_email", sendToEmail ? "1" : "0");

            const response = await axios.post(
                "/admin/messages/send",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    // Image uploads carry real file bytes over the wire on
                    // top of server-side processing (re-encoding, storage,
                    // optional email dispatch) — the default 15s API
                    // timeout is tuned for small JSON calls and was firing
                    // false-positive "timed out" errors on slower
                    // connections even when the message went through fine
                    // moments later. Give attachments more breathing room.
                    timeout: selectedImage ? 60000 : 15000,
                    // The catch block below already shows a specific,
                    // situation-aware message (and recovers gracefully on
                    // timeout) — suppress the generic global modal so the
                    // admin doesn't see two different error popups for the
                    // same failed send. Unlike `silent`, this still lets a
                    // 401 (session expired) redirect to login normally.
                    suppressGenericModal: true,
                },
            );

            if (response.data.success) {
                setMessages((prev) => [...prev, response.data.data]);
                setNewMessage("");
                setSendToEmail(false);
                clearImagePreview();
                if (selectedConversation)
                    clearMessageDraft(selectedConversation.alumni_id); // draft cleanup after send
                setAdminTyping(false); // clear typing indicator after send
                fetchConversations();
                fetchAllAlumni();
                setTimeout(() => scrollToBottom(), 0);
                message.success("Message sent successfully");
            } else {
                message.error(
                    response.data.message || "Failed to send message",
                );
            }
        } catch (error) {
            console.error("Failed to send message:", error);

            if (error.code === "ECONNABORTED") {
                // The client gave up waiting, but the server may well
                // still be processing (or may have already finished) —
                // don't tell the admin it "failed" and invite a
                // duplicate resend. Re-sync the thread shortly after so
                // the message appears on its own once it lands.
                message.warning(
                    "That's taking longer than expected — it may still go through. Checking for it now...",
                );
                clearImagePreview();
                setNewMessage("");
                if (selectedConversation) {
                    setTimeout(() => {
                        fetchAdminMessages(selectedConversation.alumni_id);
                        fetchConversations();
                    }, 5000);
                }
            } else {
                message.error("Failed to send message");
            }
        } finally {
            setSending(false);
        }
    };

    // Open restrict modal
    const openRestrictModal = (alumni) => {
        if (!alumni) return;

        // The conversation list & header pass a "conversation" object that often
        // doesn't carry course_id / employment_status_id. The All Alumni list
        // passes a full alumni row. Merge the two so the modal always has the
        // complete profile, regardless of where it was opened from.
        const fullAlumni =
            (Array.isArray(allAlumni) &&
                allAlumni.find((a) => a.alumni_id === alumni.alumni_id)) ||
            null;

        const merged = {
            ...(fullAlumni || {}),
            ...alumni, // keep live fields from caller (e.g. is_restricted just toggled)
            alumni_id: alumni.alumni_id ?? fullAlumni?.alumni_id,
            alumni_name:
                alumni.alumni_name ||
                fullAlumni?.alumni_name ||
                alumni.name ||
                fullAlumni?.name,
            course_id: alumni.course_id ?? fullAlumni?.course_id,
            employment_status_id:
                alumni.employment_status_id ?? fullAlumni?.employment_status_id,
            // Preserve any alternate field names the API might return
            course: alumni.course ?? fullAlumni?.course,
            course_name: alumni.course_name ?? fullAlumni?.course_name,
            courseName: alumni.courseName ?? fullAlumni?.courseName,
            employment_status:
                alumni.employment_status ?? fullAlumni?.employment_status,
            employmentStatus:
                alumni.employmentStatus ?? fullAlumni?.employmentStatus,
            employment: alumni.employment ?? fullAlumni?.employment,
        };

        // TEMP debug — remove once verified
        // console.log("Selected Alumni (restrict modal):", {
        //   fromCaller: alumni,
        //   fromAllAlumni: fullAlumni,
        //   merged,
        // })

        setPendingRestrictAlumni(merged);
        setShowRestrictModal(true);
    };

    // Confirm restrict action
    const confirmRestrictAlumni = async () => {
        if (!pendingRestrictAlumni) return;

        const alumniId = pendingRestrictAlumni.alumni_id;
        const newRestrictedState = !pendingRestrictAlumni.is_restricted;

        try {
            setModalLoading(true);
            const response = await axios.post(
                `/admin/messages/restrict/${alumniId}`,
                {
                    restrict: newRestrictedState,
                },
            );

            if (response.data.success) {
                message.success(
                    newRestrictedState
                        ? "Alumni has been restricted from messaging"
                        : "Alumni restriction has been removed",
                );

                setConversations((prev) =>
                    prev.map((conv) =>
                        conv.alumni_id === alumniId
                            ? { ...conv, is_restricted: newRestrictedState }
                            : conv,
                    ),
                );
                setAllAlumni((prev) =>
                    prev.map((alum) =>
                        alum.alumni_id === alumniId
                            ? { ...alum, is_restricted: newRestrictedState }
                            : alum,
                    ),
                );
                if (selectedConversation?.alumni_id === alumniId) {
                    setSelectedConversation((prev) => ({
                        ...prev,
                        is_restricted: newRestrictedState,
                    }));
                }
            } else {
                message.error(
                    response.data.message || "Failed to update restriction",
                );
            }
        } catch (error) {
            console.error("Failed to restrict alumni:", error);
            message.error("Failed to update restriction");
        } finally {
            setModalLoading(false);
            setShowRestrictModal(false);
            setPendingRestrictAlumni(null);
        }
    };

    // Open delete modal
    const openDeleteModal = (alumniId) => {
        setPendingDeleteAlumniId(alumniId);
        setRecoveryConfirm(null); // reset recovery acknowledgement
        setShowDeleteModal(true);
    };

    // Confirm delete action
    const confirmDeleteConversation = async () => {
        if (!pendingDeleteAlumniId) return;

        try {
            setModalLoading(true);
            const response = await axios.delete(
                `/admin/messages/conversation/${pendingDeleteAlumniId}`,
            );
            if (response.data.success) {
                message.success("Conversation deleted successfully");
                clearMessageDraft(pendingDeleteAlumniId); // draft cleanup after deletion
                unarchiveConversation(pendingDeleteAlumniId); // remove from archive if present
                setConversations((prev) =>
                    prev.filter((c) => c.alumni_id !== pendingDeleteAlumniId),
                );
                setAllAlumni((prev) =>
                    prev.map((alum) =>
                        alum.alumni_id === pendingDeleteAlumniId
                            ? {
                                  ...alum,
                                  has_conversation: false,
                                  last_message: null,
                                  unread_count: 0,
                              }
                            : alum,
                    ),
                );
                if (selectedConversation?.alumni_id === pendingDeleteAlumniId) {
                    setSelectedConversation(null);
                    setMessages([]);
                }
            } else {
                message.error(
                    response.data.message || "Failed to delete conversation",
                );
            }
        } catch (error) {
            console.error("Failed to delete conversation:", error);
            message.error("Failed to delete conversation");
        } finally {
            setModalLoading(false);
            setShowDeleteModal(false);
            setPendingDeleteAlumniId(null);
            setRecoveryConfirm(null);
        }
    };

    const handleViewAlumniProfile = async (alumni) => {
        try {
            setAlumniDetailsLoading(true);
            const response = await axios.get(`/alumni/${alumni.alumni_id}`);
            const values = response.data?.data || response.data;

            const previewData = {
                id: values.id,
                status: values.status,
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
            setShowAlumniDetailsModal(true);
        } catch (error) {
            console.error("Failed to fetch alumni details:", error);
            message.error("Failed to fetch alumni details");
            const fallbackData = {
                ...alumni,
                employment_status_id: alumni.employment_status_id,
                course_id: alumni.course_id,
                honors: [],
                idDocuments: [],
            };
            setAlumniPreviewData(fallbackData);
            setShowAlumniDetailsModal(true);
        } finally {
            setAlumniDetailsLoading(false);
        }
    };

    const closeAlumniDetailsModal = () => {
        setShowAlumniDetailsModal(false);
        setAlumniPreviewData(null);
    };

    return {
        fetchConversations,
        fetchAdminMessages,
        fetchAlumniMessages,
        fetchAllAlumni,
        fetchAlumniUnreadCount,
        sendAdminMessage,
        confirmDeleteConversation,
        confirmRestrictAlumni,
        sendAlumniMessage,
        handleViewAlumniProfile,
        openRestrictModal,
        openDeleteModal,
        closeAlumniDetailsModal,
    };
}
