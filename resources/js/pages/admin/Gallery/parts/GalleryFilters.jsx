import React from "react";
import {
    FilterOutlined,
    SearchOutlined,
    UndoOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Input,
    Row,
    Select,
    Space,
    Tag,
    Typography,
} from "antd";
import { useGalleryContext } from "~/pages/admin/Gallery/GalleryContext";

const { Text } = Typography;
const { Option } = Select;

export default function GalleryFilters() {
    const {
        searchText,
        setSearchText,
        fetchGalleries,
        selectedYear,
        setSelectedYear,
        yearOptions,
        selectedMonth,
        setSelectedMonth,
        monthOptions,
        clearFilters,
        hasActiveFilters,
    } = useGalleryContext();

    return (
        <section className="gal-section">
            <Card className="gal-filters-card">
                <div className="gal-filters-head">
                    <Tag className="gal-section-chip">
                        <FilterOutlined /> BROWSE & FILTER
                    </Tag>
                    <Text className="gal-filters-sub">
                        Find an album by title, year, or month
                    </Text>
                </div>
                <Row gutter={[14, 14]} align="middle">
                    <Col xs={24} sm={12} md={10}>
                        <Input
                            placeholder="Search by title..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={fetchGalleries}
                            allowClear
                            className="gal-search-input"
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="Year"
                            value={selectedYear}
                            onChange={setSelectedYear}
                            allowClear
                            className="gal-filter-select"
                            style={{ width: "100%" }}
                        >
                            {yearOptions.map((year) => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="Month"
                            value={selectedMonth}
                            onChange={setSelectedMonth}
                            allowClear
                            className="gal-filter-select"
                            style={{ width: "100%" }}
                        >
                            {monthOptions.map((month) => (
                                <Option key={month.value} value={month.value}>
                                    {month.label}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={6}>
                        <Space wrap className="gal-filter-actions">
                            <Button
                                type="primary"
                                icon={<FilterOutlined />}
                                onClick={fetchGalleries}
                                className="gal-btn-primary-sm"
                            >
                                Apply
                            </Button>
                            <Button
                                onClick={clearFilters}
                                disabled={!hasActiveFilters}
                                icon={<UndoOutlined />}
                            >
                                Reset
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>
        </section>
    );
}
