import React from "react";
import {
    BookOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { Tag, Typography } from "antd";
import logo from "~/assets/images/OCC_LOGO.png";
import { ROLES } from "~/config/roles";
import { useEventsContext } from "~/pages/admin/events/EventsContext";

const { Text, Title, Paragraph } = Typography;

export default function EventsHero() {
    const { role, stats } = useEventsContext();

    return (
        <section className="ae-hero">
            <div className="ae-hero__bg" aria-hidden>
                <span className="blob blob-1" />
                <span className="blob blob-2" />
                <span className="blob blob-3" />
                <div className="dot-grid" />
            </div>

            <div className="ae-hero__content">
                <div className="ae-hero__brand">
                    <img src={logo} alt="OCC Logo" className="ae-hero__logo" />
                    <div className="ae-hero__brand-meta">
                        <Tag className="ae-chip" icon={<CalendarOutlined />}>
                            EVENTS HUB
                        </Tag>
                        <Text className="ae-hero__eyebrow">
                            Alumni Tracing Management System
                        </Text>
                    </div>
                </div>

                <Title className="ae-hero__title">
                    Alumni Events &amp;{" "}
                    <span className="grad-text">Networking</span>
                </Title>

                <Paragraph className="ae-hero__lead">
                    {role === ROLES.ADMIN
                        ? "Manage alumni events, oversee registrations, and foster community engagement through reunions, networking sessions, and special gatherings."
                        : "Reconnect with alumni, register for upcoming events, or host your own. Strengthen your network through reunions, career opportunities, and community activities."}
                </Paragraph>

                <div className="ae-hero__stats">
                    <div className="ae-stat">
                        <span className="ae-stat__icon">
                            <CalendarOutlined />
                        </span>
                        <div className="ae-stat__body">
                            <span className="ae-stat__value">
                                {stats.total}
                            </span>
                            <span className="ae-stat__label">Total Events</span>
                        </div>
                    </div>
                    <div className="ae-stat">
                        <span className="ae-stat__icon ae-stat__icon--blue">
                            <ClockCircleOutlined />
                        </span>
                        <div className="ae-stat__body">
                            <span className="ae-stat__value">
                                {stats.upcoming}
                            </span>
                            <span className="ae-stat__label">Upcoming</span>
                        </div>
                    </div>
                    <div className="ae-stat">
                        <span className="ae-stat__icon ae-stat__icon--green">
                            <CheckCircleOutlined />
                        </span>
                        <div className="ae-stat__body">
                            <span className="ae-stat__value">
                                {stats.ongoing}
                            </span>
                            <span className="ae-stat__label">Ongoing</span>
                        </div>
                    </div>
                    <div className="ae-stat">
                        <span className="ae-stat__icon ae-stat__icon--gray">
                            <BookOutlined />
                        </span>
                        <div className="ae-stat__body">
                            <span className="ae-stat__value">
                                {stats.completed}
                            </span>
                            <span className="ae-stat__label">Completed</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
