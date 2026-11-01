import React, { useMemo } from "react";
import {
    BankOutlined,
    ClockCircleOutlined,
    FileOutlined,
    PlusOutlined,
    SearchOutlined,
    SendOutlined,
    TeamOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { Button, Card, Space, Tabs, Typography } from "antd";
import { ROLES } from "~/config/roles";
import { COLORS } from "~/config/theme";
import { useJobPostContext } from "~/pages/admin/JobPost/JobPostContext";
import {
    ApplicationsTable,
    PendingApprovalsTable,
} from "~/pages/admin/JobPost/parts/ApprovalTables";
import { ControlsSection } from "~/pages/admin/JobPost/parts/ControlsSection";
import {
    FullOrExpiredGrid,
    JobPostsGrid,
    JobsGrid,
} from "~/pages/admin/JobPost/parts/JobGrids";

const { Title, Paragraph } = Typography;

export default function JobPostTabs() {
    const {
        statsData,
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
        filteredAndSortedJobs,
        currentUser,
        handleViewDetails,
        handleEditPost,
        handleDeletePost,
        handleReviewApplications,
        pendingPosts,
        handleApprovePost,
        handleRejectPost,
        fullOrExpiredPosts,
        handleApplyClick,
        myApplications,
        myPostings,
        handleWithdrawApplication,
        withdrawLoading,
        activeTab,
        setActiveTab,
    } = useJobPostContext();

    // // Controls Section Component
    // const ControlsSection = useCallback(() => (
    //   <Card className="controls-card">
    //     <div className="controls-section">
    //       <div className="controls-left">
    //         <Input
    //           placeholder="Search jobs, companies, locations..."
    //           prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
    //           value={searchText}
    //           onChange={(e) => setSearchText(e.target.value)}
    //           allowClear
    //           style={{ width: 300 }}
    //         />
    //         <Select value={filterJobType} onChange={setFilterJobType} style={{ width: 180 }} options={jobTypeOptions} />
    //         {userRole === "admin" && (
    //           <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 160 }} options={statusOptions} />
    //         )}
    //       </div>

    //       <div className="controls-right">
    //         <Select value={sortBy} onChange={setSortBy} style={{ width: 200 }} options={sortOptions} />
    //         {userRole === "admin" && (
    //           <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => {
    //             setEditingPost(null)
    //             form.resetFields()
    //             setFileList([])
    //             setIsModalVisible(true)
    //           }}>
    //             Create Job Post
    //           </Button>
    //         )}
    //       </div>
    //     </div>
    //   </Card>
    // ), [searchText, filterJobType, filterStatus, sortBy, userRole, form])
    // Admin Tabs Content - SILENT LOADING (removed Spin spinning={loading})
    const adminTabsItems = useMemo(
        () => [
            {
                key: "all-posts",
                label: (
                    <Space>
                        <TeamOutlined />
                        <span>All Posts</span>
                        <span
                            style={{
                                backgroundColor: COLORS.antdBlue,
                                color: COLORS.white,
                                borderRadius: "10px",
                                padding: "2px 8px",
                                fontSize: "12px",
                                fontWeight: 600,
                                marginLeft: "4px",
                                display: "inline-block",
                                minWidth: "20px",
                                textAlign: "center",
                            }}
                        >
                            {statsData.total}
                        </span>
                    </Space>
                ),
                children: (
                    <>
                        <ControlsSection
                            searchText={searchText}
                            setSearchText={setSearchText}
                            filterJobType={filterJobType}
                            setFilterJobType={setFilterJobType}
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            userRole={userRole}
                            form={form}
                            setEditingPost={setEditingPost}
                            setFileList={setFileList}
                            setIsModalVisible={setIsModalVisible}
                        />
                        <JobPostsGrid
                            posts={filteredAndSortedJobs}
                            isAdmin={true}
                            currentUser={currentUser}
                            onViewDetails={handleViewDetails}
                            onEdit={handleEditPost}
                            onDelete={handleDeletePost}
                            onReviewApplications={handleReviewApplications}
                        />
                    </>
                ),
            },
            {
                key: "pending",
                label: (
                    <Space>
                        <ClockCircleOutlined />
                        <span>Pending Approvals</span>
                        {statsData.pending > 0 && (
                            <span
                                style={{
                                    backgroundColor: COLORS.antdOrange,
                                    color: COLORS.white,
                                    borderRadius: "10px",
                                    padding: "2px 8px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    marginLeft: "4px",
                                    display: "inline-block",
                                    minWidth: "20px",
                                    textAlign: "center",
                                }}
                            >
                                {statsData.pending}
                            </span>
                        )}
                    </Space>
                ),
                children: (
                    <PendingApprovalsTable
                        posts={pendingPosts}
                        currentUser={currentUser}
                        onApprove={handleApprovePost}
                        onReject={handleRejectPost}
                        onViewDetails={handleViewDetails}
                    />
                ),
            },
            {
                key: "full-expired",
                label: (
                    <Space>
                        <WarningOutlined />
                        <span>Full/Expired</span>
                        {statsData.fullOrExpired > 0 && (
                            <span
                                style={{
                                    backgroundColor: COLORS.antdRed,
                                    color: COLORS.white,
                                    borderRadius: "10px",
                                    padding: "2px 8px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    marginLeft: "4px",
                                    display: "inline-block",
                                    minWidth: "20px",
                                    textAlign: "center",
                                }}
                            >
                                {statsData.fullOrExpired}
                            </span>
                        )}
                    </Space>
                ),
                children: (
                    <FullOrExpiredGrid
                        posts={fullOrExpiredPosts}
                        isAdmin={true}
                        currentUser={currentUser}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                        onReviewApplications={handleReviewApplications}
                    />
                ),
            },
        ],
        [
            statsData,
            filteredAndSortedJobs,
            currentUser,
            handleViewDetails,
            handleEditPost,
            handleDeletePost,
            handleReviewApplications,
            pendingPosts,
            handleApprovePost,
            handleRejectPost,
            fullOrExpiredPosts,
            searchText,
            filterJobType,
            filterStatus,
            sortBy,
            userRole,
            form,
        ],
    );

    // Alumni Tabs Content - SILENT LOADING (removed Spin spinning={loading})
    const alumniTabsItems = useMemo(
        () => [
            {
                key: "browse",
                label: (
                    <Space>
                        <SearchOutlined />
                        <span>Browse Jobs</span>
                        {statsData.total > 0 && (
                            <span
                                className="tab-count-inline"
                                style={{
                                    backgroundColor: COLORS.antdBlue,
                                    color: COLORS.white,
                                    borderRadius: "10px",
                                    padding: "2px 8px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    marginLeft: "4px",
                                    display: "inline-block",
                                    minWidth: "20px",
                                    textAlign: "center",
                                }}
                            >
                                {statsData.total}
                            </span>
                        )}
                    </Space>
                ),
                children: (
                    <>
                        <ControlsSection
                            searchText={searchText}
                            setSearchText={setSearchText}
                            filterJobType={filterJobType}
                            setFilterJobType={setFilterJobType}
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            userRole={userRole}
                            form={form}
                            setEditingPost={setEditingPost}
                            setFileList={setFileList}
                            setIsModalVisible={setIsModalVisible}
                        />
                        <JobsGrid
                            jobs={filteredAndSortedJobs}
                            currentUser={currentUser}
                            onApply={handleApplyClick}
                            onViewDetails={handleViewDetails}
                            onReviewApplications={handleReviewApplications}
                            myApplications={myApplications}
                        />
                    </>
                ),
            },
            {
                key: "create",
                label: (
                    <Space>
                        <PlusOutlined />
                        <span>Post a Job</span>
                    </Space>
                ),
                children: (
                    <Card className="create-job-card">
                        <div className="create-job-content">
                            <div className="create-job-icon">
                                <BankOutlined
                                    style={{
                                        fontSize: 48,
                                        color: COLORS.brand,
                                    }}
                                />
                            </div>
                            <Title level={4}>Share a Job Opportunity</Title>
                            <Paragraph type="secondary">
                                Post a job opening from your organization. Admin
                                approval is required before publishing.
                            </Paragraph>
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
                        </div>
                    </Card>
                ),
            },
            {
                key: "my-postings",
                label: (
                    <Space>
                        <FileOutlined />
                        <span>My Postings</span>
                        {myPostings.length > 0 && (
                            <span
                                className="tab-count-inline"
                                style={{
                                    backgroundColor: COLORS.antdGreen,
                                    color: COLORS.white,
                                    borderRadius: "10px",
                                    padding: "2px 8px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    marginLeft: "4px",
                                    display: "inline-block",
                                    minWidth: "20px",
                                    textAlign: "center",
                                }}
                            >
                                {myPostings.length}
                            </span>
                        )}
                    </Space>
                ),
                children: (
                    <JobPostsGrid
                        posts={myPostings.filter(
                            (p) => !p.is_full && !p.is_expired,
                        )}
                        isAdmin={false}
                        currentUser={currentUser}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                        onReviewApplications={handleReviewApplications}
                        isMyPostings={true}
                    />
                ),
            },
            {
                key: "my-applications",
                label: (
                    <Space>
                        <SendOutlined />
                        <span>My Applications</span>
                        {myApplications.length > 0 && (
                            <span
                                className="tab-count-inline"
                                style={{
                                    backgroundColor: COLORS.antdPurple,
                                    color: COLORS.white,
                                    borderRadius: "10px",
                                    padding: "2px 8px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    marginLeft: "4px",
                                    display: "inline-block",
                                    minWidth: "20px",
                                    textAlign: "center",
                                }}
                            >
                                {myApplications.length}
                            </span>
                        )}
                    </Space>
                ),
                children: (
                    <ApplicationsTable
                        applications={myApplications}
                        currentUser={currentUser}
                        onWithdraw={handleWithdrawApplication}
                        withdrawLoading={withdrawLoading}
                    />
                ),
            },
            {
                key: "full-expired",
                label: (
                    <Space>
                        <WarningOutlined />
                        <span>Full/Expired</span>
                        {fullOrExpiredPosts.length > 0 && (
                            <span
                                className="tab-count-inline"
                                style={{
                                    backgroundColor: COLORS.antdRed,
                                    color: COLORS.white,
                                    borderRadius: "10px",
                                    padding: "2px 8px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    marginLeft: "4px",
                                    display: "inline-block",
                                    minWidth: "20px",
                                    textAlign: "center",
                                }}
                            >
                                {fullOrExpiredPosts.length}
                            </span>
                        )}
                    </Space>
                ),
                children: (
                    <FullOrExpiredGrid
                        posts={fullOrExpiredPosts}
                        isAdmin={false}
                        currentUser={currentUser}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                        onReviewApplications={handleReviewApplications}
                    />
                ),
            },
        ],
        [
            filteredAndSortedJobs,
            currentUser,
            handleApplyClick,
            handleViewDetails,
            handleReviewApplications,
            myApplications,
            myPostings,
            handleEditPost,
            handleDeletePost,
            handleWithdrawApplication,
            fullOrExpiredPosts,
            form,
            statsData,
            withdrawLoading,
            searchText,
            filterJobType,
            filterStatus,
            sortBy,
            userRole,
        ],
    );

    const tabsItems =
        userRole === ROLES.ADMIN ? adminTabsItems : alumniTabsItems;

    return (
        <Card className="tabs-card">
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabsItems}
                className="job-tabs"
            />
        </Card>
    );
}
