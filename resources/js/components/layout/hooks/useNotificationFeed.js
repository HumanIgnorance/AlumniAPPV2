import { useEffect, useRef } from "react";
import { message } from "antd";
import {
    getNotificationCategory,
    matchesNotificationAlumni,
    patchNotificationAvatar,
    showBrowserPushNotification,
    syncNotificationsWithFreshAlumniImages,
    withImageCacheBuster,
} from "~/components/layout/utils/notificationUtils";
import { NOTIFICATION_CATEGORIES } from "~/config/notificationCategories";
import axiosConfig from "~/utils/axiosConfig";

export default function useNotificationFeed({
    allowedNotificationCategoryKeys,
    filterUnread,
    activeCategory,
    setIsLoading,
    perPage,
    setNotifications,
    setTotalNotifications,
    settingsRef,
    playNotificationSound,
    role,
    setLoadingMore,
    modalPerPage,
    setAllNotifications,
    setCurrentPage,
    setAlumniPreviewData,
    queryClient,
    notifications,
    setAnimateBell,
}) {
    // Tracks unread notification ids across polls so sound/push only
    // fire for notifications that are genuinely new since the last
    // check — without this every 30s poll would re-fire them for every
    // still-unread notification, not just newly arrived ones.
    const seenUnreadIdsRef = useRef(null);

    // While the tab/window is hidden (e.g. the user Alt-Tabs to another
    // app or switches to a different browser tab), the 30s polling
    // interval keeps running in the background but browsers throttle
    // background timers — so by the time the user switches back, the
    // next fetch can land right away and "catch up" on everything that
    // arrived while they were away. Without this flag, that catch-up
    // poll treated every one of those as newly arrived and fired the
    // notification sound the instant the window regained focus, even
    // though nothing changed while the user was actually looking at
    // this window. Set true when the tab goes hidden; the next
    // fetchNotifications() call after becoming visible again silently
    // resyncs (updates what's "seen" without playing sound/push), then
    // clears the flag so normal live notifications behave as before.
    const suppressSoundOnNextFetchRef = useRef(false);

    const filterNotificationsByCategory = (notificationsList) => {
        let filtered = notificationsList.filter((n) => {
            const cat = getNotificationCategory(n);
            return (
                cat === "all" || allowedNotificationCategoryKeys.includes(cat)
            );
        });

        if (filterUnread) {
            filtered = filtered.filter((n) => !n.read);
        }

        if (activeCategory !== "all") {
            filtered = filtered.filter(
                (n) => getNotificationCategory(n) === activeCategory,
            );
        }

        return filtered;
    };

    const getCategoryCounts = (notificationsList) => {
        const roleVisible = notificationsList.filter((n) => {
            const cat = getNotificationCategory(n);
            return (
                cat === "all" || allowedNotificationCategoryKeys.includes(cat)
            );
        });
        const counts = { all: roleVisible.length };
        Object.keys(NOTIFICATION_CATEGORIES).forEach((key) => {
            if (key !== "all") {
                counts[key] = roleVisible.filter(
                    (n) => getNotificationCategory(n) === key,
                ).length;
            }
        });
        return counts;
    };

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await axiosConfig.get(
                `/notifications?page=1&per_page=${perPage}`,
                {
                    // This polls every 30s in the background (see the
                    // interval below) regardless of what page the admin
                    // is on — it must never pop the generic error modal
                    // for a routine timeout/slow-network hiccup that has
                    // nothing to do with whatever they're actually doing.
                    suppressGenericModal: true,
                },
            );

            if (response.data) {
                const notificationsData =
                    await syncNotificationsWithFreshAlumniImages(
                        response.data.data || [],
                    );
                setNotifications(notificationsData);
                if (response.data.pagination) {
                    setTotalNotifications(response.data.pagination.total);
                }

                // Sound/push alerts for whatever is unread on THIS poll
                // that wasn't already unread on the previous one — i.e.
                // genuinely new arrivals, not every still-unread item
                // re-firing each 30s cycle. The first poll after mount
                // only seeds the "seen" set (nothing should alert just
                // because the page loaded with existing unread items).
                //
                // IMPORTANT: this must only consider notifications whose
                // category is actually visible to this role in the bell
                // (allowedNotificationCategoryKeys — same filter used by
                // getFilteredNotifications below). Without this, a
                // notification hidden from the bell for this role (e.g.
                // "account_approved" isn't in ROLE_NOTIFICATION_CATEGORIES.alumni,
                // even though notifyAlumniAboutApproval() sends it
                // straight to that alumni's own user_id) still counted
                // toward "newlyArrived" and fired the sound/push with
                // nothing ever appearing in the bell to explain it —
                // exactly the "I hear a sound but there's no
                // notification" symptom. Filtering here makes what you
                // hear match what you can actually see.
                const isVisibleToRole = (n) => {
                    const cat = getNotificationCategory(n);
                    return (
                        cat === "all" ||
                        allowedNotificationCategoryKeys.includes(cat)
                    );
                };
                const visibleNotificationsData =
                    notificationsData.filter(isVisibleToRole);

                const currentUnreadIds = new Set(
                    visibleNotificationsData
                        .filter((n) => !n.read)
                        .map((n) => n.id),
                );
                if (seenUnreadIdsRef.current === null) {
                    seenUnreadIdsRef.current = currentUnreadIds;
                } else {
                    const newlyArrived = visibleNotificationsData.filter(
                        (n) => !n.read && !seenUnreadIdsRef.current.has(n.id),
                    );
                    // If the tab was hidden since the last poll (see
                    // suppressSoundOnNextFetchRef above), this fetch is a
                    // silent resync: anything that arrived while the user
                    // was away gets marked as "seen" below without
                    // announcing it, so switching back to this window
                    // never plays a sound for notifications that weren't
                    // actually new to this check-in.
                    const shouldSuppress = suppressSoundOnNextFetchRef.current;
                    suppressSoundOnNextFetchRef.current = false;

                    if (newlyArrived.length > 0 && !shouldSuppress) {
                        // Read via the ref (see settingsRef above), not the
                        // closed-over `settings` state — this function is
                        // called from a setInterval closure created once on
                        // mount, so `settings` here would otherwise always
                        // reflect the very first render's defaults.
                        if (settingsRef.current.soundEnabled) {
                            playNotificationSound(role);
                        }
                        if (settingsRef.current.pushNotifications) {
                            newlyArrived.forEach(showBrowserPushNotification);
                        }
                    }
                    seenUnreadIdsRef.current = currentUnreadIds;
                }
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllNotifications = async (page = 1) => {
        try {
            setLoadingMore(true);
            // Use larger per_page to get more notifications
            const response = await axiosConfig.get(
                `/notifications?page=${page}&per_page=${modalPerPage}`,
            );

            if (response.data) {
                const notificationsData =
                    await syncNotificationsWithFreshAlumniImages(
                        response.data.data || [],
                    );
                setAllNotifications(notificationsData);
                if (response.data.pagination) {
                    setTotalNotifications(response.data.pagination.total);
                    setCurrentPage(response.data.pagination.current_page);
                }
            }
        } catch (error) {
            console.error("Failed to fetch all notifications:", error);
            message.error("Failed to load notifications");
        } finally {
            setLoadingMore(false);
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await axiosConfig.delete(`/notifications/${notificationId}`);
            // Remove from dropdown notifications
            setNotifications((prev) =>
                prev.filter((n) => n.id !== notificationId),
            );
            // Remove from all notifications (modal)
            setAllNotifications((prev) =>
                prev.filter((n) => n.id !== notificationId),
            );
            // Update total count
            setTotalNotifications((prev) => Math.max(0, prev - 1));
            message.success("Notification deleted");
        } catch (error) {
            console.error("Failed to delete notification:", error);
            message.error("Failed to delete notification");
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axiosConfig.post(
                `/notifications/${notificationId}/mark-read`,
            );
            const updateRead = (prev) =>
                prev.map((n) =>
                    n.id === notificationId
                        ? {
                              ...n,
                              read: true,
                              read_at: new Date().toISOString(),
                          }
                        : n,
                );
            setNotifications(updateRead);
            setAllNotifications(updateRead);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await axiosConfig.post(
                "/notifications/mark-all-read",
            );

            if (response.data?.success) {
                const markAllRead = (prev) =>
                    prev.map((n) => ({
                        ...n,
                        read: true,
                        read_at: new Date().toISOString(),
                    }));
                setNotifications(markAllRead);
                setAllNotifications(markAllRead);
                message.success("All notifications marked as read");
            }
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
            message.error("Failed to mark notifications as read");
        }
    };

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "hidden") {
                suppressSoundOnNextFetchRef.current = true;
            } else if (document.visibilityState === "visible") {
                // Resync right away rather than waiting for the next
                // throttled interval tick, so the unread badge is
                // accurate immediately — this resync itself is silent
                // because the flag above is still true at this point.
                fetchNotifications();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibility);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleAlumniImageUpdated = (event) => {
            const { alumniId, userId, newImageUrl } = event.detail || {};
            if (!newImageUrl) return;

            const version = Date.now();
            const patchList = (list) =>
                list.map((notification) =>
                    matchesNotificationAlumni(notification, alumniId, userId)
                        ? patchNotificationAvatar(
                              notification,
                              newImageUrl,
                              version,
                          )
                        : notification,
                );

            setNotifications(patchList);
            setAllNotifications(patchList);
            setAlumniPreviewData((prev) =>
                prev && String(prev.id) === String(alumniId)
                    ? {
                          ...prev,
                          profileImage: withImageCacheBuster(
                              newImageUrl,
                              version,
                          ),
                      }
                    : prev,
            );
            queryClient.invalidateQueries(["alumini"]);
            queryClient.invalidateQueries(["profile"]);
        };

        window.addEventListener(
            "alumni-profile-image-updated",
            handleAlumniImageUpdated,
        );
        return () =>
            window.removeEventListener(
                "alumni-profile-image-updated",
                handleAlumniImageUpdated,
            );
    }, [queryClient]);

    useEffect(() => {
        const unread = notifications.filter((n) => !n.read).length;
        if (unread > 0) {
            setAnimateBell(true);
            const timeout = setTimeout(() => setAnimateBell(false), 1000);
            return () => clearTimeout(timeout);
        }
    }, [notifications]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return {
        handleMarkAsRead,
        filterNotificationsByCategory,
        getCategoryCounts,
        unreadCount,
        handleMarkAllAsRead,
        fetchAllNotifications,
        handleDeleteNotification,
        fetchNotifications,
    };
}
