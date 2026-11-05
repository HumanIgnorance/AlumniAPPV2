import { Typography } from "antd";
import { ANNOUNCEMENT_CATEGORIES } from "~/hooks/usePublicAnnouncementsData";
import {
    NotificationOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    StarOutlined,
    GlobalOutlined,
    IdcardOutlined,
    SolutionOutlined,
    AppstoreOutlined,
    TeamOutlined,
    SearchOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { BASE_URL } from "~/utils/constant";
import { useState, useEffect } from "react";
import { guardImageEvents } from "~/hooks/usePreventInspect";

export const { Title, Paragraph } = Typography;

// ============================================================
// Words that cycle inside the hero pill, mirrors the "Connect /
// Engage / Thrive" rotator from the reference design.
// ============================================================
export const ROTATING_WORDS = ["Connect", "Engage", "Thrive", "Belong", "Grow"];

// ============================================================
// Options behind the header's "Events" dropdown. Picking one takes
// the visitor straight to that section on the dedicated events page
// (/public-events?section=...) — the homepage's own inline Upcoming
// Events preview further down is reached only via the footer's
// "Events" Quick Link, per the "footer stays Home-events-only" rule.
// ============================================================
// ============================================================
// Options behind the header's "Announcements" dropdown. Picking one
// takes the visitor straight to that category on the dedicated
// announcements page (/public-announcements?category=...) — same
// pattern as the Events/Job Posts dropdowns below. The homepage's own
// inline "Latest Announcements" preview further down always shows the
// 6 most recent across every category, regardless of which one is
// picked here.
// ============================================================
export const ANNOUNCEMENTS_SECTIONS = ANNOUNCEMENT_CATEGORIES.map((c) => ({
    value: c.value,
    label: c.label,
    icon: <NotificationOutlined />,
}));

export const EVENTS_SECTIONS = [
    { value: "upcoming", label: "Upcoming", icon: <ClockCircleOutlined /> },
    { value: "ongoing", label: "Ongoing", icon: <CheckCircleOutlined /> },
    { value: "completed", label: "Completed", icon: <CheckCircleOutlined /> },
    { value: "featured", label: "Featured", icon: <StarOutlined /> },
];

// ============================================================
// Options behind the header's "OCC Services" dropdown — OCC's family
// of systems (kept in sync with OCC_SYSTEMS in
// PublicOccServicesPage.js; update both lists together if a system is
// added, renamed, or moves to a new domain). Picking a system opens
// that campus site directly in a new tab, since these are separate
// domains outside this app. A "View All Systems" item at the bottom
// still takes the visitor to the full /occ-services directory page,
// for the side-by-side comparison with live status checks.
// ============================================================
export const OCC_SYSTEMS = [
    {
        id: "official",
        label: "OCC Official Website",
        tag: "Main Site",
        icon: <GlobalOutlined />,
        url: "https://www.occ.edu.ph",
    },
    {
        id: "sis",
        label: "Student Information System",
        tag: "Enrolled Students",
        icon: <IdcardOutlined />,
        url: "https://www.sis.occph.com",
    },
    {
        id: "admission",
        label: "Admission System",
        tag: "Applicants",
        icon: <SolutionOutlined />,
        url: "https://www.admission.occph.com",
    },
    {
        id: "csdl",
        label: "CSDL Portal",
        tag: "Student Services",
        icon: <AppstoreOutlined />,
        url: "https://www.csdl.occph.com",
    },
    {
        id: "alumni",
        label: "Alumni System",
        tag: "Alumni",
        icon: <TeamOutlined />,
        url: "https://www.alumni.occph.com",
    },
    {
        id: "sclf",
        label: "SCLF — Smart Campus Lost & Found",
        tag: "Students & Staff",
        icon: <SearchOutlined />,
        url: "https://sclfapp.ethiodeploy.app",
    },
];

// ============================================================
// Taglines that crossfade inside the center "OCC" badge overlaying
// the 4-image showcase grid (Events / Alumni / Jobs / Gallery).
// ============================================================
export const ALUMNI_TAGLINES = [
    "Where Legacy Lives",
    "Excellence Beyond Boundaries",
    "Connection for Life",
    "Empowering Minds",
    "Transforming Futures",
];

// ============================================================
// Small helper — builds an absolute URL for images that come back
// from the API as relative storage paths. Mirrors buildImageUrl()
// used in AdminAlumniJobPostPage.js so uploaded event / gallery /
// job images resolve the same way everywhere in the app.
// ============================================================
export const buildImageUrl = (imagePath) => {
    try {
        if (!imagePath) return null;
        const base = String(BASE_URL || "").replace(/\/$/, "");
        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {
            return imagePath;
        }
        if (imagePath.startsWith("data:")) return imagePath;
        const raw = String(imagePath);
        const noLeading = raw.replace(/^\/+/, "");
        if (raw.startsWith("/storage/")) return `${base}${raw}`;
        if (noLeading.startsWith("storage/")) return `${base}/${noLeading}`;
        return `${base}/storage/${noLeading}`;
    } catch {
        return null;
    }
};

export const formatDate = (value) => {
    if (!value) return "";
    try {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    } catch {
        return "";
    }
};

export const stripHtml = (value) => {
    if (!value) return "";
    return String(value)
        .replace(/<[^>]*>/g, "")
        .trim();
};

// ------------------------------------------------------------
// Gallery items can carry a single image_url or a full image_urls[]
// batch (an alumni event album, for instance, uploaded as one gallery
// entry with several photos inside it). These two helpers give the
// full photo list for a gallery card and how many photos are in it,
// so the grid can show a "3+" style badge instead of only ever
// showing the first photo with no indication there are more.
// ------------------------------------------------------------
export const getGalleryImageList = (gallery) => {
    if (Array.isArray(gallery?.image_urls) && gallery.image_urls.length > 0) {
        return gallery.image_urls;
    }
    if (gallery?.image_url) return [gallery.image_url];
    return [];
};

export const getGalleryImageCount = (gallery) =>
    getGalleryImageList(gallery).length;

// ============================================================
// Reveal-on-scroll wrapper — lightweight IntersectionObserver based
// fade/slide-up, same easing family as the rest of the app.
// ============================================================
// ============================================================
// Image protection helpers — best-effort deterrents against casual
// right-click-save / long-press-save / drag-save. None of this can
// make an image un-screenshottable (nothing can), but it removes the
// easy "Save Image As…" paths so downloading a full-quality photo
// stays a signed-in, logged action rather than a right-click away.
// Real downloads live behind /login, same as everything else here.
// ============================================================
// ============================================================
// Gallery lightbox — tapping/clicking a thumbnail no longer sends
// visitors to /login; it opens this zoomed preview instead. On desktop
// the thumbnail shows a zoom-in cursor as the affordance; on both
// desktop and mobile, clicking/tapping the enlarged image itself
// toggles a closer zoom level in place.
// ============================================================
export const GalleryLightbox = ({ item, onClose }) => {
    const [zoomed, setZoomed] = useState(false);

    useEffect(() => {
        setZoomed(false);
    }, [item]);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    if (!item) return null;

    return (
        <div className="ph-lightbox-overlay" onClick={onClose}>
            <button
                type="button"
                className="ph-lightbox-close"
                onClick={onClose}
                aria-label="Close preview"
            >
                <CloseOutlined />
            </button>
            <div
                className="ph-lightbox-content"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={item.src}
                    alt={item.title || "Alumni memory"}
                    className={`ph-lightbox-img ${zoomed ? "is-zoomed" : ""}`}
                    onClick={() => setZoomed((z) => !z)}
                    {...guardImageEvents}
                />
                <div className="ph-lightbox-caption">
                    <span className="ph-lightbox-title">
                        {item.title || "Alumni memory"}
                    </span>
                    {item.publishedLabel && (
                        <span className="ph-lightbox-date">
                            {item.publishedLabel}
                        </span>
                    )}
                </div>
                <span className="ph-lightbox-hint">
                    Tap the photo to {zoomed ? "zoom out" : "zoom in"} &middot;
                    Sign in to download
                </span>
            </div>
        </div>
    );
};
