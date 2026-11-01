import { useState, useEffect } from "react";
import useAdminDashboard from "~/hooks/useAdminDashboard";
import { COLORS } from "~/config/theme";

export default function useDashboardLogic1() {
    const [printPreviewVisible, setPrintPreviewVisible] = useState(false);
    const [timeRange, setTimeRange] = useState("current");
    const [selectedMajor, setSelectedMajor] = useState("all");
    const currentYear = new Date().getFullYear();
    const [year, setSelectedYear] = useState("all");
    const [employmentData, setEmploymentData] = useState(null);
    const [alumniMetrics, setAlumniMetrics] = useState(null);
    const [industryDistribution, setIndustryDistribution] = useState([]);
    const [salaryProgression, setSalaryProgression] = useState([]);
    const [topEmployers, setTopEmployers] = useState([]);
    const [employmentByCourse, setEmploymentByCourse] = useState([]);

    const {
        isLoading,
        data: alumni = [],
        isFetching,
        refetch,
    } = useAdminDashboard(year);

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch();
        }, 30000); // 30 seconds

        return () => clearInterval(intervalId);
    }, [refetch]);

    useEffect(() => {
        const processAlumniData = () => {
            if (!Array.isArray(alumni?.alumni)) {
                setEmploymentData(null);
                setAlumniMetrics(null);
                setIndustryDistribution([]);
                setSalaryProgression([]);
                setTopEmployers([]);
                setEmploymentByCourse([]);
                return;
            }

            try {
                const alumniList = alumni.alumni;
                const totalAlumni = alumniList.length;
                const course = alumni.course || [];

                // Initialize counters for employment data
                let employedCount = 0;
                let unemployedCount = 0;
                let underEmployedCount = 0;
                let activeThisYear = 0;
                let totalSalary = 0;
                let salaryCount = 0;
                const satisfactionTotal = 0;
                const satisfactionCount = 0;
                const eventParticipationCount = 0;
                const mentorshipCount = 0;

                const byMajorData = {};
                const graduationYearData = {};
                const industryData = {};
                const employerData = {};
                const salaryByExperience = {};
                const courseEmploymentData = {};

                const currentYear = new Date().getFullYear();

                alumniList.forEach((alum) => {
                    // console.log(alum)
                    const employmentStatus = alum.employment_status_id;
                    const femploymentStatus = alum.femployment_status_id;
                    const major = alum.course_id;
                    const courseData = course.find(
                        (item) => item.id === alum.course_id,
                    );
                    // console.log(courseData)
                    const courseName =
                        courseData.course_code || `Course ${alum.course_id}`;

                    const graduationYear = alum.graduation_year;
                    const industry = alum.industry;
                    const employer = alum.current_company;
                    const salary = alum.salary_range;
                    const yearsExperience = alum.years_experience;

                    if (employmentStatus === 1 || femploymentStatus === 1) {
                        employedCount++;
                    } else if (
                        employmentStatus === 2 ||
                        femploymentStatus === 2
                    ) {
                        unemployedCount++;
                    } else if (
                        employmentStatus === 3 ||
                        femploymentStatus === 3
                    ) {
                        underEmployedCount++;
                    }

                    // Count active this year (graduated in last 5 years)
                    if (graduationYear && graduationYear >= currentYear - 5) {
                        activeThisYear++;
                    }

                    // Process salary data
                    if (salary) {
                        // Extract numbers including commas → "20,000" stays intact
                        const salaryMatch = salary.match(/[\d,]+/g);

                        if (salaryMatch && salaryMatch.length > 0) {
                            // Convert "20,000" → 20000
                            const numericValues = salaryMatch.map((num) =>
                                Number.parseInt(num.replace(/,/g, "")),
                            );

                            const avgSalary =
                                numericValues.reduce(
                                    (sum, num) => sum + num,
                                    0,
                                ) / numericValues.length;

                            totalSalary += avgSalary;
                            salaryCount++;
                        }
                    }

                    // // Process salary data
                    // if (salary) {
                    //     const salaryMatch = salary.match(/\d+/g);
                    //     if (salaryMatch && salaryMatch.length > 0) {
                    //         const avgSalary =
                    //             salaryMatch.reduce(
                    //                 (sum, num) => sum + parseInt(num),
                    //                 0
                    //             ) / salaryMatch.length;
                    //         totalSalary += avgSalary;
                    //         salaryCount++;
                    //     }
                    // }

                    // Process by course data for the new chart
                    if (courseName) {
                        if (!courseEmploymentData[courseName]) {
                            courseEmploymentData[courseName] = {
                                total: 0,
                                employed: 0,
                                unemployed: 0,
                                underEmployed: 0,
                                employmentRate: 0,
                            };
                        }

                        courseEmploymentData[courseName].total++;

                        if (employmentStatus === 1 || femploymentStatus === 1) {
                            courseEmploymentData[courseName].employed++;
                        } else if (
                            employmentStatus === 2 ||
                            femploymentStatus === 2
                        ) {
                            courseEmploymentData[courseName].unemployed++;
                        } else if (
                            employmentStatus === 3 ||
                            femploymentStatus === 3
                        ) {
                            courseEmploymentData[courseName].underEmployed++;
                        }
                    }

                    // Process by major data
                    if (major) {
                        if (!byMajorData[major]) {
                            byMajorData[major] = {
                                employed: 0,
                                unemployed: 0,
                                underEmployed: 0,
                                total: 0,
                                name: `Major ${major}`,
                            };
                        }
                        byMajorData[major].total++;
                        if (employmentStatus === 1 || femploymentStatus === 1) {
                            byMajorData[major].employed++;
                        } else if (
                            employmentStatus === 2 ||
                            femploymentStatus === 2
                        ) {
                            byMajorData[major].unemployed++;
                        } else if (
                            employmentStatus === 3 ||
                            femploymentStatus === 3
                        ) {
                            byMajorData[major].underEmployed++;
                        }
                    }

                    // Process graduation year data for trends
                    if (graduationYear) {
                        if (!graduationYearData[graduationYear]) {
                            graduationYearData[graduationYear] = {
                                employed: 0,
                                unemployed: 0,
                                underEmployed: 0,
                                total: 0,
                            };
                        }
                        graduationYearData[graduationYear].total++;
                        if (employmentStatus === 1 || femploymentStatus === 1) {
                            graduationYearData[graduationYear].employed++;
                        } else if (
                            employmentStatus === 2 ||
                            femploymentStatus === 2
                        ) {
                            graduationYearData[graduationYear].unemployed++;
                        } else if (
                            employmentStatus === 3 ||
                            femploymentStatus === 3
                        ) {
                            graduationYearData[graduationYear].underEmployed++;
                        }
                    }

                    // Process industry distribution
                    if (industry) {
                        industryData[industry] =
                            (industryData[industry] || 0) + 1;
                    }

                    // Process employer data
                    if (employer) {
                        employerData[employer] =
                            (employerData[employer] || 0) + 1;
                    }

                    // Process salary progression by experience
                    if (yearsExperience && salary) {
                        const expKey = Math.floor(yearsExperience);

                        // Parse salary numbers from string
                        const salaryMatch = salary.match(/\d+/g);
                        if (salaryMatch && salaryMatch.length > 0) {
                            // Calculate midpoint of range
                            const avgSalary =
                                salaryMatch.reduce(
                                    (sum, num) => sum + Number.parseInt(num),
                                    0,
                                ) / salaryMatch.length;
                            const roundedSalary = Math.round(avgSalary);

                            // Initialize experience year entry
                            if (!salaryByExperience[expKey]) {
                                salaryByExperience[expKey] = {};
                            }

                            // Track count for each salary
                            if (!salaryByExperience[expKey][roundedSalary]) {
                                salaryByExperience[expKey][roundedSalary] = 0;
                            }
                            salaryByExperience[expKey][roundedSalary] += 1;
                        }
                    }
                });

                // Calculate employment rates for each course
                Object.keys(courseEmploymentData).forEach((courseName) => {
                    const course = courseEmploymentData[courseName];
                    course.employmentRate =
                        course.total > 0
                            ? Math.round((course.employed / course.total) * 100)
                            : 0;
                });

                // Format course employment data for the chart
                const courseEmploymentFormatted = Object.entries(
                    courseEmploymentData,
                )
                    .map(([courseName, data]) => ({
                        course: courseName,
                        total: data.total,
                        employed: data.employed,
                        unemployed: data.unemployed,
                        underEmployed: data.underEmployed,
                        employmentRate: data.employmentRate,
                        employedPercentage:
                            data.total > 0
                                ? Math.round((data.employed / data.total) * 100)
                                : 0,
                        unemployedPercentage:
                            data.total > 0
                                ? Math.round(
                                      (data.unemployed / data.total) * 100,
                                  )
                                : 0,
                        underEmployedPercentage:
                            data.total > 0
                                ? Math.round(
                                      (data.underEmployed / data.total) * 100,
                                  )
                                : 0,
                    }))
                    .sort((a, b) => b.total - a.total);

                // Calculate employment data
                const currentData = [
                    {
                        name: "Employed",
                        value:
                            totalAlumni > 0
                                ? Math.round(
                                      (employedCount / totalAlumni) * 100,
                                  )
                                : 0,
                        color: COLORS.c32d1b3,
                        count: employedCount,
                    },
                    {
                        name: "Unemployed",
                        value:
                            totalAlumni > 0
                                ? Math.round(
                                      (unemployedCount / totalAlumni) * 100,
                                  )
                                : 0,
                        color: COLORS.antdRed,
                        count: unemployedCount,
                    },
                    {
                        name: "Under Employed",
                        value:
                            totalAlumni > 0
                                ? Math.round(
                                      (underEmployedCount / totalAlumni) * 100,
                                  )
                                : 0,
                        color: COLORS.antdGold,
                        count: underEmployedCount,
                    },
                ];

                // Format trend data (last 6 years)
                const recentYears = Object.keys(graduationYearData)
                    .map(Number)
                    .filter((year) => year >= currentYear - 6)
                    .sort((a, b) => a - b);

                const trendDataFormatted = recentYears.map((year) => ({
                    month: year.toString(),
                    employed:
                        graduationYearData[year].total > 0
                            ? Math.round(
                                  (graduationYearData[year].employed /
                                      graduationYearData[year].total) *
                                      100,
                              )
                            : 0,
                    unemployed:
                        graduationYearData[year].total > 0
                            ? Math.round(
                                  (graduationYearData[year].unemployed /
                                      graduationYearData[year].total) *
                                      100,
                              )
                            : 0,
                    underEmployed:
                        graduationYearData[year].total > 0
                            ? Math.round(
                                  (graduationYearData[year].underEmployed /
                                      graduationYearData[year].total) *
                                      100,
                              )
                            : 0,
                    // extra raw counts used in print report
                    totalGrads: graduationYearData[year].total,
                    employedCount: graduationYearData[year].employed,
                    unemployedCount: graduationYearData[year].unemployed,
                    underEmployedCount: graduationYearData[year].underEmployed,
                }));

                // Format by major data
                const byMajorFormatted = Object.values(byMajorData).map(
                    (data) => ({
                        major: data.name,
                        employed:
                            data.total > 0
                                ? Math.round((data.employed / data.total) * 100)
                                : 0,
                        unemployed:
                            data.total > 0
                                ? Math.round(
                                      (data.unemployed / data.total) * 100,
                                  )
                                : 0,
                        underEmployed:
                            data.total > 0
                                ? Math.round(
                                      (data.underEmployed / data.total) * 100,
                                  )
                                : 0,
                        totalGraduates: data.total,
                    }),
                );

                // Format industry distribution
                const industryColors = [
                    COLORS.antdBlue,
                    COLORS.antdGreen,
                    COLORS.antdGold,
                    COLORS.antdPurple,
                    COLORS.fa541c,
                    COLORS.antdCyan,
                ];
                const industryFormatted = Object.entries(industryData)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([name, value], index) => ({
                        name,
                        value: Math.round((value / totalAlumni) * 100),
                        count: value,
                        color: industryColors[index] || COLORS.gray666,
                    }));

                // Format salary progression for chart
                const salaryProgressionFormatted = [];

                Object.entries(salaryByExperience)
                    .sort(([a], [b]) => a - b)
                    .forEach(([years, salariesObj]) => {
                        Object.entries(salariesObj).forEach(
                            ([salary, count]) => {
                                salaryProgressionFormatted.push({
                                    year: `${years} Year${years > 1 ? "s" : ""}`,
                                    salary: Number.parseInt(salary),
                                    alumniCount: count, // Track how many alumni have this salary
                                });
                            },
                        );
                    });

                // Format top employers
                const topEmployersFormatted = Object.entries(employerData)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([name, hires]) => ({
                        name,
                        hires,
                        trend: "up",
                    }));

                // Calculate metrics
                const averageSalary =
                    salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0;

                setEmploymentData({
                    current: currentData,
                    trend: trendDataFormatted,
                    byMajor: byMajorFormatted,
                    summary: {
                        totalAlumni,
                        employedCount,
                        unemployedCount,
                        underEmployedCount,
                    },
                });

                setAlumniMetrics({
                    totalAlumni,
                    activeThisYear,
                    averageSalary,
                    satisfactionRate: 4.7, // You can calculate this from actual data if available
                    eventParticipation: 68, // You can calculate this from actual data if available
                    mentorshipEngagement: 42, // You can calculate this from actual data if available
                });

                setIndustryDistribution(industryFormatted);
                setSalaryProgression(salaryProgressionFormatted);
                setTopEmployers(topEmployersFormatted);
                setEmploymentByCourse(courseEmploymentFormatted);
            } catch (err) {
                console.error("Error processing alumni data:", err);
                // Set default/fallback data
                setEmploymentData({
                    current: [
                        {
                            name: "Employed",
                            value: 0,
                            color: COLORS.c32d1b3,
                            count: 0,
                        },
                        {
                            name: "Unemployed",
                            value: 0,
                            color: COLORS.antdRed,
                            count: 0,
                        },
                        {
                            name: "Under Employed",
                            value: 0,
                            color: COLORS.antdGold,
                            count: 0,
                        },
                    ],
                    trend: [],
                    byMajor: [],
                    summary: {
                        totalAlumni: 0,
                        employedCount: 0,
                        unemployedCount: 0,
                        underEmployedCount: 0,
                    },
                });
                setAlumniMetrics({
                    totalAlumni: 0,
                    activeThisYear: 0,
                    averageSalary: 0,
                    satisfactionRate: 0,
                    eventParticipation: 0,
                    mentorshipEngagement: 0,
                });
                setIndustryDistribution([]);
                setSalaryProgression([]);
                setTopEmployers([]);
                setEmploymentByCourse([]);
            }
        };

        processAlumniData();
    }, [alumni]);

    return {
        printPreviewVisible,
        setPrintPreviewVisible,
        currentYear,
        year,
        setSelectedYear,
        employmentData,
        alumniMetrics,
        industryDistribution,
        salaryProgression,
        topEmployers,
        employmentByCourse,
        isLoading,
    };
}
