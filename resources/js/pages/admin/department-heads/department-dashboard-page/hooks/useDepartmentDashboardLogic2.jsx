import { Card, List, Avatar, Tag, Space, Empty } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Button from "~/components/shared/AsyncButton";
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
import AlumniAvatar from "~/components/shared/AlumniAvatar";
import { RiseOutlined } from "@ant-design/icons";
import {
    Title,
    Text,
} from "~/pages/admin/department-heads/department-dashboard-page/parts/departmentDashboardShared";

export default function useDepartmentDashboardLogic2({
    employmentTrend,
    industryDistribution,
    salaryProgression,
    topEmployers,
    getEmploymentStatusTag,
    handleView,
}) {
    const ChartEmpty = ({ text = "Not enough data yet" }) => (
        <div className="dd-chart-empty">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text} />
        </div>
    );

    const EmploymentTrendChart = () => (
        <Card className="dashboard-card">
            <Title level={4}>Employment Trend (Last 6 Years)</Title>
            {employmentTrend.length === 0 ? <ChartEmpty /> : (
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={employmentTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <RechartsTooltip
                        formatter={(value) => [`${value}%`, "Percentage"]}
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="employed"
                        stackId="1"
                        stroke={COLORS.antdGreen}
                        fill={COLORS.antdGreen}
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
            )}
        </Card>
    );

    const IndustryDistributionChart = () => (
        <Card className="dashboard-card">
            <Title level={4}>Industry Distribution</Title>
            {industryDistribution.length === 0 ? <ChartEmpty text="No industry data yet" /> : (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={industryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
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
            )}
        </Card>
    );

    const SalaryProgressionChart = () => (
        <Card className="dashboard-card">
            <Title level={4}>Average Salary Progression</Title>
            {salaryProgression.length === 0 ? <ChartEmpty text="No salary data yet" /> : (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salaryProgression}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <RechartsTooltip
                        formatter={(value, name, props) => {
                            const { payload } = props;
                            const count = payload?.alumniCount || 1;
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
            )}
        </Card>
    );

    const TopEmployersList = () => (
        <Card title="Top Employers" className="dashboard-card">
            {topEmployers.length > 0 ? (
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
                                description={`${item.hires} alumni`}
                            />
                            <div>
                                <Tag color="green">
                                    <RiseOutlined /> Active
                                </Tag>
                            </div>
                        </List.Item>
                    )}
                />
            ) : (
                <div
                    style={{
                        textAlign: "center",
                        padding: "20px",
                        color: COLORS.c999999,
                    }}
                >
                    No employer data available
                </div>
            )}
        </Card>
    );

    const columns = [
        {
            title: "Name",
            key: "name",
            render: (_, record) => (
                <Space>
                    <AlumniAvatar
                        src={record.profile_image_url}
                        name={record.first_name || record.last_name}
                    />
                    <Text strong>
                        {record.first_name} {record.last_name}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Graduation Year",
            dataIndex: "graduation_year",
            key: "graduation_year",
            sorter: (a, b) => a.graduation_year - b.graduation_year,
        },
        {
            title: "Employment Status",
            key: "employment_status",
            render: (_, record) =>
                getEmploymentStatusTag(record.employment_status_id),
        },
        {
            title: "Company",
            dataIndex: "current_company",
            key: "current_company",
            render: (text) => text || "N/A",
        },
        {
            title: "Position",
            dataIndex: "job_title",
            key: "job_title",
            render: (text) => text || "N/A",
        },
        {
            title: "",
            key: "actions",
            fixed: "right",
            width: 110,
            render: (_, record) => (
                <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleView(record)}
                >
                    View
                </Button>
            ),
        },
    ];

    return {
        EmploymentTrendChart,
        IndustryDistributionChart,
        SalaryProgressionChart,
        TopEmployersList,
        columns,
    };
}
