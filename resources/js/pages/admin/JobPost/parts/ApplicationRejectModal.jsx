import React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Alert, Input, Modal, Space, Typography } from "antd";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";

const { Text } = Typography;
const { TextArea } = Input;

export default function ApplicationRejectModal() {
    const {
        rejectApplicationModalVisible,
        setRejectApplicationModalVisible,
        setRejectApplicationId,
        setRejectApplicationNotes,
        confirmRejectApplication,
        rejectApplicationLoading,
        isMobile,
        rejectApplicationNotes,
    } = useJobPostContext();

    return (
        <Modal
            title={
                <Space>
                    <CloseCircleOutlined style={{ color: COLORS.antdRed }} />
                    <span>Reject Application</span>
                </Space>
            }
            open={rejectApplicationModalVisible}
            onCancel={() => {
                setRejectApplicationModalVisible(false);
                setRejectApplicationId(null);
                setRejectApplicationNotes("");
            }}
            onOk={confirmRejectApplication}
            okText="Reject & Send Email"
            okType="danger"
            okButtonProps={{ loading: rejectApplicationLoading }}
            cancelButtonProps={{ disabled: rejectApplicationLoading }}
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
                    description="The applicant will receive an email notification with your feedback explaining why their application was not successful."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <Text strong>Please provide feedback for the applicant:</Text>
                <Text
                    type="secondary"
                    style={{ display: "block", marginBottom: 8 }}
                >
                    This feedback will help the applicant understand the
                    decision and improve for future applications.
                </Text>
                <TextArea
                    rows={5}
                    value={rejectApplicationNotes}
                    onChange={(e) => setRejectApplicationNotes(e.target.value)}
                    placeholder={`Example: Thank you for your interest in this position. After careful review:
        - We are looking for candidates with more experience in [specific skill]
        - The role requires [specific qualification] which was not evident in your application
        - We encourage you to apply for other positions that may be a better fit

        We appreciate your interest and wish you success in your job search.`}
                    maxLength={1000}
                    showCount
                    style={{ marginTop: 8 }}
                />
            </div>
        </Modal>
    );
}
