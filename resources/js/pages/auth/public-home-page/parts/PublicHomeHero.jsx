import {
    EnvironmentOutlined,
    ArrowRightOutlined,
    SoundOutlined,
} from "@ant-design/icons";
import heroVisualEvents from "~/assets/images/feature-events.png";
import { guardImageEvents } from "~/hooks/usePreventInspect";
import heroVisualAlumni from "~/assets/images/feature-alumni.png";
import heroVisualJobs from "~/assets/images/feature-jobs.png";
import heroVisualGallery from "~/assets/images/feature-gallery.png";
import { COLORS } from "~/config/theme";
import {
    Title,
    Paragraph,
    ALUMNI_TAGLINES,
} from "~/pages/auth/public-home-page/parts/publicHomeShared";
import { usePublicHomeContext } from "~/pages/auth/public-home-page/PublicHomeContext";

export default function PublicHomeHero() {
    const {
        heroRef,
        rotatorText,
        goRegister,
        scrollToRef,
        eventsRef,
        eventsLoading,
        events,
        jobsLoading,
        jobs,
    } = usePublicHomeContext();

    return (
        <section className="ph-hero" ref={heroRef}>
            <div className="ph-hero-bg" aria-hidden="true" />
            <div className="ph-hero-inner">
                <div className="ph-hero-copy">
                    <div className="ph-hero-eyebrow">
                        <EnvironmentOutlined /> Main Campus &middot; Opol,
                        Misamis Oriental
                    </div>
                    <div className="ph-hero-rotator">
                        {rotatorText}
                        <span className="caret" />
                    </div>
                    <Title level={1} className="ph-hero-title">
                        Welcome home, <span className="grad">Alumni.</span>
                    </Title>
                    <Paragraph className="ph-hero-lead">
                        browse upcoming events, explore job opportunities shared
                        by the Alumni Association, and relive campus memories
                        through the gallery — all in one place.
                    </Paragraph>
                    <div className="ph-hero-cta">
                        <button
                            className="ph-btn ph-btn-solid ph-btn-lg"
                            onClick={goRegister}
                        >
                            Get Started <ArrowRightOutlined />
                        </button>
                        <button
                            className="ph-btn ph-btn-warm ph-btn-lg"
                            onClick={() => scrollToRef(eventsRef)}
                        >
                            <SoundOutlined /> View Latest Events
                        </button>
                    </div>
                    <div className="ph-hero-stats">
                        <div className="ph-hero-stat">
                            <span className="ph-hero-stat-value">
                                {eventsLoading ? "—" : `${events.length}+`}
                            </span>
                            <span className="ph-hero-stat-label">
                                Upcoming Events
                            </span>
                        </div>
                        <div className="ph-hero-stat">
                            <span className="ph-hero-stat-value">
                                {jobsLoading ? "—" : `${jobs.length}+`}
                            </span>
                            <span className="ph-hero-stat-label">
                                Job Opportunities
                            </span>
                        </div>
                        <div className="ph-hero-stat">
                            <span className="ph-hero-stat-value">24/7</span>
                            <span className="ph-hero-stat-label">
                                Anytime Access
                            </span>
                        </div>
                    </div>
                </div>

                <div className="ph-hero-visual" aria-hidden="true">
                    <div className="ph-visual-block ph-visual-events">
                        <img
                            src={heroVisualEvents}
                            alt="Upcoming Events"
                            {...guardImageEvents}
                        />
                    </div>

                    <div className="ph-visual-block ph-visual-1">
                        <img
                            src={heroVisualAlumni}
                            alt="Alumni Directory"
                            {...guardImageEvents}
                        />
                    </div>

                    <div className="ph-visual-block ph-visual-2">
                        <img
                            src={heroVisualJobs}
                            alt="Job Posts"
                            {...guardImageEvents}
                        />
                    </div>

                    <div className="ph-visual-block ph-visual-gallery">
                        <img
                            src={heroVisualGallery}
                            alt="Photo Gallery"
                            {...guardImageEvents}
                        />
                    </div>

                    <div className="ph-visual-3">
                        <div className="ph-avatar-stack">
                            <span style={{ background: COLORS.c003366 }}>
                                O
                            </span>
                            <span
                                style={{
                                    background: COLORS.ffd700,
                                    color: COLORS.ink1a,
                                }}
                            >
                                C
                            </span>
                            <span style={{ background: COLORS.cc0000 }}>C</span>
                            <span style={{ background: COLORS.c003366 }}>
                                A
                            </span>
                        </div>
                        <span className="ph-visual-3-text-wrap">
                            {ALUMNI_TAGLINES.map((tagline, i) => (
                                <span
                                    key={tagline}
                                    className="ph-visual-3-text"
                                    style={{ animationDelay: `${i * 3}s` }}
                                >
                                    {tagline}
                                </span>
                            ))}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
