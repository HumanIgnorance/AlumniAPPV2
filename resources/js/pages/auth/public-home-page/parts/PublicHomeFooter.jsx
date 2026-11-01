import logo from "~/assets/images/site-logo.png";
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
                        fostering lifelong relationships with the institution,
                        and supporting the next generation of OCCians.
                    </Paragraph>
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

                <div>
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
                    <div className="ph-footer-links">
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
                    <code className="ph-footer-tag">{"</>"}</code>
                    Developed by{" "}
                    <strong className="ph-footer-dev-name">
                        {" "}
                        <a
                            href="https://www.facebook.com/EphemeralKun/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Antiquina, Jonee John R.
                        </a>
                    </strong>
                    <span className="ph-footer-dot">•</span> Secure
                    <span className="ph-footer-dot">•</span> Alumni Association
                    <span className="ph-footer-dot">•</span> Events
                    <span className="ph-footer-dot">•</span> © {"2025"} ATMS
                    <span className="ph-footer-dot">•</span> Built with{" "}
                    <span className="ph-footer-heart">❤️</span>
                </span>
            </div>
        </footer>
    );
}
