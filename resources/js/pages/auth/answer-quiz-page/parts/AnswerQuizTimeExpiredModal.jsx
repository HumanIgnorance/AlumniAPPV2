import { Modal } from "antd";
import { ClockCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import { getThemedModalProps } from "~/pages/auth/answer-quiz-page/parts/answerQuizShared";
import { useAnswerQuizContext } from "~/pages/auth/answer-quiz-page/AnswerQuizContext";

export default function AnswerQuizTimeExpiredModal() {
    const { currentTheme, timeExpired, expiryCountdown, expiryProgress } =
        useAnswerQuizContext();

    return (
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
}
