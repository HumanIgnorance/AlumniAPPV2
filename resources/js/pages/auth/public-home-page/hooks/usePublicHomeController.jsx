import { useAppTheme } from "~/hooks/useAppTheme";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import usePreventInspect from "~/hooks/usePreventInspect";
import usePublicHomeData from "~/hooks/usePublicHomeData";
import usePublicGalleryData from "~/hooks/usePublicGalleryData";
import usePublicAnnouncementsData from "~/hooks/usePublicAnnouncementsData";
import { buildPageTitle } from "~/config/site";
import useEventListener from "~/hooks/useEventListener";
import useHeaderHeightVar from "~/hooks/useHeaderHeightVar";
import { JOB_SECTIONS } from "~/config/publicSections";
import { AppstoreOutlined } from "@ant-design/icons";
import {
    ROTATING_WORDS,
    ANNOUNCEMENTS_SECTIONS,
    EVENTS_SECTIONS,
    OCC_SYSTEMS,
} from "~/pages/auth/public-home-page/parts/publicHomeShared";

export default function usePublicHomeController() {
    const { theme: currentTheme, toggleTheme } = useAppTheme();
    const isDark = currentTheme === "black";

    const [scrolled, setScrolled] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [rotatorIndex, setRotatorIndex] = useState(0);
    const [rotatorText, setRotatorText] = useState("");
    const [rotatorTyping, setRotatorTyping] = useState(true);
    const [lightboxItem, setLightboxItem] = useState(null);
    const { zoomModalOpen, closeZoomModal } = usePreventInspect();

    const {
        events,
        eventsLoading,
        gallery,
        galleryLoading,
        jobs,
        jobsLoading,
    } = usePublicHomeData();

    // Powers ONLY the header's "Gallery" dropdown (year -> month picker).
    // The teaser grid further down the page still uses `gallery` from
    // usePublicHomeData above (latest 8, no year/month grouping needed
    // there) — same separation of concerns as usePublicGalleryData's own
    // file header explains.
    const { years: galleryYears } = usePublicGalleryData();

    // Powers the homepage's "Latest Announcements" teaser: the 6 most
    // recent active announcements across every category, pinned first.
    // The full, per-category breakdown only lives on /public-announcements.
    const { latest: latestAnnouncements, loading: announcementsLoading } =
        usePublicAnnouncementsData();

    const heroRef = useRef(null);
    const announcementsRef = useRef(null);
    const eventsRef = useRef(null);
    const galleryRef = useRef(null);
    const jobsRef = useRef(null);
    const headerRef = useRef(null);

    // ============ Lock scroll while the gallery lightbox is open ============
    useEffect(() => {
        if (lightboxItem) {
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prevOverflow;
            };
        }
        return undefined;
    }, [lightboxItem]);

    // ============ Page title ============
    useEffect(() => {
        document.title = buildPageTitle("Home");
    }, []);

    // ============ Floating header shadow on scroll ============
    // Force-closes the mobile nav panel on scroll, same as
    // PublicEventsPage.js / PublicGalleryPage.js / PublicJobPostsPage.js /
    // PublicOccServicesPage.js. Note: this was previously removed because
    // it broke scrolling through the categories/sections list while the
    // panel was open on a phone — if that resurfaces, the panel is also
    // reachable via its own "Close" (X) button in the header.
    useEventListener("scroll", () => {
        setScrolled(window.scrollY > 8);
        setMobileNavOpen((open) => (open ? false : open));
    });

    // ============ Keep --ph-header-h in sync with the real header ============
    // The header is position: fixed so it floats above the page on every
    // device (desktop, laptop, and mobile in both portrait and landscape).
    // Its actual rendered height changes with breakpoint, text wrapping,
    // and orientation, so instead of guessing pixel values in CSS, we
    // measure it live and publish it as a CSS variable. Page content
    // padding and the mobile nav panel's offset both read this variable,
    // so they always sit flush under the header with zero dead space and
    // no chance of drifting out of sync.
    useHeaderHeightVar(headerRef);

    // ============ Hero word rotator (typewriter) ============
    useEffect(() => {
        const currentWord =
            ROTATING_WORDS[rotatorIndex % ROTATING_WORDS.length];
        let timeout;

        if (rotatorTyping) {
            if (rotatorText.length < currentWord.length) {
                timeout = setTimeout(() => {
                    setRotatorText(
                        currentWord.slice(0, rotatorText.length + 1),
                    );
                }, 90);
            } else {
                timeout = setTimeout(() => setRotatorTyping(false), 1400);
            }
        } else {
            if (rotatorText.length > 0) {
                timeout = setTimeout(() => {
                    setRotatorText(rotatorText.slice(0, -1));
                }, 45);
            } else {
                setRotatorIndex((i) => (i + 1) % ROTATING_WORDS.length);
                setRotatorTyping(true);
            }
        }
        return () => clearTimeout(timeout);
    }, [rotatorText, rotatorTyping, rotatorIndex]);

    // (No more body-scroll lock: the mobile nav is now an in-flow panel
    // under the header, not a full-screen overlay, so the rest of the
    // page — including the footer — stays reachable by normal scrolling
    // while it's open.)

    // ============ Data: events, gallery, job posts ============
    // All three now come from usePublicHomeData() above — see that
    // file for the fetch logic and the note about securing the
    // underlying endpoints on the backend.

    const goLogin = useCallback(() => {
        window.location.href = "/login";
    }, []);

    const goRegister = useCallback(() => {
        window.location.href = "/register";
    }, []);

    // Full announcements page — one section per category. The header's
    // Announcements dropdown and the teaser's "View All" both land here.
    // Passing a category jumps straight to that section, e.g.
    // goToAnnouncements("maintenance") -> /public-announcements?category=maintenance
    const goToAnnouncements = useCallback((category) => {
        window.location.href = category
            ? `/public-announcements?category=${category}`
            : "/public-announcements";
    }, []);

    // Full events page — Upcoming / Ongoing / Completed / Featured.
    // "View All" and every event card's "Read More" both land here
    // instead of gating straight to /login, since browsing the full
    // events list is public; only registering requires an account.
    // Passing a section jumps straight to that part of the page, e.g.
    // goToEvents("ongoing") -> /public-events?section=ongoing
    const goToEvents = useCallback((section) => {
        window.location.href = section
            ? `/public-events?section=${section}`
            : "/public-events";
    }, []);

    // Full job posts page — Full-time / Part-time / Contract. "View All
    // Jobs" and the header's Job Posts dropdown both land here instead
    // of gating straight to /login, since browsing the full job list is
    // public; only applying requires an account.
    // Passing a type jumps straight to that section, e.g.
    // goToJobPosts("part-time") -> /public-job-posts?type=part-time
    const goToJobPosts = useCallback((type) => {
        window.location.href = type
            ? `/public-job-posts?type=${type}`
            : "/public-job-posts";
    }, []);

    // goToGallery(2026) -> /public-gallery?year=2026
    // goToGallery(2026, 6) -> /public-gallery?year=2026&month=6 (June)
    // goToGallery() -> /public-gallery (no filter, just the full page)
    // `month` is 1-based here to stay human-readable in the URL.
    const goToGallery = useCallback((year, month) => {
        if (!year) {
            window.location.href = "/public-gallery";
            return;
        }
        const params = new URLSearchParams({ year: String(year) });
        if (month) params.set("month", String(month));
        window.location.href = `/public-gallery?${params.toString()}`;
    }, []);

    const scrollToRef = (ref) => {
        setMobileNavOpen(false);
        ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const scrollToTop = () => {
        setMobileNavOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goTo = (path) => {
        setMobileNavOpen(false);
        window.location.href = path;
    };

    // Sends the visitor to the OCC Services directory page, scrolled
    // straight to the system they picked from the header dropdown.
    // The actual jump to that system's own external site still happens
    // from the "Visit Campus Website" button on that system's card —
    // this just gets them to the right card first.
    const goToOccSystem = (systemId) => {
        setMobileNavOpen(false);
        window.location.href = `/occ-services?system=${systemId}`;
    };

    // "Events" is no longer a plain scroll link — it opens the
    // Upcoming/Ongoing/Completed/Featured dropdown instead (rendered
    // separately, right after Home, in both the desktop nav and the
    // mobile panel below). The homepage's own inline events preview
    // is still reachable, but only from the footer's Events link.
    // "Gallery" works the same way now — see galleryDropdownMenu below —
    // so it's dropped from this flat list too.
    const navItems = [
        { label: "Home", onClick: scrollToTop },
        // { label: "Announcements", onClick: () => goTo("/") },
        // { label: "E-Newsletter", onClick: () => goTo("/") },
    ];

    // "Announcements" opens a category dropdown (General / Academic /
    // Event / Career / Urgent / Maintenance / Other) that jumps straight
    // to that section on /public-announcements, same pattern as Events.
    const announcementsDropdownMenu = {
        items: ANNOUNCEMENTS_SECTIONS.map((s) => ({
            key: s.value,
            label: s.label,
            icon: s.icon,
        })),
        onClick: ({ key }) => {
            setMobileNavOpen(false);
            goToAnnouncements(key);
        },
    };

    const eventsDropdownMenu = {
        items: EVENTS_SECTIONS.map((s) => ({
            key: s.value,
            label: s.label,
            icon: s.icon,
        })),
        onClick: ({ key }) => {
            setMobileNavOpen(false);
            goToEvents(key);
        },
    };

    // "Job Posts" works the same way as "Events" now — opening a
    // Full-time / Part-time / Contract dropdown that jumps straight to
    // that section on /public-job-posts, instead of a plain scroll link.
    const jobsDropdownMenu = {
        items: JOB_SECTIONS.map((s) => ({
            key: s.value,
            label: s.label,
            icon: s.icon,
        })),
        onClick: ({ key }) => {
            setMobileNavOpen(false);
            goToJobPosts(key);
        },
    };

    // "OCC Services" opens a dropdown listing every OCC system (Main
    // Site, SIS, Admission, CSDL, Alumni) — picking one jumps straight
    // to that system's own site in a new tab. "View All Systems" at
    // the bottom instead goes to the full /occ-services directory
    // page here in the app, which also shows live reachability status
    // for each one side by side.
    const occServicesDropdownMenu = {
        items: [
            ...OCC_SYSTEMS.map((s) => ({
                key: s.id,
                label: s.label,
                icon: s.icon,
            })),
            { type: "divider", key: "occ-services-div" },
            {
                key: "occ-services-view-all",
                label: "View All Systems",
                icon: <AppstoreOutlined />,
            },
        ],
        onClick: ({ key }) => {
            setMobileNavOpen(false);
            if (key === "occ-services-view-all") {
                goTo("/occ-services");
                return;
            }
            const system = OCC_SYSTEMS.find((s) => s.id === key);
            if (system) goToOccSystem(system.id);
        },
    };

    // ============================================================
    // "Gallery" header dropdown — Year, then Month within it, sourced
    // from usePublicGalleryData()'s year/month grouping. "Undated"
    // entries are left out here on purpose: there's nothing meaningful
    // to jump to for an album with no date, and the full gallery is
    // still one click away via "Gallery" itself when nothing has
    // loaded yet (see the plain-button fallback in the header below).
    // ============================================================
    const galleryNavYears = useMemo(() => {
        return (galleryYears || [])
            .filter((y) => y.year !== "Undated")
            .map((y) => ({
                year: y.year,
                months: (y.months || [])
                    .filter((m) => m.month !== "undated")
                    .map((m) => ({
                        monthNumber: m.month + 1, // 1-based, human-readable in the URL
                        label: m.monthLabel,
                    })),
            }));
    }, [galleryYears]);

    const galleryDropdownItems = useMemo(
        () =>
            galleryNavYears.map((y) => ({
                key: `gallery-year-${y.year}`,
                label: String(y.year),
                children: [
                    {
                        key: `gallery-year-${y.year}-all`,
                        label: `All of ${y.year}`,
                    },
                    ...(y.months.length
                        ? [
                              {
                                  type: "divider",
                                  key: `gallery-year-${y.year}-div`,
                              },
                          ]
                        : []),
                    ...y.months.map((m) => ({
                        key: `gallery-year-${y.year}-month-${m.monthNumber}`,
                        label: m.label,
                    })),
                ],
            })),
        [galleryNavYears],
    );

    // Parses keys like "gallery-year-2026" (-> year only), or
    // "gallery-year-2026-all" / "gallery-year-2026-month-6" (-> year +
    // month) and routes to /public-gallery with the matching params.
    const galleryDropdownMenu = {
        items: galleryDropdownItems,
        onClick: ({ key }) => {
            setMobileNavOpen(false);
            const match = String(key).match(
                /^gallery-year-(\d+)(?:-(all)|-month-(\d+))?$/,
            );
            if (!match) return;
            const [, year, , month] = match;
            goToGallery(year, month ? Number(month) : undefined);
        },
    };

    return {
        toggleTheme,
        isDark,
        scrolled,
        mobileNavOpen,
        setMobileNavOpen,
        rotatorText,
        lightboxItem,
        setLightboxItem,
        zoomModalOpen,
        closeZoomModal,
        events,
        eventsLoading,
        gallery,
        galleryLoading,
        jobs,
        jobsLoading,
        latestAnnouncements,
        announcementsLoading,
        heroRef,
        announcementsRef,
        eventsRef,
        galleryRef,
        jobsRef,
        headerRef,
        goLogin,
        goRegister,
        goToAnnouncements,
        goToEvents,
        goToJobPosts,
        goToGallery,
        scrollToRef,
        scrollToTop,
        goTo,
        goToOccSystem,
        navItems,
        announcementsDropdownMenu,
        eventsDropdownMenu,
        jobsDropdownMenu,
        occServicesDropdownMenu,
        galleryNavYears,
        galleryDropdownItems,
        galleryDropdownMenu,
    };
}
