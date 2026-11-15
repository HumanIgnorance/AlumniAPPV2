import React from "react";
import { AnswerQuizPage, ImageQuizPage } from "./lazyPages";
import QuizRouteGuard from "./QuizRouteGuard";

// quizType must match the `type` the page submits to /save-alumni-quiz:
// "rating" (Program Experience Rating) and "abcd" (Behavioral/Image quiz).
export const GuardedAnswerQuizPage = (props) => (
    <QuizRouteGuard quizType="rating">
        <AnswerQuizPage {...props} />
    </QuizRouteGuard>
);

export const GuardedImageQuizPage = (props) => (
    <QuizRouteGuard quizType="abcd">
        <ImageQuizPage {...props} />
    </QuizRouteGuard>
);
