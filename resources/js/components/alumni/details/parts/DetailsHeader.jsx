import React from "react";
import {
    EnvironmentOutlined,
    EyeOutlined,
    MailOutlined,
    PhoneOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Col, Row, Typography } from "antd";
import logo from "~/assets/images/OCC_LOGO.png";
import { useAlumniDetailsContext } from "~/components/alumni/details/AlumniDetailsContext";

const { Title, Text } = Typography;

export default function DetailsHeader() {
    const {
        isBSIT,
        headerThemeStyle,
        localProfileImage,
        getData,
        handleImageZoom,
        verifiedPillText,
        formatName,
    } = useAlumniDetailsContext();

    return (
        <div
            className={`preview-header preview-header--modern preview-header--occ${isBSIT ? " preview-header--bsit" : ""}`}
            style={headerThemeStyle}
        >
            <div className="preview-header__shape preview-header__shape--a" />
            <div className="preview-header__shape preview-header__shape--b" />
            <div className="preview-header__sash" aria-hidden="true" />
            <span
                className="header-toga-line header-toga-line--l"
                aria-hidden="true"
            />
            <span
                className="header-toga-line header-toga-line--r"
                aria-hidden="true"
            />

            {/* Floating OCC emblem badge */}
            <div className="occ-emblem-badge">
                <img
                    src={logo}
                    alt="OCC Logo"
                    className="occ-emblem-badge__logo"
                />
                <div className="occ-emblem-badge__text">
                    <span className="occ-emblem-badge__title">OCC ALUMNI</span>
                    <span className="occ-emblem-badge__sub">
                        Verified Graduate
                    </span>
                </div>
            </div>

            <div className="preview-profile-section">
                <div className="profile-image-container">
                    {/* OCC Profile Card (geometric background + circular avatar) */}
                    <div className="occ-profile-card">
                        <div
                            className="occ-profile-card__bg"
                            aria-hidden="true"
                        >
                            <span className="occ-profile-card__shape occ-profile-card__shape--1" />
                            <span className="occ-profile-card__shape occ-profile-card__shape--2" />
                            <span className="occ-profile-card__shape occ-profile-card__shape--3" />
                        </div>

                        <div className="occ-profile-card__avatar">
                            {localProfileImage || getData("profileImage") ? (
                                <div className="profile-image-wrapper">
                                    <img
                                        src={
                                            localProfileImage ||
                                            getData("profileImage")
                                        }
                                        alt="Profile"
                                        className="preview-profile-img"
                                    />
                                    <div
                                        className="image-zoom-overlay"
                                        onClick={() =>
                                            handleImageZoom(
                                                localProfileImage ||
                                                    getData("profileImage"),
                                            )
                                        }
                                    >
                                        <EyeOutlined />
                                        <span>Click to Zoom</span>
                                    </div>
                                </div>
                            ) : (
                                <Avatar
                                    size={128}
                                    icon={<UserOutlined />}
                                    className="default-avatar"
                                />
                            )}
                            <span
                                className="profile-status-dot"
                                title="Active"
                            />
                        </div>
                    </div>
                </div>

                <div className="profile-info">
                    <div className="preview-verified-pill">
                        <SafetyCertificateOutlined />
                        <span>{verifiedPillText}</span>
                    </div>
                    <Title level={2} className="preview-name">
                        {formatName()}
                    </Title>
                    <Text className="preview-title">
                        {getData("job_title") || "Alumni"}
                        {getData("current_company") &&
                            ` \u00b7 ${getData("current_company")}`}
                    </Text>

                    {/* <div className="profile-info__eyebrow">
                                           <SafetyCertificateOutlined />
                                           <span>VERIFIED OCC ALUMNI</span>
                                       </div>
                                        */}

                    <div className="preview-contact-info">
                        <Row gutter={[12, 12]}>
                            {getData("email") && (
                                <Col xs={24} sm={12} md={8}>
                                    <div className="contact-item contact-item--chip">
                                        <span className="contact-icon-wrap">
                                            <MailOutlined className="contact-icon" />
                                        </span>
                                        <div className="contact-details">
                                            <Text className="contact-label">
                                                Email
                                            </Text>
                                            <Text
                                                className="contact-value"
                                                ellipsis={{
                                                    tooltip: getData("email"),
                                                }}
                                            >
                                                {getData("email")}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                            )}
                            {getData("phone") && (
                                <Col xs={24} sm={12} md={8}>
                                    <div className="contact-item contact-item--chip">
                                        <span className="contact-icon-wrap">
                                            <PhoneOutlined className="contact-icon" />
                                        </span>
                                        <div className="contact-details">
                                            <Text className="contact-label">
                                                Phone
                                            </Text>
                                            <Text
                                                className="contact-value"
                                                ellipsis={{
                                                    tooltip: getData("phone"),
                                                }}
                                            >
                                                {getData("phone")}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                            )}
                            {getData("address") && (
                                <Col xs={24} sm={12} md={8}>
                                    <div className="contact-item contact-item--chip">
                                        <span className="contact-icon-wrap">
                                            <EnvironmentOutlined className="contact-icon" />
                                        </span>
                                        <div className="contact-details">
                                            <Text className="contact-label">
                                                Address
                                            </Text>
                                            <Text
                                                className="contact-value"
                                                ellipsis={{
                                                    tooltip: getData("address"),
                                                }}
                                            >
                                                {getData("address")}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
}
