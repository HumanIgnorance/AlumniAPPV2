import { Card, Row, Col, Select } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
    Title,
    Text,
    Option,
} from "~/pages/admin/department-heads/department-dashboard-page/parts/departmentDashboardShared";
import { useDepartmentDashboardContext } from "~/pages/admin/department-heads/department-dashboard-page/DepartmentDashboardContext";

export default function DepartmentDashboardHeaderCard() {
    const { course, year, setSelectedYear, graduationYears } =
        useDepartmentDashboardContext();

    return (
        <Card
            className="dashboard-header-card"
            bordered={false}
            style={{ marginBottom: "24px" }}
        >
            <div className="dh-hero__bg" aria-hidden="true">
                <span className="dh-orb dh-orb-1" />
                <span className="dh-orb dh-orb-2" />
                <span className="dh-orb dh-orb-3" />
                <div className="dh-grid-overlay" />
            </div>

            <Row
                justify="space-between"
                align="middle"
                gutter={[16, 16]}
                className="dh-header-row"
            >
                <Col xs={24} md={16}>
                    <span className="dh-header-chip">
                        <CheckCircleOutlined /> Department Overview
                    </span>
                    <Title level={2} className="dh-header-title">
                        Department <span className="dh-grad">Dashboard</span>
                    </Title>
                    <Text className="dh-header-sub">
                        {course?.course_code
                            ? `${course.course_code} — ${course.course_name}`
                            : "Real-time alumni insights for your assigned department"}
                    </Text>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: "right" }}>
                    <Select
                        className="dh-header-select"
                        value={year}
                        onChange={setSelectedYear}
                        style={{ width: 200 }}
                        placeholder="Filter by Year"
                    >
                        <Option value="all">All Years </Option>
                        {graduationYears.map((y) => (
                            <Option key={y} value={y}>
                                {y}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>
        </Card>
    );
}
