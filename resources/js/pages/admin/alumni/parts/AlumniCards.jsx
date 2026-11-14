import { useMemo } from "react";
import {
    BellOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    EditOutlined,
    EnvironmentOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Badge,
    Card,
    Checkbox,
    Divider,
    Space,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import moment from "moment";
import { ROLES } from "~/config/roles";
import { COLORS } from "~/config/theme";
import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";
import {
    getAlumniQuizStatus,
    getEmploymentStatusTag,
    getStatusIcon,
} from "~/pages/admin/alumni/parts/alumniListHelpers";
import { LastActiveIndicator } from "~/pages/admin/alumni/parts/LastActiveIndicator";
import { getUserRole } from "~/utils/session";

const { Title, Text, Paragraph } = Typography;

// ============ END BULK STATUS UPDATE MODAL ============

// One labelled row of the card: [icon] [label] [value] — columns line up
// across every row so the card reads like a tidy form.
const AlumniRow = ({ icon, label, children }) => (
    <div className="alumni-row">
        <span className="alumni-row-icon">{icon}</span>
        <Text type="secondary" className="alumni-row-label">
            {label}
        </Text>
        <div className="alumni-row-value">{children}</div>
    </div>
);

export const AlumniCard = ({
    alumnus,
    handleView,
    handleStatusUpdate,
    isSelectable,
    isSelected,
    onSelectChange,
}) => {
    const role = getUserRole();
    const isTouchDevice = useIsTouchDevice();

    const isRecentlyUpdated = useMemo(() => {
        if (!alumnus.updated_at) return false;
        const updated = moment(alumnus.updated_at);
        const now = moment();

        return (
            now.diff(updated, "seconds") < 30 &&
            alumnus.created_at !== alumnus.updated_at
        );
    }, [alumnus.updated_at, alumnus.created_at]);

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onSelectChange(alumnus.id, e.target.checked);
    };

    // ---- display values (no dangling "•", no placeholder bio) ----
    const fullName = [alumnus.first_name, alumnus.last_name, alumnus.suffix]
        .filter(Boolean)
        .join(" ");
    const courseLabel =
        alumnus.course?.course_code ||
        (typeof alumnus.course === "string" ? alumnus.course : "") ||
        alumnus.major ||
        "";
    const metaLine = [
        courseLabel,
        alumnus.graduation_year ? `Class of ${alumnus.graduation_year}` : "",
    ]
        .filter(Boolean)
        .join(" • ");
    // Only show the tag when the backend explicitly says "false".
    const showUnverified = role === "admin" && alumnus.email_verified === false;
    const skills = Array.isArray(alumnus?.technical_skills)
        ? alumnus.technical_skills
        : [];
    const bio = (alumnus.bio || "").trim();
    const hasBio = bio !== "" && !/^(none|n\/a|na|null|-+)$/i.test(bio);

    return (
        <Badge.Ribbon
            text="Featured"
            color="red"
            style={{ display: alumnus.isFeatured ? "block" : "none" }}
        >
            <Card
                className={`alumni-card ${isSelected ? "alumni-card-selected" : ""}`}
                actions={[
                    <Tooltip
                        key="view"
                        onClick={() => handleView(alumnus)}
                        title="View Profile"
                        trigger={isTouchDevice ? [] : ["hover"]}
                        open={isTouchDevice ? false : undefined}
                    >
                        <EyeOutlined />
                    </Tooltip>,
                    ...(role === ROLES.ADMIN
                        ? [
                              <Tooltip
                                  title="Edit Status"
                                  key="edit"
                                  onClick={() =>
                                      handleStatusUpdate(alumnus, "approved")
                                  }
                                  trigger={isTouchDevice ? [] : ["hover"]}
                                  open={isTouchDevice ? false : undefined}
                              >
                                  <EditOutlined />
                              </Tooltip>,
                          ]
                        : []),
                ]}
            >
                <div className="alumni-card-content">
                    {isSelectable && (
                        <div
                            className="alumni-card-checkbox"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Checkbox
                                checked={isSelected}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                    )}

                    {/* Header: avatar + (name / course · class / verify tag).
                        Everything is vertically centred and the name never
                        breaks in the middle of a word. */}
                    <div className="alumni-header">
                        <Avatar
                            size={56}
                            src={alumnus.profile_image_url}
                            icon={<UserOutlined />}
                            className="alumni-avatar"
                        />
                        <div className="alumni-basic-info">
                            <div className="alumni-name-row">
                                <Title
                                    level={5}
                                    className="alumni-name"
                                    title={fullName}
                                >
                                    {fullName}
                                </Title>
                                <span className="alumni-status-icon">
                                    {getStatusIcon(alumnus.status)}
                                </span>
                            </div>
                            {metaLine && (
                                <Text type="secondary" className="alumni-meta">
                                    {metaLine}
                                </Text>
                            )}
                            {showUnverified && (
                                <Tag
                                    color="orange"
                                    className="alumni-verify-tag"
                                >
                                    Email not verified
                                </Tag>
                            )}
                        </div>
                    </div>

                    <Divider className="alumni-divider" />

                    <div className="alumni-rows">
                        <AlumniRow icon={<TeamOutlined />} label="Employment">
                            {getEmploymentStatusTag(
                                alumnus?.employment_status?.status_name,
                            )}
                        </AlumniRow>

                        {alumnus.currentCompany && (
                            <AlumniRow icon={<UserOutlined />} label="Company">
                                <Text>{alumnus.currentCompany}</Text>
                                {alumnus.position && (
                                    <Text type="secondary">
                                        {" "}
                                        • {alumnus.position}
                                    </Text>
                                )}
                            </AlumniRow>
                        )}

                        <AlumniRow
                            icon={<EnvironmentOutlined />}
                            label="Address"
                        >
                            <Text>{alumnus.address || "—"}</Text>
                        </AlumniRow>

                        {alumnus.salary && (
                            <AlumniRow icon={<DollarOutlined />} label="Salary">
                                <Text strong>
                                    ${alumnus.salary.toLocaleString()}
                                </Text>
                                <Text type="secondary"> /year</Text>
                            </AlumniRow>
                        )}

                        <AlumniRow
                            icon={<CalendarOutlined />}
                            label="Last active"
                        >
                            <LastActiveIndicator
                                lastActive={
                                    alumnus.last_active ||
                                    alumnus.lastActive ||
                                    null
                                }
                                isOnline={alumnus.is_online || false}
                            />
                        </AlumniRow>

                        {role === ROLES.ADMIN && alumnus.admin_notes && (
                            <AlumniRow
                                icon={<ExclamationCircleOutlined />}
                                label="Note"
                            >
                                <Text
                                    type="secondary"
                                    style={{ fontStyle: "italic" }}
                                >
                                    {alumnus.admin_notes}
                                </Text>
                            </AlumniRow>
                        )}
                    </div>

                    {skills.length > 0 && (
                        <div className="alumni-skills">
                            {skills.slice(0, 4).map((skill) => (
                                <Tag key={skill} className="skill-tag">
                                    {skill}
                                </Tag>
                            ))}
                            {skills.length > 4 && (
                                <Tag className="skill-tag">
                                    +{skills.length - 4} more
                                </Tag>
                            )}
                        </div>
                    )}

                    {/* Hidden when empty or a placeholder such as "None" */}
                    {hasBio && (
                        <Paragraph ellipsis={{ rows: 2 }} className="alumni-bio">
                            {bio}
                        </Paragraph>
                    )}
                </div>
            </Card>
        </Badge.Ribbon>
    );
};

// ============ NEW REGISTERED CARD ============
export const NewRegisteredCard = ({
    alumnus,
    handleView,
    handleStatusUpdate,
    quizResults,
}) => {
    const role = getUserRole();
    const isTouchDevice = useIsTouchDevice();
    const quizStatuses = getAlumniQuizStatus(alumnus, quizResults);

    // "New Acct" badge lifetime = exactly 24 hours from the registration timestamp.
    // Example: registered today at 1:00 PM → badge disappears tomorrow at 1:00 PM.
    const showNewBadge = useMemo(() => {
        if (!alumnus.created_at) return false;
        const created = moment(alumnus.created_at);
        if (!created.isValid()) return false;
        return moment().diff(created, "hours", true) < 24;
    }, [alumnus.created_at]);

    const CardInner = (
        <Card
            className="alumni-card new-registered-card"
            actions={[
                <Tooltip
                    key="view"
                    onClick={() => handleView(alumnus)}
                    title="View Profile"
                    trigger={isTouchDevice ? [] : ["hover"]}
                    open={isTouchDevice ? false : undefined}
                >
                    <EyeOutlined />
                </Tooltip>,
                ...(role === ROLES.ADMIN
                    ? [
                          <Tooltip
                              title="Edit Status"
                              key="edit"
                              onClick={() =>
                                  handleStatusUpdate(alumnus, "approved")
                              }
                              trigger={isTouchDevice ? [] : ["hover"]}
                              open={isTouchDevice ? false : undefined}
                          >
                              <EditOutlined />
                          </Tooltip>,
                      ]
                    : []),
            ]}
        >
            <div className="alumni-card-content">
                {/* ── Avatar + name row ── */}
                <div className="alumni-header">
                    <Avatar size={56} src={alumnus.profile_image_url} />
                    <div className="alumni-basic-info">
                        <Title
                            level={5}
                            className="alumni-name"
                            style={{ marginBottom: 2 }}
                        >
                            {alumnus.first_name} {alumnus.last_name}
                            {getStatusIcon(alumnus.status)}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {alumnus.major} • {alumnus.graduation_year}
                        </Text>
                    </div>
                </div>

                <Divider style={{ margin: "8px 0" }} />

                {/* ── Quiz status badges ── */}
                <div className="nr-quiz-status" style={{ marginBottom: 8 }}>
                    <Text
                        strong
                        style={{
                            fontSize: 11,
                            display: "block",
                            marginBottom: 5,
                        }}
                    >
                        Quiz Status:
                    </Text>
                    {quizStatuses.length === 0 ? (
                        <Tag color="default" style={{ fontSize: 11 }}>
                            No quizzes available
                        </Tag>
                    ) : (
                        <Space wrap size={[4, 4]}>
                            {quizStatuses.map((qs) => (
                                <Tooltip
                                    key={qs.type}
                                    title={
                                        qs.taken
                                            ? `${qs.label} completed`
                                            : `${qs.label} not taken`
                                    }
                                    trigger={isTouchDevice ? [] : ["hover"]}
                                    open={isTouchDevice ? false : undefined}
                                >
                                    <Tag
                                        color={qs.taken ? "green" : "orange"}
                                        icon={qs.icon}
                                        style={{ fontSize: 11, margin: 0 }}
                                    >
                                        {qs.label}:{" "}
                                        <strong>
                                            {qs.taken
                                                ? "Completed ✓"
                                                : "Not Taken"}
                                        </strong>
                                    </Tag>
                                </Tooltip>
                            ))}
                        </Space>
                    )}
                </div>

                <Divider style={{ margin: "8px 0" }} />

                {/* ── Details ── */}
                <div className="alumni-details">
                    <div className="detail-item-alumini">
                        <TeamOutlined />
                        <Text strong style={{ fontSize: 12 }}>
                            Employment:
                        </Text>
                        {getEmploymentStatusTag(
                            alumnus?.employment_status?.status_name,
                        )}
                    </div>

                    {alumnus.address && (
                        <div className="detail-item-alumini">
                            <EnvironmentOutlined />
                            <Text style={{ fontSize: 12 }}>
                                {alumnus.address}
                            </Text>
                        </div>
                    )}

                    <div className="detail-item-alumini">
                        <CalendarOutlined />
                        <LastActiveIndicator
                            lastActive={
                                alumnus.last_active ||
                                alumnus.lastActive ||
                                null
                            }
                            isOnline={alumnus.is_online || false}
                        />
                    </div>

                    <div className="detail-item-alumini">
                        <ClockCircleOutlined />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Registered:{" "}
                            {alumnus.created_at
                                ? moment(alumnus.created_at).fromNow()
                                : "N/A"}
                        </Text>
                    </div>

                    {role === ROLES.ADMIN && alumnus.admin_notes && (
                        <div className="detail-item-alumini">
                            <ExclamationCircleOutlined />
                            <Text
                                type="secondary"
                                style={{ fontStyle: "italic", fontSize: 12 }}
                            >
                                Note: {alumnus.admin_notes}
                            </Text>
                        </div>
                    )}
                </div>

                {/* ── Bio — capped to 2 lines by CSS ── */}
                {alumnus.bio && (
                    <Paragraph ellipsis={{ rows: 2 }} className="alumni-bio">
                        {alumnus.bio}
                    </Paragraph>
                )}
            </div>
        </Card>
    );

    if (!showNewBadge) {
        return CardInner;
    }

    return (
        <Badge.Ribbon
            text={
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.3,
                    }}
                >
                    <BellOutlined style={{ marginRight: 4 }} />
                    New Acct
                </span>
            }
            color={COLORS.antdBlue}
            placement="end"
        >
            {CardInner}
        </Badge.Ribbon>
    );
};
