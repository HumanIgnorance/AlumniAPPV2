import "~/pages/auth/PublicHomePage-styles";
import ScrollProgressOrb from "~/pages/admin/ScrollProgress/ScrollProgressOrb";
import Reveal from "~/components/shared/Reveal";
import { MailOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { ZoomWarningModal } from "~/hooks/usePreventInspect";
import {
    GalleryLightbox,
    Title,
    Paragraph,
} from "~/pages/auth/public-home-page/parts/publicHomeShared";
import { PublicHomeProvider } from "~/pages/auth/public-home-page/PublicHomeContext";
import usePublicHomeController from "~/pages/auth/public-home-page/hooks/usePublicHomeController";
import PublicHomeHeader from "~/pages/auth/public-home-page/parts/PublicHomeHeader";
import PublicHomeMobileNav from "~/pages/auth/public-home-page/parts/PublicHomeMobileNav";
import PublicHomeHero from "~/pages/auth/public-home-page/parts/PublicHomeHero";
import PublicHomeLatestActiveAnnouncements from "~/pages/auth/public-home-page/parts/PublicHomeLatestActiveAnnouncements";
import PublicHomeEvents from "~/pages/auth/public-home-page/parts/PublicHomeEvents";
import PublicHomeGallery from "~/pages/auth/public-home-page/parts/PublicHomeGallery";
import PublicHomeJobPosts from "~/pages/auth/public-home-page/parts/PublicHomeJobPosts";
import PublicHomeFooter from "~/pages/auth/public-home-page/parts/PublicHomeFooter";

function PublicHomePage() {
    const ctx = usePublicHomeController();
    const {
        isDark,
        lightboxItem,
        setLightboxItem,
        goRegister,
        goLogin,
        zoomModalOpen,
        closeZoomModal,
    } = ctx;

    return (
        <PublicHomeProvider value={ctx}>
            <div className={`ph-page ${isDark ? "dark" : "light"}`}>
                <ScrollProgressOrb />
                {/* ============ HEADER ============ */}
                <PublicHomeHeader />

                {/* ============ MOBILE NAV PANEL ============ */}
                {/* Sits directly under the header, in normal document flow —
                not a full-screen drawer. While open it sticks to the same
                spot as the header itself as you scroll, and the page
                underneath (hero, sections, footer) stays fully scrollable
                and visible in both portrait and landscape. */}
                <PublicHomeMobileNav />

                {/* ============ HERO ============ */}
                <PublicHomeHero />

                {/* ============ ANNOUNCEMENTS ============ */}
                {/* Latest 6 active announcements across every category, pinned
                first — the full, per-category breakdown lives on the
                dedicated /public-announcements page (reached via "View All"
                below or the header's Announcements dropdown). */}
                <PublicHomeLatestActiveAnnouncements />

                {/* ============ EVENTS ============ */}
                <PublicHomeEvents />

                {/* ============ GALLERY ============ */}
                <PublicHomeGallery />

                {/* ============ GALLERY LIGHTBOX ============ */}
                {lightboxItem && (
                    <GalleryLightbox
                        item={lightboxItem}
                        onClose={() => setLightboxItem(null)}
                    />
                )}

                {/* ============ JOB POSTS ============ */}
                <PublicHomeJobPosts />

                {/* ============ COMING SOON: E-NEWSLETTER ============ */}
                <section className="ph-section">
                    <Reveal as="div" className="ph-soon-card">
                        <span className="ph-soon-badge">
                            <span className="ph-soon-pulse" />
                            Launching Soon
                        </span>
                        <Title level={2} className="ph-soon-title">
                            Stay Connected —{" "}
                            <span className="grad">E-Newsletter</span>
                        </Title>
                        <Paragraph className="ph-soon-sub">
                            We're putting the finishing touches on a new way to
                            keep every OCC alumnus in the loop: a regular
                            E-Newsletter, launching soon right here on the
                            Alumni portal.
                        </Paragraph>
                        <div className="ph-soon-actions">
                            <button
                                type="button"
                                className="ph-btn ph-btn-ghost ph-btn-lg ph-soon-btn"
                                disabled
                            >
                                <MailOutlined /> E-Newsletter
                                <span className="ph-soon-chip">Soon</span>
                            </button>
                        </div>
                    </Reveal>
                </section>

                {/* ============ CTA BANNER ============ */}
                <Reveal as="div" className="ph-cta-banner">
                    <div className="ph-cta-content">
                        <Title level={2} className="ph-cta-title">
                            Ready to reconnect with OCC?
                        </Title>
                        <Paragraph className="ph-cta-sub">
                            Create your Alumni account to register for events,
                            apply to job posts, and stay connected with the
                            community you grew up with.
                        </Paragraph>
                        <div className="ph-cta-actions">
                            <button
                                className="ph-btn ph-btn-white ph-btn-lg"
                                onClick={goRegister}
                            >
                                Create Account <ArrowRightOutlined />
                            </button>
                            <button
                                className="ph-btn ph-btn-outline-white ph-btn-lg"
                                onClick={goLogin}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </Reveal>

                {/* ============ FOOTER ============ */}
                <PublicHomeFooter />

                <ZoomWarningModal
                    open={zoomModalOpen}
                    onClose={closeZoomModal}
                />
            </div>
        </PublicHomeProvider>
    );
}

export default PublicHomePage;
