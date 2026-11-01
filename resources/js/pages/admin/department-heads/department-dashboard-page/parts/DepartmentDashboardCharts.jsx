import { Row, Col, Card, Progress, Table } from "antd";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    Legend,
} from "recharts";
import { COLORS } from "~/config/theme";
import { AlumniDetails } from "~/components";
import {
    Title,
    Text,
} from "~/pages/admin/department-heads/department-dashboard-page/parts/departmentDashboardShared";
import { useDepartmentDashboardContext } from "~/pages/admin/department-heads/department-dashboard-page/DepartmentDashboardContext";

export default function DepartmentDashboardCharts() {
    const {
        pieData,
        EmploymentTrendChart,
        IndustryDistributionChart,
        SalaryProgressionChart,
        employmentRate,
        stats,
        TopEmployersList,
        course,
        columns,
        alumni,
        isLoading,
        isModalVisible,
        setIsModalVisible,
        setPreviewData,
        previewData,
    } = useDepartmentDashboardContext();

    return (
        <>
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} md={12}>
                    <Card
                        title="Overall Employment Status"
                        className="dashboard-card"
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <EmploymentTrendChart />
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} md={12}>
                    <IndustryDistributionChart />
                </Col>
                <Col xs={24} md={12}>
                    <SalaryProgressionChart />
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} md={12}>
                    <Card title="Employment Rate" className="dashboard-card">
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px 0",
                            }}
                        >
                            <Progress
                                type="dashboard"
                                percent={employmentRate}
                                strokeColor={{
                                    "0%": COLORS.c108ee9,
                                    "100%": COLORS.c87d068,
                                }}
                                size={180}
                            />
                            <div style={{ marginTop: "16px" }}>
                                <Title level={4}>
                                    {employmentRate}% Employment Rate
                                </Title>
                                <Text type="secondary">
                                    {stats.employed} out of {stats.total} alumni
                                    are employed
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <TopEmployersList />
                </Col>
            </Row>

            {/* Alumni Table */}
            <Card
                title={`${course?.course_code || "Department"} Alumni List`}
                className="dashboard-card"
            >
                <Table
                    columns={columns}
                    dataSource={alumni}
                    loading={isLoading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} alumni`,
                    }}
                />
            </Card>

            <AlumniDetails
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setPreviewData(null);
                }}
                onSubmit={() => {}}
                previewData={previewData}
                viewOnly={true}
            />
        </>
    );
}
