import { Col, Card, Descriptions } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { useProfileContext } from "~/pages/admin/profile-page/ProfileContext";

export default function ProfileAcademicInformation() {
    const { detailedProfile } = useProfileContext();

    return (
        <Col xs={24} lg={12}>
            <Card
                className="profile-card"
                bordered={false}
                title={
                    <span className="profile-card-title">
                        <span className="profile-card-icon profile-icon-emerald">
                            <BookOutlined />
                        </span>
                        Academic Information
                    </span>
                }
            >
                <Descriptions
                    column={1}
                    size="small"
                    className="profile-descriptions"
                >
                    <Descriptions.Item label="Student ID">
                        {detailedProfile?.academicInfo?.studentId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Admission Year">
                        {detailedProfile?.academicInfo?.admissionYear}
                    </Descriptions.Item>
                    <Descriptions.Item label="Graduation Year">
                        {detailedProfile?.academicInfo?.graduationYear}
                    </Descriptions.Item>
                    <Descriptions.Item label="Honors">
                        {detailedProfile?.academicInfo?.honors}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thesis Title">
                        {detailedProfile?.academicInfo?.thesisTitle}
                    </Descriptions.Item>
                    <Descriptions.Item label="Continuing Education">
                        {detailedProfile?.academicInfo?.continueEducation
                            ? "Yes"
                            : "No"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </Col>
    );
}
