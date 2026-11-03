import "./ImageQuizPage.css";
import AuthAppBar from "~/components/shared/AuthAppBar";
import "./quiz-shared/quiz-shared.css"; // unified header/question styles
import {
    Modal,
    Space,
    Progress,
    Row,
    Col,
    Statistic,
    Card,
    Skeleton,
    Result,
    Tag,
    Button,
    Divider,
    Image,
    Alert,
} from "antd";
import {
    ExclamationCircleOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
    ClockCircleOutlined,
    SmileOutlined,
    StarOutlined,
    EyeOutlined,
    MoonOutlined,
    SunOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEYS } from "~/config/storageKeys";
import axiosConfig from "~/utils/axiosConfig";
import {
    getThemedModalProps,
    Text,
    STORAGE_KEY,
    Title,
} from "~/pages/auth/image-quiz-page/parts/imageQuizShared";
import { ImageQuizProvider } from "~/pages/auth/image-quiz-page/ImageQuizContext";
import useImageQuizController from "~/pages/auth/image-quiz-page/hooks/useImageQuizController";
import ImageQuizHero from "~/pages/auth/image-quiz-page/parts/ImageQuizHero";
import ImageQuizStats from "~/pages/auth/image-quiz-page/parts/ImageQuizStats";
import ImageQuizQuestion from "~/pages/auth/image-quiz-page/parts/ImageQuizQuestion";
import ImageQuizSubmitSection from "~/pages/auth/image-quiz-page/parts/ImageQuizSubmitSection";

function ImageQuizPage() {
    const ctx = useImageQuizController();
    const {
        timeExpired,
        allRequiredAnswered,
        currentTheme,
        setIsSubmitting,
        currentQuiz,
        timeSpent,
        answers,
        setIsQuizCompleted,
        formatTime,
        isLoadingQuizzes,
        offlineBannerNode,
        resumeModalNode,
        expiredModalNode,
        currentQuestion,
        isQuizCompleted,
        getCompletionStatus,
        getPersonalityTraits,
        revealed,
        setCurrentTheme,
        handlePrevious,
        currentQuestionIndex,
        handleNext,
    } = ctx;

    const handleSubmit = async () => {
        if (timeExpired) return;
        if (!allRequiredAnswered()) {
            Modal.warning({
                ...getThemedModalProps(currentTheme),
                title: "📋 Incomplete Assessment",
                content: (
                    <div style={{ padding: "10px 0" }}>
                        <p style={{ marginBottom: 8 }}>
                            Please answer all required questions before
                            submitting.
                        </p>
                        <div
                            style={{
                                background: "#fffbf0",
                                padding: "12px",
                                borderRadius: "6px",
                                border: "1px solid #ffe58f",
                            }}
                        >
                            <Space>
                                <ExclamationCircleOutlined
                                    style={{ color: COLORS.antdGold }}
                                />
                                <Text type="warning">
                                    {completionStatus.requiredTotal -
                                        completionStatus.requiredAnswered}{" "}
                                    required question(s) remaining
                                </Text>
                            </Space>
                        </div>
                    </div>
                ),
                icon: (
                    <ExclamationCircleOutlined
                        style={{ color: COLORS.antdGold }}
                    />
                ),
                okText: "Continue Assessment",
                okType: "primary",
                centered: true,
                style: { borderRadius: "12px" },
            });
            return;
        }

        setIsSubmitting(true);

        Modal.confirm({
            ...getThemedModalProps(currentTheme),
            title: (
                <Space>
                    <ThunderboltOutlined style={{ color: COLORS.violet600 }} />
                    <span>Ready to Submit?</span>
                </Space>
            ),
            content: (
                <div style={{ padding: "10px 0" }}>
                    <p>You're about to submit your assessment. Make sure:</p>
                    <ul style={{ paddingLeft: 20, margin: "10px 0" }}>
                        <li>All required questions are answered</li>
                        <li>Your responses reflect your honest opinions</li>
                        <li>You won't be able to modify after submission</li>
                    </ul>
                    <div
                        style={{
                            background:
                                currentTheme === "black"
                                    ? COLORS.ink14
                                    : COLORS.f6ffed,
                            padding: "12px",
                            borderRadius: "6px",
                            border:
                                currentTheme === "black"
                                    ? "1px solid #303030"
                                    : "1px solid #b7eb8f",
                            marginTop: "12px",
                            color:
                                currentTheme === "black"
                                    ? COLORS.white
                                    : COLORS.black,
                        }}
                    >
                        <Space>
                            <CheckCircleOutlined
                                style={{ color: COLORS.antdGreen }}
                            />
                            <Text type="success">
                                {completionStatus.answered} of{" "}
                                {completionStatus.total} questions completed
                            </Text>
                        </Space>
                    </div>
                </div>
            ),
            icon: (
                <ExclamationCircleOutlined style={{ color: COLORS.antdBlue }} />
            ),
            okText: "Yes, Submit Now",
            cancelText: "Review Answers",
            okType: "primary",
            centered: true,
            style: { borderRadius: "12px" },
            onCancel: () => {
                setIsSubmitting(false);
            },
            onOk: async () => {
                try {
                    const submissionData = {
                        type: "abcd",
                        quizId: currentQuiz?.id || "default-quiz-id",
                        timeSpent: timeSpent,
                        answers: Object.entries(answers).map(
                            ([questionId, selectedOptionId]) => {
                                const optionLetter = selectedOptionId
                                    .charAt(selectedOptionId.length - 1)
                                    .toUpperCase();

                                return {
                                    questionId: questionId,
                                    rating: optionLetter,
                                    answeredAt: new Date().toISOString(),
                                };
                            },
                        ),
                    };

                    const userInfo = secureLocalStorage.getItem(
                        STORAGE_KEYS.USER_INFO,
                    );
                    if (userInfo) {
                        submissionData.userInfo = userInfo;
                    }

                    const loadingModal = Modal.info({
                        ...getThemedModalProps(currentTheme),
                        title: (
                            <Space>
                                <LoadingOutlined />
                                <span>Submitting Assessment</span>
                            </Space>
                        ),
                        content: (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "20px 0",
                                }}
                            >
                                <Progress
                                    percent={100}
                                    status="active"
                                    showInfo={false}
                                    strokeColor={{
                                        "0%": COLORS.violet600,
                                        "100%": COLORS.antdGreen,
                                    }}
                                />
                                <p
                                    style={{
                                        marginTop: 16,
                                        color: COLORS.gray666,
                                    }}
                                >
                                    Processing your responses...
                                </p>
                            </div>
                        ),
                        okButtonProps: { disabled: true },
                        closable: false,
                        maskClosable: false,
                        centered: true,
                        style: { borderRadius: "12px" },
                    });

                    const response = await axiosConfig.post(
                        "/save-alumni-quiz",
                        submissionData,
                        {
                            headers: { "Content-Type": "application/json" },
                            timeout: 30000,
                        },
                    );

                    loadingModal.destroy();

                    if (response.data.success) {
                        if (response.data.alumniQuizId) {
                            secureLocalStorage.setItem(
                                "lastSubmissionId",
                                response.data.alumniQuizId,
                            );
                        }

                        // Clean saved progress so it does not restore old answers
                        try {
                            secureLocalStorage.removeItem(STORAGE_KEY);
                        } catch (_) {}
                        setIsQuizCompleted(true);

                        Modal.success({
                            ...getThemedModalProps(currentTheme),
                            title: (
                                <Space>
                                    <CheckCircleOutlined
                                        style={{ color: COLORS.antdGreen }}
                                    />
                                    <span>Assessment Complete! 🎉</span>
                                </Space>
                            ),
                            content: (
                                <div style={{ padding: "10px 0" }}>
                                    <p style={{ marginBottom: 12 }}>
                                        Thank you for completing the assessment.
                                        Your personality profile has been
                                        analyzed successfully.
                                    </p>
                                    <div
                                        style={{
                                            background:
                                                currentTheme === "black"
                                                    ? COLORS.c1f1f1f
                                                    : COLORS.f6ffed,
                                            padding: "12px",
                                            borderRadius: "6px",
                                            border:
                                                currentTheme === "black"
                                                    ? "1px solid #434343"
                                                    : "1px solid #b7eb8f",
                                            color:
                                                currentTheme === "black"
                                                    ? "#e6e6e6"
                                                    : COLORS.black,
                                        }}
                                    >
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Statistic
                                                    title="Time Spent"
                                                    value={formatTime(
                                                        timeSpent,
                                                    )}
                                                    prefix={
                                                        <ClockCircleOutlined />
                                                    }
                                                    valueStyle={{
                                                        fontSize: "14px",
                                                        color: COLORS.antdBlue,
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <Statistic
                                                    title="Questions Answered"
                                                    value={
                                                        Object.keys(answers)
                                                            .length
                                                    }
                                                    suffix={`/ ${completionStatus.total}`}
                                                    valueStyle={{
                                                        fontSize: "14px",
                                                        color: COLORS.antdGreen,
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <Statistic
                                                    title="Quiz Type"
                                                    value="ABCD"
                                                    valueStyle={{
                                                        fontSize: "14px",
                                                        color: COLORS.violet600,
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            ),
                            okText: "Back to Home",
                            onOk: () => (window.location.href = "/"),
                            centered: true,
                            style: { borderRadius: "12px" },
                            width: 500,
                        });
                    } else {
                        throw new Error(
                            response.data.message || "Submission failed",
                        );
                    }
                } catch (error) {
                    console.error("❌ Error submitting quiz:", error);

                    let errorMessage =
                        "Failed to submit quiz. Please try again.";
                    let errorTitle = "Submission Error";

                    if (error.code === "ECONNABORTED") {
                        errorTitle = "⏰ Request Timeout";
                        errorMessage =
                            "The request took too long. Please check your internet connection and try again.";
                    } else if (error.response?.status === 413) {
                        errorTitle = "📁 File Too Large";
                        errorMessage =
                            "The file you uploaded is too large. Please reduce the file size and try again.";
                    } else if (error.response?.status === 429) {
                        errorTitle = "🚦 Too Many Requests";
                        errorMessage =
                            "Please wait a moment before trying again.";
                    } else if (error.response?.status >= 500) {
                        errorTitle = "🔧 Server Error";
                        errorMessage =
                            "Our servers are experiencing issues. Please try again in a few minutes.";
                    } else if (error.response?.data?.error) {
                        errorMessage = error.response.data.error;
                    } else if (error.response?.data?.errors) {
                        const validationErrors = error.response.data.errors;
                        errorMessage = Object.values(validationErrors)
                            .flat()
                            .join(", ");
                    }

                    Modal.error({
                        ...getThemedModalProps(currentTheme),
                        title: errorTitle,
                        content: (
                            <div style={{ padding: "10px 0" }}>
                                <p>{errorMessage}</p>
                                <div
                                    style={{
                                        background: "#fff2f0",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        border: "1px solid #ffccc7",
                                        marginTop: "12px",
                                    }}
                                >
                                    <Text type="secondary">
                                        If this continues, please contact
                                        support.
                                    </Text>
                                </div>
                            </div>
                        ),
                        okText: "Try Again",
                        centered: true,
                        style: { borderRadius: "12px" },
                    });
                } finally {
                    setIsSubmitting(false);
                }
            },
        });
    };

    if (isLoadingQuizzes) {
        return (
            <div className="quiz-page is-revealed">
                {offlineBannerNode}
                <section className="quiz-section" style={{ marginTop: 40 }}>
                    <Card className="quiz-card">
                        <Skeleton.Input
                            active
                            size="small"
                            style={{ width: "40%", marginBottom: 16 }}
                        />
                        <Skeleton.Node
                            active
                            style={{
                                width: "100%",
                                height: 220,
                                marginBottom: 20,
                            }}
                        >
                            <span aria-hidden="true" />
                        </Skeleton.Node>
                        <Skeleton
                            active
                            title={false}
                            paragraph={{ rows: 4 }}
                        />
                    </Card>
                </section>
                {resumeModalNode}
                {expiredModalNode}
            </div>
        );
    }

    if (!currentQuiz || !currentQuestion) {
        return (
            <div className="quiz-page is-revealed">
                {offlineBannerNode}
                <section className="quiz-section" style={{ marginTop: 60 }}>
                    <Card className="quiz-card">
                        <Result
                            status="404"
                            title="Assessment Not Found"
                            subTitle="Sorry, the visual assessment you are looking for does not exist."
                        />
                    </Card>
                </section>
                {resumeModalNode}
                {expiredModalNode}
            </div>
        );
    }

    if (isQuizCompleted) {
        const completionStatus = getCompletionStatus();
        const personality = getPersonalityTraits();

        return (
            <div className={`quiz-page ${revealed ? "is-revealed" : ""}`}>
                {offlineBannerNode}
                <section className="quiz-section" style={{ marginTop: 40 }}>
                    <Card className="quiz-completion-card">
                        <Result
                            icon={
                                <SmileOutlined
                                    style={{ color: personality.color }}
                                />
                            }
                            status="success"
                            title="Visual Assessment Complete!"
                            subTitle={
                                <Space direction="vertical">
                                    <Text>
                                        Your personality profile has been
                                        analyzed through your visual
                                        preferences.
                                    </Text>
                                    <Tag
                                        color={personality.color}
                                        icon={<StarOutlined />}
                                    >
                                        {personality.level} Personality
                                    </Tag>
                                </Space>
                            }
                            extra={[
                                <Button
                                    key="another"
                                    onClick={() => window.location.reload()}
                                >
                                    Retake Assessment
                                </Button>,
                                <Button
                                    key="home"
                                    type="primary"
                                    className="btn-primary-grad"
                                >
                                    View Detailed Analysis
                                </Button>,
                            ]}
                        >
                            <div
                                className="quiz-stats"
                                style={{ marginTop: 12 }}
                            >
                                <div className="quiz-stat">
                                    <span className="quiz-stat__icon">
                                        <EyeOutlined />
                                    </span>
                                    <div>
                                        <Text className="quiz-stat__label">
                                            Personality Type
                                        </Text>
                                        <Text
                                            className="quiz-stat__value"
                                            style={{ color: personality.color }}
                                        >
                                            {personality.level}
                                        </Text>
                                        <Text className="quiz-stat__sub">
                                            {personality.description}
                                        </Text>
                                    </div>
                                </div>
                                <div className="quiz-stat">
                                    <span className="quiz-stat__icon">
                                        <CheckCircleOutlined />
                                    </span>
                                    <div>
                                        <Text className="quiz-stat__label">
                                            Completion Rate
                                        </Text>
                                        <Text className="quiz-stat__value">
                                            {(
                                                (completionStatus.answered /
                                                    completionStatus.total) *
                                                100
                                            ).toFixed(0)}
                                            %
                                        </Text>
                                        <Text className="quiz-stat__sub">
                                            {completionStatus.answered} of{" "}
                                            {completionStatus.total} questions
                                        </Text>
                                    </div>
                                </div>
                                <div className="quiz-stat">
                                    <span className="quiz-stat__icon">
                                        <ClockCircleOutlined />
                                    </span>
                                    <div>
                                        <Text className="quiz-stat__label">
                                            Time Spent
                                        </Text>
                                        <Text className="quiz-stat__value">
                                            {formatTime(timeSpent)}
                                        </Text>
                                        <Text className="quiz-stat__sub">
                                            Estimated:{" "}
                                            {currentQuiz.estimatedTime} min
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            <Divider className="quiz-divider" />

                            <div>
                                <Title
                                    level={3}
                                    style={{
                                        textAlign: "center",
                                        marginBottom: 24,
                                    }}
                                >
                                    🎨 Your Visual Preferences Analysis
                                </Title>
                                <Row gutter={[16, 16]}>
                                    {currentQuiz.questions.map(
                                        (question, index) => {
                                            const selectedOption =
                                                question.options.find(
                                                    (opt) =>
                                                        opt.id ===
                                                        answers[question.id],
                                                );
                                            return (
                                                <Col
                                                    xs={24}
                                                    lg={12}
                                                    key={question.id}
                                                >
                                                    <Card
                                                        className="quiz-card"
                                                        size="small"
                                                        style={{
                                                            borderLeft: `4px solid ${personality.color}`,
                                                            height: "100%",
                                                        }}
                                                    >
                                                        <Space
                                                            direction="vertical"
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    alignItems:
                                                                        "flex-start",
                                                                }}
                                                            >
                                                                <Text
                                                                    strong
                                                                    style={{
                                                                        flex: 1,
                                                                    }}
                                                                >
                                                                    Q{index + 1}
                                                                    :{" "}
                                                                    {
                                                                        question.question
                                                                    }
                                                                </Text>
                                                                <Space>
                                                                    {question.required && (
                                                                        <Tag color="red">
                                                                            Required
                                                                        </Tag>
                                                                    )}
                                                                    <Tag color="blue">
                                                                        {
                                                                            question.category
                                                                        }
                                                                    </Tag>
                                                                </Space>
                                                            </div>

                                                            {selectedOption && (
                                                                <div
                                                                    style={{
                                                                        marginTop: 8,
                                                                        padding: 12,
                                                                        background:
                                                                            "var(--surface-2)",
                                                                        borderRadius: 8,
                                                                        border: "1px solid var(--border)",
                                                                    }}
                                                                >
                                                                    <Row
                                                                        gutter={
                                                                            16
                                                                        }
                                                                        align="middle"
                                                                    >
                                                                        <Col
                                                                            xs={
                                                                                24
                                                                            }
                                                                            sm={
                                                                                8
                                                                            }
                                                                        >
                                                                            <Image
                                                                                src={
                                                                                    selectedOption.image
                                                                                }
                                                                                alt={`Selected option ${selectedOption.label}`}
                                                                                width="100%"
                                                                                height={
                                                                                    60
                                                                                }
                                                                                style={{
                                                                                    objectFit:
                                                                                        "cover",
                                                                                    borderRadius: 6,
                                                                                }}
                                                                                preview={{
                                                                                    mask: (
                                                                                        <EyeOutlined />
                                                                                    ),
                                                                                }}
                                                                            />
                                                                        </Col>
                                                                        <Col
                                                                            xs={
                                                                                24
                                                                            }
                                                                            sm={
                                                                                16
                                                                            }
                                                                        >
                                                                            <Text
                                                                                strong
                                                                            >
                                                                                Option{" "}
                                                                                {
                                                                                    selectedOption.label
                                                                                }
                                                                            </Text>
                                                                            <br />
                                                                            <Text
                                                                                type="secondary"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "13px",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    selectedOption.interpretation
                                                                                }
                                                                            </Text>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            )}

                                                            {!selectedOption && (
                                                                <Text
                                                                    type="secondary"
                                                                    italic
                                                                >
                                                                    Not answered
                                                                </Text>
                                                            )}
                                                        </Space>
                                                    </Card>
                                                </Col>
                                            );
                                        },
                                    )}
                                </Row>
                            </div>
                        </Result>
                    </Card>
                </section>
                {expiredModalNode}
            </div>
        );
    }

    const completionStatus = getCompletionStatus();

    const pageCtx = { ...ctx, completionStatus, handleSubmit };

    return (
        <ImageQuizProvider value={pageCtx}>
            <div
                className={`quiz-page ${revealed ? "is-revealed" : ""} ${
                    timeExpired ? "is-locked" : ""
                }`}
            >
                {offlineBannerNode}
                <AuthAppBar />
                <div className="page-theme-toggle">
                    <button
                        type="button"
                        className="page-theme-toggle__btn"
                        onClick={() => {
                            setCurrentTheme(
                                currentTheme === "black" ? "white" : "black",
                            );
                        }}
                        aria-label="Toggle theme"
                    >
                        {currentTheme === "black" ? (
                            <MoonOutlined />
                        ) : (
                            <SunOutlined />
                        )}
                    </button>
                    <style>{`
                /* ============ Theme toggle (synced with FormLogin) ============ */
                .page-theme-toggle {
                    position: fixed; top: 20px; right: 20px; z-index: 1000;
                }
                .page-theme-toggle__btn {
                    width: 48px; height: 48px;
                    border-radius: 50%;
                    display: inline-flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    border: 1px solid #cbd5e1;
                    background: #ffffff;
                    color: #4f46e5;
                    box-shadow: 0 4px 14px rgba(2, 6, 23, 0.10);
                    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                                box-shadow 0.25s ease, border-color 0.2s;
                }
                .page-theme-toggle__btn:hover {
                    transform: rotate(-8deg) scale(1.05);
                    border-color: #4f46e5;
                    box-shadow: 0 0 0 6px rgba(79, 70, 229, 0.10),
                                0 10px 28px rgba(2, 6, 23, 0.18);
                }
                .page-theme-toggle__btn .anticon { font-size: 20px; }
                [data-theme="black"] .page-theme-toggle__btn {
                    background: #121620;
                    border-color: #303746;
                    color: #60a5fa;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.45);
                }
`}</style>
                </div>
                {/* ============ HERO ============ */}
                <ImageQuizHero />

                {/* ============ STATS ============ */}
                <ImageQuizStats />

                {/* ============ QUESTION ============ */}
                <ImageQuizQuestion />

                {/* ============ NAVIGATION ============ */}
                <section className="quiz-section">
                    <div className="quiz-navigation">
                        <Button
                            size="large"
                            icon={<ArrowLeftOutlined />}
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0 || timeExpired}
                            className="btn-ghost"
                        >
                            Previous
                        </Button>

                        <Space>
                            <Text strong>
                                Question {currentQuestionIndex + 1} of{" "}
                                {currentQuiz.questions.length}
                            </Text>
                            <Tag color="cyan">
                                {Math.round(
                                    ((currentQuestionIndex + 1) /
                                        currentQuiz.questions.length) *
                                        100,
                                )}
                                % Complete
                            </Tag>
                        </Space>

                        <Button
                            size="large"
                            icon={<ArrowRightOutlined />}
                            onClick={handleNext}
                            disabled={
                                currentQuestionIndex ===
                                    currentQuiz.questions.length - 1 ||
                                timeExpired
                            }
                            className="btn-ghost"
                        >
                            Next
                        </Button>
                    </div>
                </section>

                {/* ============ SUBMIT SECTION ============ */}
                <ImageQuizSubmitSection />

                {/* Help */}
                <section className="quiz-section">
                    <Alert
                        message="💡 Visual Assessment Guidance"
                        description="This personality assessment uses visual preferences to understand your traits. Select the images that genuinely resonate with you — there are no right or wrong answers. Your choices reveal your natural inclinations and personality characteristics."
                        type="info"
                        showIcon
                        style={{ borderRadius: 14 }}
                    />
                </section>

                {/* ============ RESUME + TIME EXPIRED MODALS ============ */}
                {resumeModalNode}
                {expiredModalNode}
            </div>
        </ImageQuizProvider>
    );
}

export default ImageQuizPage;
