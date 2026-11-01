import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { Button } from "~/components/index";
import { useLoginContext } from "~/components/login/LoginContext";
import { COLORS } from "~/config/theme";

export default function ZoomWarningModal() {
    const { zoomModalOpen, setZoomModalOpen } = useLoginContext();

    return (
        <Modal
            className="zoom-warning-modal"
            open={zoomModalOpen}
            title={
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        color: COLORS.amber500,
                        fontWeight: 700,
                    }}
                >
                    <ExclamationCircleOutlined
                        style={{ color: COLORS.amber500 }}
                    />
                    Browser Zoom Detected
                </span>
            }
            centered
            closable={false}
            maskClosable={false}
            keyboard={false}
            footer={[
                <Button
                    key="ok"
                    type="primary"
                    onClick={() => setZoomModalOpen(false)}
                    label="OK"
                />,
            ]}
        >
            <p>
                You are trying to <strong>zoom in</strong> or{" "}
                <strong>zoom out</strong>.
            </p>

            <p>
                This system is designed to work best at{" "}
                <strong>100% browser zoom</strong>.
            </p>

            <p>
                Please press <strong>Ctrl + 0</strong> to reset your browser
                zoom to <strong>100%</strong>.
            </p>
        </Modal>
    );
}
