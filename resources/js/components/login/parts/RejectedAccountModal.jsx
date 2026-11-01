import React from "react";
import { CloseCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { useLoginContext } from "~/components/login/LoginContext";
import { COLORS } from "~/config/theme";

export default function RejectedAccountModal() {
    const { rejectedModalOpen, setRejectedModalOpen, rejectedNotes } =
        useLoginContext();

    return (
        <Modal
            className="rejected-account-modal"
            open={rejectedModalOpen}
            onCancel={() => setRejectedModalOpen(false)}
            onOk={() => setRejectedModalOpen(false)}
            okText="I Understand"
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
                    <CloseCircleFilled style={{ color: COLORS.red500 }} />
                    Account Rejected
                </span>
            }
            centered
        >
            <p style={{ margin: 0, lineHeight: 1.6 }}>
                We’re sorry, your alumni account registration has been
                <strong> rejected</strong> by the administrator.
            </p>

            {rejectedNotes && (
                <div
                    style={{
                        marginTop: 14,
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.25)",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontWeight: 600,
                            color: COLORS.red500,
                            marginBottom: 6,
                        }}
                    >
                        Administrator notes:
                    </p>
                    <p
                        style={{
                            margin: 0,
                            lineHeight: 1.6,
                            color: COLORS.gray800,
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {rejectedNotes}
                    </p>
                </div>
            )}

            <p style={{ marginTop: 14, marginBottom: 0, lineHeight: 1.6 }}>
                For further clarification or questions regarding this decision,
                please contact the <strong>Administrator Office</strong>
            </p>
        </Modal>
    );
}
