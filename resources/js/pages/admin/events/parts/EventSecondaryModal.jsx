import React from "react";
import { WarningOutlined } from "@ant-design/icons";
import { Alert, Button, Modal, Space, Typography } from "antd";
import { useEventsContext } from "~/pages/admin/events/EventsContext";

const { Text } = Typography;

export default function EventSecondaryModal() {
    const {
        isValidationModalVisible,
        setIsValidationModalVisible,
        validationErrors,
    } = useEventsContext();

    return (
        <Modal
            title={
                <Space>
                    <WarningOutlined
                        style={{
                            color: "var(--warning, #f59e0b)",
                            fontSize: "22px",
                        }}
                    />
                    <span>Required Fields Missing</span>
                </Space>
            }
            open={isValidationModalVisible}
            onCancel={() => setIsValidationModalVisible(false)}
            footer={[
                <Button
                    key="ok"
                    type="primary"
                    onClick={() => setIsValidationModalVisible(false)}
                >
                    OK, I'll Fill Them
                </Button>,
            ]}
            centered
        >
            <div style={{ padding: "16px 0" }}>
                <Alert
                    message="Please complete all required fields before submitting."
                    description={
                        <div style={{ marginTop: "12px" }}>
                            <Text strong>
                                The following fields need to be filled:
                            </Text>
                            <ul
                                style={{
                                    marginTop: "8px",
                                    paddingLeft: "20px",
                                }}
                            >
                                {validationErrors.map((error, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            color: "var(--danger, #ef4444)",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                    type="warning"
                    showIcon
                />
            </div>
        </Modal>
    );
}
