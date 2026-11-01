import { useEffect, useState } from "react";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import { Form, Input, Modal, Select, Space, Tag, Typography } from "antd";
import { COLORS } from "~/config/theme";

const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;

// ============ END LAST ACTIVE STATUS HELPER FUNCTIONS ============

export const StatusUpdateModal = ({
    visible,
    onCancel,
    onOk,
    alumnus,
    loading,
    statuses,
}) => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState("pending");

    useEffect(() => {
        if (alumnus) {
            form.setFieldsValue({
                status: alumnus.status || "pending",
                employment_status_id: alumnus.employment_status_id,
                admin_notes: alumnus.admin_notes || "",
            });

            setSelectedStatus(alumnus.status || "pending");
        }
    }, [alumnus, form]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onOk({
                ...values,
                status: selectedStatus,
            });
        });
    };

    const handleClose = () => {
        form.resetFields();
        onCancel();
    };

    const getStatusDescription = (status) => {
        const descriptions = {
            approved:
                "Alumni will be visible in the directory and can be contacted by other users.",
            pending:
                "Alumni profile will be under review and not visible to others until approved.",
            inactive:
                "Alumni profile will be hidden from the directory and marked as inactive.",
            rejected:
                "Alumni account will be rejected. The alumni will see your admin notes when they try to log in, with instructions to contact the Administrator Office for further clarification.",
        };
        return descriptions[status] || "";
    };
    return (
        <Modal
            title={`Update Status - ${alumnus?.first_name ?? ""} ${alumnus?.last_name ?? ""}`}
            open={visible}
            onCancel={handleClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={600}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="New Status"
                    name="status"
                    rules={[
                        { required: true, message: "Please select a status" },
                    ]}
                >
                    <Select onChange={setSelectedStatus}>
                        <Option value="approved">
                            <Space>
                                <CheckCircleOutlined
                                    style={{ color: COLORS.antdGreen }}
                                />
                                Approved
                            </Space>
                        </Option>
                        <Option value="pending">
                            <Space>
                                <ClockCircleOutlined
                                    style={{ color: COLORS.antdGold }}
                                />
                                Pending Review
                            </Space>
                        </Option>
                        <Option value="rejected">
                            <Space>
                                <CloseCircleOutlined
                                    style={{ color: COLORS.antdRed }}
                                />
                                Rejected
                            </Space>
                        </Option>
                        {/* <Option value="inactive">
              <Space>
                <StopOutlined style={{ color: "#ff4d4f" }} />
                Inactive
              </Space>
            </Option> */}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="employment_status_id"
                    label="Current Employment Status"
                    rules={[
                        {
                            required: true,
                            message: "Please select employment status",
                        },
                    ]}
                >
                    <Select placeholder="Select employment status">
                        {statuses?.map((status) => (
                            <Option key={status.id} value={status.id}>
                                {status.status_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {selectedStatus && (
                    <div
                        style={{
                            padding: "12px",
                            backgroundColor: COLORS.neutral100,
                            borderRadius: "6px",
                            marginBottom: "16px",
                        }}
                    >
                        <Text type="secondary">
                            {getStatusDescription(selectedStatus)}
                        </Text>
                    </div>
                )}

                <Form.Item
                    label="Admin Notes"
                    name="admin_notes"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please provide notes for this status change",
                        },
                    ]}
                >
                    <TextArea
                        rows={4}
                        maxLength={500}
                        showCount
                        placeholder="Explain the reason for the status change"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

// ============ BULK STATUS UPDATE MODAL ============
export const BulkStatusUpdateModal = ({
    visible,
    onCancel,
    onOk,
    selectedAlumni,
    loading,
    statuses,
}) => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState("pending");

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                status: "pending",
                employment_status_id: undefined,
                admin_notes: "",
            });
            setSelectedStatus("pending");
        }
    }, [visible, form]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onOk({
                ...values,
                status: selectedStatus,
            });
        });
    };

    const handleClose = () => {
        form.resetFields();
        onCancel();
    };

    const getStatusDescription = (status) => {
        const descriptions = {
            approved:
                "Alumni will be visible in the directory and can be contacted by other users.",
            pending:
                "Alumni profile will be under review and not visible to others until approved.",
            inactive:
                "Alumni profile will be hidden from the directory and marked as inactive.",
            rejected:
                "Selected alumni accounts will be rejected. They will see your admin notes on login with instructions to contact the Administrator Office.",
        };
        return descriptions[status] || "";
    };

    return (
        <Modal
            title={`Bulk Update Status - ${selectedAlumni.length} Alumni Selected`}
            open={visible}
            onCancel={handleClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={600}
        >
            <div style={{ marginBottom: 16 }}>
                <Text strong>Selected Alumni:</Text>
                <div
                    style={{
                        maxHeight: 100,
                        overflowY: "auto",
                        marginTop: 8,
                        padding: 8,
                        backgroundColor: COLORS.neutral100,
                        borderRadius: 6,
                    }}
                >
                    {selectedAlumni.map((alumnus, index) => (
                        <Tag key={alumnus.id} style={{ marginBottom: 4 }}>
                            {alumnus.first_name} {alumnus.last_name}
                        </Tag>
                    ))}
                </div>
            </div>

            <Form form={form} layout="vertical">
                <Form.Item
                    label="New Status"
                    name="status"
                    rules={[
                        { required: true, message: "Please select a status" },
                    ]}
                >
                    <Select onChange={setSelectedStatus}>
                        <Option value="approved">
                            <Space>
                                <CheckCircleOutlined
                                    style={{ color: COLORS.antdGreen }}
                                />
                                Approved
                            </Space>
                        </Option>
                        <Option value="pending">
                            <Space>
                                <ClockCircleOutlined
                                    style={{ color: COLORS.antdGold }}
                                />
                                Pending Review
                            </Space>
                        </Option>
                        <Option value="rejected">
                            <Space>
                                <CloseCircleOutlined
                                    style={{ color: COLORS.antdRed }}
                                />
                                Rejected
                            </Space>
                        </Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="employment_status_id"
                    label="Current Employment Status"
                    rules={[
                        {
                            required: true,
                            message: "Please select employment status",
                        },
                    ]}
                >
                    <Select placeholder="Select employment status">
                        {statuses?.map((status) => (
                            <Option key={status.id} value={status.id}>
                                {status.status_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {selectedStatus && (
                    <div
                        style={{
                            padding: "12px",
                            backgroundColor: COLORS.neutral100,
                            borderRadius: "6px",
                            marginBottom: "16px",
                        }}
                    >
                        <Text type="secondary">
                            {getStatusDescription(selectedStatus)}
                        </Text>
                    </div>
                )}

                <Form.Item
                    label="Admin Notes"
                    name="admin_notes"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please provide notes for this status change",
                        },
                    ]}
                >
                    <TextArea
                        rows={4}
                        maxLength={500}
                        showCount
                        placeholder="Explain the reason for the status change"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
