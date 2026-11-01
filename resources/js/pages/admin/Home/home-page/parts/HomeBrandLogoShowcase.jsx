import { Image, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import siteLogo from "~/assets/images/site-logo.png";
import React from "react";
import {
    Text,
    DEV_TEAM,
    DEPARTMENT_LOGOS,
} from "~/pages/admin/Home/home-page/parts/homeShared";
import { useHomeContext } from "~/pages/admin/Home/home-page/HomeContext";

export default function HomeBrandLogoShowcase() {
    const { showBrandShowcase } = useHomeContext();

    return (
        <div
            className={`hp-brand-toggle-wrap ${showBrandShowcase ? "hp-brand-toggle-wrap--open" : ""}`}
            aria-hidden={!showBrandShowcase}
        >
            <div className="hp-brand-showcase">
                <div className="hp-brand-devteam">
                    <Image.PreviewGroup
                        preview={{
                            rootClassName: "hp-dev-preview-root",
                            imageRender: (originalNode, info) => (
                                <div className="hp-dev-preview-stage">
                                    {originalNode}
                                    <div className="hp-dev-preview-caption">
                                        <Text
                                            strong
                                            className="hp-dev-preview-name"
                                        >
                                            {DEV_TEAM[info?.current]?.name}
                                        </Text>
                                        <Text className="hp-dev-preview-role">
                                            Developer · OCC Alumni Tracing
                                            System
                                        </Text>
                                    </div>
                                </div>
                            ),
                        }}
                    >
                        {DEV_TEAM.map((dev, i) => (
                            <Tooltip
                                key={dev.key}
                                title={`${dev.name} · Click to view`}
                            >
                                <div
                                    className={`hp-dev-avatar hp-dev-avatar--${i + 1}`}
                                >
                                    <Image
                                        src={dev.logo}
                                        alt={dev.name}
                                        rootClassName="hp-dev-avatar-image"
                                        preview={{
                                            mask: (
                                                <EyeOutlined
                                                    style={{
                                                        fontSize: 16,
                                                    }}
                                                />
                                            ),
                                        }}
                                    />
                                </div>
                            </Tooltip>
                        ))}
                    </Image.PreviewGroup>
                    <span className="hp-dev-label">Built by OCC Dev</span>
                </div>

                <div className="hp-brand-track">
                    {DEPARTMENT_LOGOS.slice(0, 2).map((dept, i) => (
                        <Tooltip key={dept.key} title={dept.full}>
                            <div
                                className="hp-brand-badge"
                                tabIndex={0}
                                style={{
                                    "--accent": dept.accent,
                                    "--i": i,
                                }}
                            >
                                <img src={dept.logo} alt={dept.full} />
                                <span className="hp-brand-badge-tag">
                                    {dept.tag}
                                </span>
                            </div>
                        </Tooltip>
                    ))}

                    <div className="hp-brand-center">
                        {/* <div className="hp-brand-center-ring" /> */}
                        <div className="hp-brand-center-glow" />
                        <img
                            src={siteLogo}
                            alt="Opol Community College"
                            className="hp-brand-center-img"
                        />
                    </div>

                    {DEPARTMENT_LOGOS.slice(2).map((dept, i) => (
                        <Tooltip key={dept.key} title={dept.full}>
                            <div
                                className="hp-brand-badge"
                                tabIndex={0}
                                style={{
                                    "--accent": dept.accent,
                                    "--i": i + 2,
                                }}
                            >
                                <img src={dept.logo} alt={dept.full} />
                                <span className="hp-brand-badge-tag">
                                    {dept.tag}
                                </span>
                            </div>
                        </Tooltip>
                    ))}
                </div>

                <Text className="hp-brand-caption">Opol Community College</Text>
            </div>
        </div>
    );
}
