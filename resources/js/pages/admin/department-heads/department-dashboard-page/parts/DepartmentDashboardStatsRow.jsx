import { Row, Col, Card, Progress } from "antd";
import {
    TeamOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    WalletOutlined,
    SmileOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import Button from "~/components/shared/AsyncButton";
import { COLORS } from "~/config/theme";
import { scrollToInContent } from "~/utils/scrollInContent";
import { useDepartmentDashboardContext } from "~/pages/admin/department-heads/department-dashboard-page/DepartmentDashboardContext";

const Kpi = ({ icon, color, label, value, hint, percent }) => (
    <Card className="metric-card dd-kpi" bordered={false}>
        <div className="dd-kpi__head">
            <span
                className="dd-kpi__icon"
                style={{ background: `${color}1f`, color }}
                aria-hidden="true"
            >
                {icon}
            </span>
            <span className="dd-kpi__label">{label}</span>
        </div>
        <div className="dd-kpi__value">{value}</div>
        {hint && <div className="dd-kpi__hint">{hint}</div>}
        {percent !== undefined && (
            <Progress
                percent={percent}
                showInfo={false}
                strokeColor={color}
                size="small"
            />
        )}
    </Card>
);

export default function DepartmentDashboardStatsRow() {
    const { stats, employmentRate, averageSalary, setStatusFilter } =
        useDepartmentDashboardContext();

    const needFollowUp = stats.unemployed + stats.underEmployed;

    // One plain-language sentence a department head can act on.
    let tone = "idle";
    let icon = <InfoCircleOutlined />;
    let title = "No alumni to show for this selection yet";
    let sub = "Try another graduation year, or check back once alumni complete their career information.";
    if (stats.total > 0) {
        if (needFollowUp === 0) {
            tone = "good";
            icon = <SmileOutlined />;
            title = `All ${stats.total} alumni are employed`;
            sub = "Nothing needs follow-up right now. Great work!";
        } else {
            tone = "warn";
            icon = <ExclamationCircleOutlined />;
            title = `${employmentRate}% employed — ${needFollowUp} alumni may need follow-up`;
            sub = `${stats.unemployed} unemployed and ${stats.underEmployed} under-employed out of ${stats.total}.`;
        }
    }

    return (
        <>
            <div className="dd-insight" role="status">
                <span className={`dd-insight__icon dd-insight__icon--${tone}`}>
                    {icon}
                </span>
                <div className="dd-insight__text">
                    <p className="dd-insight__title">{title}</p>
                    <p className="dd-insight__sub">{sub}</p>
                </div>
                {needFollowUp > 0 && (
                    <Button
                        onClick={() => {
                            setStatusFilter("follow-up");
                            // never scrollIntoView() in the app shell (see utils/scrollInContent)
                            scrollToInContent(
                                document.getElementById("dd-alumni-list"),
                            );
                        }}
                    >
                        Show who needs follow-up
                    </Button>
                )}
            </div>

            <Row gutter={[16, 16]} className="dd-kpis">
                <Col xs={12} lg={6}>
                    <Kpi
                        icon={<TeamOutlined />}
                        color={COLORS.antdBlue}
                        label="Total alumni"
                        value={stats.total}
                        hint="In your department"
                    />
                </Col>
                <Col xs={12} lg={6}>
                    <Kpi
                        icon={<CheckCircleOutlined />}
                        color={COLORS.antdGreen}
                        label="Employed"
                        value={stats.employed}
                        hint={`${employmentRate}% employment rate`}
                        percent={employmentRate}
                    />
                </Col>
                <Col xs={12} lg={6}>
                    <Kpi
                        icon={<ExclamationCircleOutlined />}
                        color={COLORS.antdRed}
                        label="Need follow-up"
                        value={needFollowUp}
                        hint={`${stats.unemployed} unemployed · ${stats.underEmployed} under-employed`}
                    />
                </Col>
                <Col xs={12} lg={6}>
                    <Kpi
                        icon={<WalletOutlined />}
                        color={COLORS.antdPurple}
                        label="Avg. salary"
                        value={`₱${averageSalary.toLocaleString()}`}
                        hint="Based on reported salary ranges"
                    />
                </Col>
            </Row>
        </>
    );
}
