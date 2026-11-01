import { COLORS } from "~/config/theme";
import { Modal, Button } from "antd";
import {
    ReloadOutlined,
    ArrowRightOutlined,
    ClockCircleOutlined,
    LogoutOutlined,
    DisconnectOutlined,
} from "@ant-design/icons";
import {
    QUIZ_DURATION,
    LOGOUT_COUNTDOWN,
    getThemedModalProps,
} from "~/pages/auth/image-quiz-page/parts/imageQuizShared";

export default function useImageQuizLogic2({
    currentQuiz,
    answers,
    timeExpired,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    saveQuizProgress,
    setImagesLoaded,
    timeSpent,
    expiryCountdown,
    currentTheme,
    showResumeModal,
    handleStartNewAssessment,
    handleContinueAssessment,
    isOffline,
}) {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const allRequiredAnswered = () => {
        if (!currentQuiz) return false;
        const requiredQuestions = currentQuiz.questions.filter(
            (q) => q.required,
        );
        return requiredQuestions.every((q) => answers[q.id] !== undefined);
    };

    const getPersonalityTraits = () => {
        if (!currentQuiz)
            return {
                level: "Thinker",
                color: COLORS.antdOrange,
                description:
                    "You're logical and enjoy solving complex problems",
            };

        const selectedOptions = Object.values(answers)
            .map((answerId) => {
                for (let question of currentQuiz.questions) {
                    const option = question.options.find(
                        (opt) => opt.id === answerId,
                    );
                    if (option) return option;
                }
                return null;
            })
            .filter((opt) => opt !== null);

        const traits = {
            adventurous: selectedOptions.filter(
                (opt) =>
                    opt.interpretation?.includes("nature") ||
                    opt.interpretation?.includes("ocean") ||
                    opt.interpretation?.includes("eagle") ||
                    opt.interpretation?.includes("explor"),
            ).length,
            social: selectedOptions.filter(
                (opt) =>
                    opt.interpretation?.includes("social") ||
                    opt.interpretation?.includes("people") ||
                    opt.interpretation?.includes("community") ||
                    opt.interpretation?.includes("connection"),
            ).length,
            creative: selectedOptions.filter(
                (opt) =>
                    opt.interpretation?.includes("creative") ||
                    opt.interpretation?.includes("innovative") ||
                    opt.interpretation?.includes("artistic") ||
                    opt.interpretation?.includes("imaginative"),
            ).length,
            analytical: selectedOptions.filter(
                (opt) =>
                    opt.interpretation?.includes("analytical") ||
                    opt.interpretation?.includes("logical") ||
                    opt.interpretation?.includes("structured") ||
                    opt.interpretation?.includes("detail"),
            ).length,
        };

        const maxTrait = Object.keys(traits).reduce((a, b) =>
            traits[a] > traits[b] ? a : b,
        );

        const traitInfo = {
            adventurous: {
                level: "Explorer",
                color: COLORS.antdGreen,
                description:
                    "You're naturally curious and love exploring new possibilities",
            },
            social: {
                level: "Connector",
                color: COLORS.antdBlue,
                description:
                    "You thrive on relationships and community interactions",
            },
            creative: {
                level: "Innovator",
                color: COLORS.violet600,
                description: "You're imaginative and bring unique perspectives",
            },
            analytical: {
                level: "Thinker",
                color: COLORS.antdOrange,
                description:
                    "You're logical and enjoy solving complex problems",
            },
        };

        return traitInfo[maxTrait] || traitInfo.analytical;
    };

    const handleNext = () => {
        if (timeExpired) return;
        if (
            currentQuiz &&
            currentQuestionIndex < currentQuiz.questions.length - 1
        ) {
            const next = currentQuestionIndex + 1;
            setCurrentQuestionIndex(next);
            saveQuizProgress({ currentQuestionIndex: next });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevious = () => {
        if (timeExpired) return;
        if (currentQuestionIndex > 0) {
            const next = currentQuestionIndex - 1;
            setCurrentQuestionIndex(next);
            saveQuizProgress({ currentQuestionIndex: next });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleImageLoad = (optionId) => {
        setImagesLoaded((prev) => ({ ...prev, [optionId]: true }));
    };

    // ===== Reusable modal nodes (rendered even on loading / not-found screens) =====
    const timeLeft = Math.max(0, QUIZ_DURATION - timeSpent);
    const expiryProgress = Math.max(
        0,
        Math.min(100, (expiryCountdown / LOGOUT_COUNTDOWN) * 100),
    );

    const resumeModalNode = (
        <Modal
            {...getThemedModalProps(currentTheme)}
            open={showResumeModal}
            closable={false}
            maskClosable={false}
            keyboard={false}
            centered
            footer={null}
            width={460}
            className="resume-modal"
            title={null}
        >
            <div className="resume-modal__body">
                <div className="resume-modal__icon">
                    <ReloadOutlined />
                </div>
                <h2 className="resume-modal__title">
                    Resume Previous Assessment?
                </h2>
                <p className="resume-modal__text">
                    We found an unfinished assessment session. Would you like to
                    continue where you left off? Your saved answers and
                    remaining time have been restored.
                </p>
                <div className="resume-modal__actions">
                    <Button
                        size="large"
                        onClick={handleStartNewAssessment}
                        className="btn-ghost"
                    >
                        Start New Assessment
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleContinueAssessment}
                        className="btn-primary-grad"
                        icon={<ArrowRightOutlined />}
                    >
                        Continue Assessment
                    </Button>
                </div>
            </div>
        </Modal>
    );

    const expiredModalNode = (
        <Modal
            {...getThemedModalProps(currentTheme)}
            open={timeExpired}
            closable={false}
            maskClosable={false}
            keyboard={false}
            centered
            footer={null}
            width={520}
            className="expired-modal"
            title={null}
        >
            <div className="expired-modal__body">
                <div className="expired-modal__clock" aria-hidden>
                    <ClockCircleOutlined />
                </div>
                <h2 className="expired-modal__title">
                    <span className="grad-text">⏰ TIME LIMIT REACHED</span>
                </h2>
                <p className="expired-modal__text">
                    Thank you for participating in the assessment. Your allotted
                    time has ended and your session has expired for security
                    purposes.
                </p>
                <p className="expired-modal__text expired-modal__text--muted">
                    You will be automatically logged out and redirected to the
                    Login Page. If you wish to continue, please sign in again
                    and start a new session.
                </p>

                <div className="expired-modal__countdown">
                    <span className="expired-modal__badge">
                        {expiryCountdown}
                    </span>
                    <span>
                        Redirecting in {expiryCountdown} second
                        {expiryCountdown === 1 ? "" : "s"}...
                    </span>
                </div>

                <div className="expired-modal__progress">
                    <div
                        className="expired-modal__progress-bar"
                        style={{ width: `${expiryProgress}%` }}
                    />
                </div>

                <div className="expired-modal__logout">
                    <LogoutOutlined /> Logging out securely...
                </div>
            </div>
        </Modal>
    );

    const offlineBannerNode = isOffline ? (
        <div className="net-banner net-banner--offline" role="status">
            <DisconnectOutlined />
            <span>
                <strong>Connection Lost.</strong> Your progress is being saved
                automatically. Reconnect to continue normally.
            </span>
        </div>
    ) : null;

    return {
        formatTime,
        allRequiredAnswered,
        getPersonalityTraits,
        handleNext,
        handlePrevious,
        handleImageLoad,
        timeLeft,
        resumeModalNode,
        expiredModalNode,
        offlineBannerNode,
    };
}
