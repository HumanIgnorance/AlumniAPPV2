import "./AnswerQuizPage.css";
import AuthAppBar from "~/components/shared/AuthAppBar";
import { InspectGuard } from "~/hooks/usePreventInspect";
import "./quiz-shared/quiz-shared.css"; // unified header/question styles
import { Card, Skeleton, Modal, Button } from "antd";
import {
    DisconnectOutlined,
    MoonOutlined,
    SunOutlined,
    ReloadOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { getThemedModalProps } from "~/pages/auth/answer-quiz-page/parts/answerQuizShared";
import { AnswerQuizProvider } from "~/pages/auth/answer-quiz-page/AnswerQuizContext";
import useAnswerQuizController from "~/pages/auth/answer-quiz-page/hooks/useAnswerQuizController";
import AnswerQuizHero from "~/pages/auth/answer-quiz-page/parts/AnswerQuizHero";
import AnswerQuizStats from "~/pages/auth/answer-quiz-page/parts/AnswerQuizStats";
import AnswerQuizSteps from "~/pages/auth/answer-quiz-page/parts/AnswerQuizSteps";
import AnswerQuizQuestionCard from "~/pages/auth/answer-quiz-page/parts/AnswerQuizQuestionCard";
import AnswerQuizTimeExpiredModal from "~/pages/auth/answer-quiz-page/parts/AnswerQuizTimeExpiredModal";

function AnswerQuizPage() {
    const ctx = useAnswerQuizController();
    const {
        isLoadingQuizzes,
        revealed,
        timeExpired,
        isOffline,
        setCurrentTheme,
        currentTheme,
        showResumeModal,
        handleStartNewAssessment,
        handleContinueAssessment,
    } = ctx;

    if (isLoadingQuizzes) {
        return (
            <div className="quiz-page is-revealed">
                <InspectGuard />
                <section className="quiz-section" style={{ marginTop: 40 }}>
                    <Card className="quiz-card" bordered={false}>
                        <Skeleton.Input
                            active
                            size="small"
                            style={{ width: "40%", marginBottom: 16 }}
                        />
                        <Skeleton
                            active
                            title={false}
                            paragraph={{ rows: 5 }}
                        />
                    </Card>
                </section>
            </div>
        );
    }
    return (
        <AnswerQuizProvider value={ctx}>
            <div
                className={`quiz-page ${revealed ? "is-revealed" : ""} ${
                    timeExpired ? "is-locked" : ""
                }`}
            >
                {/* Offline banner */}
                {isOffline && (
                    <div
                        className="net-banner net-banner--offline"
                        role="status"
                    >
                        <DisconnectOutlined />
                        <span>
                            <strong>Connection Lost.</strong> Your progress is
                            being saved automatically. Reconnect to continue
                            normally.
                        </span>
                    </div>
                )}

                <AuthAppBar />
                <InspectGuard />
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
                <AnswerQuizHero />

                {/* ============ STATS ============ */}
                <AnswerQuizStats />

                {/* ============ STEPS ============ */}
                <AnswerQuizSteps />

                {/* ============ QUESTION CARD ============ */}
                <AnswerQuizQuestionCard />

                {/* ============ RESUME ASSESSMENT MODAL ============ */}
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
                            We found an unfinished assessment session. Would you
                            like to continue where you left off? Your saved
                            answers and remaining time have been restored.
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

                {/* ============ TIME EXPIRED MODAL ============ */}
                <AnswerQuizTimeExpiredModal />
            </div>
        </AnswerQuizProvider>
    );
}

export default AnswerQuizPage;
