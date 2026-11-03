import useTakeQuiz from "~/hooks/useTakeQuiz";
import { INSPECT_PROTECTION_ENABLED } from "~/config/inspect";
import { useState, useRef, useEffect } from "react";
import { buildPageTitle } from "~/config/site";
import { useAppTheme } from "~/hooks/useAppTheme";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEYS } from "~/config/storageKeys";
import { notification } from "antd";
import {
    LOGOUT_COUNTDOWN,
    STORAGE_KEY,
    QUIZ_DURATION,
} from "~/pages/auth/image-quiz-page/parts/imageQuizShared";

export default function useImageQuizLogic1() {
    const {
        isLoading: isLoadingQuizzes,
        data: questions = [],
        isFetching: isFetchingQuizzes,
        refetch: refetchQuizzes,
    } = useTakeQuiz("abcd");

    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState({});
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
        document.title = buildPageTitle("Image Quiz");
    }, []);

    //  Prevent //
    useEffect(() => {
        if (!INSPECT_PROTECTION_ENABLED) return undefined;

        const disableContextMenu = (e) => {
            e.preventDefault();
        };

        document.addEventListener("contextmenu", disableContextMenu);

        return () => {
            document.removeEventListener("contextmenu", disableContextMenu);
        };
    }, []);

    useEffect(() => {
        if (!INSPECT_PROTECTION_ENABLED) return undefined;

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

    // ============ THEME SYNC (shared with FormLogin) ============
    // Uses the same useAppTheme hook as FormLogin so this page can never
    // drift out of sync with what was actually saved (cookie + secureLocalStorage
    // + BroadcastChannel, all handled centrally by the hook).
    const { theme: currentTheme, setTheme: setCurrentTheme } = useAppTheme();
    // ============ END THEME SYNC ============

    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 60);
        return () => clearTimeout(t);
    }, []);

    // ===== Load saved progress on mount (Resume Assessment) =====
    useEffect(() => {
        try {
            const raw = secureLocalStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.quizType === "image") {
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

    // Transform API data to match expected format
    useEffect(() => {
        if (questions && questions.length > 0) {
            const transformedQuiz = {
                id: 2,
                title: "Visual Personality & Preference Assessment",
                description:
                    "Discover your personality traits through image selection and visual preferences",
                questions: questions.map((q, index) => ({
                    id: q.id,
                    type: q.type,
                    question: q.question,
                    description: q.description,
                    required: q.required,
                    category: "Visual Assessment",
                    options: q.choices.map((choice, choiceIndex) => ({
                        id: `${q.id}_${choice.letter}`,
                        image: choice.image,
                        label: choice.letter,
                        value: choice.letter.toLowerCase(),
                        interpretation: choice.interpretation,
                    })),
                })),
                createdAt: "2024-01-20",
                estimatedTime: 10,
                category: "Visual Personality Assessment",
            };
            setCurrentQuiz(transformedQuiz);
        }
    }, [questions]);

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
                currentQuestionIndex,
                timeSpent,
                quizType: "image",
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
        currentQuestionIndex,
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
        currentQuestionIndex,
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

    const currentQuestion = currentQuiz?.questions?.[currentQuestionIndex];

    const handleImageSelect = (questionId, optionId) => {
        if (timeExpired) return;
        setAnswers((prev) => {
            const next = { ...prev, [questionId]: optionId };
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
                setCurrentQuestionIndex(
                    Number.isFinite(saved.currentQuestionIndex)
                        ? saved.currentQuestionIndex
                        : 0,
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
            secureLocalStorage.removeItem("answerQuizProgress");
        } catch (_) {}
        setAnswers({});
        setCurrentQuestionIndex(0);
        setTimeSpent(0);
        pendingResumeRef.current = null;
        setShowResumeModal(false);
        setProgressChecked(true);
    };

    const getProgress = () => {
        if (!currentQuiz) return 0;
        const answered = Object.keys(answers).length;
        return Math.floor((answered / currentQuiz.questions.length) * 100);
    };

    const getCompletionStatus = () => {
        if (!currentQuiz)
            return {
                answered: 0,
                total: 0,
                requiredAnswered: 0,
                requiredTotal: 0,
            };
        const requiredQuestions = currentQuiz.questions.filter(
            (q) => q.required,
        );
        const answeredRequired = requiredQuestions.filter(
            (q) => answers[q.id] !== undefined,
        ).length;
        return {
            answered: Object.keys(answers).length,
            total: currentQuiz.questions.length,
            requiredAnswered: answeredRequired,
            requiredTotal: requiredQuestions.length,
        };
    };

    return {
        isLoadingQuizzes,
        currentQuiz,
        answers,
        isQuizCompleted,
        setIsQuizCompleted,
        timeSpent,
        isSubmitting,
        setIsSubmitting,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        setImagesLoaded,
        revealed,
        timeExpired,
        expiryCountdown,
        isOffline,
        showResumeModal,
        currentTheme,
        setCurrentTheme,
        saveQuizProgress,
        currentQuestion,
        handleImageSelect,
        handleContinueAssessment,
        handleStartNewAssessment,
        getProgress,
        getCompletionStatus,
    };
}
