import { Tag } from "antd";
import {
    CrownOutlined,
    StarOutlined,
    CalendarOutlined,
    DownOutlined,
} from "@ant-design/icons";
import moment from "moment";
import React from "react";
import {
    Text,
    getGreeting,
    Title,
    Paragraph,
} from "~/pages/admin/Home/home-page/parts/homeShared";
import { WeatherWidget } from "~/pages/admin/Home/home-page/parts/WeatherWidget";
import { useHomeContext } from "~/pages/admin/Home/home-page/HomeContext";

export default function HomeHero() {
    const {
        isAdmin,
        firstName,
        heroTagline,
        showBrandShowcase,
        setShowBrandShowcase,
        roleBadge,
        weather,
        weatherLoading,
    } = useHomeContext();

    return (
        <div
            className={`hp-hero ${isAdmin ? "hp-hero--admin" : "hp-hero--alumni"}`}
        >
            <div className="hp-hero-bg-shape" />
            <div className="hp-hero-bg-shape hp-hero-bg-shape-2" />
            <div className="hp-hero-grid-overlay" />
            <div className="hp-hero-content">
                <div className="hp-hero-left">
                    <Tag className="hp-hero-chip">
                        {isAdmin ? (
                            <>
                                <CrownOutlined /> Admin Console
                            </>
                        ) : (
                            <>
                                <StarOutlined /> Alumni Portal
                            </>
                        )}
                    </Tag>
                    <div className="hp-greeting-row">
                        <Text className="hp-greeting-text">
                            {getGreeting()},
                        </Text>
                        <Title level={2} className="hp-greeting-name">
                            {firstName}
                        </Title>
                        <span className="hp-greeting-wave">👋</span>
                    </div>
                    <div className="hp-date-row">
                        <CalendarOutlined className="hp-date-icon" />
                        <Text className="hp-date-text">
                            {moment().format("dddd, MMMM D, YYYY")}
                        </Text>
                    </div>
                    <Paragraph className="hp-hero-tagline">
                        {heroTagline}
                    </Paragraph>
                </div>
                {/* ── HERO RIGHT: role badge + weather/time widget ── */}
                <div className="hp-hero-right">
                    <button
                        type="button"
                        className={`hp-hero-badge hp-hero-badge--toggle ${showBrandShowcase ? "hp-hero-badge--active" : ""}`}
                        onClick={() => setShowBrandShowcase((v) => !v)}
                        aria-expanded={showBrandShowcase}
                        aria-label={
                            showBrandShowcase
                                ? "Hide college logos"
                                : "Show college logos"
                        }
                    >
                        {roleBadge}
                        <DownOutlined
                            className={`hp-hero-badge-chevron ${showBrandShowcase ? "hp-hero-badge-chevron--open" : ""}`}
                        />
                    </button>
                    <WeatherWidget
                        weather={weather}
                        loading={weatherLoading}
                        variant="hero"
                    />
                </div>
            </div>
        </div>
    );
}
