import {
    BankOutlined,
    CheckCircleOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    EyeOutlined,
    StopOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Empty,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import moment from "moment";
import { getJobTypeTag } from "~/pages/admin/JobPost/parts/jobPostHelpers";
import { CreatorInfo } from "~/pages/admin/JobPost/parts/PersonInfo";
import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";

const { Text } = Typography;

// =============== PENDING APPROVALS TABLE COMPONENT ===============
export function PendingApprovalsTable({
    posts,
    currentUser,
    onApprove,
    onReject,
    onViewDetails,
}) {
    const columns = [
        {
            title: "Job Post",
            key: "post",
            render: (_, record) => (
                <div>
                    <Text strong>{record.title}</Text>
                    <div>
                        <Tag icon={<BankOutlined />}>{record.company}</Tag>
                        {getJobTypeTag(record.job_type)}
                    </div>
                </div>
            ),
        },
        {
            title: "Posted By",
            key: "creator",
            render: (_, record) => <CreatorInfo creator={record.creator} />,
        },
        {
            title: "Submitted",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => moment(date).format("MMM D, YYYY"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={() => onApprove(record.id)}
                    >
                        Approve
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={() => onReject(record.id)}
                    >
                        Reject
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => onViewDetails(record)}
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    if (posts.length === 0) {
        return (
            <Card className="empty-state-card">
                <Empty
                    description="No pending approvals"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    return (
        <Table
            dataSource={posts}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="job-table"
        />
    );
}

// =============== APPLICATIONS TABLE COMPONENT ===============
export function ApplicationsTable({
    applications,
    currentUser,
    onWithdraw,
    withdrawLoading = {},
}) {
    const isTouchDevice = useIsTouchDevice();
    const columns = [
        {
            title: "Job",
            key: "job",
            width: 280,
            render: (_, record) => (
                <div className="table-job-info">
                    <Text
                        strong
                        style={{
                            fontSize: 14,
                            display: "block",
                            marginBottom: 4,
                        }}
                    >
                        {record.job?.title}
                    </Text>
                    <Space>
                        <Tag icon={<BankOutlined />} color="default">
                            {record.job?.company}
                        </Tag>
                        {record.job?.is_full && (
                            <Tag color="volcano" icon={<StopOutlined />}>
                                Full
                            </Tag>
                        )}
                        {record.job?.is_expired && (
                            <Tag color="red" icon={<ClockCircleOutlined />}>
                                Expired
                            </Tag>
                        )}
                    </Space>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (status) => {
                const colors = {
                    accepted: "green",
                    rejected: "red",
                    applied: "orange",
                    reviewing: "blue",
                };
                const icons = {
                    accepted: <CheckCircleOutlined />,
                    rejected: <CloseCircleOutlined />,
                    applied: <ClockCircleOutlined />,
                    reviewing: <EyeOutlined />,
                };
                return (
                    <Tag color={colors[status] || "blue"} icon={icons[status]}>
                        {status?.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Applied",
            dataIndex: "created_at",
            key: "created_at",
            width: 120,
            render: (date) => (
                <Tooltip
                    title={moment(date).format("MMMM D, YYYY h:mm A")}
                    trigger={isTouchDevice ? [] : ["hover"]}
                    open={isTouchDevice ? false : undefined}
                >
                    <Text type="secondary">{moment(date).fromNow()}</Text>
                </Tooltip>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_, record) => (
                <Tooltip
                    title="Withdraw Application"
                    trigger={isTouchDevice ? [] : ["hover"]}
                    open={isTouchDevice ? false : undefined}
                >
                    <Button
                        type="text"
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => onWithdraw(record.id)}
                        loading={withdrawLoading[record.id]}
                    >
                        Withdraw
                    </Button>
                </Tooltip>
            ),
        },
    ];

    if (applications.length === 0) {
        return (
            <Card className="empty-state-card">
                <Empty
                    description="You haven't applied to any jobs yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    return (
        <Table
            dataSource={applications}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="applications-table"
        />
    );
}
