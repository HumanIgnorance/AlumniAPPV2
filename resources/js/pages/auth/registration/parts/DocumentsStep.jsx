import React from "react";
import {
    CheckCircleOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Button,
    Card,
    Col,
    Divider,
    Image,
    List,
    Modal,
    Row,
    Space,
    Tag,
    Tooltip,
    Typography,
    Upload,
} from "antd";
import moment from "moment";
import { ID_TYPES } from "~/config/alumniOptions";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";

const { Title, Text } = Typography;

export default function DocumentsStep() {
    const {
        idDocuments,
        removeDocument,
        idUploadProps,
        idUploadButton,
        getDocumentStatus,
    } = useRegistrationContext();

    return (
        <div className="form-step">
            <Title level={3}>Document Upload</Title>
            <Text type="secondary">
                Upload your identification documents for verification
            </Text>

            <Divider />

            <Alert
                message="Important"
                description="Please upload clear, readable images of your documents. All documents will be reviewed for verification purposes."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Row gutter={[24, 16]}>
                <Col span={24}>
                    <Card title="Required Documents" size="small">
                        <Row gutter={[16, 16]}>
                            {ID_TYPES.map((docType) => {
                                const uploadedDoc = idDocuments.find(
                                    (doc) => doc.type === docType.value,
                                );
                                return (
                                    <Col
                                        xs={24}
                                        sm={12}
                                        md={8}
                                        key={docType.value}
                                    >
                                        <Card
                                            className={`id-upload-card ${uploadedDoc ? "uploaded" : ""}`}
                                            size="small"
                                        >
                                            <div className="id-card-content">
                                                <div className="id-icon">
                                                    {docType.icon}
                                                </div>
                                                <div className="id-info">
                                                    <Text strong>
                                                        {docType.label}
                                                    </Text>
                                                    {uploadedDoc ? (
                                                        <div className="upload-status">
                                                            <Tag
                                                                color="green"
                                                                icon={
                                                                    <CheckCircleOutlined />
                                                                }
                                                            >
                                                                Uploaded
                                                            </Tag>
                                                            <div className="document-actions">
                                                                <Tooltip title="View Document">
                                                                    <Button
                                                                        type="link"
                                                                        icon={
                                                                            <EyeOutlined />
                                                                        }
                                                                        onClick={() => {
                                                                            Modal.info(
                                                                                {
                                                                                    title: docType.label,
                                                                                    content:
                                                                                        (
                                                                                            <Image
                                                                                                width="100%"
                                                                                                src={
                                                                                                    uploadedDoc.url ||
                                                                                                    "/placeholder.svg"
                                                                                                }
                                                                                                alt={
                                                                                                    docType.label
                                                                                                }
                                                                                            />
                                                                                        ),
                                                                                    icon: null,
                                                                                    width: 600,
                                                                                },
                                                                            );
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title="Remove Document">
                                                                    <Button
                                                                        type="link"
                                                                        danger
                                                                        icon={
                                                                            <DeleteOutlined />
                                                                        }
                                                                        onClick={() =>
                                                                            removeDocument(
                                                                                uploadedDoc.id,
                                                                            )
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Upload
                                                            {...idUploadProps(
                                                                docType.value,
                                                            )}
                                                        >
                                                            {idUploadButton(
                                                                docType.value,
                                                            )}
                                                        </Upload>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card>
                </Col>

                {/* Uploaded Documents List */}
                {idDocuments.length > 0 && (
                    <Col span={24}>
                        <Card title="Uploaded Documents" size="small">
                            <List
                                dataSource={idDocuments}
                                renderItem={(doc) => {
                                    const docType = ID_TYPES.find(
                                        (d) => d.value === doc.type,
                                    );
                                    const status = getDocumentStatus(
                                        doc.status,
                                    );

                                    return (
                                        <List.Item
                                            actions={[
                                                <Tooltip
                                                    title="View Document"
                                                    key="view"
                                                >
                                                    <Button
                                                        icon={<EyeOutlined />}
                                                        onClick={() => {
                                                            Modal.info({
                                                                title: docType?.label,
                                                                content: (
                                                                    <Image
                                                                        width="100%"
                                                                        src={
                                                                            doc.url ||
                                                                            "/placeholder.svg"
                                                                        }
                                                                        alt={
                                                                            docType?.label
                                                                        }
                                                                    />
                                                                ),
                                                                icon: null,
                                                                width: 600,
                                                            });
                                                        }}
                                                    />
                                                </Tooltip>,
                                                <Tooltip
                                                    title="Remove Document"
                                                    key="remove"
                                                >
                                                    <Button
                                                        danger
                                                        icon={
                                                            <DeleteOutlined />
                                                        }
                                                        onClick={() =>
                                                            removeDocument(
                                                                doc.id,
                                                            )
                                                        }
                                                    />
                                                </Tooltip>,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={docType?.icon}
                                                title={
                                                    <Space>
                                                        <Text>
                                                            {docType?.label}
                                                        </Text>
                                                        <Tag
                                                            color={status.color}
                                                            icon={status.icon}
                                                        >
                                                            {status.text}
                                                        </Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <Space
                                                        direction="vertical"
                                                        size={0}
                                                    >
                                                        <Text type="secondary">
                                                            File: {doc.name}
                                                        </Text>
                                                        <Text type="secondary">
                                                            Uploaded:{" "}
                                                            {moment(
                                                                doc.uploadDate,
                                                            ).format(
                                                                "MMM DD, YYYY HH:mm",
                                                            )}
                                                        </Text>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    );
                                }}
                            />
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
}
