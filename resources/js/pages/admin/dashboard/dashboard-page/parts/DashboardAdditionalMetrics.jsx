import { Card, Row, Col } from "antd";
import { COLORS } from "~/config/theme";
import {
    Title,
    Text,
} from "~/pages/admin/dashboard/dashboard-page/parts/dashboardShared";
import { useDashboardContext } from "~/pages/admin/dashboard/dashboard-page/DashboardContext";

export default function DashboardAdditionalMetrics() {
    const {
        alumniMetrics,
        overallEmploymentRate,
        salaryValues,
        minSalary,
        medianSalary,
        maxSalary,
    } = useDashboardContext();

    return (
        <Card className="print-block">
            <Title level={4} className="print-section-title">
                Engagement & Salary Snapshot
            </Title>
            <Row gutter={16}>
                <Col span={8}>
                    <div style={{ textAlign: "center" }}>
                        <Title
                            level={4}
                            style={{ color: COLORS.antdGreen, margin: 0 }}
                        >
                            {alumniMetrics?.activeThisYear || 0}
                        </Title>
                        <Text style={{ color: COLORS.slate900 }}>
                            Active This Year
                        </Text>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ textAlign: "center" }}>
                        <Title
                            level={4}
                            style={{ color: COLORS.antdGold, margin: 0 }}
                        >
                            ₱
                            {alumniMetrics?.averageSalary?.toLocaleString() ||
                                0}
                        </Title>
                        <Text style={{ color: COLORS.slate900 }}>
                            Average Salary
                        </Text>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ textAlign: "center" }}>
                        <Title
                            level={4}
                            style={{ color: COLORS.antdPurple, margin: 0 }}
                        >
                            {overallEmploymentRate}%
                        </Title>
                        <Text style={{ color: COLORS.slate900 }}>
                            Employment Rate
                        </Text>
                    </div>
                </Col>
            </Row>

            {salaryValues.length > 0 && (
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={8}>
                        <div className="print-insight-item">
                            <div className="print-insight-label">
                                Minimum Reported Salary
                            </div>
                            <div className="print-insight-value">
                                ₱{minSalary.toLocaleString()}
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="print-insight-item">
                            <div className="print-insight-label">
                                Median Reported Salary
                            </div>
                            <div className="print-insight-value">
                                ₱{medianSalary.toLocaleString()}
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="print-insight-item">
                            <div className="print-insight-label">
                                Maximum Reported Salary
                            </div>
                            <div className="print-insight-value">
                                ₱{maxSalary.toLocaleString()}
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </Card>
    );
}
