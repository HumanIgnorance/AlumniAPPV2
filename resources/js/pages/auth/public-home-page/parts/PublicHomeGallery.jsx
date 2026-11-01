import Reveal from "~/components/shared/Reveal";
import { RightOutlined, PictureOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import { guardImageEvents } from "~/hooks/usePreventInspect";
import {
    Title,
    Paragraph,
    getGalleryImageList,
    buildImageUrl,
    formatDate,
} from "~/pages/auth/public-home-page/parts/publicHomeShared";
import { usePublicHomeContext } from "~/pages/auth/public-home-page/PublicHomeContext";

export default function PublicHomeGallery() {
    const { galleryRef, goTo, galleryLoading, gallery, setLightboxItem } =
        usePublicHomeContext();

    return (
        <section className="ph-section" id="gallery" ref={galleryRef}>
            <Reveal>
                <div className="ph-section-head">
                    <div>
                        <Title level={2} className="ph-section-title">
                            Moments That Matter
                        </Title>
                        <Paragraph className="ph-section-sub">
                            Relive the spirit of OCC through snapshots from
                            alumni events, campus life, and reunions.
                        </Paragraph>
                    </div>
                    <button
                        className="ph-btn ph-btn-ghost"
                        onClick={() => goTo("/public-gallery")}
                    >
                        View Full Gallery <RightOutlined />
                    </button>
                </div>
            </Reveal>

            {galleryLoading ? null : gallery.length === 0 ? (
                <div className="ph-state-box">
                    <Empty description="No photos uploaded yet." />
                </div>
            ) : (
                <div className="ph-gallery-grid">
                    {gallery.map((g, i) => {
                        const images = getGalleryImageList(g).map((p) =>
                            buildImageUrl(p),
                        );
                        const img = images[0];
                        const extraCount = images.length - 1;
                        const publishedLabel = g.created_at
                            ? `Published: ${formatDate(g.created_at)}`
                            : "";
                        return (
                            <Reveal
                                as="div"
                                key={g.id || i}
                                className="ph-gallery-item"
                                style={{ transitionDelay: `${i * 50}ms` }}
                                onClick={() =>
                                    img &&
                                    setLightboxItem({
                                        src: img,
                                        title: g.title,
                                        publishedLabel,
                                    })
                                }
                            >
                                {img ? (
                                    <img
                                        src={img}
                                        alt={g.title || "Gallery photo"}
                                        {...guardImageEvents}
                                    />
                                ) : (
                                    <div
                                        className="ph-card-icon-wrap"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        <PictureOutlined />
                                    </div>
                                )}
                                {extraCount > 0 && (
                                    <span className="ph-gallery-count-badge">
                                        {extraCount}+
                                    </span>
                                )}
                                <div className="ph-gallery-overlay">
                                    <span className="ph-gallery-overlay-title">
                                        {g.title || "Alumni memory"}
                                    </span>
                                    {publishedLabel && (
                                        <span className="ph-gallery-overlay-date">
                                            {publishedLabel}
                                        </span>
                                    )}
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
