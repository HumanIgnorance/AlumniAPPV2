import {
    Card,
    Badge,
    Tag,
    Alert,
    Divider,
    Space,
    Button,
    Progress,
} from "antd";
import {
    ExclamationCircleOutlined,
    QuestionCircleOutlined,
    TrophyOutlined,
    ArrowLeftOutlined,
    RocketOutlined,
    ArrowRightOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import QuizQuestionMeta from "~/pages/auth/quiz-shared/QuizQuestionMeta";
import {
    Text,
    Title,
} from "~/pages/auth/answer-quiz-page/parts/answerQuizShared";
import { useAnswerQuizContext } from "~/pages/auth/answer-quiz-page/AnswerQuizContext";

export default function AnswerQuizQuestionCard() {
    const {
        questionNumber,
        questionsWithInterpretation,
        currentQuestion,
        CustomRate,
        answers,
        handleRateChange,
        handlePrevious,
        currentPage,
        timeExpired,
        totalPages,
        handleSubmit,
        allRequiredAnswered,
        isSubmitting,
        handleNext,
        completionStatus,
        formatTime,
        timeSpent,
        getProgress,
    } = useAnswerQuizContext();

    return (
        <section className="quiz-section">
            <Card className="quiz-question-card" bordered={false}>
                <QuizQuestionMeta
                    position={questionNumber}
                    total={questionsWithInterpretation.length}
                    category={currentQuestion?.category}
                    required={currentQuestion?.required}
                    answered={Boolean(answers[currentQuestion?.id])}
                />
                <Title level={3} className="quiz-question-text">
                    <QuestionCircleOutlined />
                    {currentQuestion?.question}
                </Title>

                {currentQuestion?.description && (
                    <Alert
                        message={currentQuestion.description}
                        type="info"
                        showIcon
                        closable
                        className="quiz-interpretation"
                    />
                )}

                <Divider className="quiz-divider" />

                <div className="quiz-rating-section">
                    <Title level={4} className="quiz-rating-title">
                        Please rate your experience
                    </Title>

                    <CustomRate
                        value={answers[currentQuestion?.id]}
                        onChange={handleRateChange}
                        questionId={currentQuestion?.id}
                    />

                    {answers[currentQuestion?.id] && (
                        <Alert
                            className="quiz-interpretation"
                            message={
                                <Space>
                                    <TrophyOutlined />
                                    <span>
                                        {
                                            currentQuestion?.interpretation[
                                                answers[currentQuestion.id]
                                            ]
                                        }
                                    </span>
                                </Space>
                            }
                            type="success"
                            showIcon
                        />
                    )}
                </div>

                <Divider className="quiz-divider" />

                {/* Navigation */}
                <div className="quiz-navigation">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handlePrevious}
                        disabled={currentPage === 1 || timeExpired}
                        size="large"
                        className="btn-ghost"
                    >
                        Previous
                    </Button>

                    <Space>
                        <Text type="secondary">
                            {currentPage} / {totalPages}
                        </Text>
                    </Space>

                    {currentPage === totalPages ? (
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSubmit}
                            disabled={!allRequiredAnswered() || timeExpired}
                            loading={isSubmitting}
                            icon={<RocketOutlined />}
                            className="btn-primary-grad"
                        >
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit Assessment"}
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            icon={<ArrowRightOutlined />}
                            onClick={handleNext}
                            size="large"
                            disabled={timeExpired}
                            className="btn-primary-grad"
                        >
                            Next
                        </Button>
                    )}
                </div>

                {!allRequiredAnswered() && currentPage === totalPages && (
                    <Alert
                        className="quiz-interpretation"
                        message={`${
                            completionStatus.requiredTotal -
                            completionStatus.requiredAnswered
                        } required question(s) remaining`}
                        type="warning"
                        showIcon
                    />
                )}

                {/* Footer Summary */}
                <div className="quiz-footer">
                    <span className="quiz-footer__item">
                        <CheckCircleOutlined
                            style={{ color: COLORS.antdGreen }}
                        />
                        <strong>{completionStatus.answered}</strong>
                        <span className="quiz-footer__muted">
                            questions answered
                        </span>
                    </span>
                    <span
                        className="quiz-footer__item"
                        style={{ justifyContent: "center" }}
                    >
                        <ClockCircleOutlined
                            style={{ color: COLORS.antdGold }}
                        />
                        <strong>{formatTime(timeSpent)}</strong>
                        <span className="quiz-footer__muted">time spent</span>
                    </span>
                    <span
                        className="quiz-footer__item"
                        style={{ justifyContent: "flex-end" }}
                    >
                        <Progress
                            type="circle"
                            percent={getProgress()}
                            size={60}
                            strokeColor={{
                                "0%": COLORS.sky500,
                                "100%": COLORS.violet600,
                            }}
                        />
                    </span>
                </div>
            </Card>
        </section>
    );
}
