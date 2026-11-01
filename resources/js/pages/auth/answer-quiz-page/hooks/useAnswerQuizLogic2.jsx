import { Modal, Badge, Tooltip } from "antd";
import {
    ExclamationCircleOutlined,
    FireOutlined,
    UserOutlined,
    SmileOutlined,
    StarOutlined,
} from "@ant-design/icons";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEYS } from "~/config/storageKeys";
import axiosConfig from "~/utils/axiosConfig";
import { COLORS } from "~/config/theme";
import {
    getThemedModalProps,
    STORAGE_KEY,
    QUIZ_DURATION,
    LOGOUT_COUNTDOWN,
} from "~/pages/auth/answer-quiz-page/parts/answerQuizShared";

export default function useAnswerQuizLogic2({
    timeExpired,
    currentTheme,
    setIsSubmitting,
    currentQuiz,
    timeSpent,
    questionsWithInterpretation,
    answers,
    setIsQuizCompleted,
    currentQuestions,
    currentPage,
    questionsPerPage,
    expiryCountdown,
}) {
    const handleSubmit = async () => {
        if (timeExpired) return;
        if (!allRequiredAnswered()) {
            Modal.warning({
                ...getThemedModalProps(currentTheme),
                title: "Incomplete Assessment",
                content:
                    "Please answer all required questions before submitting.",
                icon: <ExclamationCircleOutlined />,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            formData.append("type", "rating");
            formData.append("quizId", currentQuiz.id || "default-quiz-id");
            formData.append("timeSpent", timeSpent.toString());
            formData.append("completedAt", new Date().toISOString());
            formData.append(
                "totalQuestions",
                questionsWithInterpretation.length.toString(),
            );
            formData.append(
                "answeredQuestions",
                Object.keys(answers).length.toString(),
            );

            const userInfo = secureLocalStorage.getItem(STORAGE_KEYS.USER_INFO);
            if (userInfo) {
                formData.append("userInfo", userInfo);
            }

            Object.entries(answers).forEach(([questionId, rating], index) => {
                formData.append(`answers[${index}][questionId]`, questionId);
                formData.append(`answers[${index}][rating]`, rating.toString());
                formData.append(
                    `answers[${index}][answeredAt]`,
                    new Date().toISOString(),
                );

                const additionalData = answers[questionId]?.additionalData;
                if (additionalData) {
                    if (additionalData.comment) {
                        formData.append(
                            `answers[${index}][comment]`,
                            additionalData.comment,
                        );
                    }
                    if (additionalData.file) {
                        formData.append(
                            `answers[${index}][file]`,
                            additionalData.file,
                        );
                    }
                }
            });

            const response = await axiosConfig.post(
                "/save-alumni-quiz",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            if (response.data.success) {
                if (response.data.submissionId) {
                    secureLocalStorage.setItem(
                        "lastSubmissionId",
                        response.data.submissionId,
                    );
                }

                // Clean saved progress so it does not restore old answers
                try {
                    secureLocalStorage.removeItem(STORAGE_KEY);
                } catch (_) {}
                setIsQuizCompleted(true);

                Modal.success({
                    ...getThemedModalProps(currentTheme),
                    title: "Assessment Complete!",
                    content:
                        "Thank you for completing the assessment. Your responses have been recorded successfully.",
                    onOk: () => (window.location.href = "/"),
                });
            } else {
                throw new Error(response.data.message || "Submission failed");
            }
        } catch (error) {
            console.error("❌ Error submitting quiz:", error);

            let errorMessage = "Failed to submit quiz. Please try again.";

            if (error.code === "ECONNABORTED") {
                errorMessage =
                    "Request timeout. Please check your internet connection and try again.";
            } else if (error.response?.status === 413) {
                errorMessage =
                    "File too large. Please reduce file size and try again.";
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            Modal.error({
                ...getThemedModalProps(currentTheme),
                title: "Submission Error",
                content: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getProgress = () => {
        const answered = Object.keys(answers).length;
        return Math.floor(
            (answered / questionsWithInterpretation.length) * 100,
        );
    };

    const getCompletionStatus = () => {
        const requiredQuestions = questionsWithInterpretation.filter(
            (q) => q.required,
        );
        const answeredRequired = requiredQuestions.filter(
            (q) => answers[q.id] !== undefined && answers[q.id] !== null,
        ).length;

        return {
            answered: Object.keys(answers).length,
            total: questionsWithInterpretation.length,
            requiredAnswered: answeredRequired,
            requiredTotal: requiredQuestions.length,
        };
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const getAverageRating = () => {
        const ratings = Object.values(answers).filter(
            (val) => val !== null && val !== undefined,
        );
        if (ratings.length === 0) return 0;
        return (
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        );
    };

    const getStressLevel = () => {
        const average = getAverageRating();

        if (average <= 2) {
            return {
                level: "Critical",
                color: COLORS.f5222d,
                description: "Difficult experiences",
                icon: <FireOutlined />,
                indicator: <Badge color={COLORS.f5222d} text="Critical" />,
            };
        } else if (average <= 3) {
            return {
                level: "High",
                color: COLORS.antdOrange,
                description: "Challenging experiences",
                icon: <ExclamationCircleOutlined />,
                indicator: <Badge color={COLORS.antdOrange} text="High" />,
            };
        } else if (average <= 4) {
            return {
                level: "Moderate",
                color: COLORS.antdGold,
                description: "Balanced experiences",
                icon: <UserOutlined />,
                indicator: <Badge color={COLORS.antdGold} text="Moderate" />,
            };
        } else {
            return {
                level: "Low",
                color: COLORS.antdGreen,
                description: "Positive experiences",
                icon: <SmileOutlined />,
                indicator: <Badge color={COLORS.antdGreen} text="Low" />,
            };
        }
    };

    const allRequiredAnswered = () => {
        const requiredQuestions = questionsWithInterpretation.filter(
            (q) => q.required,
        );
        return requiredQuestions.every(
            (q) => answers[q.id] !== undefined && answers[q.id] !== null,
        );
    };

    const getStarColors = (value) => {
        const colors = {
            1: COLORS.f5222d,
            2: COLORS.antdOrange,
            3: COLORS.antdGold,
            4: "#73d13d",
            5: COLORS.antdGreen,
        };
        return colors[value] || COLORS.antdGray3;
    };

    const CustomRate = ({ value, onChange, questionId }) => {
        return (
            <div className="custom-rate">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Tooltip
                        key={star}
                        title={
                            questionsWithInterpretation.find(
                                (q) => q.id === questionId,
                            )?.interpretation[star]
                        }
                    >
                        <button
                            type="button"
                            className={`rate-star ${value >= star ? "active" : ""}`}
                            onClick={() => onChange(questionId, star)}
                            disabled={timeExpired}
                            style={{
                                color:
                                    value >= star
                                        ? getStarColors(star)
                                        : undefined,
                                background:
                                    value >= star
                                        ? `${getStarColors(star)}1F`
                                        : undefined,
                                borderColor:
                                    value >= star
                                        ? getStarColors(star)
                                        : undefined,
                            }}
                        >
                            <StarOutlined />
                            <span className="star-number">{star}</span>
                        </button>
                    </Tooltip>
                ))}
            </div>
        );
    };

    const getQuestionStatus = (questionId) => {
        return answers[questionId] ? "answered" : "unanswered";
    };

    const completionStatus = getCompletionStatus();
    const currentQuestion = currentQuestions[0];
    const questionNumber = (currentPage - 1) * questionsPerPage + 1;
    const timeLeft = Math.max(0, QUIZ_DURATION - timeSpent);
    const expiryProgress = Math.max(
        0,
        Math.min(100, (expiryCountdown / LOGOUT_COUNTDOWN) * 100),
    );

    return {
        handleSubmit,
        getProgress,
        formatTime,
        allRequiredAnswered,
        CustomRate,
        completionStatus,
        currentQuestion,
        questionNumber,
        timeLeft,
        expiryProgress,
    };
}
