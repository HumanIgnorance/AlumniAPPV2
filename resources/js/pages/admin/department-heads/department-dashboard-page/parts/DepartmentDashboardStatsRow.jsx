import { Row, Col, Card, Statistic } from "antd";
import {
    TeamOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import { Text } from "~/pages/admin/department-heads/department-dashboard-page/parts/departmentDashboardShared";
import { useDepartmentDashboardContext } from "~/pages/admin/department-heads/department-dashboard-page/DepartmentDashboardContext";

export default function DepartmentDashboardStatsRow() {
    const { stats, employmentRate, averageSalary } =
        useDepartmentDashboardContext();

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            <Col xs={24} sm={12} md={6}>
                <Card className="metric-card">
                    <Statistic
                        title="Total Alumni"
                        value={stats.total}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: COLORS.antdBlue }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card className="metric-card">
                    <Statistic
                        title="Employed"
                        value={stats.employed}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: COLORS.antdGreen }}
                        suffix={
                            <Text type="secondary" style={{ fontSize: "14px" }}>
                                ({employmentRate}%)
                            </Text>
                        }
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card className="metric-card">
                    <Statistic
                        title="Unemployed"
                        value={stats.unemployed}
                        prefix={<ClockCircleOutlined />}
                        valueStyle={{ color: COLORS.antdRed }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card className="metric-card">
                    <Statistic
                        title="Avg. Salary"
                        value={averageSalary}
                        valueStyle={{ color: COLORS.antdPurple }}
                        formatter={(value) => `₱${value.toLocaleString()}`}
                    />
                </Card>
            </Col>
        </Row>
    );
}
