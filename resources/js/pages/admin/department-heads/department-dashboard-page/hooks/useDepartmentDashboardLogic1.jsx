import { useState, useEffect } from "react";
import {
    useDepartmentHeadDashboard,
    useDepartmentHeadAlumni,
} from "~/hooks/useDepartmentHeads";
import { COLORS } from "~/config/theme";
import { toSameOriginUrl } from "~/utils/assetUrl";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

export default function useDepartmentDashboardLogic1() {
    const [year, setSelectedYear] = useState("all");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const [courseFolderVisible, setCourseFolderVisible] = useState(false);
    // Removed selectedCourse state, use course from dashboardData instead

    const [employmentTrend, setEmploymentTrend] = useState([]);
    const [industryDistribution, setIndustryDistribution] = useState([]);
    const [salaryProgression, setSalaryProgression] = useState([]);
    const [topEmployers, setTopEmployers] = useState([]);

    const {
        data: dashboardData,
        isLoading,
        refetch,
    } = useDepartmentHeadDashboard(year);
    const { data: alumniList = [] } = useDepartmentHeadAlumni();

    const alumni = dashboardData?.alumni || [];
    const course = dashboardData?.course;

    const departmentCourseFolder = course
        ? {
              id: course.id,
              code: course.course_code,
              name: course.course_name,
              color:
                  course.id === 1
                      ? COLORS.f5222d
                      : course.id === 2
                        ? COLORS.antdBlue
                        : course.id === 3
                          ? COLORS.antdBlue
                          : course.id === 4
                            ? COLORS.antdGold
                            : COLORS.brand,
          }
        : null;

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch();
        }, 30000);
        return () => clearInterval(intervalId);
    }, [refetch]);

    useEffect(() => {
        if (!Array.isArray(alumni) || alumni.length === 0) {
            setEmploymentTrend([]);
            setIndustryDistribution([]);
            setSalaryProgression([]);
            setTopEmployers([]);
            return;
        }

        try {
            // Process Employment Trend by graduation year
            const trendData = {};
            const industryData = {};
            const employerData = {};
            const salaryByExperience = {};

            alumni.forEach((alum) => {
                const gradYear = alum.graduation_year;
                const statusId = alum.employment_status_id;
                const industry = alum.industry;
                const employer = alum.current_company;
                const yearsExperience = alum.years_experience;
                const salary = alum.salary_range;

                // Process trend data by graduation year
                if (gradYear) {
                    if (!trendData[gradYear]) {
                        trendData[gradYear] = {
                            employed: 0,
                            unemployed: 0,
                            underEmployed: 0,
                            total: 0,
                        };
                    }
                    trendData[gradYear].total++;
                    if (statusId === 1) trendData[gradYear].employed++;
                    else if (statusId === 2) trendData[gradYear].unemployed++;
                    else if (statusId === 3)
                        trendData[gradYear].underEmployed++;
                }

                // Process industry distribution
                if (industry) {
                    industryData[industry] = (industryData[industry] || 0) + 1;
                }

                // Process employer data
                if (employer) {
                    employerData[employer] = (employerData[employer] || 0) + 1;
                }

                // Process salary progression by experience
                if (yearsExperience && salary) {
                    const expKey = Math.floor(yearsExperience);
                    const salaryMatch = salary.match(/\d+/g);
                    if (salaryMatch && salaryMatch.length > 0) {
                        const avgSalary =
                            salaryMatch.reduce(
                                (sum, num) => sum + Number.parseInt(num),
                                0,
                            ) / salaryMatch.length;
                        const roundedSalary = Math.round(avgSalary);

                        if (!salaryByExperience[expKey]) {
                            salaryByExperience[expKey] = { total: 0, count: 0 };
                        }
                        salaryByExperience[expKey].total += roundedSalary;
                        salaryByExperience[expKey].count++;
                    }
                }
            });

            // Format employment trend
            const trendFormatted = Object.entries(trendData)
                .sort(([a], [b]) => a - b)
                .slice(-6) // Last 6 years
                .map(([year, data]) => ({
                    year: year,
                    employed:
                        data.total > 0
                            ? Math.round((data.employed / data.total) * 100)
                            : 0,
                    unemployed:
                        data.total > 0
                            ? Math.round((data.unemployed / data.total) * 100)
                            : 0,
                    underEmployed:
                        data.total > 0
                            ? Math.round(
                                  (data.underEmployed / data.total) * 100,
                              )
                            : 0,
                }));

            // Format industry distribution
            const industryColors = [
                COLORS.antdBlue,
                COLORS.antdGreen,
                COLORS.antdGold,
                COLORS.antdPurple,
                COLORS.fa541c,
                COLORS.antdCyan,
            ];
            const totalAlumni = alumni.length;
            const industryFormatted = Object.entries(industryData)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([name, value], index) => ({
                    name,
                    value: Math.round((value / totalAlumni) * 100),
                    color: industryColors[index] || COLORS.gray666,
                }));

            // Format salary progression
            const salaryFormatted = Object.entries(salaryByExperience)
                .sort(([a], [b]) => a - b)
                .map(([years, data]) => ({
                    year: `${years} Year${years > 1 ? "s" : ""}`,
                    salary:
                        data.count > 0
                            ? Math.round(data.total / data.count)
                            : 0,
                    alumniCount: data.count,
                }));

            // Format top employers
            const topEmployersFormatted = Object.entries(employerData)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([name, hires]) => ({
                    name,
                    hires,
                    trend: "up",
                }));

            setEmploymentTrend(trendFormatted);
            setIndustryDistribution(industryFormatted);
            setSalaryProgression(salaryFormatted);
            setTopEmployers(topEmployersFormatted);
        } catch (err) {
            console.error("Error processing alumni data:", err);
        }
    }, [alumni]);

    const stats = {
        total: alumni.length,
        employed: alumni.filter((a) => a.employment_status_id === 1).length,
        unemployed: alumni.filter((a) => a.employment_status_id === 2).length,
        underEmployed: alumni.filter((a) => a.employment_status_id === 3)
            .length,
    };

    const employmentRate =
        stats.total > 0 ? Math.round((stats.employed / stats.total) * 100) : 0;

    const pieData = [
        { name: "Employed", value: stats.employed, color: COLORS.antdGreen },
        { name: "Unemployed", value: stats.unemployed, color: COLORS.antdRed },
        {
            name: "Under Employed",
            value: stats.underEmployed,
            color: COLORS.antdGold,
        },
    ].filter((item) => item.value > 0);

    const graduationYears = [
        ...new Set(alumniList.map((a) => a.graduation_year)),
    ].sort((a, b) => b - a);

    // Calculate average salary
    const averageSalary = (() => {
        let totalSalary = 0;
        let salaryCount = 0;
        alumni.forEach((alum) => {
            if (alum.salary_range) {
                const salaryMatch = alum.salary_range.match(/\d+/g);
                if (salaryMatch && salaryMatch.length > 0) {
                    const avgSalary =
                        salaryMatch.reduce(
                            (sum, num) => sum + Number.parseInt(num),
                            0,
                        ) / salaryMatch.length;
                    totalSalary += avgSalary;
                    salaryCount++;
                }
            }
        });
        return salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0;
    })();

    const handleView = (values) => {
        const previewData = {
            first_name: values.first_name,
            last_name: values.last_name,
            middle_name: values.middle_name,
            suffix: values.suffix,
            email: values.email,
            phone: values.phone,
            address: values.address,
            birth_date: values.birth_date,
            gender: values.gender,
            bio: values.bio,
            course_id: values.course_id,
            student_id: values.student_id,
            graduation_year: values.graduation_year,
            enrollment_year: values.enrollment_year,
            honors:
                typeof values.honors === "string" && values.honors.trim() !== ""
                    ? JSON.parse(values.honors)
                    : Array.isArray(values.honors)
                      ? values.honors
                      : [],
            thesis_title: values.thesis_title,
            academic_achievements: values.academic_achievements,
            extracurricular: values.extracurricular,
            continue_education: values.continue_education,
            employment_status_id: values.employment_status_id,
            current_company: values.current_company,
            job_title: values.job_title,
            industry: values.industry,
            years_experience: values.years_experience,
            salary_range: values.salary_range,
            work_location: values.work_location,
            career_goals: values.career_goals,
            previous_companies: values.previous_companies,
            linkedin: values.linkedin,
            github: values.github,
            portfolio: values.portfolio,
            twitter: values.twitter,
            newsletter: values.newsletter,
            contactPermission: values.contactPermission,
            agreement: values.agreement,
            profileImage: toSameOriginUrl(values?.profile_image_url),
            idDocuments: values?.documents || [],
        };
        setPreviewData(previewData);
        setIsModalVisible(true);
    };

    const handleOpenCourseFolder = () => {
        if (departmentCourseFolder) {
            setCourseFolderVisible(true);
        }
    };

    const getEmploymentStatusTag = (statusId) => {
        const config = {
            1: {
                color: "green",
                text: "Employed",
                icon: <CheckCircleOutlined />,
            },
            2: {
                color: "red",
                text: "Unemployed",
                icon: <ClockCircleOutlined />,
            },
            3: {
                color: "orange",
                text: "Under Employed",
                icon: <ExclamationCircleOutlined />,
            },
        };
        const statusConfig = config[statusId] || {
            color: "default",
            text: "Unknown",
        };
        return (
            <Tag color={statusConfig.color} icon={statusConfig.icon}>
                {statusConfig.text}
            </Tag>
        );
    };

    return {
        year,
        setSelectedYear,
        isModalVisible,
        setIsModalVisible,
        previewData,
        setPreviewData,
        courseFolderVisible,
        setCourseFolderVisible,
        employmentTrend,
        industryDistribution,
        salaryProgression,
        topEmployers,
        isLoading,
        alumni,
        course,
        departmentCourseFolder,
        stats,
        employmentRate,
        pieData,
        graduationYears,
        averageSalary,
        handleOpenCourseFolder,
        getEmploymentStatusTag,
    };
}
