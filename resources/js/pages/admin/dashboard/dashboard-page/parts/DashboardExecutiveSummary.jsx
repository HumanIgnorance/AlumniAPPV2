import { Card } from "antd";
import { COLORS } from "~/config/theme";
import {
    Title,
    Paragraph,
    Text,
} from "~/pages/admin/dashboard/dashboard-page/parts/dashboardShared";
import { useDashboardContext } from "~/pages/admin/dashboard/dashboard-page/DashboardContext";

export default function DashboardExecutiveSummary() {
    const {
        totalAlumniSafe,
        year,
        overallEmploymentRate,
        employedSafe,
        underEmployedSafe,
        unemployedSafe,
        bestCourse,
        topIndustry,
        alumniMetrics,
        overallUnemploymentRate,
        overallUnderEmploymentRate,
        lowestCourse,
        largestCohort,
        topEmployer,
        trendArr,
        yoYChange,
    } = useDashboardContext();

    return (
        <Card className="print-block">
            <Title level={4} className="print-section-title">
                Executive Summary
            </Title>
            <Paragraph style={{ color: COLORS.slate900, marginBottom: 8 }}>
                This report covers <Text strong>{totalAlumniSafe}</Text> alumni
                {year === "all"
                    ? " across all graduation years"
                    : ` from graduation year ${year}`}
                . The overall employment rate is{" "}
                <Text strong>{overallEmploymentRate}%</Text>, with{" "}
                <Text strong>{employedSafe}</Text> employed,{" "}
                <Text strong>{underEmployedSafe}</Text> under-employed, and{" "}
                <Text strong>{unemployedSafe}</Text> unemployed alumni on
                record.
                {bestCourse && (
                    <>
                        {" "}
                        The top-performing program is{" "}
                        <Text strong>{bestCourse.course}</Text> (
                        {bestCourse.employmentRate}% employment rate).
                    </>
                )}
                {topIndustry && (
                    <>
                        {" "}
                        The leading industry is{" "}
                        <Text strong>{topIndustry.name}</Text> (
                        {topIndustry.value}% of placed alumni).
                    </>
                )}
            </Paragraph>

            <div className="print-insight-grid">
                <div className="print-insight-item">
                    <div className="print-insight-label">Total Alumni</div>
                    <div className="print-insight-value">
                        {totalAlumniSafe.toLocaleString()}
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">
                        Active (last 5 years)
                    </div>
                    <div className="print-insight-value">
                        {alumniMetrics?.activeThisYear || 0}
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">Employment Rate</div>
                    <div className="print-insight-value">
                        {overallEmploymentRate}%
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">Unemployment Rate</div>
                    <div className="print-insight-value">
                        {overallUnemploymentRate}%
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">
                        Under-Employment Rate
                    </div>
                    <div className="print-insight-value">
                        {overallUnderEmploymentRate}%
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">Average Salary</div>
                    <div className="print-insight-value">
                        ₱{(alumniMetrics?.averageSalary || 0).toLocaleString()}
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">
                        Best Performing Course
                    </div>
                    <div className="print-insight-value">
                        {bestCourse
                            ? `${bestCourse.course} (${bestCourse.employmentRate}%)`
                            : "—"}
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">
                        Lowest Performing Course
                    </div>
                    <div className="print-insight-value">
                        {lowestCourse
                            ? `${lowestCourse.course} (${lowestCourse.employmentRate}%)`
                            : "—"}
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">Largest Cohort</div>
                    <div className="print-insight-value">
                        {largestCohort
                            ? `${largestCohort.course} (${largestCohort.total} alumni)`
                            : "—"}
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">Top Industry</div>
                    <div className="print-insight-value">
                        {topIndustry
                            ? `${topIndustry.name} (${topIndustry.count} alumni)`
                            : "—"}
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">Top Employer</div>
                    <div className="print-insight-value">
                        {topEmployer
                            ? `${topEmployer.name} (${topEmployer.hires} hires)`
                            : "—"}
                    </div>
                </div>
                <div className="print-insight-item">
                    <div className="print-insight-label">
                        Employment Trend (YoY)
                    </div>
                    <div className="print-insight-value">
                        {trendArr.length >= 2
                            ? `${yoYChange >= 0 ? "+" : ""}${yoYChange}% pts`
                            : "—"}
                    </div>
                </div>
            </div>
        </Card>
    );
}
