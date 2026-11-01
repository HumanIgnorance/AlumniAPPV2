import { Card, Button } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    KeyOutlined,
    SaveOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { useProfileContext } from "~/pages/admin/profile-page/ProfileContext";

export default function ProfileActionButtonsCard() {
    const {
        isEditMode,
        handleCareerEditClick,
        handleView,
        setChangePasswordVisible,
        handleSave,
        saving,
        handleCancel,
    } = useProfileContext();

    return (
        <Card className="profile-actions-card" bordered={false}>
            {!isEditMode ? (
                <div className="profile-actions-grid">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={handleCareerEditClick}
                        className="profile-btn profile-btn-primary"
                    >
                        Edit Career Info
                    </Button>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleView()}
                        className="profile-btn profile-btn-ghost"
                    >
                        View Full Details
                    </Button>
                    <Button
                        icon={<KeyOutlined />}
                        onClick={() => setChangePasswordVisible(true)}
                        className="profile-btn profile-btn-soft"
                    >
                        Change Password
                    </Button>
                </div>
            ) : (
                <div className="profile-actions-grid profile-actions-grid--edit">
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        loading={saving}
                        className="profile-btn profile-btn-primary"
                    >
                        Save Changes
                    </Button>
                    <Button
                        icon={<CloseOutlined />}
                        onClick={handleCancel}
                        disabled={saving}
                        className="profile-btn profile-btn-ghost"
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </Card>
    );
}
