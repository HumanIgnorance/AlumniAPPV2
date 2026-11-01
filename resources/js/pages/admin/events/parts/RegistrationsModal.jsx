import { useEffect, useRef, useState } from "react";
import { FilePdfOutlined, PrinterOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Button, Card, Col, Modal, Progress, Row, Space, Spin, Statistic, Table, Typography, message } from "antd";
import moment from "moment";
import logo from "~/assets/images/OCC_LOGO.png";
import { COLORS } from "~/config/theme";
import axiosConfig from "~/utils/axiosConfig";
import { exportElementToPdf } from "~/utils/exportPdf";

const { Text, Title } = Typography;

export const RegistrationsModal = ({ event, visible, onClose }) => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eventData, setEventData] = useState(null);
    const printRef = useRef(null);
    const [printPreviewVisible, setPrintPreviewVisible] = useState(false);

    useEffect(() => {
        if (visible && event) {
            fetchRegistrations();
        }
    }, [visible, event]);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(
                `/events/${event.id}/registrations`,
            );
            if (response.data.success) {
                setRegistrations(response.data.data);
                setEventData(response.data.event);
            }
        } catch (error) {
            message.error("Failed to fetch registrations");
        } finally {
            setLoading(false);
        }
    };

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handlePrint = () => {
        setPrintPreviewVisible(true);
    };

    const handleActualPrint = async () => {
        setIsGeneratingPdf(true);
        try {
            const eventLabel = event?.title
                ? event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                : "event";
            await exportElementToPdf("printable-area", {
                filename: `event-registrations-${eventLabel}.pdf`,
            });
        } catch (err) {
            console.error("Failed to generate PDF:", err);
            message.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };
    const columns = [
        {
            title: "#",
            key: "index",
            width: 50,
            render: (_, __, index) => index + 1,
        },
        {
            title: "Check",
            key: "check",
            width: 70,
            align: "center",
            render: () => (
                <div
                    style={{
                        width: 20,
                        height: 20,
                        border: "1.5px solid #000",
                        borderRadius: 3,
                        margin: "0 auto",
                    }}
                />
            ),
        },
        {
            title: "Name",
            key: "name",
            render: (_, record) => (
                <Text strong>{record.alumni?.name || "N/A"}</Text>
            ),
        },
        {
            title: "Contact",
            key: "contact_number",
            render: (_, record) => record.alumni?.contact_number || "N/A",
        },
        {
            title: "Batch Year",
            key: "batch_year",
            render: (_, record) => record.alumni?.batch_year || "N/A",
        },
        {
            title: "Registration Date",
            key: "registration_date",
            render: (_, record) =>
                moment(record.registration_date || record.created_at).format(
                    "MMM DD, YYYY hh:mm A",
                ),
        },
    ];


    
    return (
        <>
            <Modal
                title={
                    <Space>
                        <UsergroupAddOutlined
                            style={{ color: "var(--accent, #4f46e5)" }}
                        />
                        <span>Event Registrations - {event?.title}</span>
                    </Space>
                }
                open={visible}
                onCancel={onClose}
                width={1000}
                footer={[
                    <Button key="close" onClick={onClose}>
                        Close
                    </Button>,
                    <Button
                        key="print"
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={handlePrint}
                        disabled={registrations.length === 0}
                    >
                        Print Preview
                    </Button>,
                ]}
            >
                <div ref={printRef}>
                    {/* Event Summary */}
                    <Card size="small" style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Statistic
                                    title="Total Registered"
                                    value={registrations.length}
                                    suffix={`/ ${event?.capacity}`}
                                    valueStyle={{
                                        color: "var(--accent, #4f46e5)",
                                    }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="Spots Remaining"
                                    value={
                                        (event?.capacity || 0) -
                                        registrations.length
                                    }
                                    valueStyle={{
                                        color:
                                            registrations.length >=
                                            (event?.capacity || 0)
                                                ? "var(--danger, #ef4444)"
                                                : "var(--success, #22c55e)",
                                    }}
                                />
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">
                                    Registration Progress
                                </Text>
                                <Progress
                                    percent={Math.round(
                                        (registrations.length /
                                            (event?.capacity || 1)) *
                                            100,
                                    )}
                                    status={
                                        registrations.length >=
                                        (event?.capacity || 0)
                                            ? "exception"
                                            : "active"
                                    }
                                    strokeColor={{
                                        "0%": COLORS.c108ee9,
                                        "100%": COLORS.c87d068,
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {/* Registrations Table */}
                    <Spin spinning={loading}>
                        <Table
                            dataSource={registrations}
                            columns={columns}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            locale={{ emptyText: "No registrations yet" }}
                        />
                    </Spin>
                </div>
            </Modal>

            {/* Print Preview Modal — #printable-area uses the shared
                .printable-area-surface (fixed real A4 size, see
                ~/styles/printPreview.css) inside the shared scrollable
                .print-preview-canvas wrapper, so this report is
                pixel-consistent with every other PDF in the app and
                never reflows or gets clipped between mobile
                portrait/landscape. */}
            <Modal
                title="Print Preview - A4 Layout"
                open={printPreviewVisible}
                onCancel={() => setPrintPreviewVisible(false)}
                width={900}
                style={{ top: 16, maxWidth: "calc(100vw - 16px)" }}
                styles={{ body: { maxHeight: "78vh", overflowY: "auto", padding: 0 } }}
                wrapClassName="print-preview-modal"
                className="print-preview-modal"
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setPrintPreviewVisible(false)}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="print"
                        type="primary"
                        icon={<FilePdfOutlined />}
                        loading={isGeneratingPdf}
                        onClick={handleActualPrint}
                    >
                        {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
                    </Button>,
                ]}
            >
                <div className="print-preview-canvas">
                <div
                    id="printable-area"
                    data-print-theme="light"
                    className="printable-area-surface"
                    style={{
                        backgroundColor: COLORS.white,
                        color: COLORS.slate900,
                    }}
                >
                    {/* Header with Logo */}
                    <div
                        className="print-report-header"
                        style={{
                            textAlign: "center",
                            borderBottom: "2px solid #000",
                        }}
                    >
                        <img
                            src={logo || "/placeholder.svg"}
                            alt="OCC Logo"
                            style={{
                                width: "80px",
                                height: "80px",
                                marginBottom: "10px",
                                objectFit: "contain",
                            }}
                        />
                        <Title level={2} style={{ margin: 0, color: COLORS.black }}>
                            Event Registration List
                        </Title>
                        <Title
                            level={4}
                            style={{
                                margin: "10px 0",
                                color: "var(--accent, #4f46e5)",
                            }}
                        >
                            {event?.title}
                        </Title>
                        <Text type="secondary" style={{ color: COLORS.gray666 }}>
                            Generated on: {moment().format("MMMM DD, YYYY")}
                        </Text>
                    </div>

                    {/* Event Info */}
                    <Card
                        className="print-block"
                        style={{
                            border: "1px solid #d9d9d9",
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <p style={{ margin: "5px 0" }}>
                                    <strong>Date:</strong>{" "}
                                    {moment(event?.date).format(
                                        "MMMM DD, YYYY",
                                    )}
                                </p>
                                <p style={{ margin: "5px 0" }}>
                                    <strong>Time:</strong>{" "}
                                    {moment(event?.start_time, "HH:mm").format(
                                        "hh:mm A",
                                    )}{" "}
                                    -{" "}
                                    {moment(event?.end_time, "HH:mm").format(
                                        "hh:mm A",
                                    )}
                                </p>
                            </Col>
                            <Col span={12}>
                                <p style={{ margin: "5px 0" }}>
                                    <strong>Location:</strong> {event?.location}
                                </p>
                                <p style={{ margin: "5px 0" }}>
                                    <strong>Organizer:</strong>{" "}
                                    {event?.organizer}
                                </p>
                            </Col>
                        </Row>
                    </Card>

                    {/* Print Statistics */}
                    <Card
                        className="print-block"
                        style={{
                            border: "1px solid #d9d9d9",
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ textAlign: "center" }}>
                                    <Title
                                        level={3}
                                        style={{
                                            color: "var(--accent, #4f46e5)",
                                        }}
                                    >
                                        {registrations.length}
                                    </Title>
                                    <Text style={{ color: COLORS.black }}>
                                        Total Registered
                                    </Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ textAlign: "center" }}>
                                    <Title
                                        level={3}
                                        style={{
                                            color:
                                                registrations.length >=
                                                (event?.capacity || 0)
                                                    ? "var(--danger, #ef4444)"
                                                    : "var(--success, #22c55e)",
                                        }}
                                    >
                                        {(event?.capacity || 0) -
                                            registrations.length}
                                    </Title>
                                    <Text style={{ color: COLORS.black }}>
                                        Spots Remaining (Capacity:{" "}
                                        {event?.capacity})
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Print Table */}
                    <Table
                        className="print-block"
                        dataSource={registrations}
                        pagination={false}
                        size="small"
                        rowKey="id"
                        style={{ width: "100%" }}
                        columns={[
                            {
                                title: "No.",
                                key: "index",
                                width: 50,
                                render: (_, __, index) => index + 1,
                            },
                            {
                                title: "Check",
                                key: "check",
                                width: 60,
                                align: "center",
                                render: () => (
                                    <div
                                        style={{
                                            width: 18,
                                            height: 18,
                                            border: "1.5px solid #000",
                                            borderRadius: 3,
                                            margin: "0 auto",
                                        }}
                                    />
                                ),
                            },
                            {
                                title: "Name",
                                key: "name",
                                render: (_, record) =>
                                    record.alumni?.name || "N/A",
                            },
                            {
                                title: "Contact Number",
                                key: "contact_number",
                                render: (_, record) =>
                                    record.alumni?.contact_number || "N/A",
                            },
                            {
                                title: "Batch Year",
                                key: "batch_year",
                                render: (_, record) =>
                                    record.alumni?.batch_year || "N/A",
                            },
                            {
                                title: "Registration Date",
                                key: "registration_date",
                                render: (_, record) =>
                                    moment(
                                        record.registration_date ||
                                            record.created_at,
                                    ).format("MMM DD, YYYY hh:mm A"),
                            },
                            {
                                title: "Signature",
                                key: "signature",
                                width: 140,
                                render: () => "",
                            },
                        ]}
                    />

                    {/* Print Footer */}
                    <div style={{
                            marginTop: "40px",
                            paddingTop: "20px",
                            borderTop: "1px solid #d9d9d9",
                            textAlign: "center",
                        }}
                    >
                        <Text type="secondary" style={{ color: COLORS.gray666 }}>
                            Alumni Events Management System
                        </Text>
                    </div>
                </div>
                </div>
            </Modal>

            {/* Print mechanics only — appearance (size/padding/typography/
                table density) lives once, unconditionally, in
                ~/styles/printPreview.css. Duplicating appearance here is
                exactly what let the preview drift from the downloaded
                PDF before, and what made the printable area's real width
                depend on the current page rather than always being a
                fixed A4 size. */}
            <style jsx global>{`
                @media print {
                    html,
                    body {
                        background: #ffffff !important;
                        color: #0f172a !important;
                    }

                    body * {
                        visibility: hidden !important;
                    }

                    #printable-area,
                    #printable-area * {
                        visibility: visible !important;
                    }

                    #printable-area {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        margin: 0 !important;
                        z-index: 999999 !important;
                    }

                    .ant-modal-mask,
                    .ant-modal-wrap {
                        position: static !important;
                        background: none !important;
                    }

                    .ant-modal,
                    .ant-modal-content {
                        position: static !important;
                        box-shadow: none !important;
                        border: none !important;
                        background: transparent !important;
                    }

                    .ant-modal-header,
                    .ant-modal-footer,
                    .ant-modal-close {
                        display: none !important;
                    }

                    .ant-modal-body {
                        padding: 0 !important;
                    }

                    .print-preview-canvas {
                        background: none !important;
                        padding: 0 !important;
                        overflow: visible !important;
                    }
                    .print-preview-canvas .printable-area-surface {
                        box-shadow: none !important;
                    }

                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }

                    @page {
                        size: A4 portrait;
                        margin: 10mm;
                    }

                    html,
                    body {
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #fff !important;
                    }
                }
            `}</style>
        </>
    );
};
