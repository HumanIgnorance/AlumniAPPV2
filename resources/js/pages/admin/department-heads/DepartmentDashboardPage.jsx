import "./DepartmentDashboard.css";
import { Spin } from "antd";
import "~/styles/printPreview.css";
import { Layout } from "~/components";
import { CourseFolderModal } from "~/pages/admin/department-heads/department-dashboard-page/parts/CourseFolderModal";
import { DepartmentDashboardProvider } from "~/pages/admin/department-heads/department-dashboard-page/DepartmentDashboardContext";
import useDepartmentDashboardController from "~/pages/admin/department-heads/department-dashboard-page/hooks/useDepartmentDashboardController";
import DepartmentDashboardHeaderCard from "~/pages/admin/department-heads/department-dashboard-page/parts/DepartmentDashboardHeaderCard";
import DepartmentDashboardCard from "~/pages/admin/department-heads/department-dashboard-page/parts/DepartmentDashboardCard";
import DepartmentDashboardStatsRow from "~/pages/admin/department-heads/department-dashboard-page/parts/DepartmentDashboardStatsRow";
import DepartmentDashboardCharts from "~/pages/admin/department-heads/department-dashboard-page/parts/DepartmentDashboardCharts";

function DepartmentDashboardPage() {
    const ctx = useDepartmentDashboardController();
    const {
        isLoading,
        courseFolderVisible,
        setCourseFolderVisible,
        departmentCourseFolder,
        alumni,
    } = ctx;

    if (isLoading) {
        return (
            <Layout>
                <div style={{ display: "flex", justifyContent: "center", padding: "96px 0" }}>
                    <Spin size="large" />
                </div>
            </Layout>
        );
    }
    return (
        <DepartmentDashboardProvider value={ctx}>
            <Layout>
                {/* Header */}
                {/* Header — matches AlumniQuestionsPage hero */}
                <div
                    style={{ padding: "24px" }}
                    className="department-dashboard"
                >
                    <DepartmentDashboardHeaderCard />

                    <DepartmentDashboardCard />

                    <DepartmentDashboardStatsRow />

                    <DepartmentDashboardCharts />

                    <CourseFolderModal
                        visible={courseFolderVisible}
                        onCancel={() => {
                            setCourseFolderVisible(false);
                        }}
                        course={departmentCourseFolder}
                        alumni={alumni}
                    />
                </div>
            </Layout>
        </DepartmentDashboardProvider>
    );
}

export default DepartmentDashboardPage;
