import { Card, Skeleton, Badge, Tooltip, Progress } from "antd";
import {
    SafetyCertificateOutlined,
    TrophyOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import moment from "moment";
import React from "react";
import {
    Text,
    getQuizMeta,
    getQuizScore,
} from "~/pages/admin/Home/home-page/parts/homeShared";

/* ── Achievements panel (alumni only) ────────────────────────────────────── */
export const AchievementsPanel = ({ results, loading }) => {
    if (loading) {
        return (
            <Card className="hp-panel-card" bordered={false}>
                <Skeleton active avatar paragraph={{ rows: 1 }} />
                <Skeleton
                    active
                    avatar
                    paragraph={{ rows: 1 }}
                    style={{ marginTop: 16 }}
                />
            </Card>
        );
    }
    return (
        <Card
            className="hp-panel-card hp-achievement-card"
            bordered={false}
            title={
                <div className="hp-panel-title">
                    <SafetyCertificateOutlined
                        style={{ color: COLORS.antdPurple }}
                    />
                    <span>My Achievements</span>
                    {results.length > 0 && (
                        <Badge
                            count={results.length}
                            style={{
                                backgroundColor: COLORS.antdPurple,
                                marginLeft: 6,
                            }}
                        />
                    )}
                </div>
            }
        >
            {results.length === 0 ? (
                <div className="hp-panel-empty">
                    <TrophyOutlined className="hp-panel-empty-icon" />
                    <Text type="secondary">
                        Take a quiz to unlock your first achievement.
                    </Text>
                </div>
            ) : (
                <div className="hp-achv-list">
                    {results.slice(0, 4).map((r, i) => {
                        const meta = getQuizMeta(r);
                        const score = getQuizScore(r);
                        const when =
                            r.created_at || r.updated_at || r.submitted_at;
                        return (
                            <div
                                key={r.id || `${r.type}-${i}`}
                                className="hp-achv-row"
                            >
                                <div
                                    className="hp-achv-icon"
                                    style={{
                                        background: `${meta.color}1a`,
                                        color: meta.color,
                                    }}
                                >
                                    {meta.icon}
                                </div>
                                <div className="hp-achv-info">
                                    <Text strong className="hp-achv-title">
                                        {meta.label}
                                    </Text>
                                    <div className="hp-achv-meta">
                                        {when && (
                                            <span>
                                                {moment(when).format(
                                                    "MMM D, YYYY",
                                                )}
                                            </span>
                                        )}
                                        {when && score != null && (
                                            <span className="hp-dot">·</span>
                                        )}
                                        {score != null && (
                                            <span>Score {score}%</span>
                                        )}
                                    </div>
                                </div>
                                {score != null ? (
                                    <Tooltip title={`${score}%`}>
                                        <Progress
                                            type="circle"
                                            percent={score}
                                            size={40}
                                            strokeWidth={10}
                                            strokeColor={meta.color}
                                            format={() => (
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        color: meta.color,
                                                    }}
                                                >
                                                    {score}
                                                </span>
                                            )}
                                        />
                                    </Tooltip>
                                ) : (
                                    <CheckCircleOutlined
                                        style={{
                                            color: COLORS.antdGreen,
                                            fontSize: 22,
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};
