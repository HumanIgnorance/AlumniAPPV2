import Reveal from "~/components/shared/Reveal";
import {
    RightOutlined,
    BankOutlined,
    EnvironmentOutlined,
    SolutionOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { Row, Col, Empty } from "antd";
import { normalizeJobType } from "~/hooks/usePublicJobPostsData";
import {
    Title,
    Paragraph,
    buildImageUrl,
    stripHtml,
    formatDate,
} from "~/pages/auth/public-home-page/parts/publicHomeShared";
import { usePublicHomeContext } from "~/pages/auth/public-home-page/PublicHomeContext";

export default function PublicHomeJobPosts() {
    const { jobsRef, goToJobPosts, jobsLoading, jobs } = usePublicHomeContext();

    return (
        <section className="ph-section" id="jobs" ref={jobsRef}>
            <Reveal>
                <div className="ph-section-head">
                    <div>
                        <Title level={2} className="ph-section-title">
                            Career Opportunities
                        </Title>
                        <Paragraph className="ph-section-sub">
                            Explore job openings shared by the institution and
                            its partner companies for OCC graduates.
                        </Paragraph>
                    </div>
                    <button
                        className="ph-btn ph-btn-ghost"
                        onClick={() => goToJobPosts()}
                    >
                        View All Jobs <RightOutlined />
                    </button>
                </div>
            </Reveal>

            <Row gutter={[22, 22]}>
                {jobsLoading ? (
                    null
                ) : jobs.length === 0 ? (
                    <Col span={24}>
                        <div className="ph-state-box">
                            <Empty description="No job postings available right now." />
                        </div>
                    </Col>
                ) : (
                    jobs.map((job, i) => {
                        const img = buildImageUrl(
                            job.banner_image || job.banner_image_url,
                        );
                        return (
                            <Col xs={24} sm={12} key={job.id || i}>
                                <Reveal
                                    className="ph-card"
                                    style={{ transitionDelay: `${i * 60}ms` }}
                                    onClick={() =>
                                        goToJobPosts(
                                            normalizeJobType(job.job_type),
                                        )
                                    }
                                >
                                    <div className="ph-card-icon-wrap">
                                        {img ? (
                                            <img src={img} alt={job.title} />
                                        ) : (
                                            <BankOutlined />
                                        )}
                                    </div>
                                    <div className="ph-card-body">
                                        <div className="ph-job-meta">
                                            {job.job_type && (
                                                <span className="ph-chip">
                                                    {job.job_type}
                                                </span>
                                            )}
                                            {job.location && (
                                                <span className="ph-chip">
                                                    <EnvironmentOutlined />{" "}
                                                    {job.location}
                                                </span>
                                            )}
                                        </div>
                                        <Title
                                            level={5}
                                            className="ph-card-title"
                                        >
                                            {job.title}
                                        </Title>
                                        <Paragraph className="ph-card-desc">
                                            {job.company
                                                ? `Hiring at ${job.company}`
                                                : stripHtml(job.description)}
                                        </Paragraph>
                                        <div className="ph-card-foot">
                                            <span className="ph-card-date">
                                                <SolutionOutlined />
                                                Published:{" "}
                                                {formatDate(job.created_at)}
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
