import logo from "~/assets/images/OCC_LOGO.png";
import { Tag } from "antd";
import {
    PictureOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    BulbOutlined,
} from "@ant-design/icons";
import { companyInfo } from "~/config/institution";
import {
    Text,
    Title,
    Paragraph,
} from "~/pages/auth/image-quiz-page/parts/imageQuizShared";
import { useImageQuizContext } from "~/pages/auth/image-quiz-page/ImageQuizContext";

export default function ImageQuizHero() {
    const { currentQuiz, timeLeft, formatTime } = useImageQuizContext();

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
                        <Tag className="quiz-chip" icon={<PictureOutlined />}>
                            VISUAL ASSESSMENT
                        </Tag>
                        <Text className="quiz-hero__eyebrow">
                            {companyInfo.name}
                        </Text>
                    </div>
                </div>

                <Title className="quiz-hero__title">
                    Visual Personality{" "}
                    <span className="grad-text">Assessment</span>
                </Title>

                <Paragraph className="quiz-hero__lead">
                    {currentQuiz.description}. Choose the visuals that resonate
                    with you most — there are no right or wrong answers.
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
                    <Tag icon={<PictureOutlined />}>Visual</Tag>
                    <Tag icon={<CalendarOutlined />}>
                        {currentQuiz.estimatedTime} min
                    </Tag>
                    <Tag icon={<BulbOutlined />}>
                        {currentQuiz.questions.length} Questions
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
