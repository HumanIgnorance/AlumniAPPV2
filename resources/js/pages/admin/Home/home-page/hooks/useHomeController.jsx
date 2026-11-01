import { getUserRole } from "~/utils/session";
import secureLocalStorage from "react-secure-storage";
import { ROLES } from "~/config/roles";
import { STORAGE_KEYS } from "~/config/storageKeys";
import useAlumni from "~/hooks/useAlumni";
import useQuizResult from "~/hooks/useQuizResult";
import { useLocation } from "react-router-dom";
import React, { useMemo, useState, useEffect } from "react";
import { STATUS } from "~/config/status";
import axiosConfig from "~/utils/axiosConfig";
import moment from "moment";
import { CrownOutlined, TrophyOutlined } from "@ant-design/icons";
import {
    getFirstName,
    getCurrentUserId,
    ALL_QUICK_LINKS,
} from "~/pages/admin/Home/home-page/parts/homeShared";

export default function useHomeController() {
    const userRole = (
        getUserRole() ||
        secureLocalStorage.getItem("role") ||
        "alumni"
    ).toLowerCase();
    const isAlumni = userRole === ROLES.ALUMNI;
    const isAdmin = userRole === ROLES.ADMIN;
    const firstName = getFirstName();
    const currentUserId = getCurrentUserId();
    const currentUserName =
        secureLocalStorage.getItem(STORAGE_KEYS.USER_NAME) ||
        secureLocalStorage.getItem(STORAGE_KEYS.NAME) ||
        "";

    // GET /alumni is admin-only on the backend — this page is shared by
    // both admin and alumni (see MainPage.js redirect logic), so this
    // must stay disabled for non-admins or every alumni landing here
    // fires an admin-only request and gets a 403.
    const { data: alumni = [], isLoading: alumniLoading } = useAlumni({
        enabled: isAdmin,
    });
    const {
        data: quizResults = [],
        isLoading: quizLoading,
        refetch: refetchQuizResults,
    } = useQuizResult();
    const location = useLocation();

    const stats = React.useMemo(() => {
        const list = (Array.isArray(alumni) ? alumni : []).filter(
            (a) => a.status !== STATUS.REJECTED,
        );
        return {
            totalAlumni: list.length,
            employed: list.filter((a) => a.employment_status_id === 1).length,
            unemployed: list.filter((a) => a.employment_status_id === 2).length,
        };
    }, [alumni]);

    const myQuizResults = useMemo(() => {
        if (!Array.isArray(quizResults)) return [];
        const firstWord =
            (currentUserName || "").split(" ")[0].toLowerCase() || "";
        return quizResults.filter((r) => {
            if (currentUserId != null) {
                const candidateIds = [
                    r.user?.id,
                    r.alumni_id,
                    r.user_id,
                    r.alumni?.id,
                ];
                // Compare as strings — localStorage values are strings while
                // API ids often come back as numbers, so a strict === here
                // was silently matching nothing.
                if (
                    candidateIds.some(
                        (id) =>
                            id != null && String(id) === String(currentUserId),
                    )
                )
                    return true;
            }
            if (firstWord && r.user?.name) {
                return r.user.name.toLowerCase().includes(firstWord);
            }
            return false;
        });
    }, [quizResults, currentUserId, currentUserName]);

    const [recentEvents, setRecentEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsTotal, setEventsTotal] = useState(0);

    const [recentJobs, setRecentJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsTotal, setJobsTotal] = useState(0);

    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);

    const [revealed, setRevealed] = useState(false);
    const BRAND_SHOWCASE_KEY = "hp_brand_showcase_open";
    const [showBrandShowcase, setShowBrandShowcase] = useState(() => {
        try {
            const saved = secureLocalStorage.getItem(BRAND_SHOWCASE_KEY);
            return saved === true || saved === "true";
        } catch {
            return false;
        }
    });

    useEffect(() => {
        try {
            secureLocalStorage.setItem(BRAND_SHOWCASE_KEY, showBrandShowcase);
        } catch {
            // ignore storage failures (e.g. private browsing)
        }
    }, [showBrandShowcase]);

    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 60);
        return () => clearTimeout(t);
    }, []);

    // The quiz-taking page lives on a different route, so the cached
    // useQuizResult() data here can be stale by the time the user is
    // redirected back to Home right after submitting. Force a refetch
    // every time Home mounts / is navigated back to so a just-completed
    // quiz is picked up immediately instead of waiting for the next
    // background refetch.
    useEffect(() => {
        refetchQuizResults?.();
    }, [location.pathname]);

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosConfig.get("/events");
                const raw = res?.data;
                const list =
                    raw?.data || raw?.events || (Array.isArray(raw) ? raw : []);
                const total =
                    raw?.total || raw?.meta?.total || list.length || 0;
                const upcoming = list
                    .filter((e) => {
                        const d = e.start_date || e.event_date || e.date;
                        return (
                            !d ||
                            moment(d).isSameOrAfter(moment().startOf("day"))
                        );
                    })
                    .sort((a, b) =>
                        moment(
                            a.start_date || a.event_date || a.date || "",
                        ).diff(
                            moment(
                                b.start_date || b.event_date || b.date || "",
                            ),
                        ),
                    );
                setEventsTotal(total);
                setRecentEvents(upcoming.slice(0, 4));
            } catch {
                setRecentEvents([]);
                setEventsTotal(0);
            } finally {
                setEventsLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const endpoint = isAlumni
                    ? "/job-posts?status=approved"
                    : "/job-posts";
                const res = await axiosConfig.get(endpoint);
                const raw = res?.data;
                const list =
                    raw?.data ||
                    raw?.jobs ||
                    raw?.job_posts ||
                    (Array.isArray(raw) ? raw : []);
                const active = list.filter((j) => !j.is_full && !j.is_expired);
                setJobsTotal(active.length);
                setRecentJobs(active.slice(0, 4));
            } catch {
                setRecentJobs([]);
                setJobsTotal(0);
            } finally {
                setJobsLoading(false);
            }
        })();
    }, [isAlumni]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=8.5239&longitude=124.5658&current_weather=true&timezone=Asia%2FManila",
                );
                const data = await res.json();
                const cw = data?.current_weather;
                const wmoText = (code) => {
                    if (code === 0) return "Clear sky";
                    if (code <= 3) return "Partly cloudy";
                    if (code <= 49) return "Foggy";
                    if (code <= 67) return "Rainy";
                    if (code <= 77) return "Snowy";
                    if (code <= 82) return "Showers";
                    if (code <= 99) return "Thunderstorm";
                    return "Mostly cloudy";
                };
                setWeather(
                    cw
                        ? {
                              temperature: cw.temperature * (9 / 5) + 32,
                              condition_text: wmoText(cw.weathercode),
                              condition: wmoText(cw.weathercode),
                          }
                        : {
                              temperature: 83.3,
                              condition_text: "Mostly cloudy",
                              condition: "cloudy",
                          },
                );
            } catch {
                setWeather({
                    temperature: 83.3,
                    condition_text: "Mostly cloudy",
                    condition: "cloudy",
                });
            } finally {
                setWeatherLoading(false);
            }
        })();
    }, []);

    const quickLinks = ALL_QUICK_LINKS.filter((l) =>
        l.roles.includes(userRole),
    );

    const roleBadge = isAdmin ? (
        <>
            <CrownOutlined className="hp-hero-badge-icon" />
            <span>Administrator</span>
        </>
    ) : (
        <>
            <TrophyOutlined className="hp-hero-badge-icon" />
            <span>OCC Alumni</span>
        </>
    );

    const heroTagline = isAdmin ? (
        <>
            Welcome back, Admin. Manage the{" "}
            <strong>OCC Alumni Tracing System</strong> — track graduates, curate
            events, and keep the community thriving.
        </>
    ) : (
        <>
            Welcome to the <strong>OCC Alumni Tracing System</strong>. Stay
            connected, explore opportunities, and grow with your community.
        </>
    );

    return {
        isAlumni,
        isAdmin,
        firstName,
        alumniLoading,
        quizLoading,
        quizResults,
        stats,
        myQuizResults,
        recentEvents,
        eventsLoading,
        eventsTotal,
        recentJobs,
        jobsLoading,
        jobsTotal,
        weather,
        weatherLoading,
        revealed,
        showBrandShowcase,
        setShowBrandShowcase,
        quickLinks,
        roleBadge,
        heroTagline,
    };
}
