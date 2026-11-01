import {
    BankOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    DollarOutlined,
    EditOutlined,
    EnvironmentOutlined,
    MessageOutlined,
    QuestionCircleOutlined,
    SendOutlined,
    StopOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Card,
    Col,
    Empty,
    Progress,
    Row,
    Space,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import moment from "moment";
import { STATUS } from "~/config/status";
import { COLORS } from "~/config/theme";
import {
    getCapacityProgress,
    getJobTypeTag,
} from "~/pages/admin/JobPost/parts/jobPostHelpers";
import { buildImageUrl } from "~/pages/admin/JobPost/parts/jobPostUtils";
import { CreatorInfo } from "~/pages/admin/JobPost/parts/PersonInfo";
import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";

const { Title, Text } = Typography;

// =============== JOB POSTS GRID COMPONENT (FOR ADMIN & MY POSTINGS) ===============
export function JobPostsGrid({
    posts,
    isAdmin,
    currentUser,
    onViewDetails,
    onEdit,
    onDelete,
    onReviewApplications,
    isMyPostings = false,
}) {
    const isTouchDevice = useIsTouchDevice();
    if (posts.length === 0) {
        return (
            <Card className="empty-state-card">
                <Empty
                    description="No job posts available"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    // Check if current user is the creator of the job post
    const isJobCreator = (job) => {
        const userId = Number(currentUser?.id);
        const creatorId = Number(job.created_by_user_id) || Number(job.user_id);
        return userId === creatorId;
    };

    return (
        <Row gutter={[20, 20]} className="job-grid">
            {posts.map((post) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={post.id}>
                    <Badge.Ribbon
                        text={post.status}
                        color={
                            post.status === STATUS.APPROVED
                                ? "green"
                                : post.status === STATUS.PENDING
                                  ? "orange"
                                  : "red"
                        }
                    >
                        <Card
                            className="job-post-card"
                            hoverable
                            cover={
                                <div className="job-card-cover">
                                    {/* ============ FIX: Properly display banner image using buildImageUrl ============ */}
                                    {post.banner_image ||
                                    post.banner_image_url ? (
                                        <img
                                            src={buildImageUrl(
                                                post.banner_image ||
                                                    post.banner_image_url,
                                            )}
                                            alt={post.title}
                                            className="job-card-image"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling &&
                                                    (e.target.nextSibling.style.display =
                                                        "flex");
                                            }}
                                        />
                                    ) : null}
                                    {/* Placeholder shown when no image or image fails to load */}
                                    <div
                                        className="job-card-image-placeholder"
                                        style={{
                                            display:
                                                post.banner_image ||
                                                post.banner_image_url
                                                    ? "none"
                                                    : "flex",
                                        }}
                                    >
                                        <BankOutlined
                                            style={{
                                                fontSize: 36,
                                                color: COLORS.bfbfbf,
                                            }}
                                        />
                                    </div>
                                    {/* REMOVED: Eye icon overlay */}
                                    <div className="job-card-type-badge">
                                        {getJobTypeTag(post.job_type)}
                                    </div>
                                </div>
                            }
                        >
                            {/* Card Content */}
                            <div className="job-card-content">
                                {/* Title */}
                                <Title
                                    level={5}
                                    className="job-card-title"
                                    ellipsis={{ rows: 2 }}
                                >
                                    {post.title}
                                </Title>

                                {/* Company */}
                                <div className="job-card-company">
                                    <BankOutlined
                                        style={{
                                            marginRight: 6,
                                            color: COLORS.brand,
                                        }}
                                    />
                                    <Text strong>{post.company}</Text>
                                </div>

                                <div className="job-card-creator">
                                    <CreatorInfo creator={post.creator} />
                                </div>

                                {/* Meta Info - ✅ FIXED: Peso sign */}
                                <div className="job-card-meta">
                                    <div className="meta-item">
                                        <EnvironmentOutlined />
                                        <Text type="secondary">
                                            {post.location || "Remote"}
                                        </Text>
                                    </div>
                                    <div className="meta-item">
                                        <DollarOutlined />
                                        <Text type="secondary">
                                            {post.salary_min
                                                ? `₱${Number(post.salary_min).toLocaleString()}`
                                                : "N/A"}
                                        </Text>
                                    </div>
                                </div>

                                {/* Capacity Progress */}
                                {getCapacityProgress(post)}

                                {/* Expiration Info */}
                                {post.expires_at && !post.is_expired && (
                                    <div style={{ marginTop: 8 }}>
                                        <Tag
                                            color="blue"
                                            icon={<ClockCircleOutlined />}
                                        >
                                            {post.expiration_display} left
                                        </Tag>
                                    </div>
                                )}

                                {/* Posted Date */}
                                <div className="job-card-date">
                                    <CalendarOutlined
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 12 }}
                                    >
                                        Posted{" "}
                                        {moment(post.created_at).fromNow()}
                                    </Text>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="job-card-actions">
                                <Button
                                    type="primary"
                                    onClick={() => onViewDetails(post)}
                                    block
                                >
                                    View Details
                                </Button>

                                {/* Review Applications - Show for admin or for alumni's own approved posts */}
                                {(isAdmin ||
                                    (isJobCreator(post) &&
                                        post.status === STATUS.APPROVED)) && (
                                    <Button
                                        type="default"
                                        icon={<TeamOutlined />}
                                        onClick={() =>
                                            onReviewApplications(post)
                                        }
                                        style={{ marginTop: 8 }}
                                        block
                                    >
                                        Review Applications (
                                        {post.applications_count || 0})
                                    </Button>
                                )}

                                {/* Edit/Delete for admin OR for alumni's own PENDING posts */}
                                {(isAdmin ||
                                    (isJobCreator(post) &&
                                        post.status === STATUS.PENDING)) && (
                                    <Space
                                        style={{
                                            marginTop: 8,
                                            width: "100%",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Tooltip
                                            title="Edit"
                                            trigger={
                                                isTouchDevice ? [] : ["hover"]
                                            }
                                            open={
                                                isTouchDevice
                                                    ? false
                                                    : undefined
                                            }
                                        >
                                            <Button
                                                className="job-post-edit-btn"
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => onEdit(post)}
                                            />
                                        </Tooltip>
                                        <Tooltip
                                            title="Delete"
                                            trigger={
                                                isTouchDevice ? [] : ["hover"]
                                            }
                                            open={
                                                isTouchDevice
                                                    ? false
                                                    : undefined
                                            }
                                        >
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() =>
                                                    onDelete(post.id)
                                                }
                                            />
                                        </Tooltip>
                                    </Space>
                                )}

                                {/* ============ NEW: Help tooltip and Message Admin button for alumni's approved posts ============ */}
                                {isMyPostings &&
                                    isJobCreator(post) &&
                                    post.status === STATUS.APPROVED && (
                                        <div
                                            style={{
                                                marginTop: 8,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: 8,
                                            }}
                                        >
                                            <Tooltip
                                                title={
                                                    <div>
                                                        <Text
                                                            strong
                                                            style={{
                                                                color: COLORS.white,
                                                                display:
                                                                    "block",
                                                                marginBottom: 8,
                                                            }}
                                                        >
                                                            Why can't I edit or
                                                            delete this post?
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                color: "rgba(255,255,255,0.85)",
                                                                fontSize: 12,
                                                                display:
                                                                    "block",
                                                                marginBottom: 12,
                                                            }}
                                                        >
                                                            Once your job post
                                                            is approved, only
                                                            the admin can make
                                                            edits or delete it.
                                                            This policy protects
                                                            against malicious
                                                            modifications and
                                                            ensures all approved
                                                            job postings remain
                                                            trustworthy for our
                                                            alumni community.
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                color: "rgba(255,255,255,0.85)",
                                                                fontSize: 12,
                                                                display:
                                                                    "block",
                                                            }}
                                                        >
                                                            If you need any
                                                            changes or have
                                                            clarifications,
                                                            please message the
                                                            admin using the
                                                            button below.
                                                        </Text>
                                                    </div>
                                                }
                                                overlayStyle={{ maxWidth: 340 }}
                                                trigger={
                                                    isTouchDevice
                                                        ? []
                                                        : ["hover"]
                                                }
                                                open={
                                                    isTouchDevice
                                                        ? false
                                                        : undefined
                                                }
                                            >
                                                <Button
                                                    type="text"
                                                    icon={
                                                        <QuestionCircleOutlined
                                                            style={{
                                                                color: COLORS.antdGold,
                                                                fontSize: 18,
                                                            }}
                                                        />
                                                    }
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                title="Message Admin for Clarification"
                                                trigger={
                                                    isTouchDevice
                                                        ? []
                                                        : ["hover"]
                                                }
                                                open={
                                                    isTouchDevice
                                                        ? false
                                                        : undefined
                                                }
                                            >
                                                <Button
                                                    type="text"
                                                    icon={
                                                        <MessageOutlined
                                                            style={{
                                                                color: COLORS.antdBlue,
                                                                fontSize: 18,
                                                            }}
                                                        />
                                                    }
                                                    onClick={() => {
                                                        // Navigate to messages page with admin context
                                                        window.location.href =
                                                            "/messages";
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    )}
                            </div>
                        </Card>
                    </Badge.Ribbon>
                </Col>
            ))}
        </Row>
    );
}

// =============== FULL OR EXPIRED GRID COMPONENT ===============
export function FullOrExpiredGrid({
    posts,
    isAdmin,
    currentUser,
    onViewDetails,
    onEdit,
    onDelete,
    onReviewApplications,
}) {
    const isTouchDevice = useIsTouchDevice();
    if (posts.length === 0) {
        return (
            <Card className="empty-state-card">
                <Empty
                    description="No full or expired job posts"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    // Check if current user is the creator of the job post
    const isJobCreator = (job) => {
        if (!currentUser || !currentUser.id || !job) return false;

        const userId = Number(currentUser.id);
        const creatorId = Number(job.created_by_user_id) || Number(job.user_id);

        if (!userId || isNaN(userId) || userId === 0) return false;
        if (!creatorId || isNaN(creatorId) || creatorId === 0) return false;

        return userId === creatorId;
    };

    return (
        <Row gutter={[20, 20]} className="job-grid">
            {posts.map((post) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={post.id}>
                    <Badge.Ribbon
                        text={post.is_expired ? "Expired" : "Full"}
                        color={post.is_expired ? "red" : "volcano"}
                    >
                        <Card
                            className="job-post-card job-post-card-inactive"
                            hoverable
                            cover={
                                <div
                                    className="job-card-cover"
                                    style={{ opacity: 0.7 }}
                                >
                                    {/* ============ FIX: Properly display banner image using buildImageUrl ============ */}
                                    {post.banner_image ||
                                    post.banner_image_url ? (
                                        <img
                                            src={buildImageUrl(
                                                post.banner_image ||
                                                    post.banner_image_url,
                                            )}
                                            alt={post.title}
                                            className="job-card-image"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling &&
                                                    (e.target.nextSibling.style.display =
                                                        "flex");
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="job-card-image-placeholder"
                                        style={{
                                            display:
                                                post.banner_image ||
                                                post.banner_image_url
                                                    ? "none"
                                                    : "flex",
                                        }}
                                    >
                                        <BankOutlined
                                            style={{
                                                fontSize: 36,
                                                color: COLORS.bfbfbf,
                                            }}
                                        />
                                    </div>
                                    <div className="job-card-type-badge">
                                        {getJobTypeTag(post.job_type)}
                                    </div>
                                </div>
                            }
                        >
                            {/* Card Content */}
                            <div className="job-card-content">
                                {/* Title */}
                                <Title
                                    level={5}
                                    className="job-card-title"
                                    ellipsis={{ rows: 2 }}
                                >
                                    {post.title}
                                </Title>

                                {/* Company */}
                                <div className="job-card-company">
                                    <BankOutlined
                                        style={{
                                            marginRight: 6,
                                            color: COLORS.brand,
                                        }}
                                    />
                                    <Text strong>{post.company}</Text>
                                </div>

                                <div className="job-card-creator">
                                    <CreatorInfo creator={post.creator} />
                                </div>

                                {/* Status Tags */}
                                <div style={{ marginTop: 8 }}>
                                    {post.is_expired && (
                                        <Tag
                                            color="red"
                                            icon={<ClockCircleOutlined />}
                                        >
                                            Expired on{" "}
                                            {moment(post.expires_at).format(
                                                "MMM D, YYYY",
                                            )}
                                        </Tag>
                                    )}
                                    {post.is_full && (
                                        <Tag
                                            color="volcano"
                                            icon={<StopOutlined />}
                                        >
                                            Full ({post.applications_count}/
                                            {post.capacity})
                                        </Tag>
                                    )}
                                </div>

                                {/* Capacity Progress */}
                                {post.capacity && (
                                    <div style={{ marginTop: 8 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Applications:{" "}
                                            {post.applications_count || 0} /{" "}
                                            {post.capacity}
                                        </Text>
                                        <Progress
                                            percent={100}
                                            size="small"
                                            status="exception"
                                        />
                                    </div>
                                )}

                                {/* Posted Date */}
                                <div className="job-card-date">
                                    <CalendarOutlined
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 12 }}
                                    >
                                        Posted{" "}
                                        {moment(post.created_at).fromNow()}
                                    </Text>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="job-card-actions">
                                <Button
                                    type="primary"
                                    onClick={() => onViewDetails(post)}
                                    block
                                >
                                    View Details
                                </Button>

                                {/* Review Applications */}
                                {(isAdmin || isJobCreator(post)) && (
                                    <Button
                                        type="default"
                                        icon={<TeamOutlined />}
                                        onClick={() =>
                                            onReviewApplications(post)
                                        }
                                        style={{ marginTop: 8 }}
                                        block
                                    >
                                        Review Applications (
                                        {post.applications_count || 0})
                                    </Button>
                                )}

                                {(isAdmin || isJobCreator(post)) && (
                                    <Space
                                        style={{
                                            marginTop: 8,
                                            width: "100%",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Tooltip
                                            title="Edit"
                                            trigger={
                                                isTouchDevice ? [] : ["hover"]
                                            }
                                            open={
                                                isTouchDevice
                                                    ? false
                                                    : undefined
                                            }
                                        >
                                            <Button
                                                className="job-post-edit-btn"
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => onEdit(post)}
                                            />
                                        </Tooltip>
                                        <Tooltip
                                            title="Delete"
                                            trigger={
                                                isTouchDevice ? [] : ["hover"]
                                            }
                                            open={
                                                isTouchDevice
                                                    ? false
                                                    : undefined
                                            }
                                        >
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() =>
                                                    onDelete(post.id)
                                                }
                                            />
                                        </Tooltip>
                                    </Space>
                                )}
                            </div>
                        </Card>
                    </Badge.Ribbon>
                </Col>
            ))}
        </Row>
    );
}

// =============== JOBS GRID COMPONENT (FOR ALUMNI BROWSE) ===============
export function JobsGrid({
    jobs,
    currentUser,
    onApply,
    onViewDetails,
    onReviewApplications,
    myApplications = [],
}) {
    if (jobs.length === 0) {
        return (
            <Card className="empty-state-card">
                <Empty
                    description="No jobs available at the moment"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    // Check if current user is the creator of the job
    const isJobCreator = (job) => {
        if (!currentUser || !currentUser.id || !job) return false;

        const userId = Number(currentUser.id);
        const creatorId = Number(job.created_by_user_id) || Number(job.user_id);

        if (!userId || isNaN(userId) || userId === 0) return false;
        if (!creatorId || isNaN(creatorId) || creatorId === 0) return false;

        return userId === creatorId;
    };

    // ✅ NEW: Check if current user has already applied to this job
    const hasAlreadyApplied = (job) => {
        return myApplications.some(
            (app) =>
                Number(app.job_post_id) === Number(job.id) ||
                Number(app.job?.id) === Number(job.id),
        );
    };

    return (
        <Row gutter={[20, 20]} className="job-grid">
            {jobs.map((job) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={job.id}>
                    <Card
                        className="job-post-card job-browse-card"
                        hoverable
                        cover={
                            <div className="job-card-cover">
                                {/* ============ FIX: Properly display banner image using buildImageUrl ============ */}
                                {job.banner_image || job.banner_image_url ? (
                                    <img
                                        src={buildImageUrl(
                                            job.banner_image ||
                                                job.banner_image_url,
                                        )}
                                        alt={job.title}
                                        className="job-card-image"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling &&
                                                (e.target.nextSibling.style.display =
                                                    "flex");
                                        }}
                                    />
                                ) : null}
                                <div
                                    className="job-card-image-placeholder"
                                    style={{
                                        display:
                                            job.banner_image ||
                                            job.banner_image_url
                                                ? "none"
                                                : "flex",
                                    }}
                                >
                                    <BankOutlined
                                        style={{
                                            fontSize: 36,
                                            color: COLORS.bfbfbf,
                                        }}
                                    />
                                </div>
                                <div className="job-card-status-badge">
                                    <Tag
                                        color="green"
                                        icon={<CheckCircleOutlined />}
                                    >
                                        Live
                                    </Tag>
                                </div>
                                <div className="job-card-type-badge">
                                    {getJobTypeTag(job.job_type)}
                                </div>
                            </div>
                        }
                    >
                        {/* Card Content */}
                        <div className="job-card-content">
                            {/* Title */}
                            <Title
                                level={5}
                                className="job-card-title"
                                ellipsis={{ rows: 2 }}
                            >
                                {job.title}
                            </Title>

                            {/* Company */}
                            <div className="job-card-company">
                                <BankOutlined
                                    style={{
                                        marginRight: 6,
                                        color: COLORS.brand,
                                    }}
                                />
                                <Text strong>{job.company}</Text>
                            </div>

                            <div className="job-card-creator">
                                <CreatorInfo creator={job.creator} />
                            </div>

                            {/* Meta Info - ✅ FIXED: Peso sign */}
                            <div className="job-card-meta">
                                <div className="meta-item">
                                    <EnvironmentOutlined />
                                    <Text type="secondary">
                                        {job.location || "Remote"}
                                    </Text>
                                </div>
                                <div className="meta-item">
                                    <DollarOutlined />
                                    <Text type="secondary">
                                        {job.salary_min
                                            ? `₱${Number(job.salary_min).toLocaleString()}`
                                            : "N/A"}
                                    </Text>
                                </div>
                            </div>

                            {/* Capacity Progress */}
                            {job.capacity && (
                                <div style={{ marginTop: 8 }}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 12 }}
                                    >
                                        Spots remaining:{" "}
                                        {job.remaining_capacity} /{" "}
                                        {job.capacity}
                                    </Text>
                                    <Progress
                                        percent={Math.round(
                                            ((job.applications_count || 0) /
                                                job.capacity) *
                                                100,
                                        )}
                                        size="small"
                                        status={
                                            (job.applications_count || 0) >=
                                            job.capacity
                                                ? "exception"
                                                : "normal"
                                        }
                                        strokeColor={
                                            (job.applications_count || 0) /
                                                job.capacity <=
                                            0.5
                                                ? COLORS.antdGreen // Green - low capacity used
                                                : (job.applications_count ||
                                                        0) /
                                                        job.capacity <=
                                                    0.8
                                                  ? COLORS.antdGold // Yellow - medium capacity
                                                  : COLORS.antdRed // Red - high/full capacity
                                        }
                                    />
                                </div>
                            )}

                            {/* Expiration Info */}
                            {job.expires_at && !job.is_expired && (
                                <div style={{ marginTop: 8 }}>
                                    <Tag
                                        color="blue"
                                        icon={<ClockCircleOutlined />}
                                    >
                                        {job.expiration_display} left
                                    </Tag>
                                </div>
                            )}

                            {/* Posted Date */}
                            <div className="job-card-date">
                                <CalendarOutlined style={{ marginRight: 4 }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Posted {moment(job.created_at).fromNow()}
                                </Text>
                            </div>
                        </div>

                        {/* Card Actions */}
                        <div className="job-card-actions">
                            <Button
                                type="primary"
                                onClick={() => onViewDetails(job)}
                                block
                            >
                                View Details
                            </Button>
                            {/* ✅ UPDATED: If user is the creator, show Review Applications. If already applied, show "Already Applied". Otherwise show "Apply Now" */}
                            {isJobCreator(job) ? (
                                <Button
                                    type="default"
                                    icon={<TeamOutlined />}
                                    onClick={() => onReviewApplications(job)}
                                    style={{ marginTop: 8 }}
                                    block
                                >
                                    Review Applications (
                                    {job.applications_count || 0})
                                </Button>
                            ) : hasAlreadyApplied(job) ? (
                                // ✅ NEW: Show "Already Applied" button if user has applied to this job
                                <Button
                                    type="default"
                                    disabled
                                    icon={<CheckCircleOutlined />}
                                    style={{
                                        marginTop: 8,
                                        backgroundColor: COLORS.f6ffed,
                                        borderColor: "#b7eb8f",
                                        color: COLORS.antdGreen,
                                    }}
                                    block
                                >
                                    Already Applied
                                </Button>
                            ) : (
                                <Button
                                    type="default"
                                    icon={<SendOutlined />}
                                    onClick={() => onApply(job)}
                                    style={{ marginTop: 8 }}
                                    block
                                >
                                    Apply Now
                                </Button>
                            )}
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
