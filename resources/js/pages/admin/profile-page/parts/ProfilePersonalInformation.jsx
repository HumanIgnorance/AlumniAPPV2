import { Col, Card, Descriptions } from "antd";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { useProfileContext } from "~/pages/admin/profile-page/ProfileContext";

export default function ProfilePersonalInformation() {
    const { detailedProfile } = useProfileContext();

    return (
        <Col xs={24} lg={12}>
            <Card
                className="profile-card"
                bordered={false}
                title={
                    <span className="profile-card-title">
                        <span className="profile-card-icon profile-icon-indigo">
                            <UserOutlined />
                        </span>
                        Personal Information
                    </span>
                }
            >
                <Descriptions
                    column={1}
                    size="small"
                    className="profile-descriptions"
                >
                    <Descriptions.Item label="First Name">
                        {detailedProfile?.personalInfo?.firstName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Middle Name">
                        {detailedProfile?.personalInfo?.middleName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Name">
                        {detailedProfile?.personalInfo?.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Date of Birth">
                        {detailedProfile?.personalInfo?.dateOfBirth &&
                        detailedProfile.personalInfo.dateOfBirth !==
                            "Not provided"
                            ? moment(
                                  detailedProfile.personalInfo.dateOfBirth,
                              ).format("MMM DD, YYYY")
                            : "Not provided"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Gender">
                        {detailedProfile?.personalInfo?.gender}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nationality">
                        {detailedProfile?.personalInfo?.nationality}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </Col>
    );
}
