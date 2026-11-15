import React from "react";
import { Image } from "antd";
import Modal from "~/components/shared/AppModal";
import "./DetailModal.css";

/**
 * ONE layout for every "click a card -> see the details" dialog.
 *
 *   <DetailModal open={!!item} onClose={close} title={item.title}>
 *       <DetailBody
 *           images={urls}                       // 0 = optional `fallback`, 1 = banner, 2+ = tidy grid
 *           tags={[<Tag/>, <Tag/>]}
 *           meta={[{ icon: <CalendarOutlined />, label: "Date", value: "Nov 14, 2026" }]}
 *       >
 *           the description / body text
 *       </DetailBody>
 *   </DetailModal>
 *
 * Order is always: banner -> tags -> labelled facts -> body. Everything is a
 * full-width block, so there is no empty gutter beside a small thumbnail and
 * the facts always line up the same way across the whole app.
 */
export function DetailModal({ open, onClose, title, width = 640, className = "", children, footer = null }) {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={title}
            footer={footer}
            width={width}
            centered
            destroyOnClose
            className={`dm-modal ${className}`.trim()}
        >
            {children}
        </Modal>
    );
}

export function DetailBody({
    images = [],
    fallback = null, // node shown (compact) when there are no images
    tags = [],
    meta = [],
    preview = false, // true = antd <Image> click-to-zoom, false = plain <img> (pass imgProps to guard it)
    imgProps = {},
    alt = "",
    children,
}) {
    const list = (images || []).filter(Boolean);
    const facts = (meta || []).filter((m) => m && m.value !== undefined && m.value !== null && m.value !== "");

    const renderImg = (src, i, cls) =>
        preview ? (
            <Image key={i} src={src} alt={alt} wrapperClassName={cls} rootClassName="dm-img-root" />
        ) : (
            <span key={i} className={cls}>
                <img src={src} alt={alt} {...imgProps} />
            </span>
        );

    let media = null;
    if (list.length === 1) {
        media = <div className="dm-media dm-media--single">{renderImg(list[0], 0, "dm-img")}</div>;
    } else if (list.length > 1) {
        const grid = (
            <div className={`dm-media dm-media--grid dm-cols-${Math.min(list.length, 3)}`}>
                {list.map((src, i) => renderImg(src, i, "dm-img"))}
            </div>
        );
        media = preview ? <Image.PreviewGroup>{grid}</Image.PreviewGroup> : grid;
    } else if (fallback) {
        media = <div className="dm-media dm-media--fallback">{fallback}</div>;
    }

    return (
        <div className="dm">
            {media}

            {tags.length > 0 && (
                <div className="dm-tags">
                    {tags.map((t, i) => (
                        <React.Fragment key={i}>{t}</React.Fragment>
                    ))}
                </div>
            )}

            {facts.length > 0 && (
                <dl className="dm-facts">
                    {facts.map((m, i) => (
                        <div className="dm-fact" key={i}>
                            <span className="dm-fact-icon" aria-hidden="true">
                                {m.icon}
                            </span>
                            <div className="dm-fact-text">
                                <dt>{m.label}</dt>
                                <dd>{m.value}</dd>
                            </div>
                        </div>
                    ))}
                </dl>
            )}

            {children ? <div className="dm-body">{children}</div> : null}
        </div>
    );
}

export default DetailModal;
