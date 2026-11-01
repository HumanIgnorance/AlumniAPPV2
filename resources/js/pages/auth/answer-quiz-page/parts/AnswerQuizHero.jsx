import logo from "~/assets/images/OCC_LOGO.png";
import { Tag } from "antd";
import {
    BulbOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    CalendarOutlined,
    QuestionCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { companyInfo } from "~/config/institution";
import {
    Text,
    Title,
    Paragraph,
} from "~/pages/auth/answer-quiz-page/parts/answerQuizShared";
import { useAnswerQuizContext } from "~/pages/auth/answer-quiz-page/AnswerQuizContext";

export default function AnswerQuizHero() {
    const { currentQuiz, questionsWithInterpretation, timeLeft, formatTime } =
        useAnswerQuizContext();

    return (
        <section className="quiz-hero">
            <div className="quiz-hero__bg" aria-hidden>
                <span className="blob blob-1" />
                <span className="blob blob-2" />
                <span className="blob blob-3" />
                <div className="dot-grid" />
            </div>

            <div className="quiz-hero__content">
                <div className="quiz-hero__brand">
                    <img
                        src={logo}
                        alt="OCC Logo"
                        className="quiz-hero__logo"
                    />
                    <div className="quiz-hero__brand-meta">
                        <Tag className="quiz-chip" icon={<BulbOutlined />}>
                            BEHAVIORAL ASSESSMENT
                        </Tag>
                        <Text className="quiz-hero__eyebrow">
                            {companyInfo.name}
                        </Text>
                    </div>
                </div>

                <Title className="quiz-hero__title">
                    {currentQuiz.title.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className="grad-text">
                        {currentQuiz.title.split(" ").slice(-1)[0]}
                    </span>
                </Title>

                <Paragraph className="quiz-hero__lead">
                    {currentQuiz.description}. Your honest feedback helps us
                    better understand workplace wellness and continuously
                    improve our alumni community experience.
                </Paragraph>

                <div className="quiz-hero__company">
                    <span>
                        <GlobalOutlined /> {companyInfo.website}
                    </span>
                    <span>
                        <EnvironmentOutlined /> {companyInfo.address}
                    </span>
                </div>

                <div className="quiz-hero__tags">
                    <Tag icon={<TeamOutlined />}>{currentQuiz.category}</Tag>
                    <Tag icon={<ThunderboltOutlined />}>
                        {currentQuiz.difficulty}
                    </Tag>
                    <Tag icon={<CalendarOutlined />}>
                        {currentQuiz.estimatedTime} min
                    </Tag>
                    <Tag icon={<QuestionCircleOutlined />}>
                        {questionsWithInterpretation.length} Questions
                    </Tag>
                    <Tag
                        icon={<ClockCircleOutlined />}
                        className={
                            timeLeft < 60
                                ? "quiz-timer--warn"
                                : "quiz-timer--ok"
                        }
                    >
                        Time Left: {formatTime(timeLeft)}
                    </Tag>
                </div>
            </div>
        </section>
    );
}
