import { Card, Progress } from "antd";
import {
    ThunderboltOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { Text } from "~/pages/auth/answer-quiz-page/parts/answerQuizShared";
import { useAnswerQuizContext } from "~/pages/auth/answer-quiz-page/AnswerQuizContext";

export default function AnswerQuizStats() {
    const {
        getProgress,
        formatTime,
        timeSpent,
        completionStatus,
        questionNumber,
        totalPages,
    } = useAnswerQuizContext();

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
                                className="quiz-progress"
                                percent={getProgress()}
                                size="small"
                                showInfo={false}
                            />
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
                            <CheckCircleOutlined />
                        </span>
                        <div>
                            <Text className="quiz-stat__label">Answered</Text>
                            <Text className="quiz-stat__value">
                                {completionStatus.answered}
                                <span className="quiz-footer__muted">
                                    {" "}
                                    / {completionStatus.total}
                                </span>
                            </Text>
                            <Text className="quiz-stat__sub">
                                {completionStatus.requiredAnswered}/
                                {completionStatus.requiredTotal} required
                            </Text>
                        </div>
                    </div>
                    <div className="quiz-stat">
                        <span className="quiz-stat__icon">
                            <TrophyOutlined />
                        </span>
                        <div>
                            <Text className="quiz-stat__label">
                                Current Question
                            </Text>
                            <Text className="quiz-stat__value">
                                {questionNumber}
                                <span className="quiz-footer__muted">
                                    {" "}
                                    / {totalPages}
                                </span>
                            </Text>
                            <Text className="quiz-stat__sub">
                                step through one at a time
                            </Text>
                        </div>
                    </div>
                </div>
            </Card>
        </section>
    );
}
