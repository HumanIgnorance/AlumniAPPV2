import React, { useState, useEffect } from "react";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Skeleton, Card } from "antd";
import { COLORS } from "~/config/theme";
import {
    getWeatherIcon,
    toCelsius,
    Text,
} from "~/pages/admin/Home/home-page/parts/homeShared";

/* ── Weather + clock widget (supports default & "hero" variant) ──────────── */
export const WeatherWidget = ({ weather, loading, variant = "default" }) => {
    const [localTime, setLocalTime] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setLocalTime(
                now.toLocaleTimeString("en-PH", {
                    timeZone: "Asia/Manila",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
            );
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    const dateStr = new Date().toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    /* ── Hero variant: glassy pill that sits inside the hero header ── */
    if (variant === "hero") {
        return (
            <div className="hp-hero-weather">
                <div className="hp-hero-weather-block">
                    <div className="hp-hero-weather-location">
                        <EnvironmentOutlined />
                        <span>Opol, Mis. Or.</span>
                    </div>
                    <div className="hp-hero-weather-time">
                        {localTime || "—"}
                    </div>
                    {/* <div className="hp-hero-weather-date">{dateStr}</div> */}
                </div>
                <div className="hp-hero-weather-sep" />
                <div className="hp-hero-weather-block hp-hero-weather-block--right">
                    {loading ? (
                        <Skeleton.Input
                            active
                            size="small"
                            style={{ width: 70 }}
                        />
                    ) : weather ? (
                        <>
                            <div className="hp-hero-weather-icon">
                                {getWeatherIcon(weather.condition_text)}
                            </div>
                            <div className="hp-hero-weather-temp">
                                {toCelsius(weather.temperature)}°C
                            </div>
                            <div className="hp-hero-weather-condition">
                                {weather.condition_text}
                            </div>
                        </>
                    ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            N/A
                        </Text>
                    )}
                </div>
            </div>
        );
    }

    /* ── Default (stat-grid) variant — kept intact for backwards-compat ── */
    return (
        <Card className="hp-stat-card hp-weather-card" bordered={false}>
            <div className="hp-weather-inner">
                <div className="hp-weather-left">
                    <div className="hp-weather-location">
                        <EnvironmentOutlined
                            style={{ color: COLORS.antdBlue, fontSize: 12 }}
                        />
                        <span className="hp-weather-location-label">
                            Opol, Mis. Or.
                        </span>
                    </div>
                    <div className="hp-weather-time">{localTime || "—"}</div>
                    <div className="hp-weather-date">{dateStr}</div>
                </div>
                <div className="hp-weather-divider" />
                <div className="hp-weather-right">
                    {loading ? (
                        <Skeleton.Input
                            active
                            size="small"
                            style={{ width: 70 }}
                        />
                    ) : weather ? (
                        <>
                            <div className="hp-weather-icon">
                                {getWeatherIcon(weather.condition_text)}
                            </div>
                            <span className="hp-weather-temp">
                                {toCelsius(weather.temperature)}°C
                            </span>
                            <span className="hp-weather-condition">
                                {weather.condition_text}
                            </span>
                        </>
                    ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            N/A
                        </Text>
                    )}
                </div>
            </div>
        </Card>
    );
};
