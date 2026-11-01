import { useState } from "react";
import { exportElementToPdf } from "~/utils/exportPdf";
import {
    message,
    Table,
    Tooltip,
    Space,
    Progress,
    List,
    Avatar,
    Tag,
} from "antd";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    Legend,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Area,
    BarChart,
    Bar,
    LabelList,
    LineChart,
    Line,
    ComposedChart,
} from "recharts";
import { COLORS } from "~/config/theme";
import {
    Title,
    Text,
} from "~/pages/admin/dashboard/dashboard-page/parts/dashboardShared";

export default function useDashboardLogic2({
    setPrintPreviewVisible,
    year,
    employmentData,
    industryDistribution,
    salaryProgression,
    employmentByCourse,
    topEmployers,
    alumniMetrics,
}) {
    const handlePrint = () => {
        setPrintPreviewVisible(true);
    };

    const handleClosePreview = () => {
        setPrintPreviewVisible(false);
    };

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleActualPrint = async () => {
        setIsGeneratingPdf(true);
        try {
            const yearLabel = year === "all" ? "all-years" : `year-${year}`;
            await exportElementToPdf("printable-area", {
                filename: `alumni-dashboard-report-${yearLabel}.pdf`,
            });
        } catch (err) {
            console.error("Failed to generate PDF:", err);
            message.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    // Chart Components
    const EmploymentPieChart = () => (
        <div className="chart-container">
            <Title level={4}>Overall Employment Status</Title>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={employmentData?.current || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {(employmentData?.current || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <RechartsTooltip
                        formatter={(value, name) => [`${value}%`, name]}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
                {(employmentData?.current || []).map((item, index) => (
                    <div key={index} className="legend-item">
                        <div
                            className="legend-color"
                            style={{ backgroundColor: item.color }}
                        />
                        <Text>{item.name}</Text>
                        <Text strong>{item.value}%</Text>
                        <Text type="secondary">({item.count} alumni)</Text>
                    </div>
                ))}
            </div>
        </div>
    );

    const EmploymentTrendChart = () => (
        <div className="chart-container">
            <Title level={4}>Employment Trend (Last 6 Years)</Title>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={employmentData?.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip
                        formatter={(value) => [`${value}%`, "Percentage"]}
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="employed"
                        stackId="1"
                        stroke={COLORS.c32d1b3}
                        fill={COLORS.c32d1b3}
                        fillOpacity={0.6}
                        name="Employed"
                    />
                    <Area
                        type="monotone"
                        dataKey="underEmployed"
                        stackId="1"
                        stroke={COLORS.antdGold}
                        fill={COLORS.antdGold}
                        fillOpacity={0.6}
                        name="Under Employed"
                    />
                    <Area
                        type="monotone"
                        dataKey="unemployed"
                        stackId="1"
                        stroke={COLORS.antdRed}
                        fill={COLORS.antdRed}
                        fillOpacity={0.6}
                        name="Unemployed"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );

    const IndustryDistributionChart = () => (
        <div className="chart-container">
            <Title level={4}>Industry Distribution</Title>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={industryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip
                        formatter={(value) => [`${value}%`, "Percentage"]}
                    />
                    <Bar dataKey="value" name="Percentage">
                        {industryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList
                            dataKey="value"
                            position="top"
                            formatter={(value) => `${value}%`}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
    const SalaryProgressionChart = () => (
        <div className="chart-container">
            <Title level={4}>Average Salary Progression</Title>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salaryProgression}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <RechartsTooltip
                        formatter={(value, name, props) => {
                            const { payload } = props;
                            const count = payload.alumniCount || 1;
                            return [
                                `₱${value?.toLocaleString() || 0}${count > 1 ? ` (${count} Alumni)` : ""}`,
                                "Salary",
                            ];
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="salary"
                        stroke={COLORS.antdBlue}
                        strokeWidth={3}
                        dot={{ fill: COLORS.antdBlue }}
                        name="Salary"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    const EmploymentByMajorTable = () => (
        <div className="chart-container">
            <Title level={4}>Employment by Major</Title>
            <Table
                dataSource={employmentData?.byMajor || []}
                pagination={false}
                size="small"
                loading={!employmentData}
                columns={[
                    { title: "Major", dataIndex: "major", key: "major" },
                    {
                        title: "Employed",
                        dataIndex: "employed",
                        key: "employed",
                        render: (value) => <Text strong>{value}%</Text>,
                    },
                    {
                        title: "Unemployed",
                        dataIndex: "unemployed",
                        key: "unemployed",
                        render: (value) => (
                            <Text type="secondary">{value}%</Text>
                        ),
                    },
                    {
                        title: "Under Employed",
                        dataIndex: "underEmployed",
                        key: "underEmployed",
                        render: (value) => (
                            <Text type="secondary">{value}%</Text>
                        ),
                    },
                    {
                        title: "Total Graduates",
                        dataIndex: "totalGraduates",
                        key: "totalGraduates",
                        render: (value) => <Text>{value}</Text>,
                    },
                ]}
            />
        </div>
    );

    const EmploymentByCourseChart = () => (
        <div className="chart-container" style={{ marginBottom: 20 }}>
            <Title level={4}>Employment Statistics by Course</Title>
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                    data={employmentByCourse}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="course"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        fontSize={12}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip
                        formatter={(value, name) => {
                            if (name === "Employment Rate")
                                return [`${value}%`, name];
                            return [value, name];
                        }}
                    />
                    <Legend />
                    <Bar
                        yAxisId="left"
                        dataKey="employed"
                        name="Employed"
                        fill={COLORS.c32d1b3}
                        barSize={20}
                    />
                    <Bar
                        yAxisId="left"
                        dataKey="unemployed"
                        name="Unemployed"
                        fill={COLORS.antdRed}
                        barSize={20}
                    />
                    <Bar
                        yAxisId="left"
                        dataKey="underEmployed"
                        name="Under Employed"
                        fill={COLORS.antdGold}
                        barSize={20}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="employmentRate"
                        name="Employment Rate"
                        stroke={COLORS.antdBlue}
                        strokeWidth={3}
                        dot={{ fill: COLORS.antdBlue, strokeWidth: 2, r: 4 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>

            <Table
                dataSource={employmentByCourse}
                pagination={false}
                size="small"
                style={{ marginTop: 20 }}
                scroll={{ x: 600 }}
                rowKey="course"
                columns={[
                    {
                        title: "Course",
                        dataIndex: "course",
                        key: "course",
                        fixed: "left",
                        width: 150,
                        render: (text) => (
                            <Tooltip title={text}>
                                <Text strong>
                                    {text.length > 20
                                        ? `${text.substring(0, 20)}...`
                                        : text}
                                </Text>
                            </Tooltip>
                        ),
                    },
                    {
                        title: "Total Alumni",
                        dataIndex: "total",
                        key: "total",
                        render: (value) => <Text>{value}</Text>,
                    },
                    {
                        title: "Employed",
                        key: "employed",
                        render: (_, record) => (
                            <Space>
                                <Text strong>{record.employed}</Text>
                                <Text type="secondary">
                                    ({record.employedPercentage}%)
                                </Text>
                            </Space>
                        ),
                    },
                    {
                        title: "Unemployed",
                        key: "unemployed",
                        render: (_, record) => (
                            <Space>
                                <Text type="danger">{record.unemployed}</Text>
                                <Text type="secondary">
                                    ({record.unemployedPercentage}%)
                                </Text>
                            </Space>
                        ),
                    },
                    {
                        title: "Under Employed",
                        key: "underEmployed",
                        render: (_, record) => (
                            <Space>
                                <Text type="warning">
                                    {record.underEmployed}
                                </Text>
                                <Text type="secondary">
                                    ({record.underEmployedPercentage}%)
                                </Text>
                            </Space>
                        ),
                    },
                    {
                        title: "Employment Rate",
                        dataIndex: "employmentRate",
                        key: "employmentRate",
                        render: (value) => (
                            <Progress
                                percent={value}
                                size="small"
                                status={
                                    value >= 80
                                        ? "success"
                                        : value >= 60
                                          ? "normal"
                                          : "exception"
                                }
                            />
                        ),
                    },
                ]}
            />
        </div>
    );
    const EmploymentByCourseStackedChart = () => (
        <div className="chart-container">
            <Title level={4}>Employment Distribution by Course (%)</Title>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={employmentByCourse}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="course"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        fontSize={12}
                    />
                    <YAxis />
                    <RechartsTooltip
                        formatter={(value, name) => [`${value}%`, name]}
                    />
                    <Legend />
                    <Bar
                        dataKey="employedPercentage"
                        name="Employed %"
                        stackId="a"
                        fill={COLORS.c32d1b3}
                    />
                    <Bar
                        dataKey="underEmployedPercentage"
                        name="Under Employed %"
                        stackId="a"
                        fill={COLORS.antdGold}
                    />
                    <Bar
                        dataKey="unemployedPercentage"
                        name="Unemployed %"
                        stackId="a"
                        fill={COLORS.antdRed}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const TopEmployersList = () => (
        <div className="chart-container">
            <Title level={4}>Top Employers</Title>
            <List
                dataSource={topEmployers}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    style={{
                                        backgroundColor: [
                                            COLORS.antdBlue,
                                            COLORS.antdGreen,
                                            COLORS.antdGold,
                                            COLORS.antdPurple,
                                            COLORS.fa541c,
                                            COLORS.antdCyan,
                                        ][index % 6],
                                    }}
                                >
                                    {item.name.charAt(0)}
                                </Avatar>
                            }
                            title={item.name}
                            description={`${item.hires} hires`}
                        />
                        <div>
                            <Tag
                                color={
                                    item.trend === "up"
                                        ? "green"
                                        : item.trend === "down"
                                          ? "red"
                                          : "orange"
                                }
                            >
                                {item.trend}
                            </Tag>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );

    const getStatusTag = (status) => {
        const statusConfig = {
            employed: { color: "green", text: "Employed" },
            unemployed: { color: "red", text: "Seeking" },
            under_employed: { color: "orange", text: "Under Employed" },
            graduate_school: { color: "blue", text: "Graduate School" },
        };
        const config = statusConfig[status] || {
            color: "default",
            text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    // ===== Derived insights used only inside the print report =====
    const totalAlumniSafe = alumniMetrics?.totalAlumni || 0;
    const employedSafe = employmentData?.summary?.employedCount || 0;
    const unemployedSafe = employmentData?.summary?.unemployedCount || 0;
    const underEmployedSafe = employmentData?.summary?.underEmployedCount || 0;
    const overallEmploymentRate =
        totalAlumniSafe > 0
            ? Math.round((employedSafe / totalAlumniSafe) * 100)
            : 0;
    const overallUnemploymentRate =
        totalAlumniSafe > 0
            ? Math.round((unemployedSafe / totalAlumniSafe) * 100)
            : 0;
    const overallUnderEmploymentRate =
        totalAlumniSafe > 0
            ? Math.round((underEmployedSafe / totalAlumniSafe) * 100)
            : 0;

    const bestCourse = employmentByCourse.length
        ? [...employmentByCourse].sort(
              (a, b) => b.employmentRate - a.employmentRate,
          )[0]
        : null;
    const lowestCourse = employmentByCourse.length
        ? [...employmentByCourse].sort(
              (a, b) => a.employmentRate - b.employmentRate,
          )[0]
        : null;
    const largestCohort = employmentByCourse.length
        ? [...employmentByCourse].sort((a, b) => b.total - a.total)[0]
        : null;
    const topIndustry = industryDistribution.length
        ? industryDistribution[0]
        : null;
    const topEmployer = topEmployers.length ? topEmployers[0] : null;

    const salaryValues = (salaryProgression || [])
        .map((s) => s.salary)
        .filter((v) => Number.isFinite(v));
    const minSalary = salaryValues.length ? Math.min(...salaryValues) : 0;
    const maxSalary = salaryValues.length ? Math.max(...salaryValues) : 0;
    const medianSalary = (() => {
        if (!salaryValues.length) return 0;
        const sorted = [...salaryValues].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2
            ? sorted[mid]
            : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    })();

    const trendArr = employmentData?.trend || [];
    const latestTrend = trendArr.length ? trendArr[trendArr.length - 1] : null;
    const earliestTrend = trendArr.length ? trendArr[0] : null;
    const yoYChange =
        latestTrend && earliestTrend
            ? latestTrend.employed - earliestTrend.employed
            : 0;

    return {
        handlePrint,
        handleClosePreview,
        isGeneratingPdf,
        handleActualPrint,
        EmploymentPieChart,
        EmploymentTrendChart,
        IndustryDistributionChart,
        SalaryProgressionChart,
        EmploymentByMajorTable,
        EmploymentByCourseChart,
        TopEmployersList,
        totalAlumniSafe,
        employedSafe,
        unemployedSafe,
        underEmployedSafe,
        overallEmploymentRate,
        overallUnemploymentRate,
        overallUnderEmploymentRate,
        bestCourse,
        lowestCourse,
        largestCohort,
        topIndustry,
        topEmployer,
        salaryValues,
        minSalary,
        maxSalary,
        medianSalary,
        trendArr,
        yoYChange,
    };
}
