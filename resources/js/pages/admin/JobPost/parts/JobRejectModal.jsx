import React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Alert, Input, Modal, Space, Typography } from "antd";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";

const { Text } = Typography;
const { TextArea } = Input;

export default function JobRejectModal() {
    const {
        rejectJobPostModalVisible,
        setRejectJobPostModalVisible,
        setRejectJobPostId,
        setRejectJobPostNotes,
        confirmRejectJobPost,
        rejectJobPostLoading,
        isMobile,
        rejectJobPostNotes,
    } = useJobPostContext();

    return (
        <Modal
            title={
                <Space>
                    <CloseCircleOutlined style={{ color: COLORS.antdRed }} />
                    <span>Reject Job Post</span>
                </Space>
            }
            open={rejectJobPostModalVisible}
            onCancel={() => {
                setRejectJobPostModalVisible(false);
                setRejectJobPostId(null);
                setRejectJobPostNotes("");
            }}
            onOk={confirmRejectJobPost}
            okText="Reject & Send Email"
            okType="danger"
            okButtonProps={{ loading: rejectJobPostLoading }}
            cancelButtonProps={{ disabled: rejectJobPostLoading }}
            width={isMobile ? "95%" : 600}
            style={{
                top: isMobile ? 8 : undefined,
                maxWidth: isMobile ? "95vw" : undefined,
                paddingBottom: 0,
            }}
        >
            <div style={{ marginBottom: 16 }}>
                <Alert
                    message="Rejection Notification"
                    description="The alumni who created this job post will receive an email notification with your feedback explaining why their post was rejected."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <Text strong>Please provide a reason for rejection:</Text>
                <Text
                    type="secondary"
                    style={{ display: "block", marginBottom: 8 }}
                >
                    This feedback will be sent to the alumni via email.
                </Text>
                <TextArea
                    rows={5}
                    value={rejectJobPostNotes}
                    onChange={(e) => setRejectJobPostNotes(e.target.value)}
                    placeholder={`Example: Your job post was rejected because:
        - The job description lacks specific requirements
        - The salary range seems unrealistic
        - Missing company information
        - Please provide more details about the role responsibilities

        Feel free to update your post and resubmit for review.`}
                    maxLength={1000}
                    showCount
                    style={{ marginTop: 8 }}
                />
            </div>
        </Modal>
    );
}
