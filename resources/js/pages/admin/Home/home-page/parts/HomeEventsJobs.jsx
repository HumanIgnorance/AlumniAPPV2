import { Card, Badge, Button, Spin } from "antd";
import {
    CalendarOutlined,
    ArrowRightOutlined,
    SolutionOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import { Link } from "react-router-dom";
import React from "react";
import {
    Text,
    EventRow,
    JobRow,
} from "~/pages/admin/Home/home-page/parts/homeShared";
import { AchievementsPanel } from "~/pages/admin/Home/home-page/parts/AchievementsPanel";
import { useHomeContext } from "~/pages/admin/Home/home-page/HomeContext";

export default function HomeEventsJobs() {
    const {
        recentEvents,
        eventsLoading,
        recentJobs,
        jobsLoading,
        isAlumni,
        myQuizResults,
        quizLoading,
    } = useHomeContext();

    return (
        <div className="hp-section hp-bottom-row">
            <div className="hp-panels-grid">
                {/* Upcoming Events */}
                <Card
                    className="hp-panel-card"
                    bordered={false}
                    title={
                        <div className="hp-panel-title">
                            <CalendarOutlined
                                style={{ color: COLORS.antdGreen }}
                            />
                            <span>Upcoming Events</span>
                            {recentEvents.length > 0 && (
                                <Badge
                                    count={recentEvents.length}
                                    style={{
                                        backgroundColor: COLORS.antdGreen,
                                        marginLeft: 6,
                                    }}
                                />
                            )}
                        </div>
                    }
                    extra={
                        <Link to="/events">
                            <Button
                                type="link"
                                size="small"
                                icon={<ArrowRightOutlined />}
                            >
                                View All
                            </Button>
                        </Link>
                    }
                >
                    {eventsLoading ? (
                        <div className="hp-panel-loading">
                            <Spin size="small" />
                        </div>
                    ) : recentEvents.length === 0 ? (
                        <div className="hp-panel-empty">
                            <CalendarOutlined className="hp-panel-empty-icon" />
                            <Text type="secondary">
                                No upcoming events yet.
                            </Text>
                            <Link to="/events">
                                <Button
                                    size="small"
                                    type="dashed"
                                    style={{ marginTop: 8 }}
                                >
                                    Browse Events
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="hp-event-list">
                            {recentEvents.map((e) => (
                                <EventRow
                                    key={e.id || e.event_id || e.title}
                                    event={e}
                                />
                            ))}
                        </div>
                    )}
                </Card>

                {/* Latest Job Posts */}
                <Card
                    className="hp-panel-card"
                    bordered={false}
                    title={
                        <div className="hp-panel-title">
                            <SolutionOutlined
                                style={{ color: COLORS.antdOrange }}
                            />
                            <span>Latest Job Posts</span>
                            {recentJobs.length > 0 && (
                                <Badge
                                    count={recentJobs.length}
                                    style={{
                                        backgroundColor: COLORS.antdOrange,
                                        marginLeft: 6,
                                    }}
                                />
                            )}
                        </div>
                    }
                    extra={
                        <Link to="/job-posts">
                            <Button
                                type="link"
                                size="small"
                                icon={<ArrowRightOutlined />}
                            >
                                View All
                            </Button>
                        </Link>
                    }
                >
                    {jobsLoading ? (
                        <div className="hp-panel-loading">
                            <Spin size="small" />
                        </div>
                    ) : recentJobs.length === 0 ? (
                        <div className="hp-panel-empty">
                            <SolutionOutlined className="hp-panel-empty-icon" />
                            <Text type="secondary">
                                No job posts available right now.
                            </Text>
                            <Link to="/job-posts">
                                <Button
                                    size="small"
                                    type="dashed"
                                    style={{ marginTop: 8 }}
                                >
                                    Browse Jobs
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="hp-job-list">
                            {recentJobs.map((j) => (
                                <JobRow
                                    key={j.id || j.job_id || j.job_title}
                                    job={j}
                                />
                            ))}
                        </div>
                    )}
                </Card>

                {/* Achievements (alumni only) */}
                {isAlumni && (
                    <AchievementsPanel
                        results={myQuizResults}
                        loading={quizLoading}
                    />
                )}
            </div>
        </div>
    );
}
