import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";
import { useState, useEffect } from "react";
import { getUserRole } from "~/utils/session";
import dayjs from "dayjs";
import { ROLES } from "~/config/roles";
import axiosConfig from "~/utils/axiosConfig";
import { STORAGE_KEYS } from "~/config/storageKeys";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function useEventDetailsModalController({
    visible,
    event,
    onRefresh,
    onDelete,
    onEdit,
    onClose,
}) {
    const isTouchDevice = useIsTouchDevice();
    const [isLiked, setIsLiked] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [phoneModalVisible, setPhoneModalVisible] = useState(false);
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    const [messengerModalVisible, setMessengerModalVisible] = useState(false);
    const [registrationsModalVisible, setRegistrationsModalVisible] =
        useState(false);
    const [isLoadingRegistrationStatus, setIsLoadingRegistrationStatus] =
        useState(false);
    const [galPreviewOpen, setGalPreviewOpen] = useState(false);
    const [galPreviewIndex, setGalPreviewIndex] = useState(0);

    // Each time the modal becomes visible, increment the key to force
    // react-slick to unmount + remount with correct viewport dimensions.
    // Without this, slick measures width=0 during the AntD zoom animation
    // and all slides are invisibly positioned off-screen on portrait mobile.
    const [carouselKey, setCarouselKey] = useState(0);
    useEffect(() => {
        if (visible) {
            setCarouselKey((k) => k + 1);
        }
    }, [visible]);

    const role = getUserRole();

    const contactInfo = {
        phone: event?.contact_number || "N/A",
        email: event?.contact_email || "N/A",
        // messenger: "https://www.facebook.com/messages/t/your-page-id",
        title: event?.organizer || "Event Organizer",
    };

    // Helper function to check if early bird pricing is available
    const isEarlyBirdAvailable = (event) => {
        if (!event.earlyBirdEndDate) return false;
        const now = dayjs();
        return now.isBefore(dayjs(event.earlyBirdEndDate));
    };

    const eventId = event?.id;
    useEffect(() => {
        const fetchFreshEventData = async () => {
            if (visible && eventId && role === ROLES.ALUMNI) {
                setIsLoadingRegistrationStatus(true);
                try {
                    const response = await axiosConfig.get(
                        `/events/${eventId}`,
                    );
                    const freshEvent = response.data;
                    const backendRegistered =
                        freshEvent.is_user_registered || false;
                    setIsRegistered(backendRegistered);

                    // Sync localStorage with fresh backend value
                    const storedRegistrations = JSON.parse(
                        localStorage.getItem(
                            STORAGE_KEYS.EVENT_REGISTRATIONS,
                        ) || "{}",
                    );
                    if (backendRegistered) {
                        storedRegistrations[eventId] = true;
                    } else {
                        delete storedRegistrations[eventId];
                    }
                    localStorage.setItem(
                        STORAGE_KEYS.EVENT_REGISTRATIONS,
                        JSON.stringify(storedRegistrations),
                    );
                } catch (error) {
                    console.error("Failed to fetch fresh event data:", error);
                    // Fallback to event prop value if fetch fails
                    setIsRegistered(event?.is_user_registered || false);
                } finally {
                    setIsLoadingRegistrationStatus(false);
                }
            } else if (event) {
                // For non-alumni users, just use the prop value
                setIsRegistered(event.is_user_registered || false);
            }
        };

        fetchFreshEventData();
    }, [visible, eventId, role, event]);

    const handleRegister = async () => {
        setIsRegistering(true);
        try {
            const response = await axiosConfig.post(
                `/events/${event.id}/register`,
            );
            if (response.data.success) {
                setIsRegistered(true);

                // Persist registration to localStorage
                const storedRegistrations = JSON.parse(
                    localStorage.getItem(STORAGE_KEYS.EVENT_REGISTRATIONS) ||
                        "{}",
                );
                storedRegistrations[event.id] = true;
                localStorage.setItem(
                    STORAGE_KEYS.EVENT_REGISTRATIONS,
                    JSON.stringify(storedRegistrations),
                );

                message.success(
                    response.data.message ||
                        "Successfully registered for this event!",
                );
                if (onRefresh) onRefresh();
            }
        } catch (error) {
            message.error(
                error.response?.data?.message ||
                    "Failed to register for the event",
            );
        } finally {
            setIsRegistering(false);
        }
    };

    const handleCancelRegistration = async () => {
        Modal.confirm({
            title: "Cancel Registration",
            icon: <ExclamationCircleOutlined />,
            content:
                "Are you sure you want to cancel your registration for this event?",
            okText: "Yes, Cancel",
            okType: "danger",
            cancelText: "No",
            async onOk() {
                try {
                    const response = await axiosConfig.post(
                        `/events/${event.id}/cancel-registration`,
                    );
                    if (response.data.success) {
                        setIsRegistered(false);

                        // Remove registration from localStorage
                        const storedRegistrations = JSON.parse(
                            localStorage.getItem(
                                STORAGE_KEYS.EVENT_REGISTRATIONS,
                            ) || "{}",
                        );
                        delete storedRegistrations[event.id];
                        localStorage.setItem(
                            STORAGE_KEYS.EVENT_REGISTRATIONS,
                            JSON.stringify(storedRegistrations),
                        );

                        message.success(
                            response.data.message ||
                                "Registration cancelled successfully",
                        );
                        if (onRefresh) onRefresh();
                    }
                } catch (error) {
                    message.error(
                        error.response?.data?.message ||
                            "Failed to cancel registration",
                    );
                }
            },
        });
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        message.success(
            isLiked ? "Removed from favorites" : "Added to favorites",
        );
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        message.success("Event link copied to clipboard!");
    };

    const handleMenuClick = ({ key }) => {
        if (key === "delete") {
            Modal.confirm({
                title: "Delete Event",
                icon: <ExclamationCircleOutlined />,
                content:
                    "Are you sure you want to delete this event? This action cannot be undone.",
                okText: "Yes, Delete",
                okType: "danger",
                cancelText: "Cancel",
                onOk() {
                    onDelete(event);
                },
            });
        } else if (key === "edit") {
            onEdit(event);
        } else if (key === "share") {
            handleShare();
        } else if (key === "registrations") {
            setRegistrationsModalVisible(true);
        }
    };

    return {
        event,
        visible,
        onClose,
        isTouchDevice,
        isRegistered,
        isRegistering,
        phoneModalVisible,
        setPhoneModalVisible,
        emailModalVisible,
        setEmailModalVisible,
        messengerModalVisible,
        setMessengerModalVisible,
        registrationsModalVisible,
        setRegistrationsModalVisible,
        isLoadingRegistrationStatus,
        galPreviewOpen,
        setGalPreviewOpen,
        galPreviewIndex,
        setGalPreviewIndex,
        carouselKey,
        role,
        contactInfo,
        isEarlyBirdAvailable,
        handleRegister,
        handleCancelRegistration,
        handleMenuClick,
    };
}
