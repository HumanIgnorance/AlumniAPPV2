import React from "react";
import { FileOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Typography } from "antd";
import moment from "moment";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";
import { clearApplicationDraft } from "~/pages/admin/JobPost/parts/jobPostStorage";

const { Text } = Typography;

export default function ApplicationPromptModals() {
    const {
        applicationDiscardConfirmVisible,
        setApplicationDiscardConfirmVisible,
        confirmDiscardApplicationChanges,
        applicationDraftLastSaved,
        applicationDraftRestoreVisible,
        setApplicationDraftRestoreVisible,
        applicationDraftCtxRef,
        setPendingApplicationDraft,
        appForm,
        setApplicationFormDirty,
        setApplicationDraftLastSaved,
        restoreApplicationDraft,
        pendingApplicationDraft,
    } = useJobPostContext();

    return (
        <>
            <Modal
                title={
                    <Space>
                        <WarningOutlined style={{ color: COLORS.antdGold }} />
                        <span>Unsaved Application</span>
                    </Space>
                }
                open={applicationDiscardConfirmVisible}
                onCancel={() => setApplicationDiscardConfirmVisible(false)}
                centered
                maskClosable={false}
                keyboard={false}
                className="application-discard-modal"
                footer={[
                    <Button
                        key="continue"
                        type="primary"
                        onClick={() =>
                            setApplicationDiscardConfirmVisible(false)
                        }
                    >
                        Continue Editing
                    </Button>,
                    <Button
                        key="discard"
                        danger
                        onClick={confirmDiscardApplicationChanges}
                    >
                        Discard Changes
                    </Button>,
                ]}
            >
                <p>
                    You have unsaved application information. What would you
                    like to do?
                </p>
                {applicationDraftLastSaved && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Auto-saved:{" "}
                        {moment(applicationDraftLastSaved).format(
                            "MMM D, YYYY h:mm:ss A",
                        )}
                    </Text>
                )}
            </Modal>

            <Modal
                title={
                    <Space>
                        <FileOutlined style={{ color: COLORS.antdBlue }} />
                        <span>Application Draft Found</span>
                    </Space>
                }
                open={applicationDraftRestoreVisible}
                onCancel={() => {
                    // Cancelling this modal just dismisses it; the draft stays in storage
                    // until the user explicitly chooses Restore or Start Fresh.
                    setApplicationDraftRestoreVisible(false);
                }}
                centered
                maskClosable={false}
                keyboard={false}
                className="application-draft-restore-modal"
                footer={[
                    <Button
                        key="fresh"
                        onClick={() => {
                            const { jobId, userId } =
                                applicationDraftCtxRef.current || {};
                            clearApplicationDraft(jobId, userId);
                            setPendingApplicationDraft(null);
                            setApplicationDraftRestoreVisible(false);
                            try {
                                appForm.resetFields();
                            } catch {}
                            setApplicationFormDirty(false);
                            setApplicationDraftLastSaved(null);
                        }}
                    >
                        Start Fresh
                    </Button>,
                    <Button
                        key="restore"
                        type="primary"
                        onClick={() => {
                            restoreApplicationDraft(pendingApplicationDraft);
                            setApplicationDraftRestoreVisible(false);
                            setPendingApplicationDraft(null);
                        }}
                    >
                        Restore Draft
                    </Button>,
                ]}
            >
                <p>
                    We found a previously saved application draft. Would you
                    like to restore it?
                </p>
                {pendingApplicationDraft?._savedAt && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Last saved:{" "}
                        {moment(pendingApplicationDraft._savedAt).format(
                            "MMM D, YYYY h:mm:ss A",
                        )}
                    </Text>
                )}
            </Modal>
        </>
    );
}
