import React from "react";
import {
    BookOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    StarOutlined,
} from "@ant-design/icons";
import { Badge, Card, Tabs } from "antd";
import { COLORS } from "~/config/theme";
import { useEventsContext } from "~/pages/admin/events/EventsContext";

const { TabPane } = Tabs;

export default function EventsStatusTabs() {
    const { activeTab, setActiveTab, stats } = useEventsContext();

    return (
        <Card className="tabs-card">
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="status-tabs"
            >
                <TabPane
                    tab={
                        <span>
                            <CalendarOutlined />
                            All Events
                            <Badge
                                count={stats.total}
                                style={{
                                    backgroundColor: "var(--accent, #4f46e5)",
                                    marginLeft: 8,
                                }}
                            />
                        </span>
                    }
                    key="all"
                />
                <TabPane
                    tab={
                        <span>
                            <ClockCircleOutlined />
                            Upcoming
                            <Badge
                                count={stats.upcoming}
                                style={{
                                    backgroundColor: "var(--accent, #4f46e5)",
                                    marginLeft: 8,
                                }}
                            />
                        </span>
                    }
                    key="upcoming"
                />
                <TabPane
                    tab={
                        <span>
                            <CheckCircleOutlined />
                            Ongoing
                            <Badge
                                count={stats.ongoing}
                                style={{
                                    backgroundColor: "var(--success, #22c55e)",
                                    marginLeft: 8,
                                }}
                            />
                        </span>
                    }
                    key="ongoing"
                />
                <TabPane
                    tab={
                        <span>
                            <BookOutlined />
                            Completed
                            <Badge
                                count={stats.completed}
                                style={{
                                    backgroundColor: COLORS.antdGray7,
                                    marginLeft: 8,
                                }}
                            />
                        </span>
                    }
                    key="completed"
                />
                <TabPane
                    tab={
                        <span>
                            <StarOutlined />
                            Featured
                            <Badge
                                count={stats.featured}
                                style={{
                                    backgroundColor: "var(--warning, #f59e0b)",
                                    marginLeft: 8,
                                }}
                            />
                        </span>
                    }
                    key="featured"
                />
            </Tabs>
        </Card>
    );
}
