import Reveal from "~/components/shared/Reveal";
import {
    RightOutlined,
    SoundOutlined,
    CalendarOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { Row, Col, Empty } from "antd";
import {
    Title,
    Paragraph,
    buildImageUrl,
    stripHtml,
    formatDate,
} from "~/pages/auth/public-home-page/parts/publicHomeShared";
import { usePublicHomeContext } from "~/pages/auth/public-home-page/PublicHomeContext";

export default function PublicHomeEvents() {
    const { eventsRef, goToEvents, eventsLoading, events } =
        usePublicHomeContext();

    return (
        <section className="ph-section" id="events" ref={eventsRef}>
            <Reveal>
                <div className="ph-section-head">
                    <div>
                        <Title level={2} className="ph-section-title">
                            Upcoming Events
                        </Title>
                        <Paragraph className="ph-section-sub">
                            Stay in the loop on reunions, seminars, and
                            gatherings hosted by the Alumni Association.
                        </Paragraph>
                    </div>
                    <button
                        className="ph-btn ph-btn-ghost"
                        onClick={goToEvents}
                    >
                        View All <RightOutlined />
                    </button>
                </div>
            </Reveal>

            <Row gutter={[22, 22]}>
                {eventsLoading ? (
                    null
                ) : events.length === 0 ? (
                    <Col span={24}>
                        <div className="ph-state-box">
                            <Empty description="No events posted yet. Check back soon!" />
                        </div>
                    </Col>
                ) : (
                    events.map((ev, i) => {
                        const img =
                            buildImageUrl(ev.image_urls?.[0]) ||
                            buildImageUrl(ev.image);
                        return (
                            <Col xs={24} sm={12} key={ev.id || i}>
                                <Reveal
                                    className="ph-card"
                                    style={{ transitionDelay: `${i * 60}ms` }}
                                    onClick={goToEvents}
                                >
                                    <div className="ph-card-icon-wrap">
                                        {img ? (
                                            <img src={img} alt={ev.title} />
                                        ) : (
                                            <SoundOutlined />
                                        )}
                                    </div>
                                    <div className="ph-card-body">
                                        <Title
                                            level={5}
                                            className="ph-card-title"
                                        >
                                            {ev.title}
                                        </Title>
                                        <Paragraph className="ph-card-desc">
                                            {stripHtml(ev.description) ||
                                                "Tap Read More for full event details."}
                                        </Paragraph>
                                        {ev.created_at && (
                                            <span className="ph-card-published">
                                                Published:{" "}
                                                {formatDate(ev.created_at)}
                                            </span>
                                        )}
                                        <div className="ph-card-foot">
                                            <span className="ph-card-date">
                                                <CalendarOutlined />
                                                {formatDate(
                                                    ev.date || ev.event_date,
                                                )}
                                            </span>
                                            <span className="ph-card-link">
                                                Read More <ArrowRightOutlined />
                                            </span>
                                        </div>
                                    </div>
                                </Reveal>
                            </Col>
                        );
                    })
                )}
            </Row>
        </section>
    );
}
