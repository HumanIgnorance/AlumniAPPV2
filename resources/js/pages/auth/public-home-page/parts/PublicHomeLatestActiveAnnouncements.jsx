import Reveal from "~/components/shared/Reveal";
import {
    RightOutlined,
    PushpinFilled,
    NotificationOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { Row, Col, Empty } from "antd";
import { COLORS } from "~/config/theme";
import { ANNOUNCEMENT_CATEGORIES } from "~/hooks/usePublicAnnouncementsData";
import {
    Title,
    Paragraph,
    buildImageUrl,
    stripHtml,
    formatDate,
} from "~/pages/auth/public-home-page/parts/publicHomeShared";
import { usePublicHomeContext } from "~/pages/auth/public-home-page/PublicHomeContext";

export default function PublicHomeLatestActiveAnnouncements() {
    const {
        announcementsRef,
        goToAnnouncements,
        announcementsLoading,
        latestAnnouncements,
    } = usePublicHomeContext();

    return (
        <section
            className="ph-section"
            id="announcements"
            ref={announcementsRef}
        >
            <Reveal>
                <div className="ph-section-head">
                    <div>
                        <Title level={2} className="ph-section-title">
                            Latest Announcements
                        </Title>
                        <Paragraph className="ph-section-sub">
                            News, updates, and notices from the OCC Alumni
                            Association.
                        </Paragraph>
                    </div>
                    <button
                        className="ph-btn ph-btn-ghost"
                        onClick={() => goToAnnouncements()}
                    >
                        View All <RightOutlined />
                    </button>
                </div>
            </Reveal>

            <Row gutter={[22, 22]}>
                {announcementsLoading ? (
                    null
                ) : latestAnnouncements.length === 0 ? (
                    <Col span={24}>
                        <div className="ph-state-box">
                            <Empty description="No announcements posted yet. Check back soon!" />
                        </div>
                    </Col>
                ) : (
                    latestAnnouncements.map((a, i) => {
                        const img =
                            buildImageUrl(a.images?.[0]) ||
                            buildImageUrl(a.image_urls?.[0]);
                        return (
                            <Col xs={24} sm={12} lg={8} key={a.id || i}>
                                <Reveal
                                    className="ph-card"
                                    style={{ transitionDelay: `${i * 60}ms` }}
                                    onClick={() =>
                                        goToAnnouncements(a.category)
                                    }
                                >
                                    <div className="ph-card-icon-wrap">
                                        {a.pinned && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: 8,
                                                    left: 8,
                                                    fontSize: 12,
                                                    color: COLORS.ffd700,
                                                    zIndex: 2,
                                                }}
                                            >
                                                <PushpinFilled />
                                            </span>
                                        )}
                                        {img ? (
                                            <img src={img} alt={a.title} />
                                        ) : (
                                            <NotificationOutlined />
                                        )}
                                    </div>
                                    <div className="ph-card-body">
                                        <Title
                                            level={5}
                                            className="ph-card-title"
                                        >
                                            {a.title}
                                        </Title>
                                        <Paragraph className="ph-card-desc">
                                            {stripHtml(a.content) ||
                                                "Tap Read More for the full announcement."}
                                        </Paragraph>
                                        <span className="ph-card-published">
                                            Published:{" "}
                                            {formatDate(
                                                a.publish_date || a.created_at,
                                            )}
                                        </span>
                                        <div className="ph-card-foot">
                                            <span className="ph-card-date">
                                                <NotificationOutlined />{" "}
                                                {ANNOUNCEMENT_CATEGORIES.find(
                                                    (c) =>
                                                        c.value ===
                                                        (a.category ||
                                                            "general"),
                                                )?.label || "General"}
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
