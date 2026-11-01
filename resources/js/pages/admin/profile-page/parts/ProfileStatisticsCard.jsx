import { Card } from "antd";
import {
    BankOutlined,
    SolutionOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { Text } from "~/pages/admin/profile-page/parts/profileShared";
import { useProfileContext } from "~/pages/admin/profile-page/ProfileContext";

export default function ProfileStatisticsCard() {
    const { detailedProfile } = useProfileContext();

    return (
        <Card className="profile-stats-card" bordered={false}>
            <div className="profile-stats-grid">
                {/* <div className="profile-stat">
                <span className="profile-stat-icon">
                  <BookOutlined />
                </span>
                <div>
                  <Text className="profile-stat-label">Student ID</Text>
                  <Text className="profile-stat-value">
                    {detailedProfile?.academicInfo?.studentId || "—"}
                  </Text>
                </div>
              </div> */}
                <div className="profile-stat">
                    <span className="profile-stat-icon">
                        <BankOutlined />
                    </span>
                    <div>
                        <Text className="profile-stat-label">Company</Text>
                        <Text className="profile-stat-value">
                            {detailedProfile?.professionalInfo
                                ?.currentCompany || "—"}
                        </Text>
                    </div>
                </div>
                <div className="profile-stat">
                    <span className="profile-stat-icon">
                        <SolutionOutlined />
                    </span>
                    <div>
                        <Text className="profile-stat-label">Role</Text>
                        <Text className="profile-stat-value">
                            {detailedProfile?.professionalInfo?.jobTitle || "—"}
                        </Text>
                    </div>
                </div>
                <div className="profile-stat">
                    <span className="profile-stat-icon">
                        <ClockCircleOutlined />
                    </span>
                    <div>
                        <Text className="profile-stat-label">Last Updated</Text>
                        <Text className="profile-stat-value">
                            {detailedProfile?.basicInfo?.lastUpdated || "—"}
                        </Text>
                    </div>
                </div>
            </div>
        </Card>
    );
}
