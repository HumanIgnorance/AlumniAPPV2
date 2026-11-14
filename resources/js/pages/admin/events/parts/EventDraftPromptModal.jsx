import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Space } from "antd";
import Modal from "~/components/shared/AppModal";
import Button from "~/components/shared/AsyncButton";
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
