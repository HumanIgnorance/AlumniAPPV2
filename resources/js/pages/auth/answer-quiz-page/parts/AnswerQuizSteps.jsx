import { Card, Steps, Badge, Avatar } from "antd";
import { CheckCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import { Step } from "~/pages/auth/answer-quiz-page/parts/answerQuizShared";
import { useAnswerQuizContext } from "~/pages/auth/answer-quiz-page/AnswerQuizContext";

export default function AnswerQuizSteps() {
    const {
        currentPage,
        getProgress,
        totalPages,
        answers,
        questionsWithInterpretation,
    } = useAnswerQuizContext();

    return (
        <section className="quiz-section">
            <Card className="quiz-card quiz-steps-card" bordered={false}>
                <Steps
                    current={currentPage - 1}
                    percent={
                        (getProgress() / 100) * (currentPage / totalPages) * 100
                    }
                    size="small"
                    responsive
                >
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                        <Step
                            key={i}
                            title={`Q${i + 1}`}
                            description={i + 1 === currentPage ? "Current" : ""}
                            icon={
                                <Badge
                                    count={
                                        answers[
                                            questionsWithInterpretation[i]?.id
                                        ] ? (
                                            <CheckCircleOutlined
                                                style={{
                                                    color: COLORS.antdGreen,
                                                    fontSize: "12px",
                                                }}
                                            />
                                        ) : null
                                    }
                                >
                                    <Avatar
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                i + 1 === currentPage
                                                    ? COLORS.sky500
                                                    : answers[
                                                            questionsWithInterpretation[
                                                                i
                                                            ]?.id
                                                        ]
                                                      ? COLORS.antdGreen
                                                      : undefined,
                                            color:
                                                i + 1 === currentPage ||
                                                answers[
                                                    questionsWithInterpretation[
                                                        i
                                                    ]?.id
                                                ]
                                                    ? COLORS.white
                                                    : undefined,
                                        }}
                                    >
                                        {i + 1}
                                    </Avatar>
                                </Badge>
                            }
                        />
                    ))}
                    {totalPages > 5 && (
                        <Step
                            title={`+${totalPages - 5} more`}
                            description=""
                            icon={<EllipsisOutlined />}
                        />
                    )}
                </Steps>
            </Card>
        </section>
    );
}
