import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useMessagesContext } from "~/pages/admin/messages/MessagesContext";
import { prefetchImage } from "~/utils/saveImage";

export default function ImageLightbox() {
    const { lightboxImage, closeLightbox, isAdmin, downloadImage } =
        useMessagesContext();

    useEffect(() => {
        if (lightboxImage && isAdmin) prefetchImage(lightboxImage);
    }, [lightboxImage, isAdmin]);

    return (
        lightboxImage &&
        createPortal(
            <div className="image-lightbox" onClick={closeLightbox}>
                <div
                    className="lightbox-actions"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="lightbox-close"
                        onClick={closeLightbox}
                        title="Close image"
                        aria-label="Close image"
                    >
                        ×
                    </button>

                    {isAdmin && (
                        <button
                            className="lightbox-download"
                            onClick={(e) => {
                                e.stopPropagation();
                                downloadImage(lightboxImage);
                            }}
                            title="Download image"
                            aria-label="Download image"
                        >
                            ⬇
                        </button>
                    )}
                </div>

                <div className="lightbox-image-wrap">
                    <img
                        src={lightboxImage || "/placeholder.svg"}
                        alt="Full size"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>,
            document.body,
        )
    );
}
