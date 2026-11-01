import React from "react";
import { CommentOutlined } from "@ant-design/icons";
import { Button, Empty, Modal, Space, Spin, Tag, Typography } from "antd";
import { useLayoutContext } from "~/components/layout/LayoutContext";
import {
    FEEDBACK_AREA_LABELS,
    FEEDBACK_STATUS_META,
    FEEDBACK_TYPE_META,
} from "~/components/layout/utils/feedbackOptions";
import { COLORS } from "~/config/theme";

const { Text } = Typography;

export default function FeedbackDetailModal() {
    const {
        currentTheme,
        selectedFeedbackReport,
        feedbackDetailModalVisible,
        setFeedbackDetailModalVisible,
        setSelectedFeedbackReport,
        feedbackDetailLoading,
    } = useLayoutContext();

    const isDark = currentTheme === "black";
    const report = selectedFeedbackReport;
    const typeMeta = report?.type ? FEEDBACK_TYPE_META[report.type] : null;
    const statusMeta = report?.status
        ? FEEDBACK_STATUS_META[report.status] || {
              label: report.status,
              color: "default",
          }
        : null;
    const areaLabel = report
        ? report.area_label || FEEDBACK_AREA_LABELS[report.area] || report.area
        : null;

    return (
        <Modal
            title={
                <Space>
                    <CommentOutlined style={{ color: COLORS.red500 }} />
                    <span>Your Feedback</span>
                </Space>
            }
            open={feedbackDetailModalVisible}
            onCancel={() => {
                setFeedbackDetailModalVisible(false);
                setSelectedFeedbackReport(null);
            }}
            footer={[
                <Button
                    key="close"
                    onClick={() => {
                        setFeedbackDetailModalVisible(false);
                        setSelectedFeedbackReport(null);
                    }}
                >
                    Close
                </Button>,
            ]}
            width={480}
            centered
        >
            <Spin spinning={feedbackDetailLoading}>
                {report ? (
                    <div>
                        <Space wrap style={{ marginBottom: 16 }}>
                            {typeMeta && (
                                <Tag
                                    color={typeMeta.color}
                                    icon={typeMeta.icon}
                                >
                                    {typeMeta.label}
                                </Tag>
                            )}
                            {areaLabel && <Tag>{areaLabel}</Tag>}
                            {statusMeta && (
                                <Tag
                                    color={statusMeta.color}
                                    icon={statusMeta.icon}
                                >
                                    {statusMeta.label}
                                </Tag>
                            )}
                        </Space>

                        {report.details && (
                            <div style={{ marginBottom: 16 }}>
                                <Text
                                    className="theme-text-secondary"
                                    style={{
                                        display: "block",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        marginBottom: 6,
                                    }}
                                >
                                    What you reported
                                </Text>
                                <div
                                    className="theme-card-bg"
                                    style={{
                                        padding: "12px 14px",
                                        borderRadius: 10,
                                        whiteSpace: "pre-wrap",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {report.details}
                                </div>
                            </div>
                        )}

                        <div>
                            <Text
                                className="theme-text-secondary"
                                style={{
                                    display: "block",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                    marginBottom: 6,
                                }}
                            >
                                Note from admin
                            </Text>
                            {report.admin_notes ? (
                                <div
                                    style={{
                                        padding: "12px 14px",
                                        borderRadius: 10,
                                        whiteSpace: "pre-wrap",
                                        lineHeight: 1.6,
                                        background: isDark
                                            ? COLORS.c1a1a2e
                                            : COLORS.f0f7ff,
                                        border: isDark
                                            ? "1px solid #333"
                                            : "1px solid #d6e8ff",
                                    }}
                                >
                                    {report.admin_notes}
                                </div>
                            ) : (
                                <Text className="theme-text-secondary">
                                    The admin didn't leave a note with this
                                    update.
                                </Text>
                            )}
                        </div>

                        {report.resolved_by?.name && (
                            <div style={{ marginTop: 16 }}>
                                <Text
                                    className="theme-text-secondary"
                                    style={{ fontSize: 12 }}
                                >
                                    Reviewed by{" "}
                                    <Text strong>
                                        {report.resolved_by.name}
                                    </Text>
                                    {report.resolved_at &&
                                        ` on ${new Date(
                                            report.resolved_at,
                                        ).toLocaleString()}`}
                                </Text>
                            </div>
                        )}
                    </div>
                ) : (
                    !feedbackDetailLoading && (
                        <Empty description="This feedback report is no longer available" />
                    )
                )}
            </Spin>
        </Modal>
    );
}
