import React from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import { logout } from "~/components/layout/utils/sessionActions";
import { COLORS } from "~/config/theme";

export default function QuizRequiredModal() {
    const { modalVisible, setModalVisible, alumniQuizzes } = useLayoutContext();

    return (
        <Modal
            title="Select Quiz Type"
            open={modalVisible}
            onCancel={() => setModalVisible(true)}
            footer={null}
            closable={false}
            maskClosable={false}
        >
            <div style={{ textAlign: "center" }}>
                <div
                    className="theme-warning-box"
                    style={{
                        border: "1px solid #ffbb96",
                        borderRadius: 6,
                        padding: 16,
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <span
                            style={{
                                color: COLORS.fa541c,
                                fontSize: 18,
                                marginRight: 8,
                            }}
                        >
                            ⚠
                        </span>
                        <span
                            style={{
                                color: COLORS.fa541c,
                                fontWeight: "bold",
                                fontSize: 14,
                            }}
                        >
                            Required: Complete a quiz to continue using Device
                        </span>
                    </div>
                </div>

                {Array.isArray(alumniQuizzes) &&
                    !alumniQuizzes.find((item) => item.type === "rating") && (
                        <Button
                            type="dashed"
                            size="large"
                            style={{ width: "100%", marginBottom: 16 }}
                            onClick={() =>
                                (window.location.href = "answer-question")
                            }
                        >
                            Program Experience Rating ✅
                        </Button>
                    )}

                {Array.isArray(alumniQuizzes) &&
                    !alumniQuizzes.find((item) => item.type === "abcd") && (
                        <Button
                            type="dashed"
                            size="large"
                            style={{ width: "100%", marginBottom: 16 }}
                            onClick={() =>
                                (window.location.href = "image-quiz")
                            }
                        >
                            Behavioral Assessment Questions ✅
                        </Button>
                    )}

                <Button
                    style={{
                        width: "100%",
                        marginTop: 10,
                        backgroundColor: COLORS.white,
                        borderColor: COLORS.antdRed,
                        color: COLORS.antdRed,
                    }}
                    icon={<LogoutOutlined />}
                    onClick={logout}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                            COLORS.antdOrange;
                        e.currentTarget.style.color = COLORS.white;
                        e.currentTarget.style.borderColor = COLORS.antdOrange;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.white;
                        e.currentTarget.style.color = COLORS.antdRed;
                        e.currentTarget.style.borderColor = COLORS.antdRed;
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.antdRed;
                        e.currentTarget.style.color = COLORS.white;
                        e.currentTarget.style.borderColor = COLORS.antdRed;
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.backgroundColor =
                            COLORS.antdOrange;
                        e.currentTarget.style.color = COLORS.white;
                        e.currentTarget.style.borderColor = COLORS.antdOrange;
                    }}
                >
                    Logout
                </Button>
            </div>
        </Modal>
    );
}
