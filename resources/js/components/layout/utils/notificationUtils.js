import avatarGuidance from "~/assets/images/avatar_guidance.png";
import avatarBEED from "~/assets/images/beed-logo.png";
import avatarBSBA from "~/assets/images/bsba-logo.png";
import avatarBSIT from "~/assets/images/bsit-logo.jpg";
import avatarBSED from "~/assets/images/educ-logo.png";
import {
    NOTIFICATION_CATEGORIES,
    TYPE_TO_CATEGORY,
} from "~/config/notificationCategories";
import { ROLES } from "~/config/roles";
import axiosConfig from "~/utils/axiosConfig";
import { getUserRole } from "~/utils/session";

export const showBrowserPushNotification = (notif) => {
    if (typeof window === "undefined" || !("Notification" in window)) {
        return;
    }
    if (window.Notification.permission !== "granted") return;

    try {
        const title = notif.title || "New notification";
        const body = notif.message || "";
        const pushNotif = new window.Notification(title, {
            body,
            tag: `notification-${notif.id}`,
            // playNotificationSound() above already plays the
            // org's own role-specific chime (admin.mp3/alumni.mp3/
            // etc.) for this same event. Without `silent: true`
            // here, the OS/browser also plays its own generic
            // default notification sound on top of it — that's the
            // "overlap" sound that isn't the org's sound. Muting
            // the native sound leaves only the one intentional
            // chime.
            silent: true,
        });
        pushNotif.onclick = () => {
            window.focus();
            pushNotif.close();
        };
    } catch (e) {
        console.error("Failed to show browser push notification:", e);
    }
};

export const getNotificationData = (notification) => {
    if (!notification.data) return {};
    if (typeof notification.data === "string") {
        try {
            return JSON.parse(notification.data);
        } catch (e) {
            console.error("Failed to parse notification data:", e);
            return {};
        }
    }
    return notification.data;
};

export const patchNotificationAvatar = (
    notification,
    imageUrl,
    version = Date.now(),
) => {
    const notificationData = getNotificationData(notification);
    const bustedImageUrl = withImageCacheBuster(imageUrl, version);
    const nextData = {
        ...notificationData,
        alumni_profile_image: bustedImageUrl,
        profile_image_url: bustedImageUrl,
    };

    return {
        ...notification,
        data:
            typeof notification.data === "string"
                ? JSON.stringify(nextData)
                : nextData,
        sender: notification.sender
            ? { ...notification.sender, avatar: bustedImageUrl }
            : notification.sender,
    };
};

export const matchesNotificationAlumni = (notification, alumniId, userId) => {
    const data = getNotificationData(notification);
    return (
        (alumniId &&
            [data?.alumni_id, data?.id, data?.alumni?.id]
                .filter(Boolean)
                .some((id) => String(id) === String(alumniId))) ||
        (userId &&
            [data?.user_id, data?.alumni?.user_id]
                .filter(Boolean)
                .some((id) => String(id) === String(userId)))
    );
};

export const syncNotificationsWithFreshAlumniImages = async (
    notificationsList,
) => {
    const alumniIds = [
        ...new Set(
            notificationsList
                .map(
                    (notification) =>
                        getNotificationData(notification)?.alumni_id,
                )
                .filter(Boolean),
        ),
    ];

    if (!alumniIds.length) return notificationsList;

    const alumniById = new Map();
    await Promise.all(
        alumniIds.map(async (alumniId) => {
            try {
                const response = await axiosConfig.get(`/alumni/${alumniId}`);
                const alumni = response.data?.data || response.data;
                if (alumni?.profile_image_url) {
                    alumniById.set(String(alumniId), alumni.profile_image_url);
                }
            } catch (_error) {
                // Keep the notification's embedded image if this alumni fetch fails.
            }
        }),
    );

    const version = Date.now();
    return notificationsList.map((notification) => {
        const alumniId = getNotificationData(notification)?.alumni_id;
        const freshImage = alumniById.get(String(alumniId));
        return freshImage
            ? patchNotificationAvatar(notification, freshImage, version)
            : notification;
    });
};

export const getNotificationCategory = (notification) => {
    const notificationData = getNotificationData(notification);
    // Kept separate rather than collapsed with `||`: some backend
    // notifications set notifiable_type to a specific token
    // ("new_feedback_report"), but others set it to a generic
    // Eloquent class name ("App\Models\Alumni") and put the real,
    // specific type in data.type instead (e.g. "profile_update",
    // "pending_alumni_login" — see AuthController /
    // AlumniRegistrationController). Collapsing the two with `||`
    // would let the generic notifiable_type permanently shadow the
    // specific data.type whenever it happened to be truthy, silently
    // losing the more useful value.
    const rawType = notification.notifiable_type || "";
    const dataType = notificationData?.type || "";
    const notificationMessage = (
        notification.message ||
        notificationData?.message ||
        ""
    ).toLowerCase();
    const title = (
        notification.title ||
        notificationData?.title ||
        ""
    ).toLowerCase();

    // Pass 1: trust an explicit, recognized type token from the
    // backend — it's authoritative and MUST run before any of the
    // keyword-based fallbacks below. Otherwise a message that simply
    // *mentions* another category's keyword gets miscategorized —
    // e.g. an ATMS feedback report submitted about the "Events" area
    // reads "...submitted feedback: events", and a naive
    // event-keyword check (`message.includes("event")`) would match
    // that before a feedback check ever ran, showing an
    // "Event Registered" badge instead of "Feedback". Check both
    // fields — whichever one is a known token wins; notifiable_type
    // first since it's the more common home for it.
    if (TYPE_TO_CATEGORY[rawType]) return TYPE_TO_CATEGORY[rawType];
    if (TYPE_TO_CATEGORY[dataType]) return TYPE_TO_CATEGORY[dataType];

    // Pass 2: keyword-based fallback, only for legacy/unrecognized
    // notifications that don't carry a known type in either field.
    // Feedback is checked before event/profile/etc. here too, since a
    // feedback message can legitimately contain any of those words as
    // the name of the area it was submitted about.
    if (
        notificationMessage.includes("department head") ||
        title.includes("department head")
    ) {
        return "department_head_login";
    }

    if (
        notificationMessage.includes("feedback") ||
        title.includes("feedback")
    ) {
        return "feedback";
    }

    if (
        notificationMessage.includes("event") ||
        notificationMessage.includes("registered for") ||
        title.includes("event")
    ) {
        return "event_registration";
    }

    if (
        notificationMessage.includes("profile") ||
        notificationMessage.includes("updated") ||
        title.includes("profile")
    ) {
        return "profile_update";
    }

    if (
        notificationMessage.includes("attempt") ||
        notificationMessage.includes("failed login") ||
        notificationMessage.includes("suspicious") ||
        title.includes("attempt")
    ) {
        return "login_attempt";
    }

    if (
        notificationMessage.includes("logged in") ||
        notificationMessage.includes("login") ||
        title.includes("login")
    ) {
        return "account_login";
    }

    if (
        notificationMessage.includes("approved") ||
        notificationMessage.includes("verified") ||
        title.includes("approved")
    ) {
        return "account_approved";
    }

    if (
        notificationMessage.includes("quiz") ||
        notificationMessage.includes("rating") ||
        notificationMessage.includes("assessment") ||
        title.includes("quiz")
    ) {
        return "quiz_submission";
    }

    if (
        notificationMessage.includes("announcement") ||
        title.includes("announcement")
    ) {
        return "announcement";
    }

    // Belt-and-suspenders: the two message notifications above should
    // always carry rawType "admin_message"/"alumni_message" and get
    // caught by Pass 1, but if an older row is ever missing that
    // token, don't let it silently fall back to the generic "All"
    // bucket — match on the title text instead. Admin's aggregate
    // title ("Alumni Messages") is checked first since it also
    // contains the word "message".
    if (title.includes("alumni messages")) {
        return "alumni_messages";
    }
    if (notificationMessage.includes("message") || title.includes("message")) {
        return "messages";
    }

    return "all";
};

export const getCategoryInfo = (notification) => {
    const category = getNotificationCategory(notification);
    return NOTIFICATION_CATEGORIES[category] || NOTIFICATION_CATEGORIES.all;
};

export const getNotificationAlumniAvatar = (notification) => {
    const currentRole = getUserRole();
    if (currentRole === ROLES.ALUMNI) {
        return avatarGuidance;
    }

    const notificationData = getNotificationData(notification);

    if (
        notificationData?.type === "department_head_login" ||
        (notification.title &&
            notification.title.toLowerCase().includes("department head")) ||
        (notification.message &&
            notification.message.toLowerCase().includes("department head"))
    ) {
        const courseId = notificationData?.course_id;
        switch (courseId) {
            case 1:
            case "1":
                return avatarBSIT;
            case 2:
            case "2":
                return avatarBSED;
            case 3:
            case "3":
                return avatarBEED;
            case 4:
            case "4":
                return avatarBSBA;
            default:
                return avatarGuidance;
        }
    }

    if (notificationData?.alumni_profile_image) {
        return withImageCacheBuster(notificationData.alumni_profile_image);
    }
    if (notificationData?.profile_image_url) {
        return withImageCacheBuster(notificationData.profile_image_url);
    }
    if (notification.sender?.avatar) {
        return withImageCacheBuster(notification.sender.avatar);
    }
    return null;
};

export const getNotificationEventImage = (notification) => {
    const notificationData = getNotificationData(notification);
    if (
        notification.notifiable_type === "new_event" &&
        notificationData?.event_images?.length > 0
    ) {
        return notificationData.event_images[0];
    }
    return null;
};

export const withImageCacheBuster = (imageUrl, version) => {
    if (
        !imageUrl ||
        imageUrl.startsWith("blob:") ||
        imageUrl.startsWith("data:")
    ) {
        return imageUrl;
    }

    const cleanUrl = imageUrl.replace(
        /([?&])v=\d+(&?)/,
        (match, prefix, suffix) => (suffix ? prefix : ""),
    );

    // No explicit version means the caller doesn't actually know the
    // image changed — this is just a normal render of an existing
    // avatar. Return the plain URL so the browser can serve it from
    // cache instead of treating it as a brand-new resource every time
    // this runs (previously defaulted to Date.now(), which minted a
    // new "unique" URL on every single re-render and forced a fresh
    // network request for the same image, easily blowing through the
    // profile-image rate limit when many notifications render at once).
    if (!version) {
        return cleanUrl;
    }

    return `${cleanUrl}${cleanUrl.includes("?") ? "&" : "?"}v=${version}`;
};

// Formats a 24-hour time string ("HH:mm" or "HH:mm:ss") into a readable
// 12-hour display string, e.g. "16:40:00" -> "04:40 PM".
export const formatEventTime = (value) => {
    if (!value) return "";
    const match = String(value).match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!match) return value;
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
};
