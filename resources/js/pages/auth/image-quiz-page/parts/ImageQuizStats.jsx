import { Card, Progress } from "antd";
import {
    ThunderboltOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    BulbOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import { Text } from "~/pages/auth/image-quiz-page/parts/imageQuizShared";
import { useImageQuizContext } from "~/pages/auth/image-quiz-page/ImageQuizContext";

export default function ImageQuizStats() {
    const {
        getProgress,
        completionStatus,
        formatTime,
        timeSpent,
        currentQuestionIndex,
        currentQuiz,
    } = useImageQuizContext();

    return (
        <section className="quiz-section">
            <Card className="quiz-card" bordered={false}>
                <div className="quiz-stats">
                    <div className="quiz-stat">
                        <span className="quiz-stat__icon">
                            <ThunderboltOutlined />
                        </span>
                        <div style={{ flex: 1 }}>
                            <Text className="quiz-stat__label">Progress</Text>
                            <Text className="quiz-stat__value">
                                {getProgress()}%
                            </Text>
                            <Progress
                                percent={getProgress()}
                                size="small"
                                showInfo={false}
                                strokeColor={{
                                    "0%": COLORS.sky500,
                                    "100%": COLORS.violet600,
                                }}
                            />
                        </div>
                    </div>
                    <div className="quiz-stat">
                        <span className="quiz-stat__icon">
                            <CheckCircleOutlined />
                        </span>
                        <div>
                            <Text className="quiz-stat__label">Required</Text>
                            <Text className="quiz-stat__value">
                                {completionStatus.requiredAnswered}
                                <span className="quiz-footer__muted">
                                    {" "}
                                    / {completionStatus.requiredTotal}
                                </span>
                            </Text>
                            <Text className="quiz-stat__sub">
                                questions completed
                            </Text>
                        </div>
                    </div>
                    <div className="quiz-stat">
                        <span className="quiz-stat__icon">
                            <ClockCircleOutlined />
                        </span>
                        <div>
                            <Text className="quiz-stat__label">Time Spent</Text>
                            <Text className="quiz-stat__value">
                                {formatTime(timeSpent)}
                            </Text>
                            <Text className="quiz-stat__sub">
                                since you started
                            </Text>
                        </div>
                    </div>
                    <div className="quiz-stat">
                        <span className="quiz-stat__icon">
                            <BulbOutlined />
                        </span>
                        <div>
                            <Text className="quiz-stat__label">
                                Current Question
                            </Text>
                            <Text className="quiz-stat__value">
                                {currentQuestionIndex + 1}
                                <span className="quiz-footer__muted">
                                    {" "}
                                    / {currentQuiz.questions.length}
                                </span>
                            </Text>
                            <Text className="quiz-stat__sub">
                                visual preference
                            </Text>
                        </div>
                    </div>
                </div>
            </Card>
        </section>
    );
}
