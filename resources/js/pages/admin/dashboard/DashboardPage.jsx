import "./AlumniDashboard.css";
import { Layout } from "~/components";
import { Modal, Button, Card, Row, Col, Spin } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import logo from "~/assets/images/OCC_LOGO.png";
import moment from "moment";
import {
    ResponsiveContainer,
    ComposedChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Legend,
    Bar,
    Line,
} from "recharts";
import {
    Title,
    Text,
} from "~/pages/admin/dashboard/dashboard-page/parts/dashboardShared";
import { DashboardProvider } from "~/pages/admin/dashboard/dashboard-page/DashboardContext";
import useDashboardController from "~/pages/admin/dashboard/dashboard-page/hooks/useDashboardController";
import DashboardContent from "~/pages/admin/dashboard/dashboard-page/parts/DashboardContent";
import DashboardExecutiveSummary from "~/pages/admin/dashboard/dashboard-page/parts/DashboardExecutiveSummary";
import DashboardAdditionalMetrics from "~/pages/admin/dashboard/dashboard-page/parts/DashboardAdditionalMetrics";
import DashboardEmploymentStatusPie from "~/pages/admin/dashboard/dashboard-page/parts/DashboardEmploymentStatusPie";
import DashboardEmploymentTrendChart from "~/pages/admin/dashboard/dashboard-page/parts/DashboardEmploymentTrendChart";
import DashboardEmploymentByMajor from "~/pages/admin/dashboard/dashboard-page/parts/DashboardEmploymentByMajor";
import DashboardPrintStyles from "~/pages/admin/dashboard/dashboard-page/parts/DashboardPrintStyles";

function AlumniDashboard() {
    const ctx = useDashboardController();
    const {
        isLoading,
        printPreviewVisible,
        handleClosePreview,
        isGeneratingPdf,
        handleActualPrint,
        year,
        totalAlumniSafe,
        employedSafe,
        overallEmploymentRate,
        unemployedSafe,
        overallUnemploymentRate,
        underEmployedSafe,
        overallUnderEmploymentRate,
        employmentByCourse,
    } = ctx;

    if (isLoading) {
        return (
            <Layout>
                <div style={{ display: "flex", justifyContent: "center", padding: "96px 0" }}>
                <Spin size="large" />
            </div>
            </Layout>
        );
    }
    return (
        <DashboardProvider value={ctx}>
            <Layout>
                <DashboardContent />

                {/* Print Preview Modal — forced light theme via wrapClassName */}
                <Modal
                    title="Print Preview - A4 Layout"
                    open={printPreviewVisible}
                    onCancel={handleClosePreview}
                    width={900}
                    style={{ top: 16, maxWidth: "calc(100vw - 16px)" }}
                    styles={{
                        body: {
                            maxHeight: "78vh",
                            overflowY: "auto",
                            padding: 0,
                        },
                    }}
                    wrapClassName="print-preview-modal"
                    className="print-preview-modal"
                    footer={[
                        <Button key="cancel" onClick={handleClosePreview}>
                            Cancel
                        </Button>,
                        <Button
                            key="print"
                            type="primary"
                            icon={<FilePdfOutlined />}
                            loading={isGeneratingPdf}
                            onClick={handleActualPrint}
                        >
                            {isGeneratingPdf
                                ? "Generating PDF..."
                                : "Download PDF"}
                        </Button>,
                    ]}
                >
                    <div className="print-preview-canvas">
                        <div
                            id="printable-area"
                            data-print-theme="light"
                            className="printable-area-surface"
                            style={{
                                backgroundColor: COLORS.white,
                                color: COLORS.slate900,
                            }}
                        >
                            {/* ===== Header with Logo ===== */}
                            <div
                                className="print-report-header"
                                style={{
                                    textAlign: "center",
                                    borderBottom: "2px solid #0f172a",
                                }}
                            >
                                <img
                                    src={logo || "/placeholder.svg"}
                                    alt="OCC Logo"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        marginBottom: "10px",
                                        objectFit: "contain",
                                    }}
                                />
                                <Title
                                    level={2}
                                    style={{
                                        margin: 0,
                                        color: COLORS.slate900,
                                    }}
                                >
                                    Alumni Dashboard Report
                                </Title>
                                <Title
                                    level={4}
                                    style={{
                                        margin: "8px 0",
                                        color: COLORS.antdBlue,
                                    }}
                                >
                                    {year === "all"
                                        ? "All Years"
                                        : `Year ${year}`}
                                </Title>
                                <Text
                                    className="print-muted"
                                    style={{ color: COLORS.c555555 }}
                                >
                                    Generated on:{" "}
                                    {moment().format(
                                        "MMMM DD, YYYY [at] hh:mm A",
                                    )}
                                </Text>
                                <br />
                                <Text
                                    className="print-muted"
                                    style={{ color: COLORS.c555555 }}
                                >
                                    Report Reference: ADR-
                                    {moment().format("YYYYMMDD-HHmmss")}
                                </Text>
                            </div>

                            {/* ===== Executive Summary ===== */}
                            <DashboardExecutiveSummary />

                            {/* ===== Key Metrics ===== */}
                            <Card className="print-block">
                                <Title
                                    level={4}
                                    className="print-section-title"
                                >
                                    Key Metrics
                                </Title>
                                <Row gutter={16}>
                                    <Col span={6}>
                                        <div style={{ textAlign: "center" }}>
                                            <Title
                                                level={3}
                                                style={{
                                                    color: COLORS.antdBlue,
                                                    margin: 0,
                                                }}
                                            >
                                                {totalAlumniSafe}
                                            </Title>
                                            <Text
                                                style={{
                                                    color: COLORS.slate900,
                                                }}
                                            >
                                                Total Alumni
                                            </Text>
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div style={{ textAlign: "center" }}>
                                            <Title
                                                level={3}
                                                style={{
                                                    color: COLORS.antdGreen,
                                                    margin: 0,
                                                }}
                                            >
                                                {employedSafe}
                                            </Title>
                                            <Text
                                                style={{
                                                    color: COLORS.slate900,
                                                }}
                                            >
                                                Employed (
                                                {overallEmploymentRate}%)
                                            </Text>
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div style={{ textAlign: "center" }}>
                                            <Title
                                                level={3}
                                                style={{
                                                    color: COLORS.antdRed,
                                                    margin: 0,
                                                }}
                                            >
                                                {unemployedSafe}
                                            </Title>
                                            <Text
                                                style={{
                                                    color: COLORS.slate900,
                                                }}
                                            >
                                                Unemployed (
                                                {overallUnemploymentRate}%)
                                            </Text>
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div style={{ textAlign: "center" }}>
                                            <Title
                                                level={3}
                                                style={{
                                                    color: COLORS.antdGold,
                                                    margin: 0,
                                                }}
                                            >
                                                {underEmployedSafe}
                                            </Title>
                                            <Text
                                                style={{
                                                    color: COLORS.slate900,
                                                }}
                                            >
                                                Under Employed (
                                                {overallUnderEmploymentRate}%)
                                            </Text>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            {/* ===== Additional Metrics ===== */}
                            <DashboardAdditionalMetrics />

                            {/* ===== Employment by Course Chart ===== */}
                            <Card className="print-block">
                                <Title
                                    level={4}
                                    className="print-section-title"
                                >
                                    Employment Statistics by Course
                                </Title>
                                <div
                                    className="print-chart-box"
                                    style={{ width: "100%", height: 350 }}
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <ComposedChart
                                            data={employmentByCourse}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 60,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="course"
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                                interval={0}
                                                fontSize={10}
                                            />
                                            <YAxis yAxisId="left" />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                            />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="employed"
                                                name="Employed"
                                                fill={COLORS.c32d1b3}
                                                barSize={15}
                                            />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="unemployed"
                                                name="Unemployed"
                                                fill={COLORS.antdRed}
                                                barSize={15}
                                            />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="underEmployed"
                                                name="Under Employed"
                                                fill={COLORS.antdGold}
                                                barSize={15}
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="employmentRate"
                                                name="Employment Rate"
                                                stroke={COLORS.antdBlue}
                                                strokeWidth={2}
                                                dot={{
                                                    fill: COLORS.antdBlue,
                                                    r: 3,
                                                }}
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* ===== Employment Status Pie Chart ===== */}
                            <DashboardEmploymentStatusPie />

                            {/* ===== Employment Trend Chart + Year-by-Year Table ===== */}
                            <DashboardEmploymentTrendChart />

                            {/* ===== Employment by Major Table ===== */}
                            <DashboardEmploymentByMajor />
                        </div>
                    </div>
                </Modal>

                {/* Print Styles
          IMPORTANT: this block only handles page MECHANICS — what's
          visible, what's positioned where, what page size is used.
          It must never set width/height/padding/margin/font-size on
          #printable-area's content again: those live in one place,
          unconditionally, in AlumniDashboard.css. Two places setting
          the same appearance value is exactly what made the preview
          drift from the printed page before. */}
                <DashboardPrintStyles />
            </Layout>
        </DashboardProvider>
    );
}

export default AlumniDashboard;
