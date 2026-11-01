import {
    Modal,
    Space,
    Badge,
    Button,
    Card,
    Tag,
    List,
    Row,
    Col,
    Image,
} from "antd";
import { COLORS } from "~/config/theme";
import { FullscreenOutlined } from "@ant-design/icons";
import { Text } from "~/pages/admin/questions/alumni-questions-page/parts/alumniQuestionsShared";
import { useAlumniQuestionsContext } from "~/pages/admin/questions/alumni-questions-page/AlumniQuestionsContext";

export default function AlumniQuestionsQuizDetailsModal() {
    const {
        viewingQuiz,
        isQuizDetailsModalVisible,
        closeQuizDetailsModal,
        openQuizDrawer,
    } = useAlumniQuestionsContext();

    return (
        <Modal
            title={
                <Space>
                    <Text strong>Quiz Details</Text>
                    {viewingQuiz && (
                        <Badge
                            count={`${viewingQuiz.questions?.length || 0} questions`}
                            style={{ backgroundColor: COLORS.antdBlue }}
                        />
                    )}
                </Space>
            }
            open={isQuizDetailsModalVisible}
            onCancel={closeQuizDetailsModal}
            width="min(800px, 94vw)"
            className="quiz-details-modal"
            footer={[
                <Button
                    key="edit"
                    onClick={() => {
                        closeQuizDetailsModal();
                        openQuizDrawer(viewingQuiz);
                    }}
                >
                    Edit Quiz
                </Button>,
                <Button
                    key="preview"
                    type="primary"
                    icon={<FullscreenOutlined />}
                >
                    Preview Quiz
                </Button>,
                <Button key="close" onClick={closeQuizDetailsModal}>
                    Close
                </Button>,
            ]}
        >
            {viewingQuiz && (
                <div className="quiz-details-content">
                    <Card
                        title={
                            <Space>
                                <Text strong>{viewingQuiz.title}</Text>
                                <Tag
                                    color={
                                        viewingQuiz.type === "rate"
                                            ? "blue"
                                            : "green"
                                    }
                                >
                                    {viewingQuiz.type === "rate"
                                        ? "Rating Quiz"
                                        : "Multiple Choice Quiz"}
                                </Tag>
                                {viewingQuiz.isActive && (
                                    <Tag color="green">Active</Tag>
                                )}
                            </Space>
                        }
                        style={{ marginBottom: 16 }}
                    >
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Text>
                                <strong>Created:</strong>{" "}
                                {new Date(
                                    viewingQuiz.created_at,
                                ).toLocaleDateString()}
                            </Text>
                            <Text>
                                <strong>Updated:</strong>{" "}
                                {new Date(
                                    viewingQuiz.updated_at,
                                ).toLocaleDateString()}
                            </Text>
                        </Space>
                    </Card>

                    <List
                        dataSource={viewingQuiz.questions || []}
                        renderItem={(question, index) => {
                            // Prefer choices_with_urls (full URL); fall back to raw choices
                            const renderChoices =
                                question.choices_with_urls &&
                                question.choices_with_urls.length
                                    ? question.choices_with_urls
                                    : question.choices || [];

                            return (
                                <List.Item className="quiz-question-item">
                                    <div className="question-number">
                                        <Text strong>#{index + 1}</Text>
                                    </div>
                                    <div className="question-content">
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
                                            {question.type === "abcd" &&
                                                renderChoices.length > 0 && (
                                                    <div className="choices-preview">
                                                        <Text strong>
                                                            Options:
                                                        </Text>
                                                        <Row
                                                            gutter={[16, 16]}
                                                            style={{
                                                                marginTop: 8,
                                                            }}
                                                        >
                                                            {renderChoices.map(
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
                                                                        <Card size="small">
                                                                            <Space align="start">
                                                                                <Text
                                                                                    strong
                                                                                >
                                                                                    {
                                                                                        choice.letter
                                                                                    }
                                                                                </Text>
                                                                                {choice.image && (
                                                                                    <Image
                                                                                        width={
                                                                                            80
                                                                                        }
                                                                                        height={
                                                                                            80
                                                                                        }
                                                                                        src={
                                                                                            choice.image
                                                                                        }
                                                                                        alt={
                                                                                            choice.interpretation
                                                                                        }
                                                                                        style={{
                                                                                            objectFit:
                                                                                                "cover",
                                                                                            borderRadius: 6,
                                                                                        }}
                                                                                        fallback="https://via.placeholder.com/80?text=No+Image"
                                                                                    />
                                                                                )}
                                                                                <Text>
                                                                                    {
                                                                                        choice.interpretation
                                                                                    }
                                                                                </Text>
                                                                            </Space>
                                                                        </Card>
                                                                    </Col>
                                                                ),
                                                            )}
                                                        </Row>
                                                    </div>
                                                )}
                                        </Space>
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                </div>
            )}
        </Modal>
    );
}
