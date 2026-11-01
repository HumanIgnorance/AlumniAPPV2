import {
    Modal,
    Space,
    Badge,
    Button,
    Card,
    Tag,
    List,
    Rate,
    Row,
    Col,
    Image,
    Statistic,
} from "antd";
import { COLORS } from "~/config/theme";
import { Text } from "~/pages/admin/questions/alumni-questions-page/parts/alumniQuestionsShared";
import { useAlumniQuestionsContext } from "~/pages/admin/questions/alumni-questions-page/AlumniQuestionsContext";

export default function AlumniQuestionsQuizResultDetails() {
    const {
        viewingQuizResult,
        isQuizResultDetailsModalVisible,
        closeQuizResultDetailsModal,
    } = useAlumniQuestionsContext();

    return (
        <Modal
            title={
                <Space>
                    <Text strong>Quiz Result Details</Text>
                    {viewingQuizResult && (
                        <Badge
                            count={`${viewingQuizResult.questions?.length || 0} questions`}
                            style={{ backgroundColor: COLORS.antdBlue }}
                        />
                    )}
                </Space>
            }
            open={isQuizResultDetailsModalVisible}
            onCancel={closeQuizResultDetailsModal}
            width="min(900px, 94vw)"
            className="quiz-result-details-modal"
            footer={[
                <Button key="close" onClick={closeQuizResultDetailsModal}>
                    Close
                </Button>,
            ]}
        >
            {viewingQuizResult && (
                <div className="quiz-result-details-content">
                    <Card title="User Information" style={{ marginBottom: 16 }}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Text strong>
                                Name: {viewingQuizResult.user?.name || "N/A"}
                            </Text>
                            <Text type="secondary">
                                Submitted:{" "}
                                {new Date(
                                    viewingQuizResult.created_at,
                                ).toLocaleDateString()}
                            </Text>
                            <Tag
                                color={
                                    viewingQuizResult.type === "rate"
                                        ? "blue"
                                        : "green"
                                }
                            >
                                {viewingQuizResult.type === "rate"
                                    ? "Rating Quiz"
                                    : "Multiple Choice Quiz"}
                            </Tag>
                        </Space>
                    </Card>

                    <Card title="Questions & Answers">
                        <List
                            dataSource={viewingQuizResult.questions || []}
                            renderItem={(question, index) => (
                                <List.Item className="quiz-result-question-item">
                                    <div className="question-number">
                                        <Text strong>#{index + 1}</Text>
                                    </div>
                                    <div
                                        className="question-content"
                                        style={{ width: "100%" }}
                                    >
                                        <Space
                                            direction="vertical"
                                            style={{ width: "100%" }}
                                        >
                                            <div className="question-header">
                                                <Space>
                                                    <Tag
                                                        color={
                                                            question.type ===
                                                            "rate"
                                                                ? "blue"
                                                                : "green"
                                                        }
                                                    >
                                                        {question.type ===
                                                        "rate"
                                                            ? "Rating"
                                                            : "Multiple Choice"}
                                                    </Tag>
                                                    {question.required && (
                                                        <Tag color="red">
                                                            Required
                                                        </Tag>
                                                    )}
                                                </Space>
                                            </div>

                                            <Text strong>
                                                {question.question}
                                            </Text>

                                            {question.description && (
                                                <Text type="secondary">
                                                    {question.description}
                                                </Text>
                                            )}

                                            <div
                                                className="user-answer-section"
                                                style={{
                                                    marginTop: 12,
                                                    padding: 12,
                                                    borderRadius: 6,
                                                }}
                                            >
                                                <Text strong>
                                                    User's Answer:{" "}
                                                </Text>
                                                {question.type === "rate" ? (
                                                    <Space>
                                                        <Rate
                                                            value={
                                                                Number.parseInt(
                                                                    question
                                                                        .pivot
                                                                        ?.answer,
                                                                ) || 0
                                                            }
                                                            disabled
                                                            style={{
                                                                marginLeft: 8,
                                                            }}
                                                        />
                                                        <Text>
                                                            (
                                                            {question.pivot
                                                                ?.answer ||
                                                                "No answer"}
                                                            )
                                                        </Text>
                                                    </Space>
                                                ) : (
                                                    <Space>
                                                        <Text
                                                            strong
                                                            style={{
                                                                color: COLORS.antdBlue,
                                                            }}
                                                        >
                                                            {question.pivot
                                                                ?.answer ||
                                                                "No answer"}
                                                        </Text>
                                                        {question.choices_with_urls && (
                                                            <Text>
                                                                -{" "}
                                                                {question.choices_with_urls.find(
                                                                    (choice) =>
                                                                        choice.letter ===
                                                                        question
                                                                            .pivot
                                                                            ?.answer,
                                                                )
                                                                    ?.interpretation ||
                                                                    "Interpretation not available"}
                                                            </Text>
                                                        )}
                                                    </Space>
                                                )}
                                            </div>

                                            {question.type === "abcd" &&
                                                question.choices_with_urls && (
                                                    <div
                                                        className="choices-preview"
                                                        style={{
                                                            marginTop: 12,
                                                        }}
                                                    >
                                                        <Text strong>
                                                            Available Options:
                                                        </Text>
                                                        <Row
                                                            gutter={[16, 16]}
                                                            style={{
                                                                marginTop: 8,
                                                            }}
                                                        >
                                                            {question.choices_with_urls.map(
                                                                (
                                                                    choice,
                                                                    choiceIndex,
                                                                ) => (
                                                                    <Col
                                                                        xs={24}
                                                                        sm={12}
                                                                        key={
                                                                            choiceIndex
                                                                        }
                                                                    >
                                                                        <Card
                                                                            size="small"
                                                                            style={{
                                                                                border:
                                                                                    choice.letter ===
                                                                                    question
                                                                                        .pivot
                                                                                        ?.answer
                                                                                        ? "2px solid #1890ff"
                                                                                        : "1px solid #d9d9d9",
                                                                            }}
                                                                        >
                                                                            <Space align="start">
                                                                                <Badge
                                                                                    count={
                                                                                        choice.letter
                                                                                    }
                                                                                    style={{
                                                                                        backgroundColor:
                                                                                            choice.letter ===
                                                                                            question
                                                                                                .pivot
                                                                                                ?.answer
                                                                                                ? COLORS.antdBlue
                                                                                                : COLORS.antdGray5,
                                                                                    }}
                                                                                />
                                                                                <Space
                                                                                    direction="vertical"
                                                                                    size={
                                                                                        0
                                                                                    }
                                                                                >
                                                                                    {choice.image && (
                                                                                        <Image
                                                                                            width={
                                                                                                60
                                                                                            }
                                                                                            height={
                                                                                                60
                                                                                            }
                                                                                            src={
                                                                                                choice.image ||
                                                                                                "/placeholder.svg"
                                                                                            }
                                                                                            alt={
                                                                                                choice.interpretation
                                                                                            }
                                                                                            style={{
                                                                                                objectFit:
                                                                                                    "cover",
                                                                                                borderRadius: 4,
                                                                                            }}
                                                                                            fallback="https://via.placeholder.com/60?text=No+Image"
                                                                                        />
                                                                                    )}
                                                                                    <Text
                                                                                        style={{
                                                                                            fontSize:
                                                                                                "12px",
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            choice.interpretation
                                                                                        }
                                                                                    </Text>
                                                                                </Space>
                                                                            </Space>
                                                                        </Card>
                                                                    </Col>
                                                                ),
                                                            )}
                                                        </Row>
                                                    </div>
                                                )}

                                            {question.type === "rate" && (
                                                <div
                                                    className="rating-info"
                                                    style={{ marginTop: 8 }}
                                                >
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        Scale: 1 (Lowest) - 5
                                                        (Highest)
                                                    </Text>
                                                </div>
                                            )}
                                        </Space>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>

                    <Card title="Summary" style={{ marginTop: 16 }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Total Questions"
                                    value={
                                        viewingQuizResult.questions?.length || 0
                                    }
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Required Questions"
                                    value={
                                        viewingQuizResult.questions?.filter(
                                            (q) => q.required,
                                        )?.length || 0
                                    }
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Completion Date"
                                    value={new Date(
                                        viewingQuizResult.created_at,
                                    ).toLocaleDateString()}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            )}
        </Modal>
    );
}
