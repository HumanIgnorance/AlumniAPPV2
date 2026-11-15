import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Spin, message } from "antd";
import axiosConfig from "~/utils/axiosConfig";
import { ROLES, ROLE_HOME } from "~/config/roles";

/**
 * Gate for the one-time alumni assessments (/answer-question, /image-quiz).
 *
 * Decides ONCE on mount (so the results screen that stays visible right after
 * a successful submit is never yanked away):
 *   - not signed in            -> /login
 *   - admin / department head  -> their own home (these pages are alumni-only)
 *   - alumnus who already
 *     submitted this quiz type -> /home
 *   - otherwise                -> render the quiz
 *
 * This is UX only. The server is the real gate: POST /save-alumni-quiz
 * rejects non-alumni (403) and repeat submissions (409). If the profile
 * request fails for a non-auth reason (offline, 5xx) we render the page and
 * let the server decide.
 */
export default function QuizRouteGuard({ quizType, children }) {
    const [state, setState] = useState({ status: "checking", to: null });

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const { data } = await axiosConfig.get("/profile");
                if (cancelled) return;

                if (data?.role !== ROLES.ALUMNI) {
                    setState({
                        status: "redirect",
                        to: ROLE_HOME[data?.role] || "/",
                    });
                    return;
                }

                const alreadyDone =
                    Array.isArray(data.alumni_quizzes) &&
                    data.alumni_quizzes.some((q) => q.type === quizType);

                if (alreadyDone) {
                    message.info("You have already completed this quiz.");
                    setState({ status: "redirect", to: "/home" });
                    return;
                }

                setState({ status: "allowed", to: null });
            } catch (error) {
                if (cancelled) return;
                if (error?.response?.status === 401) {
                    setState({ status: "redirect", to: "/login" });
                } else {
                    setState({ status: "allowed", to: null });
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [quizType]);

    if (state.status === "redirect") {
        return <Redirect to={state.to} />;
    }

    if (state.status === "checking") {
        return (
            <div className="app-page-fallback" role="status" aria-label="Loading">
                <Spin size="large" />
            </div>
        );
    }

    return children;
}
