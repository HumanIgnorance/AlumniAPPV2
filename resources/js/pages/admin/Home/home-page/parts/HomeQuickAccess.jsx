import { RocketOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Card } from "antd";
import React from "react";
import { Title, Text } from "~/pages/admin/Home/home-page/parts/homeShared";
import { useHomeContext } from "~/pages/admin/Home/home-page/HomeContext";

export default function HomeQuickAccess() {
    const { quickLinks } = useHomeContext();

    return (
        <div className="hp-section">
            <div className="hp-section-header">
                <Title level={5} className="hp-section-title">
                    <RocketOutlined /> Quick Access
                </Title>
            </div>
            <div className="hp-quick-grid">
                {quickLinks.map((item) => (
                    <Link
                        key={item.key}
                        to={item.url}
                        className="hp-quick-link"
                    >
                        <Card
                            className="hp-quick-card"
                            bordered={false}
                            hoverable
                        >
                            <div
                                className="hp-quick-icon-wrap"
                                style={{
                                    background: `linear-gradient(135deg, ${item.color}26, ${item.color}10)`,
                                    boxShadow: `0 6px 16px ${item.color}26`,
                                }}
                            >
                                <span
                                    style={{
                                        color: item.color,
                                        fontSize: 22,
                                    }}
                                >
                                    {item.icon}
                                </span>
                            </div>
                            <Text strong className="hp-quick-label">
                                {item.label}
                            </Text>
                            <Text className="hp-quick-desc">
                                {item.description}
                            </Text>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
