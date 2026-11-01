import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { useEventsContext } from "~/pages/admin/events/EventsContext";

export default function EventDraftPromptModal() {
    const { isDraftPromptVisible, handleStartNewDraft, handleContinueDraft } =
        useEventsContext();

    return (
        <Modal
            title={
                <Space>
                    <InfoCircleOutlined
                        style={{ color: "#3b82f6", fontSize: "22px" }}
                    />
                    <span>Unsaved Draft Found</span>
                </Space>
            }
            open={isDraftPromptVisible}
            onCancel={handleStartNewDraft}
            footer={[
                <Button key="new" onClick={handleStartNewDraft}>
                    Start New
                </Button>,
                <Button
                    key="continue"
                    type="primary"
                    onClick={handleContinueDraft}
                >
                    Continue Draft
                </Button>,
            ]}
            centered
        >
            <p style={{ margin: 0 }}>
                We found a saved event draft. Would you like to continue where
                you left off?
            </p>
        </Modal>
    );
}
