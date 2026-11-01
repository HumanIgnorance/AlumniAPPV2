import { Typography } from "antd";
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from "@ant-design/icons";
import logo from "~/assets/images/site-logo.png";
import { SITE } from "~/config/site";

const { Paragraph } = Typography;

/** Footer shared by the public pages. All text/identity comes from config/site.js. */
const PublicFooter = ({ goTo }) => {
    return (
    <footer className="ph-footer">
        <div className="ph-footer-inner">
            <div className="ph-footer-brand-col">
                <div className="ph-footer-brand">
                    <img src={logo} alt="OCC Alumni Logo" />
                    <span className="ph-footer-brand-title">{SITE.associationName}</span>
                </div>
                <Paragraph className="ph-footer-desc">
                    Connecting Opol Community College alumni worldwide, fostering
                    lifelong relationships with the institution, and supporting
                    the next generation of OCCians.
                </Paragraph>
                <div className="ph-footer-social">
                    <a href="#" aria-label="Facebook"><FacebookOutlined /></a>
                    <a href="#" aria-label="Twitter"><TwitterOutlined /></a>
                    <a href="#" aria-label="Instagram"><InstagramOutlined /></a>
                </div>
            </div>

            <div>
                <div className="ph-footer-heading">Quick Links</div>
                <div className="ph-footer-links">
                    <button onClick={() => goTo("/")}>Home</button>
                    {/* <button onClick={() => goTo("/public-events")}>Events</button>
                    <button onClick={() => goTo("/public-gallery")}>Gallery</button>
                    <button onClick={() => goTo("/public-job-posts")}>Job Posts</button>
                    <button onClick={() => goTo("/public-announcements")}>Announcements</button>
                    <button onClick={() => goTo("/public-about")}>About</button>
                    <button onClick={() => goTo("/public-faq")}>FAQs</button> */}
                </div>
            </div>

            <div>
                <div className="ph-footer-heading">{SITE.appName}</div>
                <div className="ph-footer-links">
                    <button onClick={() => goTo("/public-contact")}>Contact Us</button>
                    <button onClick={() => goTo("/public-credits")}>Credits</button>
                    <button onClick={() => goTo("/install-pwa")}>Install PWA</button>
                </div>
            </div>
        </div>

        <div className="ph-footer-bottom">
            <span>{SITE.appName} - All rights reserved.</span>
            <span className="ph-footer-credit">
                <code className="ph-footer-tag">{"</>"}</code>
                Developed by <strong className="ph-footer-dev-name"> <a href={SITE.developer.url} target="_blank" rel="noopener noreferrer">{SITE.developer.name}</a></strong>
                <span className="ph-footer-dot">•</span> Secure
                <span className="ph-footer-dot">•</span> Alumni Association
                <span className="ph-footer-dot">•</span> Events
                <span className="ph-footer-dot">•</span> © {SITE.copyrightYear} {SITE.appName}
                <span className="ph-footer-dot">•</span> Built with <span className="ph-footer-heart">❤️</span>
            </span>
        </div>
    </footer>
    );
};

export default PublicFooter;
