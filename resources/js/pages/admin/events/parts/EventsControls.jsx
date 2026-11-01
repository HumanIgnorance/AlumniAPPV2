import React from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Select, Tag } from "antd";
import { ROLES } from "~/config/roles";
import { useEventsContext } from "~/pages/admin/events/EventsContext";
import {
    eventCategories,
    eventTypes,
} from "~/pages/admin/events/parts/eventConstants";

const { Option } = Select;

export default function EventsControls() {
    const { filters, handleFilterChange, role, showCreateModal } =
        useEventsContext();

    return (
        <Card className="controls-card">
            <div className="controls-section">
                <div className="controls-left">
                    <Input
                        placeholder="Search events by title, description, location..."
                        prefix={<SearchOutlined />}
                        value={filters.search}
                        onChange={(e) =>
                            handleFilterChange("search", e.target.value)
                        }
                        style={{ width: 300 }}
                        size="large"
                    />

                    <Select
                        value={filters.eventType}
                        onChange={(value) =>
                            handleFilterChange("eventType", value)
                        }
                        style={{ width: 180 }}
                        placeholder="Event Type"
                    >
                        {eventTypes.map((type) => (
                            <Option key={type.value} value={type.value}>
                                <Tag color={type.color}>{type.label}</Tag>
                            </Option>
                        ))}
                    </Select>

                    <Select
                        value={filters.category}
                        onChange={(value) =>
                            handleFilterChange("category", value)
                        }
                        style={{ width: 200 }}
                        placeholder="Category"
                    >
                        {eventCategories.map((category) => (
                            <Option key={category.value} value={category.value}>
                                {category.label}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="controls-right">
                    {role === ROLES.ADMIN && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showCreateModal}
                            size="large"
                        >
                            Create Event
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
