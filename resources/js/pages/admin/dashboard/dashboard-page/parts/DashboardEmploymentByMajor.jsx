import { Card, Table } from "antd";
import { COLORS } from "~/config/theme";
import moment from "moment";
import {
    Title,
    Text,
} from "~/pages/admin/dashboard/dashboard-page/parts/dashboardShared";
import { useDashboardContext } from "~/pages/admin/dashboard/dashboard-page/DashboardContext";

export default function DashboardEmploymentByMajor() {
    const {
        employmentData,
        industryDistribution,
        topEmployers,
        employedSafe,
        overallEmploymentRate,
        lowestCourse,
        topIndustry,
        trendArr,
        yoYChange,
    } = useDashboardContext();

    return (
        <>
            {employmentData?.byMajor && employmentData.byMajor.length > 0 && (
                <Card className="print-block">
                    <Title level={4} className="print-section-title">
                        Employment by Major
                    </Title>
                    <Table
                        dataSource={employmentData.byMajor}
                        pagination={false}
                        size="small"
                        rowKey="major"
                        columns={[
                            {
                                title: "No.",
                                key: "index",
                                width: 50,
                                render: (_, __, index) => index + 1,
                            },
                            {
                                title: "Major",
                                dataIndex: "major",
                                key: "major",
                            },
                            {
                                title: "Employed",
                                dataIndex: "employed",
                                key: "employed",
                                render: (value) => `${value}%`,
                            },
                            {
                                title: "Unemployed",
                                dataIndex: "unemployed",
                                key: "unemployed",
                                render: (value) => `${value}%`,
                            },
                            {
                                title: "Under Employed",
                                dataIndex: "underEmployed",
                                key: "underEmployed",
                                render: (value) => `${value}%`,
                            },
                            {
                                title: "Total Graduates",
                                dataIndex: "totalGraduates",
                                key: "totalGraduates",
                            },
                        ]}
                    />
                </Card>
            )}

            {/* ===== Industry Distribution Table ===== */}
            {industryDistribution.length > 0 && (
                <Card className="print-block">
                    <Title level={4} className="print-section-title">
                        Industry Distribution (Table)
                    </Title>
                    <Table
                        dataSource={industryDistribution}
                        pagination={false}
                        size="small"
                        rowKey="name"
                        columns={[
                            {
                                title: "Rank",
                                key: "index",
                                width: 50,
                                render: (_, __, index) => index + 1,
                            },
                            {
                                title: "Industry",
                                dataIndex: "name",
                                key: "name",
                            },
                            {
                                title: "Alumni Count",
                                dataIndex: "count",
                                key: "count",
                                render: (value) => value ?? "—",
                            },
                            {
                                title: "Share",
                                dataIndex: "value",
                                key: "value",
                                render: (value) => `${value}%`,
                            },
                        ]}
                    />
                </Card>
            )}

            {/* ===== Top Employers ===== */}
            {topEmployers.length > 0 && (
                <Card className="print-block">
                    <Title level={4} className="print-section-title">
                        Top Employers
                    </Title>
                    <Table
                        dataSource={topEmployers}
                        pagination={false}
                        size="small"
                        rowKey="name"
                        columns={[
                            {
                                title: "Rank",
                                key: "index",
                                width: 50,
                                render: (_, __, index) => index + 1,
                            },
                            {
                                title: "Company",
                                dataIndex: "name",
                                key: "name",
                            },
                            {
                                title: "Hires",
                                dataIndex: "hires",
                                key: "hires",
                            },
                            {
                                title: "Share of Placed",
                                key: "share",
                                render: (_, record) =>
                                    employedSafe > 0
                                        ? `${Math.round((record.hires / employedSafe) * 100)}%`
                                        : "—",
                            },
                        ]}
                    />
                </Card>
            )}

            {/* ===== Notes & Recommendations ===== */}
            <Card className="print-block">
                <Title level={4} className="print-section-title">
                    Notes & Recommendations
                </Title>
                <ul
                    style={{
                        color: COLORS.slate900,
                        paddingLeft: 18,
                        margin: 0,
                        lineHeight: 1.7,
                    }}
                >
                    <li>
                        Employment rate of{" "}
                        <Text strong>{overallEmploymentRate}%</Text> is
                        {overallEmploymentRate >= 80
                            ? " above target. Continue current career-services initiatives."
                            : overallEmploymentRate >= 60
                              ? " near target. Focus on under-employed conversion."
                              : " below target. Prioritize job-placement programs for affected cohorts."}
                    </li>
                    {lowestCourse && lowestCourse.employmentRate < 60 && (
                        <li>
                            Course <Text strong>{lowestCourse.course}</Text>{" "}
                            shows the lowest employment rate (
                            {lowestCourse.employmentRate}%). Consider targeted
                            industry partnerships.
                        </li>
                    )}
                    {topIndustry && (
                        <li>
                            <Text strong>{topIndustry.name}</Text> is the
                            dominant employment industry — deepen recruiting
                            relationships there.
                        </li>
                    )}
                    {trendArr.length >= 2 && (
                        <li>
                            Employment trend has{" "}
                            {yoYChange >= 0 ? "improved" : "declined"} by{" "}
                            <Text strong>
                                {Math.abs(yoYChange)} percentage points
                            </Text>{" "}
                            over the reporting window.
                        </li>
                    )}
                </ul>
            </Card>

            {/* ===== Signature + Footer — kept as ONE unbreakable block ===== */}
            <div className="print-closing-block">
                <div className="print-signature">
                    <div className="sig-block">
                        <div className="sig-line">Prepared by</div>
                    </div>
                    <div className="sig-block">
                        <div className="sig-line">Reviewed by</div>
                    </div>
                    <div className="sig-block">
                        <div className="sig-line">Approved by</div>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: "16px",
                        paddingTop: "10px",
                        borderTop: "1px solid #d9d9d9",
                        textAlign: "center",
                    }}
                >
                    <Text
                        className="print-muted"
                        style={{ color: COLORS.c555555 }}
                    >
                        This is an official document generated from the Alumni
                        Management System · Page generated{" "}
                        {moment().format("YYYY-MM-DD HH:mm")}
                    </Text>
                </div>
            </div>
        </>
    );
}
