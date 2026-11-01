import { CheckCircleOutlined } from "@ant-design/icons";

/**
 * Header row of a question card, shared by both quizzes so the labels,
 * order and styling are identical:
 *   [Question 3 of 10]  [category]  [Required | Optional]  [Answered]
 * Styles: quiz-shared.css (design tokens only).
 */
export default function QuizQuestionMeta({
    position,
    total,
    category,
    categoryIcon,
    required,
    answered,
}) {
    return (
        <div className="quiz-question-meta">
            <span className="quiz-q-pill">
                Question {position} of {total}
            </span>
            {category ? (
                <span className="quiz-q-chip">
                    {categoryIcon}
                    {category}
                </span>
            ) : null}
            <span
                className={`quiz-q-chip ${
                    required ? "quiz-q-chip--danger" : "quiz-q-chip--warning"
                }`}
            >
                {required ? "Required" : "Optional"}
            </span>
            {answered ? (
                <span className="quiz-q-chip quiz-q-chip--success">
                    <CheckCircleOutlined />
                    Answered
                </span>
            ) : null}
        </div>
    );
}
