import React from "react";
import {
    ArrowLeftOutlined,
    CloseOutlined,
    ExclamationOutlined,
    SafetyCertificateOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {
    Button,
    Input,
    Modal,
    Select,
    Typography,
    Upload,
    message,
} from "antd";
import logoMini from "~/assets/images/site-logo.png";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import { FEEDBACK_AREAS } from "~/components/layout/utils/feedbackOptions";
import { COLORS } from "~/config/theme";

const { Text } = Typography;

export default function FeedbackFlowModals() {
    const {
        currentTheme,
        isMobile,
        discardModalOpen,
        setDiscardModalOpen,
        closeAllFeedback,
        feedbackModalOpen,
        setFeedbackModalOpen,
        setFeedbackOption,
        setFeedbackStep2Open,
        feedbackStep2Open,
        setFeedbackStep3Open,
        feedbackStep3Open,
        feedbackOption,
        feedbackArea,
        setFeedbackArea,
        feedbackDetails,
        setFeedbackDetails,
        feedbackScreenshots,
        setFeedbackScreenshots,
        submitAtmsFeedback,
    } = useLayoutContext();

    return (() => {
        const isDark = currentTheme === "black";

        const fbBg = isDark ? COLORS.ink0a : COLORS.white;
        const fbText = isDark ? COLORS.white : COLORS.ink1a;
        const fbMuted = isDark ? COLORS.a0a0a0 : COLORS.gray666;
        const fbSubtle = isDark ? "#7a7a7a" : COLORS.c888888;
        const fbBorder = isDark ? "1px solid #2a2a2a" : "1px solid #eaeaea";
        const fbCardBg = isDark ? COLORS.ink14 : COLORS.zinc50;
        const fbCardHover = isDark ? "#1c1c1c" : COLORS.antdGray3;
        const fbIcon = isDark ? "#cfcfcf" : COLORS.c555555;
        const fbLink = isDark ? COLORS.blue400 : "#1677ff";

        const modalProps = {
            centered: true,
            width: isMobile ? "94vw" : 520,
            style: { top: isMobile ? 20 : undefined, padding: 0 },
            bodyStyle: {
                background: fbBg,
                color: fbText,
                padding: isMobile ? 16 : 20,
                borderRadius: 8,
            },
            className: `feedback-modal ${isDark ? "feedback-modal-dark" : "feedback-modal-light"}`,
        };

        return (
            <>
                {/* ===== Discard Confirmation Modal ===== */}
                <Modal
                    {...modalProps}
                    open={discardModalOpen}
                    title={
                        <span style={{ color: fbText, fontWeight: 700 }}>
                            Discard feedback?
                        </span>
                    }
                    onCancel={() => setDiscardModalOpen(false)}
                    footer={
                        <div
                            style={{
                                display: "flex",
                                flexDirection: isMobile ? "column" : "row",
                                justifyContent: "flex-end",
                                gap: 8,
                            }}
                        >
                            <Button
                                block={isMobile}
                                onClick={() => setDiscardModalOpen(false)}
                            >
                                Continue editing
                            </Button>
                            <Button
                                block={isMobile}
                                danger
                                type="primary"
                                onClick={() => {
                                    setDiscardModalOpen(false);
                                    closeAllFeedback();
                                }}
                            >
                                Discard
                            </Button>
                        </div>
                    }
                >
                    <p
                        className="ant-typography"
                        style={{ color: fbMuted, margin: 0 }}
                    >
                        If you discard now, you won't share any feedback with
                        us.
                    </p>
                </Modal>

                {/* ===== STEP 1: Choose option ===== */}
                <Modal
                    {...modalProps}
                    open={feedbackModalOpen}
                    footer={null}
                    closable
                    onCancel={() => setFeedbackModalOpen(false)}
                    title={
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                color: COLORS.red500,
                                fontWeight: 700,
                                fontSize: isMobile ? 15 : 16,
                            }}
                        >
                            <SafetyCertificateOutlined />
                            Give Feedback to ATMS
                        </span>
                    }
                >
                    {/* Option 1 */}
                    <button
                        type="button"
                        onClick={() => {
                            setFeedbackOption("improve");
                            setFeedbackStep2Open(true);
                        }}
                        style={{
                            width: "100%",
                            background: fbCardBg,
                            border: fbBorder,
                            color: fbText,
                            borderRadius: 10,
                            padding: isMobile ? 12 : 16,
                            marginBottom: 12,
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            cursor: "pointer",
                            transition: "background 0.2s",
                            textAlign: "left",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = fbCardHover)
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = fbCardBg)
                        }
                    >
                        <img
                            src={logoMini}
                            alt="ATMS"
                            style={{
                                width: isMobile ? 36 : 42,
                                height: isMobile ? 36 : 42,
                                objectFit: "contain",
                                flexShrink: 0,
                            }}
                        />
                        <div style={{ minWidth: 0 }}>
                            <div
                                style={{
                                    fontWeight: 600,
                                    fontSize: isMobile ? 14 : 15,
                                    color: fbText,
                                }}
                            >
                                Help us improve ATMS
                            </div>
                            <div
                                style={{
                                    fontSize: isMobile ? 12 : 13,
                                    color: fbSubtle,
                                }}
                            >
                                Give feedback about your ATMS experience
                            </div>
                        </div>
                    </button>

                    {/* Option 2 */}
                    <button
                        type="button"
                        onClick={() => {
                            setFeedbackOption("wrong");
                            setFeedbackStep2Open(true);
                        }}
                        style={{
                            width: "100%",
                            background: fbCardBg,
                            border: fbBorder,
                            color: fbText,
                            borderRadius: 10,
                            padding: isMobile ? 12 : 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            cursor: "pointer",
                            transition: "background 0.2s",
                            textAlign: "left",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = fbCardHover)
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = fbCardBg)
                        }
                    >
                        <ExclamationOutlined
                            style={{
                                fontSize: isMobile ? 20 : 22,
                                color: COLORS.antdGold,
                                flexShrink: 0,
                            }}
                        />
                        <div style={{ minWidth: 0 }}>
                            <div
                                style={{
                                    fontWeight: 600,
                                    fontSize: isMobile ? 14 : 15,
                                    color: fbText,
                                }}
                            >
                                Something went wrong
                            </div>
                            <div
                                style={{
                                    fontSize: isMobile ? 12 : 13,
                                    color: fbSubtle,
                                }}
                            >
                                Let us know about broken feature
                            </div>
                        </div>
                    </button>
                </Modal>

                {/* ===== STEP 2: Logs & Diagnostics ===== */}
                <Modal
                    {...modalProps}
                    open={feedbackStep2Open}
                    footer={null}
                    closable={false}
                    onCancel={() => setDiscardModalOpen(true)}
                    title={
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 8,
                            }}
                        >
                            <Button
                                type="text"
                                icon={
                                    <ArrowLeftOutlined
                                        style={{ color: fbIcon }}
                                    />
                                }
                                onClick={() => setFeedbackStep2Open(false)}
                            />
                            <span
                                style={{
                                    fontWeight: 700,
                                    color: fbText,
                                    fontSize: isMobile ? 14 : 16,
                                    flex: 1,
                                    textAlign: "center",
                                }}
                            >
                                Give Feedback to ATMS
                            </span>
                            <Button
                                type="text"
                                icon={
                                    <CloseOutlined style={{ color: fbIcon }} />
                                }
                                onClick={() => setDiscardModalOpen(true)}
                            />
                        </div>
                    }
                >
                    <p
                        className="ant-typography"
                        style={{
                            fontWeight: 600,
                            marginTop: 4,
                            color: fbText,
                            fontSize: isMobile ? 14 : 15,
                        }}
                    >
                        Include complete logs and diagnostics in your report?
                    </p>
                    <p
                        className="ant-typography"
                        style={{
                            fontSize: isMobile ? 12 : 13,
                            color: fbMuted,
                            lineHeight: 1.55,
                        }}
                    >
                        Information about your device, account and this app
                        related to the issue that you are reporting will be
                        automatically included in this report in order to help
                        us understand and resolve the issue.
                    </p>
                    <p
                        className="ant-typography"
                        style={{
                            fontSize: isMobile ? 12 : 13,
                            color: fbMuted,
                            lineHeight: 1.55,
                        }}
                    >
                        You can further help us fix this problem by sending
                        complete logs and diagnostics. This may include
                        information such as user activity logs, network logs,
                        crash logs and memory dumps associated with ATMS. We
                        will not use the information contained in this report
                        for other purposes.{" "}
                        <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            style={{ color: fbLink }}
                        >
                            Learn more
                        </a>
                    </p>

                    <div
                        style={{
                            marginTop: 20,
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            justifyContent: "flex-end",
                            gap: 8,
                        }}
                    >
                        <Button
                            block={isMobile}
                            type="primary"
                            onClick={() => {
                                setFeedbackStep2Open(false);
                                setFeedbackStep3Open(true);
                            }}
                        >
                            Report
                        </Button>
                    </div>
                </Modal>

                {/* ===== STEP 3: Report Form ===== */}
                <Modal
                    {...modalProps}
                    width={isMobile ? "94vw" : 560}
                    open={feedbackStep3Open}
                    footer={null}
                    closable={false}
                    onCancel={() => setDiscardModalOpen(true)}
                    title={
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 8,
                            }}
                        >
                            <Button
                                type="text"
                                icon={
                                    <ArrowLeftOutlined
                                        style={{ color: fbIcon }}
                                    />
                                }
                                onClick={() => {
                                    setFeedbackStep3Open(false);
                                    setFeedbackStep2Open(true);
                                }}
                            />
                            <span
                                style={{
                                    fontWeight: 700,
                                    color: fbText,
                                    fontSize: isMobile ? 14 : 16,
                                    flex: 1,
                                    textAlign: "center",
                                }}
                            >
                                {feedbackOption === "wrong"
                                    ? "Something went wrong"
                                    : "Help us improve ATMS"}
                            </span>
                            <Button
                                type="text"
                                icon={
                                    <CloseOutlined style={{ color: fbIcon }} />
                                }
                                onClick={() => setDiscardModalOpen(true)}
                            />
                        </div>
                    }
                >
                    <p
                        className="ant-typography"
                        style={{
                            fontWeight: 600,
                            marginBottom: 12,
                            color: fbText,
                            fontSize: isMobile ? 14 : 15,
                        }}
                    >
                        How can we improve?
                    </p>

                    <div style={{ marginBottom: 14 }}>
                        <Text
                            style={{
                                display: "block",
                                marginBottom: 6,
                                color: fbText,
                                fontSize: 13,
                            }}
                        >
                            Choose an area
                        </Text>
                        <Select
                            placeholder="Select a feature"
                            style={{ width: "100%" }}
                            value={feedbackArea}
                            onChange={(v) => setFeedbackArea(v)}
                            options={FEEDBACK_AREAS}
                        />
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        <Text
                            style={{
                                display: "block",
                                marginBottom: 6,
                                color: fbText,
                                fontSize: 13,
                            }}
                        >
                            Details
                        </Text>
                        <Input.TextArea
                            rows={isMobile ? 3 : 4}
                            placeholder="Describe what happened or what could be better..."
                            value={feedbackDetails}
                            onChange={(e) => setFeedbackDetails(e.target.value)}
                        />
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        <Text
                            style={{
                                display: "block",
                                marginBottom: 6,
                                color: fbText,
                                fontSize: 13,
                            }}
                        >
                            Screenshot{" "}
                            <span style={{ color: COLORS.red500 }}>
                                (required)
                            </span>
                        </Text>
                        <Upload
                            listType="picture"
                            accept=".jpg,.jpeg,.png,.webp"
                            beforeUpload={() => false}
                            fileList={feedbackScreenshots}
                            onChange={({ fileList }) =>
                                setFeedbackScreenshots(fileList.slice(0, 5))
                            }
                            onRemove={(file) =>
                                setFeedbackScreenshots((prev) =>
                                    prev.filter((f) => f.uid !== file.uid),
                                )
                            }
                            multiple
                            maxCount={5}
                        >
                            <Button
                                icon={
                                    <UploadOutlined style={{ color: fbIcon }} />
                                }
                                block={isMobile}
                            >
                                Add screenshot (required)
                            </Button>
                        </Upload>
                        <p
                            className="ant-typography"
                            style={{
                                fontSize: 11,
                                color: fbSubtle,
                                marginTop: 6,
                                marginBottom: 0,
                            }}
                        >
                            At least one screenshot of the issue is required
                            (JPG, PNG or WEBP, max 5MB each, up to 5 files).
                        </p>
                    </div>

                    <p
                        className="ant-typography"
                        style={{
                            fontSize: 12,
                            color: fbSubtle,
                            lineHeight: 1.55,
                        }}
                    >
                        Let us know if you have ideas that can help make our
                        products better. If you need help solving a specific
                        problem, please visit the Help Center.
                    </p>

                    <div
                        style={{
                            marginTop: 20,
                            display: "flex",
                            flexDirection: isMobile ? "column-reverse" : "row",
                            justifyContent: "flex-end",
                            gap: 8,
                        }}
                    >
                        <Button
                            block={isMobile}
                            onClick={() => setDiscardModalOpen(true)}
                        >
                            Cancel
                        </Button>
                        <Button
                            block={isMobile}
                            type="primary"
                            loading={submitAtmsFeedback.isLoading}
                            disabled={
                                !feedbackArea ||
                                !feedbackDetails.trim() ||
                                feedbackScreenshots.length === 0
                            }
                            onClick={async () => {
                                try {
                                    const formData = new FormData();
                                    formData.append(
                                        "type",
                                        feedbackOption === "wrong"
                                            ? "wrong"
                                            : "improve",
                                    );
                                    formData.append("area", feedbackArea);
                                    formData.append("details", feedbackDetails);
                                    formData.append(
                                        "page_url",
                                        window.location.href,
                                    );
                                    formData.append("theme", currentTheme);
                                    feedbackScreenshots.forEach((file) => {
                                        const raw = file.originFileObj || file;
                                        if (raw) {
                                            formData.append(
                                                "screenshots[]",
                                                raw,
                                            );
                                        }
                                    });

                                    await submitAtmsFeedback.mutateAsync(
                                        formData,
                                    );

                                    message.success(
                                        "Thanks! Your feedback has been submitted.",
                                    );
                                    closeAllFeedback();
                                } catch (err) {
                                    message.error(
                                        err?.response?.data?.message ||
                                            "Failed to submit feedback. Please try again.",
                                    );
                                }
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                </Modal>
            </>
        );
    })();
}
