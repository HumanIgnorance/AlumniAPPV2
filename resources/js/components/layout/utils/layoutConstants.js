export const themeOptions = [
    { value: "white", label: "Light" },
    { value: "black", label: "Dark" },
];

// Maps the frontend's camelCase settings state to the backend's
// snake_case preference keys (see NotificationPreferencesController).
// "darkMode" is intentionally left out — theme is a separate, purely
// client-side concern (currentTheme elsewhere in this file), not a
// notification channel, so it isn't sent to the server.
export const SETTINGS_KEY_MAP = {
    emailNotifications: "email_notifications",
    soundEnabled: "sound_enabled",
    pushNotifications: "push_notifications",
};

// Mirrors User::DEFAULT_NOTIFICATION_PREFERENCES on the backend —
// used purely for display, to show a "Default" tag next to whichever
// toggles the user hasn't actively changed yet, so it's obvious at a
// glance which settings are still on their out-of-the-box value vs.
// which ones they've deliberately switched.
export const DEFAULT_SETTINGS = {
    emailNotifications: true,
    soundEnabled: false,
    pushNotifications: true,
};

// Actual sound file per role, served as static assets from
// public/sounds/notifications/. admin/alumni/default use the
// ElevenLabs-generated chimes the user supplied (see below); drop
// replacement files in that folder (same filenames) to change the
// sound again — no code change needed after that.
//   admin    -> "Airy social media chime, modern app alert"
//   alumni   -> "Soft chime new message notification, single bright tone"
//   default  -> "Subtle bell calendar reminder alert, gentle two-note"
export const NOTIFICATION_SOUND_FILES = {
    admin: "/sounds/notifications/admin.mp3",
    alumni: "/sounds/notifications/alumni.mp3",
    department_head: "/sounds/notifications/department_head.wav",
    default: "/sounds/notifications/default.mp3",
};
