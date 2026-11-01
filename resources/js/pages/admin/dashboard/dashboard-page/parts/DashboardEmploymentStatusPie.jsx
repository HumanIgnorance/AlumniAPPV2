import { Card, Row, Col } from "antd";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    Legend,
} from "recharts";
import { COLORS } from "~/config/theme";
import {
    Title,
    Text,
} from "~/pages/admin/dashboard/dashboard-page/parts/dashboardShared";
import { useDashboardContext } from "~/pages/admin/dashboard/dashboard-page/DashboardContext";

export default function DashboardEmploymentStatusPie() {
    const {
        employmentData,
        employedSafe,
        unemployedSafe,
        underEmployedSafe,
        totalAlumniSafe,
    } = useDashboardContext();

    return (
        <Card className="print-block">
            <Title level={4} className="print-section-title">
                Overall Employment Status
            </Title>
            <Row gutter={16}>
                <Col span={12}>
                    <div
                        className="print-chart-box"
                        style={{ width: "100%", height: 250 }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={employmentData?.current || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(employmentData?.current || []).map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ),
                                    )}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value, name) => [
                                        `${value}%`,
                                        name,
                                    ]}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{ paddingTop: "20px" }}>
                        {(employmentData?.current || []).map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: "16px",
                                        height: "16px",
                                        backgroundColor: item.color,
                                        marginRight: "10px",
                                        borderRadius: "4px",
                                    }}
                                />
                                <Text
                                    style={{
                                        marginRight: "10px",
                                        color: COLORS.slate900,
                                    }}
                                >
                                    {item.name}:
                                </Text>
                                <Text strong style={{ color: COLORS.slate900 }}>
                                    {item.value}%
                                </Text>
                                <Text
                                    type="secondary"
                                    style={{
                                        marginLeft: "8px",
                                        color: COLORS.c555555,
                                    }}
                                >
                                    ({item.count} alumni)
                                </Text>
                            </div>
                        ))}
                        <div
                            style={{
                                marginTop: 10,
                                fontSize: 11,
                                color: COLORS.c555555,
                            }}
                        >
                            Total accounted:{" "}
                            {employedSafe + unemployedSafe + underEmployedSafe}{" "}
                            of {totalAlumniSafe} alumni.
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}
