import { Card, Row, Col } from "antd";
import { FolderOutlined } from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import {
    Title,
    Text,
} from "~/pages/admin/department-heads/department-dashboard-page/parts/departmentDashboardShared";
import { useDepartmentDashboardContext } from "~/pages/admin/department-heads/department-dashboard-page/DepartmentDashboardContext";

export default function DepartmentDashboardCard() {
    const { departmentCourseFolder, handleOpenCourseFolder, alumni } =
        useDepartmentDashboardContext();

    return (
        <Card
            title="My Course Folder"
            style={{ marginBottom: "24px" }}
            className="dashboard-card"
        >
            <Row gutter={[16, 16]}>
                {departmentCourseFolder ? (
                    <Col xs={24} sm={12} md={6}>
                        <Card
                            hoverable
                            style={{
                                textAlign: "center",
                                borderTop: `3px solid ${departmentCourseFolder.color}`,
                                cursor: "pointer",
                            }}
                            onClick={handleOpenCourseFolder}
                        >
                            <FolderOutlined
                                style={{
                                    fontSize: 48,
                                    color: departmentCourseFolder.color,
                                    marginBottom: 16,
                                }}
                            />
                            <Title level={4} style={{ margin: 0 }}>
                                {departmentCourseFolder.code}
                            </Title>
                            <Text type="secondary">{alumni.length} Alumni</Text>
                        </Card>
                    </Col>
                ) : (
                    <Col span={24}>
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px",
                                color: COLORS.c999999,
                            }}
                        >
                            No course assigned to your account
                        </div>
                    </Col>
                )}
            </Row>
        </Card>
    );
}
