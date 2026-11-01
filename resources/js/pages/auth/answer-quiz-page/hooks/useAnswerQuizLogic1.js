import useTakeQuiz from "~/hooks/useTakeQuiz";
import { useState, useRef, useEffect } from "react";
import { buildPageTitle } from "~/config/site";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEYS } from "~/config/storageKeys";
import { notification } from "antd";
import { useAppTheme } from "~/hooks/useAppTheme";
import {
    LOGOUT_COUNTDOWN,
    STORAGE_KEY,
    QUIZ_DURATION,
} from "~/pages/auth/answer-quiz-page/parts/answerQuizShared";

export default function useAnswerQuizLogic1() {
    const {
        isLoading: isLoadingQuizzes,
        data: questions = [],
        isFetching: isFetchingQuizzes,
        refetch: refetchQuizzes,
    } = useTakeQuiz("rating");

    const [currentQuiz, setCurrentQuiz] = useState({
        title: "Behavioral Stress Test",
        description: "Please rate your experiences",
        questions: questions,
        estimatedTime: 5,
        category: "Workplace Wellness",
        difficulty: "Intermediate",
    });

    const [answers, setAnswers] = useState({});
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage] = useState(1);
    const [visitedQuestions, setVisitedQuestions] = useState(new Set([1]));
    const [revealed, setRevealed] = useState(false);

    // ===== Time Expired / Resume / Offline state =====
    const [timeExpired, setTimeExpired] = useState(false);
    const [expiryCountdown, setExpiryCountdown] = useState(LOGOUT_COUNTDOWN);
    const [isOffline, setIsOffline] = useState(
        typeof navigator !== "undefined" ? !navigator.onLine : false,
    );
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [progressChecked, setProgressChecked] = useState(false);
    const pendingResumeRef = useRef(null);

    useEffect(() => {
        document.title = buildPageTitle("Rating Quiz");
    }, []);

    //  Prevent //
    useEffect(() => {
        const disableContextMenu = (e) => {
            e.preventDefault();
        };

        document.addEventListener("contextmenu", disableContextMenu);

        return () => {
            document.removeEventListener("contextmenu", disableContextMenu);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
                (e.ctrlKey && e.key === "u")
            ) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // ===== Load saved progress on mount (Resume Assessment) =====
    useEffect(() => {
        try {
            const raw = secureLocalStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.quizType === "rating") {
                    pendingResumeRef.current = parsed;
                    setShowResumeModal(true);
                    return;
                }
            }
        } catch (e) {
            console.warn("Failed to read saved progress", e);
        }
        setProgressChecked(true);
    }, []);

    // ===== Timer (paused during resume modal / expiry / completion) =====
    useEffect(() => {
        if (!progressChecked) return;
        if (timeExpired || isQuizCompleted || showResumeModal) return;
        const timer = setInterval(() => {
            setTimeSpent((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [progressChecked, timeExpired, isQuizCompleted, showResumeModal]);

    // ===== Time-expiration trigger =====
    useEffect(() => {
        if (timeExpired) return;
        if (!progressChecked) return;
        if (timeSpent >= QUIZ_DURATION) {
            try {
                secureLocalStorage.removeItem(STORAGE_KEY);
            } catch (_) {}
            setTimeExpired(true);
            setExpiryCountdown(LOGOUT_COUNTDOWN);
        }
    }, [timeSpent, timeExpired, progressChecked]);

    // ===== Expiry countdown -> session cleanup + redirect =====
    useEffect(() => {
        if (!timeExpired) return;
        if (expiryCountdown <= 0) {
            try {
                // Phase 6: access_token is no longer stored client-side
                // (HttpOnly cookie) — nothing to remove here anymore.
                secureLocalStorage.removeItem(STORAGE_KEYS.FACULTY_ID);
                secureLocalStorage.removeItem(STORAGE_KEYS.USER_ID);
                secureLocalStorage.removeItem(STORAGE_KEYS.USER_ROLE);
                secureLocalStorage.removeItem(STORAGE_KEYS.EMAIL);
                secureLocalStorage.removeItem(STORAGE_KEYS.NAME);
                secureLocalStorage.removeItem(STORAGE_KEYS.COURSE_ID);
                secureLocalStorage.clear();
            } catch (_) {}
            notification.warning({
                message: "Session Expired",
                description:
                    "Your assessment session has ended. Please sign in again to continue.",
                placement: "topRight",
                duration: 4,
            });
            window.location.href = "/login";
            return;
        }
        const t = setTimeout(() => {
            setExpiryCountdown((c) => c - 1);
        }, 1000);
        return () => clearTimeout(t);
    }, [timeExpired, expiryCountdown]);

    // ===== Save helper =====
    const saveQuizProgress = (overrides = {}) => {
        if (timeExpired || isQuizCompleted) return;
        try {
            const payload = {
                answers,
                currentPage,
                visitedQuestions: Array.from(visitedQuestions),
                timeSpent,
                quizType: "rating",
                savedAt: Date.now(),
                ...overrides,
            };
            secureLocalStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            console.warn("Auto-save failed", e);
        }
    };

    // ===== Auto-save every 1s =====
    useEffect(() => {
        if (
            !progressChecked ||
            timeExpired ||
            isQuizCompleted ||
            showResumeModal
        )
            return;
        const id = setInterval(() => saveQuizProgress(), 1000);
        return () => clearInterval(id);
    }, [
        progressChecked,
        timeExpired,
        isQuizCompleted,
        showResumeModal,
        answers,
        currentPage,
        visitedQuestions,
        timeSpent,
    ]);

    // ===== BeforeUnload protection =====
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (timeExpired || isQuizCompleted) return;
            saveQuizProgress();
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [
        answers,
        currentPage,
        visitedQuestions,
        timeSpent,
        timeExpired,
        isQuizCompleted,
    ]);

    // ===== Offline / Online detection =====
    useEffect(() => {
        const handleOffline = () => {
            setIsOffline(true);
            notification.warning({
                key: "net-status",
                message: "⚠️ Connection Lost",
                description:
                    "Don't worry. Your progress is being saved automatically. Reconnect to continue normally.",
                placement: "topRight",
                duration: 0,
            });
        };
        const handleOnline = () => {
            setIsOffline(false);
            notification.success({
                key: "net-status",
                message: "✅ Connection Restored",
                description: "Your assessment session continues normally.",
                placement: "topRight",
                duration: 3,
            });
        };
        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);
        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 60);
        return () => clearTimeout(t);
    }, []);

    // Add interpretation to each question dynamically
    const questionsWithInterpretation = questions.map((question, index) => ({
        ...question,
        interpretation: {
            1: "Very often / Very well",
            2: "Often / Well",
            3: "Sometimes / Moderately",
            4: "Rarely / Poorly",
            5: "Very rarely / Very poorly",
        },
        category: "Workplace Wellness",
        sequence: index + 1,
    }));

    // ============ THEME SYNC (shared with FormLogin) ============
    // Uses the same useAppTheme hook as FormLogin so this page can never
    // drift out of sync with what was actually saved (cookie + secureLocalStorage
    // + BroadcastChannel, all handled centrally by the hook).
    const { theme: currentTheme, setTheme: setCurrentTheme } = useAppTheme();
    // ============ END THEME SYNC ============

    // Pagination logic
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questionsWithInterpretation.slice(
        indexOfFirstQuestion,
        indexOfLastQuestion,
    );

    const totalPages = Math.ceil(
        questionsWithInterpretation.length / questionsPerPage,
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setVisitedQuestions((prev) => {
            const next = new Set([...prev, page]);
            saveQuizProgress({
                currentPage: page,
                visitedQuestions: Array.from(next),
            });
            return next;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleRateChange = (questionId, value) => {
        setAnswers((prev) => {
            const next = { ...prev, [questionId]: value };
            saveQuizProgress({ answers: next });
            return next;
        });
    };

    // ===== Resume modal handlers =====
    const handleContinueAssessment = () => {
        const saved = pendingResumeRef.current;
        if (saved) {
            try {
                setAnswers(saved.answers || {});
                setCurrentPage(saved.currentPage || 1);
                setVisitedQuestions(
                    new Set(
                        Array.isArray(saved.visitedQuestions)
                            ? saved.visitedQuestions
                            : [saved.currentPage || 1],
                    ),
                );
                setTimeSpent(
                    Number.isFinite(saved.timeSpent) ? saved.timeSpent : 0,
                );
            } catch (_) {}
        }
        pendingResumeRef.current = null;
        setShowResumeModal(false);
        setProgressChecked(true);
        notification.success({
            message: "Assessment Resumed",
            description: "Your previous progress has been restored.",
            placement: "topRight",
            duration: 3,
        });
    };

    const handleStartNewAssessment = () => {
        try {
            secureLocalStorage.removeItem(STORAGE_KEY);
            secureLocalStorage.removeItem("imageQuizProgress");
        } catch (_) {}
        setAnswers({});
        setCurrentPage(1);
        setVisitedQuestions(new Set([1]));
        setTimeSpent(0);
        pendingResumeRef.current = null;
        setShowResumeModal(false);
        setProgressChecked(true);
    };

    return {
        isLoadingQuizzes,
        currentQuiz,
        answers,
        setIsQuizCompleted,
        timeSpent,
        isSubmitting,
        setIsSubmitting,
        currentPage,
        questionsPerPage,
        revealed,
        timeExpired,
        expiryCountdown,
        isOffline,
        showResumeModal,
        questionsWithInterpretation,
        currentTheme,
        setCurrentTheme,
        currentQuestions,
        totalPages,
        handleNext,
        handlePrevious,
        handleRateChange,
        handleContinueAssessment,
        handleStartNewAssessment,
    };
}
