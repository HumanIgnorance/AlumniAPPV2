import React from "react";
import { WarningOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { useEventsContext } from "~/pages/admin/events/EventsContext";

export default function EventDiscardModal() {
    const {
        isDiscardConfirmVisible,
        handleContinueEditing,
        handleDiscardChanges,
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
                    <span>Discard Changes?</span>
                </Space>
            }
            open={isDiscardConfirmVisible}
            onCancel={handleContinueEditing}
            footer={[
                <Button key="continue" onClick={handleContinueEditing}>
                    Continue Editing
                </Button>,
                <Button
                    key="discard"
                    danger
                    type="primary"
                    onClick={handleDiscardChanges}
                >
                    Discard Changes
                </Button>,
            ]}
            centered
        >
            <p style={{ margin: 0 }}>
                You have unsaved event information. Are you sure you want to
                discard your progress?
            </p>
        </Modal>
    );
}
