import { Card, Table } from "antd";
import {
    ResponsiveContainer,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Legend,
    Area,
    BarChart,
    Bar,
    Cell,
    LabelList,
    LineChart,
    Line,
} from "recharts";
import { COLORS } from "~/config/theme";
import {
    Title,
    Text,
} from "~/pages/admin/dashboard/dashboard-page/parts/dashboardShared";
import { useDashboardContext } from "~/pages/admin/dashboard/dashboard-page/DashboardContext";

export default function DashboardEmploymentTrendChart() {
    const {
        employmentData,
        trendArr,
        industryDistribution,
        salaryProgression,
        minSalary,
        maxSalary,
        medianSalary,
        alumniMetrics,
        employmentByCourse,
    } = useDashboardContext();

    return (
        <>
            <Card className="print-block">
                <Title level={4} className="print-section-title">
                    Employment Trend (Last 6 Years)
                </Title>
                <div
                    className="print-chart-box"
                    style={{ width: "100%", height: 280 }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={employmentData?.trend || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip
                                formatter={(value) => [
                                    `${value}%`,
                                    "Percentage",
                                ]}
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

                {trendArr.length > 0 && (
                    <Table
                        style={{ marginTop: 12 }}
                        dataSource={trendArr}
                        pagination={false}
                        size="small"
                        rowKey="month"
                        columns={[
                            { title: "Year", dataIndex: "month", key: "month" },
                            {
                                title: "Graduates",
                                dataIndex: "totalGrads",
                                key: "totalGrads",
                            },
                            {
                                title: "Employed",
                                key: "emp",
                                render: (_, r) =>
                                    `${r.employedCount ?? 0} (${r.employed}%)`,
                            },
                            {
                                title: "Unemployed",
                                key: "un",
                                render: (_, r) =>
                                    `${r.unemployedCount ?? 0} (${r.unemployed}%)`,
                            },
                            {
                                title: "Under Employed",
                                key: "uemp",
                                render: (_, r) =>
                                    `${r.underEmployedCount ?? 0} (${r.underEmployed}%)`,
                            },
                        ]}
                    />
                )}
            </Card>

            {/* ===== Industry Distribution Chart ===== */}
            {industryDistribution.length > 0 && (
                <Card className="print-block">
                    <Title level={4} className="print-section-title">
                        Industry Distribution
                    </Title>
                    <div
                        className="print-chart-box"
                        style={{ width: "100%", height: 280 }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={industryDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={10} />
                                <YAxis />
                                <RechartsTooltip
                                    formatter={(value) => [
                                        `${value}%`,
                                        "Percentage",
                                    ]}
                                />
                                <Bar dataKey="value" name="Percentage">
                                    {industryDistribution.map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ),
                                    )}
                                    <LabelList
                                        dataKey="value"
                                        position="top"
                                        formatter={(value) => `${value}%`}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            )}

            {/* ===== Salary Progression Chart ===== */}
            {salaryProgression.length > 0 && (
                <Card className="print-block">
                    <Title level={4} className="print-section-title">
                        Average Salary Progression
                    </Title>
                    <div
                        className="print-chart-box"
                        style={{ width: "100%", height: 280 }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salaryProgression}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <RechartsTooltip
                                    formatter={(value) => [
                                        `₱${value?.toLocaleString() || 0}`,
                                        "Salary",
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="salary"
                                    stroke={COLORS.antdBlue}
                                    strokeWidth={2}
                                    dot={{ fill: COLORS.antdBlue }}
                                    name="Salary"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div
                        style={{
                            marginTop: 8,
                            fontSize: 11,
                            color: COLORS.c555555,
                        }}
                    >
                        Reported salary range: ₱{minSalary.toLocaleString()} – ₱
                        {maxSalary.toLocaleString()} · Median ₱
                        {medianSalary.toLocaleString()} · Mean ₱
                        {(alumniMetrics?.averageSalary || 0).toLocaleString()}
                    </div>
                </Card>
            )}

            {/* ===== Employment by Course Table ===== */}
            <Card className="print-block">
                <Title level={4} className="print-section-title">
                    Employment Statistics by Course (Table)
                </Title>
                <Table
                    dataSource={employmentByCourse}
                    pagination={false}
                    size="small"
                    rowKey="course"
                    columns={[
                        {
                            title: "No.",
                            key: "index",
                            width: 50,
                            render: (_, __, index) => index + 1,
                        },
                        { title: "Course", dataIndex: "course", key: "course" },
                        { title: "Total", dataIndex: "total", key: "total" },
                        {
                            title: "Employed",
                            key: "employed",
                            render: (_, record) =>
                                `${record.employed} (${record.employedPercentage}%)`,
                        },
                        {
                            title: "Unemployed",
                            key: "unemployed",
                            render: (_, record) =>
                                `${record.unemployed} (${record.unemployedPercentage}%)`,
                        },
                        {
                            title: "Under Employed",
                            key: "underEmployed",
                            render: (_, record) =>
                                `${record.underEmployed} (${record.underEmployedPercentage}%)`,
                        },
                        {
                            title: "Employment Rate",
                            dataIndex: "employmentRate",
                            key: "employmentRate",
                            render: (value) => `${value}%`,
                        },
                    ]}
                    summary={(pageData) => {
                        const totals = pageData.reduce(
                            (acc, r) => {
                                acc.total += r.total;
                                acc.employed += r.employed;
                                acc.unemployed += r.unemployed;
                                acc.underEmployed += r.underEmployed;
                                return acc;
                            },
                            {
                                total: 0,
                                employed: 0,
                                unemployed: 0,
                                underEmployed: 0,
                            },
                        );
                        const rate =
                            totals.total > 0
                                ? Math.round(
                                      (totals.employed / totals.total) * 100,
                                  )
                                : 0;
                        return (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={2}>
                                    <Text strong>TOTAL</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>
                                    <Text strong>{totals.total}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>
                                    <Text strong>{totals.employed}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>
                                    <Text strong>{totals.unemployed}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={5}>
                                    <Text strong>{totals.underEmployed}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={6}>
                                    <Text strong>{rate}%</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        );
                    }}
                />
            </Card>
        </>
    );
}
