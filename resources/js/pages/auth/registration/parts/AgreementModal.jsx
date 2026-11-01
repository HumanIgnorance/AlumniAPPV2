import React from "react";
import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Alert, Button, Modal } from "antd";
import { COLORS } from "~/config/theme";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";

export default function AgreementModal() {
    const { isAgreementModalVisible, setIsAgreementModalVisible } =
        useRegistrationContext();

    return (
        <Modal
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <WarningOutlined
                        style={{ fontSize: "20px", color: COLORS.antdRed }}
                    />
                    <span>Agreement Required</span>
                </div>
            }
            open={isAgreementModalVisible}
            onCancel={() => setIsAgreementModalVisible(false)}
            footer={[
                <Button
                    key="ok"
                    type="primary"
                    onClick={() => setIsAgreementModalVisible(false)}
                >
                    OK, I understand
                </Button>,
            ]}
            centered
        >
            <div style={{ padding: "16px 0" }}>
                <Alert
                    message="Please agree to the terms"
                    description={
                        <div>
                            <p style={{ marginBottom: 8 }}>
                                You must check the agreement checkbox before
                                submitting your application:
                            </p>
                            <p
                                style={{
                                    fontStyle: "italic",
                                    color: "var(--text-muted)",
                                }}
                            >
                                "I confirm that all information provided is
                                accurate and truthful. I agree to the Privacy
                                Policy and Terms of Service."
                            </p>
                        </div>
                    }
                    type="error"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                />
            </div>
        </Modal>
    );
}
