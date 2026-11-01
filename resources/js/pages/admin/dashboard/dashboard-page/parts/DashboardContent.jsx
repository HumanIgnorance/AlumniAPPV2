import logo from "~/assets/images/OCC_LOGO.png";
import {
    Tag,
    Select,
    Button,
    Row,
    Col,
    Card,
    Statistic,
    Progress,
    Rate,
} from "antd";
import {
    CheckCircleOutlined,
    PrinterOutlined,
    TeamOutlined,
    UserOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import {
    Text,
    Title,
    Paragraph,
    Option,
} from "~/pages/admin/dashboard/dashboard-page/parts/dashboardShared";
import { useDashboardContext } from "~/pages/admin/dashboard/dashboard-page/DashboardContext";

export default function DashboardContent() {
    const {
        year,
        setSelectedYear,
        currentYear,
        handlePrint,
        alumniMetrics,
        employmentData,
        EmploymentByCourseChart,
        EmploymentPieChart,
        EmploymentTrendChart,
        IndustryDistributionChart,
        SalaryProgressionChart,
        EmploymentByMajorTable,
        TopEmployersList,
    } = useDashboardContext();

    return (
        <div className="alumni-dashboard-container">
            {/* =========================================================
            HEADER SECTION — Modern hero (matches AboutPage design)
           ========================================================= */}
            <section className="dashboard-hero">
                <div className="dashboard-hero__bg" aria-hidden="true">
                    <span className="orb orb-1" />
                    <span className="orb orb-2" />
                    <span className="orb orb-3" />
                    <div className="grid-overlay" />
                </div>

                <div className="dashboard-hero__content">
                    <div className="dashboard-hero__left">
                        <div className="dashboard-hero__brand">
                            <img
                                src={logo}
                                alt="OCC Logo"
                                className="dashboard-hero__logo"
                            />
                            <div className="dashboard-hero__brand-meta">
                                <Tag
                                    className="dashboard-chip"
                                    icon={<CheckCircleOutlined />}
                                >
                                    Live Analytics Dashboard
                                </Tag>
                                <Text className="dashboard-hero__eyebrow">
                                    Administrator Overview
                                </Text>
                            </div>
                        </div>

                        <Title level={2} className="dashboard-hero__title">
                            Alumni <span className="grad-text">Dashboard</span>
                        </Title>

                        <Paragraph className="dashboard-hero__lead">
                            Comprehensive overview of alumni employment, career
                            progression, and engagement metrics — updated in
                            real time based on Alumni Career Information.
                        </Paragraph>
                    </div>

                    <div className="dashboard-hero__controls">
                        <Select
                            value={year}
                            onChange={setSelectedYear}
                            className="dashboard-hero__select"
                            placeholder="Select Year"
                        >
                            <Option value="all">All Years</Option>
                            {Array.from({ length: 25 }, (_, i) => {
                                const yearValue = currentYear - i;
                                return (
                                    <Option
                                        key={yearValue}
                                        value={yearValue.toString()}
                                    >
                                        {yearValue}
                                    </Option>
                                );
                            })}
                        </Select>

                        <Button
                            type="primary"
                            icon={<PrinterOutlined />}
                            onClick={handlePrint}
                            className="dashboard-hero__print-btn"
                        >
                            Print Preview
                        </Button>
                    </div>
                </div>
            </section>

            {/* Metrics Row */}
            <Row gutter={[24, 24]} className="metrics-row">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="metric-card">
                        <Statistic
                            title="Total Alumni"
                            value={alumniMetrics?.totalAlumni || 0}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: COLORS.antdBlue }}
                        />
                        <Progress
                            percent={100}
                            showInfo={false}
                            status="active"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="metric-card">
                        <Statistic
                            title="Active This Year"
                            value={alumniMetrics?.activeThisYear || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: COLORS.antdGreen }}
                        />
                        <Progress
                            percent={
                                alumniMetrics?.totalAlumni
                                    ? Math.round(
                                          (alumniMetrics.activeThisYear /
                                              alumniMetrics.totalAlumni) *
                                              100,
                                      )
                                    : 0
                            }
                            showInfo={false}
                            status="active"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="metric-card">
                        <Statistic
                            title="Average Salary"
                            value={alumniMetrics?.averageSalary || 0}
                            valueStyle={{ color: COLORS.antdGold }}
                            formatter={(value) =>
                                `₱${value?.toLocaleString() || 0}`
                            }
                        />
                        <Text type="secondary">Based on reported salaries</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="metric-card">
                        <Statistic
                            title="Overall Employment Rate"
                            value={
                                employmentData?.summary
                                    ? Math.round(
                                          (employmentData.summary
                                              .employedCount /
                                              employmentData.summary
                                                  .totalAlumni) *
                                              100,
                                      )
                                    : 0
                            }
                            suffix="%"
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: COLORS.antdPurple }}
                        />
                        <Rate
                            disabled
                            value={alumniMetrics?.satisfactionRate || 0}
                            allowHalf
                        />
                    </Card>
                </Col>
            </Row>

            {/* New Employment by Course Chart */}
            <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
                <Col xs={24}>
                    <EmploymentByCourseChart />
                </Col>
            </Row>

            {/* Charts Row 1 */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <EmploymentPieChart />
                </Col>
                <Col xs={24} lg={12}>
                    <EmploymentTrendChart />
                </Col>
            </Row>

            {/* Charts Row 2 */}
            <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
                <Col xs={24} lg={12}>
                    <IndustryDistributionChart />
                </Col>
                <Col xs={24} lg={12}>
                    <SalaryProgressionChart />
                </Col>
            </Row>

            {/* Additional Data */}
            <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
                <Col xs={24} lg={12}>
                    <EmploymentByMajorTable />
                </Col>
                <Col xs={24} lg={12}>
                    <TopEmployersList />
                </Col>
            </Row>

            {/* Alternative Stacked Chart (optional) */}
            {/* <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
                    <Col xs={24}>
                        <EmploymentByCourseStackedChart />
                    </Col>
                </Row> */}
        </div>
    );
}
