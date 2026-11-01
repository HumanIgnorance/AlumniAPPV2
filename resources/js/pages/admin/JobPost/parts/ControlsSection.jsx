import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Select } from "antd";
import { ROLES } from "~/config/roles";
import { COLORS } from "~/config/theme";
import {
    jobTypeOptions,
    sortOptions,
    statusOptions,
} from "~/pages/admin/JobPost/parts/jobPostConstants";

// ============ STABLE CONTROLS SECTION (PREVENTS INPUT FLICKER) ============
export const ControlsSection = ({
    searchText,
    setSearchText,
    filterJobType,
    setFilterJobType,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    userRole,
    form,
    setEditingPost,
    setFileList,
    setIsModalVisible,
}) => (
    <Card className="controls-card">
        <div className="controls-section">
            <div className="controls-left">
                <Input
                    placeholder="Search jobs, companies, locations..."
                    prefix={<SearchOutlined style={{ color: COLORS.bfbfbf }} />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    style={{ width: 300 }}
                />
                <Select
                    value={filterJobType}
                    onChange={setFilterJobType}
                    style={{ width: 180 }}
                    options={jobTypeOptions}
                />
                {userRole === ROLES.ADMIN && (
                    <Select
                        value={filterStatus}
                        onChange={setFilterStatus}
                        style={{ width: 160 }}
                        options={statusOptions}
                    />
                )}
            </div>

            <div className="controls-right">
                <Select
                    value={sortBy}
                    onChange={setSortBy}
                    style={{ width: 200 }}
                    options={sortOptions}
                />
                {userRole === ROLES.ADMIN && (
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingPost(null);
                            form.resetFields();
                            setFileList([]);
                            setIsModalVisible(true);
                        }}
                    >
                        Create Job Post
                    </Button>
                )}
            </div>
        </div>
    </Card>
);
