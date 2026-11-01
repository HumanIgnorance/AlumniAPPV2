import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Typography } from "antd";
import moment from "moment";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";
import { clearJobPostDraft } from "~/pages/admin/JobPost/parts/jobPostStorage";

const { Text } = Typography;

export default function JobFormPromptModals() {
    const {
        discardConfirmVisible,
        setDiscardConfirmVisible,
        confirmDiscardChanges,
        draftRestoreModalVisible,
        setDraftRestoreModalVisible,
        setPendingDraft,
        setDraftLastSaved,
        form,
        setFileList,
        bannerFileListRef,
        applyDraftToForm,
        pendingDraft,
        successModalVisible,
        setSuccessModalVisible,
        setLastCreatedJob,
        setEditingPost,
        setIsModalVisible,
        lastCreatedJob,
    } = useJobPostContext();

    return (
        <>
            <Modal
                title="Discard Changes?"
                open={discardConfirmVisible}
                onCancel={() => setDiscardConfirmVisible(false)}
                onOk={confirmDiscardChanges}
                okText="Discard Changes"
                cancelText="Continue Editing"
                okButtonProps={{ danger: true }}
                centered
            >
                <p>
                    You have unsaved job post information. Are you sure you want
                    to discard your progress?
                </p>
            </Modal>

            <Modal
                title="Unsaved Draft Found"
                open={draftRestoreModalVisible}
                onCancel={() => {
                    setDraftRestoreModalVisible(false);
                    setPendingDraft(null);
                }}
                footer={[
                    <Button
                        key="start-new"
                        onClick={() => {
                            clearJobPostDraft();
                            setDraftLastSaved(null);
                            setPendingDraft(null);
                            setDraftRestoreModalVisible(false);
                            form.resetFields();
                            setFileList([]);
                            bannerFileListRef.current = [];
                        }}
                    >
                        Start New
                    </Button>,
                    <Button
                        key="continue"
                        type="primary"
                        onClick={() => {
                            applyDraftToForm(pendingDraft);
                            setDraftRestoreModalVisible(false);
                            setPendingDraft(null);
                        }}
                    >
                        Continue Draft
                    </Button>,
                ]}
                centered
            >
                <p>
                    We found a saved job post draft. Would you like to continue
                    where you left off?
                </p>
                {pendingDraft?._savedAt && (
                    <Text type="secondary">
                        Last saved:{" "}
                        {moment(pendingDraft._savedAt).format(
                            "MMM D, YYYY h:mm:ss A",
                        )}
                    </Text>
                )}
            </Modal>

            <Modal
                title={
                    <Space>
                        <CheckCircleOutlined
                            style={{ color: COLORS.antdGreen }}
                        />
                        <span>Job Post Created Successfully</span>
                    </Space>
                }
                open={successModalVisible}
                onCancel={() => setSuccessModalVisible(false)}
                footer={[
                    <Button
                        key="another"
                        onClick={() => {
                            setSuccessModalVisible(false);
                            setLastCreatedJob(null);
                            setEditingPost(null);
                            form.resetFields();
                            setFileList([]);
                            bannerFileListRef.current = [];
                            setIsModalVisible(true);
                        }}
                    >
                        Create Another
                    </Button>,
                ]}
                centered
            >
                {lastCreatedJob && (
                    <div>
                        <p>
                            <strong>Job Title:</strong> {lastCreatedJob.title}
                        </p>
                        <p>
                            <strong>Company:</strong> {lastCreatedJob.company}
                        </p>
                        <p>
                            <strong>Created:</strong>{" "}
                            {moment(
                                lastCreatedJob.created_at || new Date(),
                            ).format("MMM D, YYYY h:mm A")}
                        </p>
                    </div>
                )}
            </Modal>
        </>
    );
}
