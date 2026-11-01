import React from "react";
import {
    AppstoreOutlined,
    CalendarOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    UndoOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Carousel,
    Checkbox,
    Col,
    Empty,
    Pagination,
    Row,
    Space,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";

const { Title, Text } = Typography;

export default function GalleryGridSection() {
    const {
        hasActiveFilters,
        loading,
        total,
        galleries,
        isAdmin,
        setUploadModalVisible,
        clearFilters,
        getGalleryImages,
        selectionMode,
        selectedImages,
        toggleImageSelection,
        openPreview,
        handleDownloadGallery,
        handleDownload,
        handleEdit,
        handleDelete,
        currentPage,
        pageSize,
        setCurrentPage,
        setPageSize,
    } = useGalleryContext();

    return (
        <section className="gal-section">
            <div className="gal-list-header">
                <div>
                    <Tag className="gal-section-chip gal-section-chip--accent">
                        <AppstoreOutlined /> ALBUMS
                    </Tag>
                    <Title level={3} className="gal-list-title">
                        {hasActiveFilters
                            ? "Filtered Results"
                            : "All Galleries"}
                    </Title>
                    <Text className="gal-list-sub">
                        {loading
                            ? "Loading…"
                            : `${total} album${total === 1 ? "" : "s"} available`}
                    </Text>
                </div>
            </div>

            {/* ============ GALLERY GRID ============ */}
            <div className="gal-grid-container">
                {loading ? null : galleries.length === 0 ? (
                    <Card className="gal-empty-card">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span className="gal-empty-text">
                                    {hasActiveFilters
                                        ? "No galleries match your filters"
                                        : "No galleries yet"}
                                </span>
                            }
                        >
                            {isAdmin && !hasActiveFilters && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setUploadModalVisible(true)}
                                    className="gal-btn-primary-sm"
                                >
                                    Upload First Images
                                </Button>
                            )}
                            {hasActiveFilters && (
                                <Button
                                    icon={<UndoOutlined />}
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </Empty>
                    </Card>
                ) : (
                    <Row gutter={[20, 20]} className="gal-grid">
                        {galleries.map((gallery, index) => {
                            const images = getGalleryImages(gallery);
                            const imageCount = images.length;
                            const cardDelay = `${Math.min(index, 11) * 70}ms`;

                            return (
                                <Col
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={6}
                                    key={gallery.id}
                                >
                                    <Card
                                        className={`gal-image-card ${selectionMode && selectedImages.includes(gallery.id) ? "selected" : ""}`}
                                        style={{ animationDelay: cardDelay }}
                                        cover={
                                            <div
                                                className="gal-image-wrapper"
                                                onClick={() => {
                                                    if (selectionMode) {
                                                        toggleImageSelection(
                                                            gallery.id,
                                                        );
                                                    } else {
                                                        openPreview(gallery, 0);
                                                    }
                                                }}
                                            >
                                                {selectionMode && (
                                                    <div className="gal-selection-checkbox">
                                                        <Checkbox
                                                            checked={selectedImages.includes(
                                                                gallery.id,
                                                            )}
                                                            onChange={() =>
                                                                toggleImageSelection(
                                                                    gallery.id,
                                                                )
                                                            }
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                {imageCount > 1 && (
                                                    <div className="gal-image-count-badge">
                                                        <AppstoreOutlined />
                                                        <span>
                                                            {imageCount}
                                                        </span>
                                                    </div>
                                                )}

                                                {imageCount > 1 ? (
                                                    <Carousel
                                                        autoplay
                                                        dots={false}
                                                        effect="fade"
                                                        autoplaySpeed={3000}
                                                        className="gal-carousel"
                                                    >
                                                        {images.map(
                                                            (
                                                                imgUrl,
                                                                imgIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        imgIndex
                                                                    }
                                                                    className="gal-carousel-slide"
                                                                >
                                                                    <img
                                                                        alt={`${gallery.title} - ${imgIndex + 1}`}
                                                                        src={
                                                                            imgUrl
                                                                        }
                                                                        className="gal-image"
                                                                        loading="lazy"
                                                                    />
                                                                </div>
                                                            ),
                                                        )}
                                                    </Carousel>
                                                ) : (
                                                    <img
                                                        alt={gallery.title}
                                                        src={
                                                            images[0] ||
                                                            gallery.image_url
                                                        }
                                                        className="gal-image"
                                                        loading="lazy"
                                                    />
                                                )}

                                                <div className="gal-image-overlay">
                                                    <EyeOutlined className="gal-view-icon" />
                                                    <span>
                                                        {selectionMode
                                                            ? "Tap to Select"
                                                            : `View ${imageCount > 1 ? `${imageCount} Photos` : "Photo"}`}
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                        actions={[
                                            <Tooltip
                                                title={
                                                    imageCount > 1
                                                        ? "Download All"
                                                        : "Download"
                                                }
                                                key="download"
                                            >
                                                <Button
                                                    type="text"
                                                    icon={<DownloadOutlined />}
                                                    onClick={() =>
                                                        imageCount > 1
                                                            ? handleDownloadGallery(
                                                                  gallery,
                                                              )
                                                            : handleDownload(
                                                                  gallery,
                                                                  0,
                                                              )
                                                    }
                                                    className="gal-action-btn"
                                                />
                                            </Tooltip>,
                                            ...(isAdmin
                                                ? [
                                                      <Tooltip
                                                          title="Edit"
                                                          key="edit"
                                                      >
                                                          <Button
                                                              type="text"
                                                              icon={
                                                                  <EditOutlined />
                                                              }
                                                              onClick={() =>
                                                                  handleEdit(
                                                                      gallery,
                                                                  )
                                                              }
                                                              className="gal-action-btn"
                                                          />
                                                      </Tooltip>,
                                                      <Tooltip
                                                          title="Delete"
                                                          key="delete"
                                                      >
                                                          <Button
                                                              type="text"
                                                              danger
                                                              icon={
                                                                  <DeleteOutlined />
                                                              }
                                                              onClick={() =>
                                                                  handleDelete(
                                                                      gallery,
                                                                  )
                                                              }
                                                              className="gal-action-btn"
                                                          />
                                                      </Tooltip>,
                                                  ]
                                                : []),
                                        ]}
                                    >
                                        <Card.Meta
                                            title={
                                                <Tooltip title={gallery.title}>
                                                    <Text
                                                        ellipsis
                                                        className="gal-card-title"
                                                    >
                                                        {gallery.title}
                                                    </Text>
                                                </Tooltip>
                                            }
                                            description={
                                                <Space
                                                    direction="vertical"
                                                    size={6}
                                                    className="gal-card-meta"
                                                >
                                                    <Text
                                                        type="secondary"
                                                        className="gal-card-date"
                                                    >
                                                        <CalendarOutlined />{" "}
                                                        {gallery.formatted_date}
                                                    </Text>
                                                    <Space wrap size={4}>
                                                        {imageCount > 1 && (
                                                            <Tag className="gal-card-tag tag-photos">
                                                                <AppstoreOutlined />{" "}
                                                                {imageCount}{" "}
                                                                PHOTOS
                                                            </Tag>
                                                        )}
                                                        <Tag className="gal-card-tag tag-type">
                                                            {gallery.file_type?.toUpperCase() ||
                                                                "IMAGE"}
                                                        </Tag>
                                                        <Tag className="gal-card-tag tag-size">
                                                            {
                                                                gallery.formatted_size
                                                            }
                                                        </Tag>
                                                    </Space>
                                                </Space>
                                            }
                                        />
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </div>

            {/* ============ PAGINATION ============ */}
            {!loading && galleries.length > 0 && (
                <div className="gal-pagination">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} galleries`
                        }
                        responsive
                    />
                </div>
            )}
        </section>
    );
}
