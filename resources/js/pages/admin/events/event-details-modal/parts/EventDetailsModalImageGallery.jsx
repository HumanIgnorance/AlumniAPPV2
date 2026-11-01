import { Carousel, Image } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useEventDetailsModalContext } from "~/pages/admin/events/event-details-modal/EventDetailsModalContext";

export default function EventDetailsModalImageGallery() {
    const {
        carouselKey,
        event,
        setGalPreviewIndex,
        setGalPreviewOpen,
        galPreviewOpen,
        galPreviewIndex,
    } = useEventDetailsModalContext();

    return (
        <div className="event-gallery-section">
            <Carousel
                key={carouselKey}
                arrows
                dots={{ className: "custom-dots" }}
                effect="fade"
                className="event-carousel"
                afterChange={() => {
                    // Defensive repaint nudge for mobile portrait.
                    // The CSS fix (pinning .slick-track) handles
                    // the root cause, but some WebKit/Blink
                    // builds can still finish a fade transition
                    // without actually painting the <img>. This
                    // forces an invisible reflow on the newly
                    // active slide's image so it always paints.
                    requestAnimationFrame(() => {
                        const activeImg = document.querySelector(
                            ".event-carousel .slick-active .event-detail-image",
                        );
                        if (activeImg) {
                            const prevDisplay = activeImg.style.display;
                            activeImg.style.display = "none";
                            // Reading offsetHeight forces the
                            // browser to flush layout before we
                            // restore display, triggering a
                            // fresh repaint.

                            activeImg.offsetHeight;
                            activeImg.style.display = prevDisplay || "block";
                        }
                    });
                }}
            >
                {event.image_urls?.map((image, index) => (
                    <div key={index} className="carousel-slide">
                        {/* Plain <img> — avoids Antd <Image> wrapper
                                        collapsing inside slick on portrait mobile.
                                        loading="eager" is intentional: lazy-loading
                                        inside a modal can leave images blank on iOS
                                        because the modal is not considered "in viewport". */}
                        <img
                            src={image || "/placeholder.svg"}
                            alt={`${event.title} - Image ${index + 1}`}
                            className="event-detail-image"
                            loading="eager"
                            onClick={() => {
                                setGalPreviewIndex(index);
                                setGalPreviewOpen(true);
                            }}
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                            }}
                        />
                        <div
                            className="event-detail-image-overlay"
                            onClick={() => {
                                setGalPreviewIndex(index);
                                setGalPreviewOpen(true);
                            }}
                        >
                            <EyeOutlined />
                            <span>View Photo</span>
                        </div>
                    </div>
                ))}
            </Carousel>
            {/* Hidden Antd preview group — provides zoom / rotate / swipe UX */}
            <div style={{ display: "none" }}>
                <Image.PreviewGroup
                    preview={{
                        visible: galPreviewOpen,
                        current: galPreviewIndex,
                        onVisibleChange: (v) => setGalPreviewOpen(v),
                        onChange: (idx) => setGalPreviewIndex(idx),
                    }}
                >
                    {event.image_urls?.map((image, index) => (
                        <Image key={index} src={image || "/placeholder.svg"} />
                    ))}
                </Image.PreviewGroup>
            </div>
        </div>
    );
}
