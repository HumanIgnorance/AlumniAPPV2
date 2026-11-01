import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import secureLocalStorage from "react-secure-storage";
import {
    DEFAULT_SETTINGS,
    NOTIFICATION_SOUND_FILES,
    SETTINGS_KEY_MAP,
} from "~/components/layout/utils/layoutConstants";
import axiosConfig from "~/utils/axiosConfig";
import { getUserRole } from "~/utils/session";

export default function useNotificationSettings() {
    const [settings, setSettings] = useState({
        ...DEFAULT_SETTINGS,
        darkMode: false,
    });

    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // Mirrors `settings` for the polling interval below. The interval is
    // registered once (empty-deps useEffect, further down) and reuses
    // the SAME fetchNotifications closure for every 30s tick. Reading
    // `settings.soundEnabled` directly inside that closure meant it was
    // permanently frozen at whatever "settings" was on the very first
    // render (soundEnabled: false, before the saved preference even
    // finished loading from the server) — so toggling sound on in the
    // Settings modal never had any effect on the polling loop; the sound
    // toggle looked "on" but no sound ever played. Reading from this ref
    // instead always sees the live value without needing to tear down
    // and recreate the interval on every settings change.
    const settingsRef = useRef(settings);

    useEffect(() => {
        settingsRef.current = settings;
    }, [settings]);

    // Cache of <audio> elements per role so we don't re-create/re-fetch
    // the file on every single notification — created lazily the first
    // time each role's sound is needed.
    const notificationAudioCacheRef = useRef({});

    // Chrome/Firefox/Safari all block audio playback that isn't tied to
    // a user gesture (click/tap/keypress) until the page has been
    // "unlocked" once. playNotificationSound() is only ever called from
    // the 30s polling setInterval — never from a click — so without
    // this, audio.play() silently rejects (NotAllowedError, swallowed
    // by the existing .catch()), producing no audible sound even
    // though nothing visibly errors. This is why sound can appear
    // completely silent for every user regardless of the
    // sound_enabled toggle: the toggle was never the only gate.
    //
    // Fix: the first time the user clicks/taps/presses a key anywhere
    // on the page, prime every cached notification sound and resume
    // the shared AudioContext, once per browser session.
    const audioUnlockedRef = useRef(false);

    useEffect(() => {
        if (audioUnlockedRef.current) return;

        const unlock = () => {
            if (audioUnlockedRef.current) return;
            audioUnlockedRef.current = true;

            // Prime each role's <audio> element with a muted play/pause
            // cycle. This is what actually satisfies Safari's stricter
            // per-element gesture requirement (unlocking one <audio>
            // doesn't unlock another created later, so all four are
            // primed up front here rather than lazily in
            // playNotificationSound).
            Object.entries(NOTIFICATION_SOUND_FILES).forEach(
                ([roleKey, src]) => {
                    try {
                        let audio = notificationAudioCacheRef.current[roleKey];
                        if (!audio) {
                            audio = new Audio(src);
                            audio.preload = "auto";
                            audio.volume = 0.6;
                            notificationAudioCacheRef.current[roleKey] = audio;
                        }
                        const wasMuted = audio.muted;
                        audio.muted = true;
                        const p = audio.play();
                        if (p && typeof p.then === "function") {
                            p.then(() => {
                                audio.pause();
                                audio.currentTime = 0;
                                audio.muted = wasMuted;
                            }).catch(() => {
                                audio.muted = wasMuted;
                            });
                        } else {
                            audio.pause();
                            audio.currentTime = 0;
                            audio.muted = wasMuted;
                        }
                    } catch (e) {
                        console.error(
                            `Failed to prime notification audio for ${roleKey}:`,
                            e,
                        );
                    }
                },
            );

            document.removeEventListener("click", unlock);
            document.removeEventListener("keydown", unlock);
            document.removeEventListener("touchstart", unlock);
        };

        document.addEventListener("click", unlock);
        document.addEventListener("keydown", unlock);
        document.addEventListener("touchstart", unlock);

        return () => {
            document.removeEventListener("click", unlock);
            document.removeEventListener("keydown", unlock);
            document.removeEventListener("touchstart", unlock);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Plays ONLY the org's own sound file for the role — no synthesized
    // fallback tone. Previously a WebAudio "bell" tone would play
    // whenever the mp3 failed or errored, and that generated tone could
    // start milliseconds apart from (or on top of) the real mp3,
    // producing the "overlap"/phased sound that wasn't the org's actual
    // chime. If the mp3 can't play for some reason, we simply log it —
    // no substitute sound is generated.
    const playNotificationSound = (forRole) => {
        const activeRole = forRole || getUserRole();
        const src =
            NOTIFICATION_SOUND_FILES[activeRole] ||
            NOTIFICATION_SOUND_FILES.default;

        try {
            let audio = notificationAudioCacheRef.current[activeRole];
            if (!audio) {
                audio = new Audio(src);
                audio.preload = "auto";
                audio.volume = 0.6;
                notificationAudioCacheRef.current[activeRole] = audio;
            } else {
                // Restart from the beginning if a previous play is still
                // finishing up (e.g. two notifications arrive close
                // together).
                audio.currentTime = 0;
            }

            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch((e) => {
                    console.error("Failed to play notification sound file:", e);
                });
            }
        } catch (e) {
            console.error("Failed to play notification sound:", e);
        }
    };

    // Fetches the user's saved preferences from the backend so they're
    // consistent across devices/browsers, using the localStorage copy
    // only as an instant-paint fallback while that request is in flight.
    useEffect(() => {
        const cached = secureLocalStorage.getItem("notificationSettings");
        if (cached) {
            try {
                setSettings((prev) => ({ ...prev, ...JSON.parse(cached) }));
            } catch (e) {
                console.error("Failed to parse cached notification settings");
            }
        }

        (async () => {
            try {
                const { data } = await axiosConfig.get(
                    "/notification-settings",
                    { suppressGenericModal: true },
                );
                if (data?.success && data.data) {
                    const fromServer = {
                        emailNotifications: data.data.email_notifications,
                        soundEnabled: data.data.sound_enabled,
                        pushNotifications: data.data.push_notifications,
                    };
                    setSettings((prev) => ({ ...prev, ...fromServer }));
                    secureLocalStorage.setItem(
                        "notificationSettings",
                        JSON.stringify(fromServer),
                    );
                }
            } catch (e) {
                // Not fatal — the localStorage cache (or the in-state
                // defaults) is still a usable fallback.
                console.error("Failed to load notification settings:", e);
            } finally {
                setSettingsLoaded(true);
            }
        })();
    }, []);

    const handleSettingsChange = async (key, value) => {
        setSettings((prev) => {
            const updated = { ...prev, [key]: value };
            secureLocalStorage.setItem(
                "notificationSettings",
                JSON.stringify(updated),
            );
            return updated;
        });

        // Turning push notifications on requires the browser's own
        // permission prompt — ask right when the user opts in, not
        // silently, so they understand why the prompt appeared.
        if (
            key === "pushNotifications" &&
            value &&
            typeof window !== "undefined" &&
            "Notification" in window &&
            window.Notification.permission === "default"
        ) {
            try {
                const permission =
                    await window.Notification.requestPermission();
                if (permission !== "granted") {
                    message.warning(
                        "Browser permission was not granted, so push notifications won't show.",
                    );
                }
            } catch (e) {
                console.error("Failed to request notification permission:", e);
            }
        }

        const backendKey = SETTINGS_KEY_MAP[key];
        if (backendKey) {
            try {
                await axiosConfig.put("/notification-settings", {
                    [backendKey]: value,
                });
                message.success("Setting updated successfully");
            } catch (e) {
                console.error("Failed to save notification setting:", e);
                message.error(
                    "Setting saved on this device, but failed to sync — try again later.",
                );
            }
        } else {
            message.success("Setting updated successfully");
        }
    };

    return {
        settingsRef,
        playNotificationSound,
        settings,
        settingsLoaded,
        handleSettingsChange,
    };
}
