import { Card, Alert, Row, Col, Tooltip, Image } from "antd";
import {
    PictureOutlined,
    CheckCircleOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import QuizQuestionMeta from "~/pages/auth/quiz-shared/QuizQuestionMeta";
import {
    Title,
    Text,
} from "~/pages/auth/image-quiz-page/parts/imageQuizShared";
import { useImageQuizContext } from "~/pages/auth/image-quiz-page/ImageQuizContext";

export default function ImageQuizQuestion() {
    const {
        currentQuiz,
        currentQuestionIndex,
        currentQuestion,
        answers,
        timeExpired,
        handleImageSelect,
        handleImageLoad,
    } = useImageQuizContext();

    return (
        <section className="quiz-section">
            <Card className="quiz-question-card" bordered={false}>
                <QuizQuestionMeta
                    position={currentQuestionIndex + 1}
                    total={currentQuiz.questions.length}
                    category={currentQuestion.category}
                    categoryIcon={<PictureOutlined />}
                    required={currentQuestion.required}
                    answered={Boolean(answers[currentQuestion.id])}
                />
                <Title level={3} className="quiz-question-text">
                    <PictureOutlined />
                    {currentQuestion.question}
                </Title>

                {currentQuestion.description && (
                    <Alert
                        message="Visual Context"
                        description={currentQuestion.description}
                        type="info"
                        showIcon
                        style={{ marginBottom: 18, borderRadius: 12 }}
                    />
                )}

                {/* Image Options */}
                <div className="image-options-grid">
                    <Row gutter={[16, 16]}>
                        {currentQuestion.options.map((option) => {
                            const isSelected =
                                answers[currentQuestion.id] === option.id;
                            return (
                                <Col xs={12} sm={12} md={6} key={option.id}>
                                    <Tooltip
                                        title={`Choose option ${option.label}`}
                                    >
                                        <div
                                            className={`image-option ${isSelected ? "selected" : ""} ${timeExpired ? "is-disabled" : ""}`}
                                            onClick={() =>
                                                handleImageSelect(
                                                    currentQuestion.id,
                                                    option.id,
                                                )
                                            }
                                        >
                                            <div className="image-container">
                                                <Image
                                                    src={option.image}
                                                    alt={`Option ${option.label}`}
                                                    width="100%"
                                                    height={160}
                                                    style={{
                                                        objectFit: "cover",
                                                    }}
                                                    preview={{
                                                        mask: <EyeOutlined />,
                                                    }}
                                                    onLoad={() =>
                                                        handleImageLoad(
                                                            option.id,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="option-label">
                                                <Text className="label-text">
                                                    Option {option.label}
                                                </Text>
                                                <span className="selection-indicator">
                                                    {isSelected ? (
                                                        <CheckCircleOutlined
                                                            style={{
                                                                color: COLORS.violet600,
                                                                fontSize: 20,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="radio-placeholder" />
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </Tooltip>
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            </Card>
        </section>
    );
}
