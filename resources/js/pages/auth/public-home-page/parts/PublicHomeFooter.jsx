import logo from "~/assets/images/site-logo.png";
import sealWhite from "~/assets/images/occaa-logo-white.png";
import {
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
} from "@ant-design/icons";
import { Paragraph } from "~/pages/auth/public-home-page/parts/publicHomeShared";
import { usePublicHomeContext } from "~/pages/auth/public-home-page/PublicHomeContext";

export default function PublicHomeFooter() {
    const {
        scrollToTop,
        scrollToRef,
        announcementsRef,
        eventsRef,
        galleryRef,
        jobsRef,
        goTo,
    } = usePublicHomeContext();

    return (
        <footer className="ph-footer">
            {/* Desktop: large faded white seal in the empty right side. */}
            <img
                className="ph-footer-seal ph-footer-seal--mark"
                src={sealWhite}
                alt=""
                aria-hidden="true"
                draggable="false"
                loading="lazy"
                decoding="async"
            />
            <div className="ph-footer-inner">
                <div className="ph-footer-brand-col">
                    <div className="ph-footer-brand">
                        <img src={logo} alt="OCC Alumni Logo" />
                        <span className="ph-footer-brand-title">
                            OCC Alumni Association
                        </span>
                    </div>
                    <Paragraph className="ph-footer-desc">
                        Connecting Opol Community College alumni worldwide,
                        fostering lifelong relationships with Opol Community College,
                        and supporting the next generation of OCCians.
                    </Paragraph>
                    <div className="ph-footer-social-row">
                        <div className="ph-footer-social">
                            <a href="#" aria-label="Facebook">
                                <FacebookOutlined />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <TwitterOutlined />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <InstagramOutlined />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="ph-footer-links-col">
                    <img className="ph-footer-seal ph-footer-seal--links" src={sealWhite} alt="" aria-hidden="true" draggable="false" loading="lazy" decoding="async" />
                    <div className="ph-footer-heading">Quick Links</div>
                    <div className="ph-footer-links">
                        <button onClick={scrollToTop}>Home</button>
                        <button onClick={() => scrollToRef(announcementsRef)}>
                            Announcements
                        </button>
                        <button onClick={() => scrollToRef(eventsRef)}>
                            Events
                        </button>
                        <button onClick={() => scrollToRef(galleryRef)}>
                            Gallery
                        </button>
                        <button onClick={() => scrollToRef(jobsRef)}>
                            Job Posts
                        </button>
                        <button onClick={() => goTo("/public-about")}>
                            About
                        </button>
                        <button onClick={() => goTo("/public-faq")}>
                            FAQs
                        </button>
                    </div>
                </div>

                <div>
                    <div className="ph-footer-heading">ATMS</div>
                    <div className="ph-footer-links ph-footer-links--stack">
                        <button onClick={() => goTo("/public-contact")}>
                            Contact Us
                        </button>
                        <button onClick={() => goTo("/public-credits")}>
                            Credits
                        </button>
                        <button onClick={() => goTo("/install-pwa")}>
                            Install PWA
                        </button>
                    </div>
                </div>
            </div>

            <div className="ph-footer-bottom">
                <span>ATMS - All rights reserved.</span>
                <span className="ph-footer-credit">
                    <span className="ph-footer-credit-dev">
                        <code className="ph-footer-tag">{"</>"}</code>
                        <span>Developed by</span>
                        <strong className="ph-footer-dev-name"><a
                            href="https://www.facebook.com/EphemeralKun/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Antiquina, Jonee John R.
                        </a></strong>
                    </span>
                    <span className="ph-footer-dot ph-footer-dot--group">•</span>
                    <span className="ph-footer-credit-meta">
                        <span>Secure</span><span className="ph-footer-dot">•</span><span>Alumni Association</span><span className="ph-footer-dot">•</span><span>Events</span>
                    </span>
                    <span className="ph-footer-dot ph-footer-dot--group">•</span>
                    <span className="ph-footer-credit-meta">
                        <span>© {"2025"} ATMS</span><span className="ph-footer-dot">•</span><span>Built with <span className="ph-footer-heart">❤️</span></span>
                    </span>
                </span>
            </div>
        </footer>
    );
}
