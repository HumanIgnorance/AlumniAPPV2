import { JOB_SECTIONS } from "~/config/publicSections";
import { AppstoreOutlined, PictureOutlined } from "@ant-design/icons";
import {
    ANNOUNCEMENTS_SECTIONS,
    EVENTS_SECTIONS,
    OCC_SYSTEMS,
} from "~/pages/auth/public-home-page/parts/publicHomeShared";
import { usePublicHomeContext } from "~/pages/auth/public-home-page/PublicHomeContext";

export default function PublicHomeMobileNav() {
    const {
        mobileNavOpen,
        navItems,
        goToAnnouncements,
        goToEvents,
        goToJobPosts,
        goToOccSystem,
        goTo,
        galleryNavYears,
        setMobileNavOpen,
        goToGallery,
    } = usePublicHomeContext();

    return (
        <nav
            className={`ph-mobile-panel ${mobileNavOpen ? "open" : ""}`}
            aria-hidden={!mobileNavOpen}
        >
            <div className="ph-mobile-panel-inner">
                <div className="ph-mobile-panel-links">
                    <button
                        className="ph-mobile-panel-link"
                        onClick={navItems[0].onClick}
                        tabIndex={mobileNavOpen ? 0 : -1}
                    >
                        {navItems[0].label}
                    </button>

                    {/* Gallery / Job Posts sit right beside Home, on their
                            own row above the Events group, so they read as
                            top-level pages rather than Events sub-sections. */}
                    {navItems.slice(1).map((item) => (
                        <button
                            key={item.label}
                            className="ph-mobile-panel-link"
                            onClick={item.onClick}
                            tabIndex={mobileNavOpen ? 0 : -1}
                        >
                            {item.label}
                        </button>
                    ))}

                    <span className="ph-mobile-panel-group-label">
                        Announcements
                    </span>
                    <div className="ph-mobile-panel-events-group">
                        {ANNOUNCEMENTS_SECTIONS.map((s) => (
                            <button
                                key={s.value}
                                className="ph-mobile-panel-link ph-mobile-panel-event-link"
                                onClick={() => goToAnnouncements(s.value)}
                                tabIndex={mobileNavOpen ? 0 : -1}
                            >
                                {s.icon} {s.label}
                            </button>
                        ))}
                    </div>

                    <span className="ph-mobile-panel-group-label">Events</span>
                    <div className="ph-mobile-panel-events-group">
                        {EVENTS_SECTIONS.map((s) => (
                            <button
                                key={s.value}
                                className="ph-mobile-panel-link ph-mobile-panel-event-link"
                                onClick={() => goToEvents(s.value)}
                                tabIndex={mobileNavOpen ? 0 : -1}
                            >
                                {s.icon} {s.label}
                            </button>
                        ))}
                    </div>

                    <span className="ph-mobile-panel-group-label">
                        Job Posts
                    </span>
                    <div className="ph-mobile-panel-events-group">
                        {JOB_SECTIONS.map((s) => (
                            <button
                                key={s.value}
                                className="ph-mobile-panel-link ph-mobile-panel-event-link"
                                onClick={() => goToJobPosts(s.value)}
                                tabIndex={mobileNavOpen ? 0 : -1}
                            >
                                {s.icon} {s.label}
                            </button>
                        ))}
                    </div>

                    <span className="ph-mobile-panel-group-label">
                        OCC Services
                    </span>
                    <div className="ph-mobile-panel-events-group">
                        {OCC_SYSTEMS.map((s) => (
                            <button
                                key={s.id}
                                className="ph-mobile-panel-link ph-mobile-panel-event-link"
                                onClick={() => goToOccSystem(s.id)}
                                tabIndex={mobileNavOpen ? 0 : -1}
                            >
                                {s.icon} {s.label}
                            </button>
                        ))}
                        <button
                            className="ph-mobile-panel-link ph-mobile-panel-event-link"
                            onClick={() => goTo("/occ-services")}
                            tabIndex={mobileNavOpen ? 0 : -1}
                        >
                            <AppstoreOutlined /> View All Systems
                        </button>
                    </div>

                    {galleryNavYears.length > 0 && (
                        <>
                            <span className="ph-mobile-panel-group-label">
                                Gallery
                            </span>
                            <div className="ph-mobile-panel-events-group">
                                {galleryNavYears.map((y) => (
                                    <div
                                        key={y.year}
                                        className="ph-mobile-panel-gallery-year"
                                    >
                                        <button
                                            className="ph-mobile-panel-link ph-mobile-panel-event-link"
                                            onClick={() => {
                                                setMobileNavOpen(false);
                                                goToGallery(y.year);
                                            }}
                                            tabIndex={mobileNavOpen ? 0 : -1}
                                        >
                                            <PictureOutlined /> {y.year} — All
                                        </button>
                                        {y.months.map((m) => (
                                            <button
                                                key={`${y.year}-${m.monthNumber}`}
                                                className="ph-mobile-panel-link ph-mobile-panel-event-link"
                                                style={{ paddingLeft: 34 }}
                                                onClick={() => {
                                                    setMobileNavOpen(false);
                                                    goToGallery(
                                                        y.year,
                                                        m.monthNumber,
                                                    );
                                                }}
                                                tabIndex={
                                                    mobileNavOpen ? 0 : -1
                                                }
                                            >
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                {/* Sign In / Sign Up removed from the burger panel —
                        both now live in the header itself (beside the
                        theme toggle) on every mobile breakpoint. */}
            </div>
        </nav>
    );
}
