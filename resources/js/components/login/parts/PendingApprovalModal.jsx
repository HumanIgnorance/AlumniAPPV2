import React from "react";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useLoginContext } from "~/components/login/LoginContext";
import { COLORS } from "~/config/theme";

export default function PendingApprovalModal() {
    const { pendingModalOpen, setPendingModalOpen } = useLoginContext();

    return (
        <Modal
            className="pending-approval-modal"
            open={pendingModalOpen}
            onCancel={() => setPendingModalOpen(false)}
            onOk={() => setPendingModalOpen(false)}
            okText="Got it"
            cancelButtonProps={{ style: { display: "none" } }}
            title={
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        color: COLORS.red500,
                        fontWeight: 700,
                    }}
                >
                    <SafetyCertificateOutlined
                        style={{ color: COLORS.red500 }}
                    />
                    Account Pending Approval
                </span>
            }
            centered
        >
            <p style={{ margin: 0, lineHeight: 1.6 }}>
                Your alumni account is pending approval. Please wait for
                administrator approval. You will be notified via email once your
                account has been approved.
            </p>
        </Modal>
    );
}
