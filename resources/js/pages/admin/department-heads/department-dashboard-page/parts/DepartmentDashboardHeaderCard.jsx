import { Tag, Select } from "antd";
import { CheckCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import Button from "~/components/shared/AsyncButton";
import logo from "~/assets/images/OCC_LOGO.png";
import {
    Title,
    Paragraph,
    Text,
    Option,
} from "~/pages/admin/department-heads/department-dashboard-page/parts/departmentDashboardShared";
import { useDepartmentDashboardContext } from "~/pages/admin/department-heads/department-dashboard-page/DepartmentDashboardContext";

/**
 * Same header as the admin Dashboard and every other page
 * (.dashboard-hero → sized/aligned by css/page-header.css):
 *   [logo] [chip]   Title ............ [year filter] [refresh]
 *   one-line description
 */
export default function DepartmentDashboardHeaderCard() {
    const {
        course,
        year,
        setSelectedYear,
        graduationYears,
        refetch,
        isFetching,
        dataUpdatedAt,
    } = useDepartmentDashboardContext();

    const code = course?.course_code;
    const updated = dataUpdatedAt
        ? new Date(dataUpdatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : null;

    return (
        <section className="dashboard-hero" aria-label="Department dashboard header">
            <div className="dashboard-hero__bg" aria-hidden="true">
                <span className="orb orb-1" />
                <span className="orb orb-2" />
                <span className="orb orb-3" />
                <div className="grid-overlay" />
            </div>

            <div className="dashboard-hero__content">
                <div className="dashboard-hero__left">
                    <div className="dashboard-hero__brand">
                        <img
                            src={logo}
                            alt="OCC Logo"
                            className="dashboard-hero__logo"
                        />
                        <div className="dashboard-hero__brand-meta">
                            <Tag
                                className="dashboard-chip"
                                icon={<CheckCircleOutlined />}
                            >
                                Department Head Dashboard
                            </Tag>
                            <Text className="dashboard-hero__eyebrow">
                                Department Overview
                            </Text>
                        </div>
                    </div>

                    <Title level={2} className="dashboard-hero__title">
                        {code ? `${code} ` : "Department "}
                        <span className="grad-text">Dashboard</span>
                    </Title>

                    <Paragraph className="dashboard-hero__lead">
                        {course?.course_name
                            ? `${course.course_name} — real-time alumni employment and career insights for your department.`
                            : "Real-time alumni employment and career insights for your assigned department."}
                    </Paragraph>
                </div>

                <div className="dashboard-hero__controls">
                    {updated && (
                        <span className="dh-updated">Updated {updated}</span>
                    )}
                    <Select
                        value={year}
                        onChange={setSelectedYear}
                        className="dashboard-hero__select"
                        placeholder="Filter by graduation year"
                        aria-label="Filter by graduation year"
                    >
                        <Option value="all">All Years</Option>
                        {graduationYears.map((y) => (
                            <Option key={y} value={y}>
                                {y}
                            </Option>
                        ))}
                    </Select>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        loading={isFetching}
                        onClick={() => refetch()}
                        className="dashboard-hero__print-btn dashboard-hero__refresh"
                    >
                        Refresh
                    </Button>
                </div>
            </div>
        </section>
    );
}
