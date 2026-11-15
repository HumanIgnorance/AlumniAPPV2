import { Card } from "antd";
import { FolderOpenOutlined } from "@ant-design/icons";
import Button from "~/components/shared/AsyncButton";
import {
    Title,
    Text,
} from "~/pages/admin/department-heads/department-dashboard-page/parts/departmentDashboardShared";
import { useDepartmentDashboardContext } from "~/pages/admin/department-heads/department-dashboard-page/DepartmentDashboardContext";

/** "My Department": the head's own course + a one-tap way into its alumni folder. */
export default function DepartmentDashboardCard() {
    const { departmentCourseFolder, handleOpenCourseFolder, alumni } =
        useDepartmentDashboardContext();

    if (!departmentCourseFolder) {
        return (
            <Card className="dashboard-card dd-dept" title="My Department">
                <Text type="secondary">
                    No course is assigned to your account yet. Please contact
                    the administrator.
                </Text>
            </Card>
        );
    }

    const color = departmentCourseFolder.color;
    return (
        <Card className="dashboard-card dd-dept" title="My Department">
            <div className="dd-dept__row">
                <div
                    className="dd-dept__folder"
                    style={{ background: `${color}1f`, color }}
                    aria-hidden="true"
                >
                    <FolderOpenOutlined />
                </div>
                <div className="dd-dept__meta">
                    <Title level={4} className="dd-dept__code">
                        {departmentCourseFolder.code}
                    </Title>
                    <div className="dd-dept__name">
                        {departmentCourseFolder.name}
                    </div>
                    <Text type="secondary">
                        {alumni.length} alumni in your department
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<FolderOpenOutlined />}
                    onClick={handleOpenCourseFolder}
                >
                    Open course folder
                </Button>
            </div>
        </Card>
    );
}
