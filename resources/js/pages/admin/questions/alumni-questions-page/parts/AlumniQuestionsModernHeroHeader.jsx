import { Tag, Button } from "antd";
import {
    QuestionCircleOutlined,
    OrderedListOutlined,
    CheckSquareOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Title,
    Text,
} from "~/pages/admin/questions/alumni-questions-page/parts/alumniQuestionsShared";
import { useAlumniQuestionsContext } from "~/pages/admin/questions/alumni-questions-page/AlumniQuestionsContext";

export default function AlumniQuestionsModernHeroHeader() {
    const { quizzes, questions, quizzes_result, openQuizDrawer, showModal } =
        useAlumniQuestionsContext();

    return (
        <div className="qm-hero">
            <div className="qm-hero__bg" aria-hidden="true">
                <span className="qm-orb qm-orb-1" />
                <span className="qm-orb qm-orb-2" />
                <span className="qm-orb qm-orb-3" />
                <div className="qm-grid-overlay" />
            </div>

            <div className="qm-hero__content">
                <div className="qm-hero__left">
                    <Tag className="qm-chip">
                        <QuestionCircleOutlined /> Quiz Management
                    </Tag>
                    <Title level={2} className="qm-hero__title">
                        Build, Manage & Track{" "}
                        <span className="qm-grad-text">Quizzes</span>
                    </Title>
                    <Text className="qm-hero__lead">
                        Create engaging quizzes, organize questions, and monitor
                        results — all in one clean, professional workspace built
                        for alumni engagement.
                    </Text>

                    <div className="qm-hero__stats">
                        <div className="qm-stat-card">
                            <span className="qm-stat-icon qm-stat-icon--blue">
                                <OrderedListOutlined />
                            </span>
                            <div className="qm-stat-meta">
                                <span className="qm-stat-value">
                                    {quizzes.length}
                                </span>
                                <span className="qm-stat-label">Quizzes</span>
                            </div>
                        </div>
                        <div className="qm-stat-card">
                            <span className="qm-stat-icon qm-stat-icon--green">
                                <QuestionCircleOutlined />
                            </span>
                            <div className="qm-stat-meta">
                                <span className="qm-stat-value">
                                    {questions.length}
                                </span>
                                <span className="qm-stat-label">Questions</span>
                            </div>
                        </div>
                        <div className="qm-stat-card">
                            <span className="qm-stat-icon qm-stat-icon--purple">
                                <CheckSquareOutlined />
                            </span>
                            <div className="qm-stat-meta">
                                <span className="qm-stat-value">
                                    {quizzes_result.length}
                                </span>
                                <span className="qm-stat-label">Results</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="qm-hero__actions">
                    <Button
                        className="qm-btn-primary"
                        icon={<PlusOutlined />}
                        onClick={() => openQuizDrawer()}
                        size="large"
                    >
                        Create New Quiz
                    </Button>
                    <Button
                        className="qm-btn-primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                        size="large"
                    >
                        Add Question
                    </Button>
                </div>
            </div>
        </div>
    );
}
