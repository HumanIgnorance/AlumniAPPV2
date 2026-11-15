import { Row, Col, Card, Progress, Table, Input, Segmented, Grid, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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
        filteredAlumni,
        searchText,
        setSearchText,
        statusFilter,
        setStatusFilter,
        isLoading,
        isModalVisible,
        setIsModalVisible,
        setPreviewData,
        previewData,
    } = useDepartmentDashboardContext();

    const screens = Grid.useBreakpoint();
    const isPhone = !screens.md;

    return (
        <>
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                <Col xs={24} md={12}>
                    <Card
                        title="Overall Employment Status"
                        className="dashboard-card"
                    >
                        {pieData.length === 0 ? (
                            <div className="dd-chart-empty">
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No employment data yet"
                                />
                            </div>
                        ) : (
                        <ResponsiveContainer width="100%" height={isPhone ? 260 : 300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={
                                        isPhone
                                            ? false
                                            : ({ name, percent }) =>
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
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <EmploymentTrendChart />
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                <Col xs={24} md={12}>
                    <IndustryDistributionChart />
                </Col>
                <Col xs={24} md={12}>
                    <SalaryProgressionChart />
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                <Col xs={24} md={12}>
                    <Card title="Employment Rate" className="dashboard-card">
                        <div
                            style={{
                                textAlign: "center",
                                padding: isPhone ? "12px 0" : "40px 0",
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
                id="dd-alumni-list"
                title={`${course?.course_code || "Department"} Alumni List`}
                className="dashboard-card"
            >
                <div className="dd-toolbar">
                    <Input
                        allowClear
                        className="dd-toolbar__search"
                        prefix={<SearchOutlined />}
                        placeholder="Search name, company, position or year"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Segmented
                        className="dd-toolbar__seg"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { label: "All", value: "all" },
                            { label: "Employed", value: 1 },
                            { label: "Unemployed", value: 2 },
                            { label: "Under-employed", value: 3 },
                            { label: "Needs follow-up", value: "follow-up" },
                        ]}
                    />
                    <span className="dd-toolbar__count">
                        Showing {filteredAlumni.length} of {alumni.length}
                    </span>
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredAlumni}
                    loading={isLoading}
                    rowKey="id"
                    scroll={{ x: 720 }}
                    size={isPhone ? "small" : "middle"}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No alumni match your search or filter"
                            />
                        ),
                    }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: !isPhone,
                        simple: isPhone,
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
