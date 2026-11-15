import {
    TeamOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    SolutionOutlined,
    NotificationOutlined,
    BarChartOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import React from "react";
import { StatCard } from "~/pages/admin/Home/home-page/parts/homeShared";
import { useHomeContext } from "~/pages/admin/Home/home-page/HomeContext";

export default function HomeStats() {
    const {
        stats,
        alumniLoading,
        eventsTotal,
        eventsLoading,
        jobsTotal,
        jobsLoading,
        announcementsTotal,
        announcementsLoading,
        isAdmin,
        quizResults,
        quizLoading,
        isAlumni,
        myQuizResults,
    } = useHomeContext();

    return (
        <div className="hp-section">
            <div className="hp-stats-grid">
                <StatCard
                    icon={<TeamOutlined />}
                    value={stats.totalAlumni.toLocaleString()}
                    label="Total Alumni"
                    color={COLORS.antdBlue}
                    loading={alumniLoading}
                />
                <StatCard
                    icon={<CheckCircleOutlined />}
                    value={stats.employed.toLocaleString()}
                    label="Employed"
                    color={COLORS.antdGreen}
                    loading={alumniLoading}
                />
                <StatCard
                    icon={<CalendarOutlined />}
                    value={eventsTotal.toLocaleString()}
                    label="Events"
                    color={COLORS.antdOrange}
                    loading={eventsLoading}
                />
                <StatCard
                    icon={<SolutionOutlined />}
                    value={jobsTotal.toLocaleString()}
                    label="Job Openings"
                    color={COLORS.antdPurple}
                    loading={jobsLoading}
                />
                <StatCard
                    icon={<NotificationOutlined />}
                    value={announcementsTotal.toLocaleString()}
                    label="Announcements"
                    color={COLORS.antdRed}
                    loading={announcementsLoading}
                />
                {isAdmin && (
                    <StatCard
                        icon={<BarChartOutlined />}
                        value={(Array.isArray(quizResults)
                            ? quizResults.length
                            : 0
                        ).toLocaleString()}
                        label="Quiz Submissions"
                        color={COLORS.antdCyan}
                        loading={quizLoading}
                    />
                )}
                {isAlumni && (
                    <StatCard
                        icon={<SafetyCertificateOutlined />}
                        value={myQuizResults.length.toLocaleString()}
                        label="My Quizzes Taken"
                        color={COLORS.antdCyan}
                        loading={quizLoading}
                    />
                )}
            </div>
        </div>
    );
}
