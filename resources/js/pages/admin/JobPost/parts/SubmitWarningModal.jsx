import React from "react";
import { WarningOutlined } from "@ant-design/icons";
import { Alert, Modal, Space, Tag, Typography } from "antd";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";

const { Paragraph, Text } = Typography;

export default function SubmitWarningModal() {
    const {
        submitWarningModalVisible,
        pendingFormValues,
        setSubmitWarningLoading,
        performFormSubmit,
        setPendingFormValues,
        setSubmitWarningModalVisible,
        isMobile,
        submitWarningLoading,
    } = useJobPostContext();

    return (
        <Modal
            open={submitWarningModalVisible}
            title={
                <Space>
                    <WarningOutlined
                        style={{ color: COLORS.antdGold, fontSize: 24 }}
                    />
                    <span>Important Notice Before Submitting</span>
                </Space>
            }
            onOk={async () => {
                if (pendingFormValues) {
                    setSubmitWarningLoading(true);
                    try {
                        await performFormSubmit(pendingFormValues);
                        setPendingFormValues(null);
                        setSubmitWarningModalVisible(false);
                    } finally {
                        setSubmitWarningLoading(false);
                    }
                }
            }}
            onCancel={() => {
                setSubmitWarningModalVisible(false);
                setPendingFormValues(null);
            }}
            okText="I Understand, Submit"
            cancelText="Cancel"
            width={isMobile ? "95%" : 520}
            style={{
                top: isMobile ? 8 : undefined,
                maxWidth: isMobile ? "95vw" : undefined,
                paddingBottom: 0,
            }}
            confirmLoading={submitWarningLoading}
            okButtonProps={{ loading: submitWarningLoading }}
        >
            <Alert
                message="Edit Restrictions After Approval"
                description={
                    <div style={{ marginTop: 8 }}>
                        <Paragraph>
                            <Text strong>Please note the following:</Text>
                        </Paragraph>
                        <ul
                            style={{
                                paddingLeft: 20,
                                marginBottom: 16,
                            }}
                        >
                            <li style={{ marginBottom: 8 }}>
                                <Text>
                                    While your job post is{" "}
                                    <Tag color="orange">Pending</Tag> approval,
                                    you can freely edit all details or delete.
                                </Text>
                            </li>
                            <li style={{ marginBottom: 8 }}>
                                <Text>
                                    Once your job post is{" "}
                                    <Tag color="green">Approved</Tag> by the
                                    admin,{" "}
                                    <Text strong type="danger">
                                        you will no longer be able to delete or
                                        edit it.
                                    </Text>
                                </Text>
                            </li>
                            <li style={{ marginBottom: 8 }}>
                                <Text>
                                    After approval, only the admin can make
                                    changes to prevent any malicious
                                    modifications to verified content.
                                </Text>
                            </li>
                        </ul>
                        <Paragraph type="secondary" style={{ fontSize: 13 }}>
                            This policy ensures the integrity and
                            trustworthiness of all approved job postings for our
                            alumni community.
                        </Paragraph>
                    </div>
                }
                type="warning"
                showIcon
                style={{ marginBottom: 0 }}
            />
        </Modal>
    );
}
