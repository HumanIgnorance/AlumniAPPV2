import React from "react";
import {
    BankOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { Tag, Typography } from "antd";
import logo from "~/assets/images/OCC_LOGO.png";
import { ROLES } from "~/config/roles";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";

const { Text, Title, Paragraph } = Typography;

export default function JobPostHero() {
    const { userRole, statsData } = useJobPostContext();

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
                        <Tag className="ae-chip" icon={<BankOutlined />}>
                            JOB POSTS
                        </Tag>
                        <Text className="ae-hero__eyebrow">
                            Alumni Tracing Management System
                        </Text>
                    </div>
                </div>

                <Title className="ae-hero__title">
                    Job Posts <span className="grad-text">Management</span>
                </Title>

                <Paragraph className="ae-hero__lead">
                    {userRole === ROLES.ADMIN
                        ? "Manage job postings and approve alumni submissions across the platform."
                        : "Browse job opportunities, share career openings, and manage your applications within the alumni community."}
                </Paragraph>

                <div className="ae-hero__stats">
                    <div className="ae-stat">
                        <span className="ae-stat__icon">
                            <TeamOutlined />
                        </span>
                        <div className="ae-stat__body">
                            <span className="ae-stat__value">
                                {statsData.total}
                            </span>
                            <span className="ae-stat__label">Total Posts</span>
                        </div>
                    </div>
                    <div className="ae-stat">
                        <span className="ae-stat__icon ae-stat__icon--blue">
                            <ClockCircleOutlined />
                        </span>
                        <div className="ae-stat__body">
                            <span className="ae-stat__value">
                                {statsData.pending}
                            </span>
                            <span className="ae-stat__label">Pending</span>
                        </div>
                    </div>
                    <div className="ae-stat">
                        <span className="ae-stat__icon ae-stat__icon--green">
                            <CheckCircleOutlined />
                        </span>
                        <div className="ae-stat__body">
                            <span className="ae-stat__value">
                                {statsData.approved}
                            </span>
                            <span className="ae-stat__label">Approved</span>
                        </div>
                    </div>
                    <div className="ae-stat">
                        <span className="ae-stat__icon ae-stat__icon--gray">
                            <WarningOutlined />
                        </span>
                        <div className="ae-stat__body">
                            <span className="ae-stat__value">
                                {statsData.fullOrExpired}
                            </span>
                            <span className="ae-stat__label">
                                Full / Expired
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
