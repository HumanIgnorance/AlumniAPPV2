import { Card, Space, Button, Divider } from "antd";
import { COLORS } from "~/config/theme";
import {
    ThunderboltOutlined,
    CheckCircleOutlined,
    BulbOutlined,
} from "@ant-design/icons";
import {
    Title,
    Text,
} from "~/pages/auth/image-quiz-page/parts/imageQuizShared";
import { useImageQuizContext } from "~/pages/auth/image-quiz-page/ImageQuizContext";

export default function ImageQuizSubmitSection() {
    const {
        currentQuestionIndex,
        currentQuiz,
        allRequiredAnswered,
        completionStatus,
        handleSubmit,
        timeExpired,
        isSubmitting,
    } = useImageQuizContext();

    return (
        (currentQuestionIndex === currentQuiz.questions.length - 1 && (
            <section className="quiz-section">
                <Card className="quiz-submit-card">
                    <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%" }}
                    >
                        <div>
                            <Title
                                level={3}
                                style={{
                                    color: allRequiredAnswered()
                                        ? COLORS.violet600
                                        : COLORS.antdOrange,
                                    margin: 0,
                                }}
                            >
                                {allRequiredAnswered()
                                    ? "🎉 Ready to Discover!"
                                    : "📋 Complete Required Selections"}
                            </Title>
                            <Text type="secondary">
                                {allRequiredAnswered()
                                    ? "All required visual selections have been made. Submit to discover your personality profile."
                                    : `${
                                          completionStatus.requiredTotal -
                                          completionStatus.requiredAnswered
                                      } required selection(s) remaining.`}
                            </Text>
                        </div>

                        <Button
                            size="large"
                            icon={<ThunderboltOutlined />}
                            onClick={handleSubmit}
                            disabled={!allRequiredAnswered() || timeExpired}
                            loading={isSubmitting}
                            className="btn-primary-grad"
                            style={{ minWidth: 240 }}
                        >
                            {isSubmitting
                                ? "Analyzing..."
                                : "Discover My Personality"}
                        </Button>

                        <Space
                            wrap
                            split={<Divider type="vertical" />}
                            style={{ justifyContent: "center", width: "100%" }}
                        >
                            <Space>
                                <CheckCircleOutlined
                                    style={{
                                        color:
                                            completionStatus.requiredAnswered ===
                                            completionStatus.requiredTotal
                                                ? COLORS.antdGreen
                                                : COLORS.antdGray5,
                                    }}
                                />
                                <Text>
                                    Required:{" "}
                                    {completionStatus.requiredAnswered}/
                                    {completionStatus.requiredTotal}
                                </Text>
                            </Space>
                            <Space>
                                <CheckCircleOutlined
                                    style={{
                                        color:
                                            completionStatus.answered ===
                                            completionStatus.total
                                                ? COLORS.antdGreen
                                                : COLORS.antdGray5,
                                    }}
                                />
                                <Text>
                                    Total: {completionStatus.answered}/
                                    {completionStatus.total}
                                </Text>
                            </Space>
                            <Space>
                                <BulbOutlined
                                    style={{ color: COLORS.sky500 }}
                                />
                                <Text>
                                    Question: {currentQuestionIndex + 1}/
                                    {currentQuiz.questions.length}
                                </Text>
                            </Space>
                        </Space>
                    </Space>
                </Card>
            </section>
        )) ??
        null
    );
}
