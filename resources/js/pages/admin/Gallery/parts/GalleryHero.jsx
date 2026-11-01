import React from "react";
import {
    CalendarOutlined,
    CloseCircleOutlined,
    CloudUploadOutlined,
    FileImageOutlined,
    PictureOutlined,
    SelectOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Statistic, Tag, Typography } from "antd";
import logo from "~/assets/images/OCC_LOGO.png";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";

const { Title, Paragraph } = Typography;

export default function GalleryHero() {
    const {
        isAdmin,
        galleries,
        selectionMode,
        toggleSelectionMode,
        setUploadModalVisible,
        statistics,
    } = useGalleryContext();

    return (
        <section className="gal-hero">
            <div className="gal-hero__bg">
                <span className="gal-blob gal-blob-1" />
                <span className="gal-blob gal-blob-2" />
                <span className="gal-blob gal-blob-3" />
                <div className="gal-hero__grid" />
            </div>

            <div className="gal-hero__content">
                <div className="gal-hero__brand">
                    <img src={logo} alt="OCC Logo" className="gal-hero__logo" />
                    <div className="gal-hero__brand-meta">
                        <Tag className="gal-chip">ALUMNI GALLERY</Tag>
                        <span className="gal-hero__eyebrow">
                            Memories, captured & shared
                        </span>
                    </div>
                </div>

                <Title className="gal-hero__title">
                    Alumni <span className="grad-text">Photo Library</span>
                </Title>
                <Paragraph className="gal-hero__lead">
                    {isAdmin
                        ? "Curate and showcase memorable moments. Upload, organize, and manage albums across years and events — everything in one professional workspace."
                        : "Relive memorable moments from events, reunions, and milestones. Browse, preview in high quality, and download photos with a single click."}
                </Paragraph>

                <div className="gal-hero__actions">
                    {galleries.length > 0 && (
                        <Button
                            type={selectionMode ? "primary" : "default"}
                            icon={
                                selectionMode ? (
                                    <CloseCircleOutlined />
                                ) : (
                                    <SelectOutlined />
                                )
                            }
                            onClick={toggleSelectionMode}
                            className={`gal-btn-ghost ${selectionMode ? "is-active" : ""}`}
                            size="large"
                        >
                            {selectionMode ? "Cancel Selection" : "Select Mode"}
                        </Button>
                    )}
                    {isAdmin && (
                        <Button
                            type="primary"
                            icon={<CloudUploadOutlined />}
                            size="large"
                            className="gal-btn-primary"
                            onClick={() => setUploadModalVisible(true)}
                        >
                            Upload Images
                        </Button>
                    )}
                </div>

                {/* Inline hero stats — admin only */}
                {isAdmin && (
                    <Row
                        gutter={[14, 14]}
                        className="gal-hero__stats"
                        justify="center"
                    >
                        <Col xs={24} sm={8}>
                            <div className="gal-stat-card stat-total">
                                <div className="gal-stat-icon">
                                    <PictureOutlined />
                                </div>
                                <div className="gal-stat-body">
                                    <span className="gal-stat-label">
                                        Total Images
                                    </span>
                                    <Statistic
                                        value={statistics.total_images}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={8}>
                            <div className="gal-stat-card stat-size">
                                <div className="gal-stat-icon">
                                    <FileImageOutlined />
                                </div>
                                <div className="gal-stat-body">
                                    <span className="gal-stat-label">
                                        Total Storage
                                    </span>
                                    <Statistic value={statistics.total_size} />
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={8}>
                            <div className="gal-stat-card stat-month">
                                <div className="gal-stat-icon">
                                    <CalendarOutlined />
                                </div>
                                <div className="gal-stat-body">
                                    <span className="gal-stat-label">
                                        This Month
                                    </span>
                                    <Statistic
                                        value={statistics.this_month_uploads}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        </section>
    );
}
