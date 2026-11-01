import { useState, useMemo } from "react";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    FolderOutlined,
    PrinterOutlined,
    SearchOutlined,
    TeamOutlined,
    FilePdfOutlined,
} from "@ant-design/icons";
import {
    Tag,
    message,
    Modal,
    Space,
    Button,
    Row,
    Col,
    Input,
    Select,
    Card,
    Statistic,
    List,
    Table,
} from "antd";
import { exportElementToPdf } from "~/utils/exportPdf";
import { COLORS } from "~/config/theme";
import AlumniAvatar from "~/components/shared/AlumniAvatar";
import logo from "~/assets/images/OCC_LOGO.png";
import moment from "moment";
import {
    Option,
    Title,
    Text,
} from "~/pages/admin/department-heads/department-dashboard-page/parts/departmentDashboardShared";

export const CourseFolderModal = ({ visible, onCancel, course, alumni }) => {
    const [folderSearch, setFolderSearch] = useState("");
    const [folderEmploymentFilter, setFolderEmploymentFilter] = useState("all");
    const [printPreviewVisible, setPrintPreviewVisible] = useState(false);

    // Filter alumni by course_id and search/employment filters
    const filteredCourseAlumni = useMemo(() => {
        let filtered = alumni.filter(
            (a) => Number(a.course_id) === Number(course?.id),
        );

        // Apply search filter
        if (folderSearch) {
            const searchLower = folderSearch.toLowerCase();
            filtered = filtered.filter((a) => {
                const firstName = a?.first_name?.toLowerCase() || "";
                const lastName = a?.last_name?.toLowerCase() || "";
                return (
                    firstName.includes(searchLower) ||
                    lastName.includes(searchLower)
                );
            });
        }

        // Apply employment status filter
        if (folderEmploymentFilter !== "all") {
            const statusMap = {
                employed: 1,
                unemployed: 2,
                under_employed: 3,
            };
            filtered = filtered.filter(
                (a) =>
                    a.employment_status_id ===
                    statusMap[folderEmploymentFilter],
            );
        }

        return filtered;
    }, [alumni, course?.id, folderSearch, folderEmploymentFilter]);

    const getEmploymentStatusTag = (statusId) => {
        const config = {
            1: {
                color: "green",
                text: "Employed",
                icon: <CheckCircleOutlined />,
            },
            2: {
                color: "red",
                text: "Unemployed",
                icon: <ClockCircleOutlined />,
            },
            3: {
                color: "orange",
                text: "Under Employed",
                icon: <ExclamationCircleOutlined />,
            },
        };
        const statusConfig = config[statusId] || {
            color: "default",
            text: "Unknown",
        };
        return (
            <Tag color={statusConfig.color} icon={statusConfig.icon}>
                {statusConfig.text}
            </Tag>
        );
    };

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handlePrint = () => {
        setPrintPreviewVisible(true);
    };

    const handleActualPrint = async () => {
        setIsGeneratingPdf(true);
        try {
            const courseLabel =
                course?.name || course?.course_name
                    ? (course.name || course.course_name)
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                    : "course";
            await exportElementToPdf("printable-area", {
                filename: `department-report-${courseLabel}.pdf`,
            });
        } catch (err) {
            console.error("Failed to generate PDF:", err);
            message.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!course) return null;

    return (
        <>
            <Modal
                title={
                    <Space>
                        <FolderOutlined style={{ color: course.color }} />
                        <span>
                            {course.code} - {course.name}
                        </span>
                    </Space>
                }
                open={visible}
                onCancel={onCancel}
                width={1200}
                style={{ top: 24, maxWidth: "calc(100vw - 16px)" }}
                styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
                className="course-folder-modal"
                footer={[
                    <Button
                        key="print"
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={handlePrint}
                    >
                        Print Preview
                    </Button>,
                    <Button key="close" onClick={onCancel}>
                        Close
                    </Button>,
                ]}
            >
                <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="large"
                >
                    {/* Search and Filter Controls */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Input
                                placeholder="Search alumni by name..."
                                prefix={<SearchOutlined />}
                                value={folderSearch}
                                onChange={(e) =>
                                    setFolderSearch(e.target.value)
                                }
                                size="large"
                                allowClear
                            />
                        </Col>
                        <Col span={12}>
                            <Select
                                value={folderEmploymentFilter}
                                onChange={setFolderEmploymentFilter}
                                style={{ width: "100%" }}
                                size="large"
                                placeholder="Employment Status"
                            >
                                <Option value="all">
                                    <Tag color="default">All Employment</Tag>
                                </Option>
                                <Option value="employed">
                                    <Tag color="green">Employed</Tag>
                                </Option>
                                <Option value="unemployed">
                                    <Tag color="red">Unemployed</Tag>
                                </Option>
                                <Option value="under_employed">
                                    <Tag color="orange">Under Employed</Tag>
                                </Option>
                            </Select>
                        </Col>
                    </Row>

                    {/* Statistics */}
                    <Card>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Statistic
                                    title="Total Alumni"
                                    value={filteredCourseAlumni.length}
                                    prefix={<TeamOutlined />}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="Employed"
                                    value={
                                        filteredCourseAlumni.filter(
                                            (a) => a.employment_status_id === 1,
                                        ).length
                                    }
                                    valueStyle={{ color: COLORS.antdGreen }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="Unemployed"
                                    value={
                                        filteredCourseAlumni.filter(
                                            (a) => a.employment_status_id === 2,
                                        ).length
                                    }
                                    valueStyle={{ color: COLORS.antdRed }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="Under Employed"
                                    value={
                                        filteredCourseAlumni.filter(
                                            (a) => a.employment_status_id === 3,
                                        ).length
                                    }
                                    valueStyle={{ color: COLORS.antdGold }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {/* Alumni List - Without View button */}
                    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                        {filteredCourseAlumni.length === 0 ? (
                            <Card>
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "40px 0",
                                    }}
                                >
                                    <Title level={4}>No alumni found</Title>
                                    <Text type="secondary">
                                        No alumni match your search criteria for
                                        this course
                                    </Text>
                                </div>
                            </Card>
                        ) : (
                            <List
                                dataSource={filteredCourseAlumni}
                                renderItem={(alumnus) => (
                                    <List.Item key={alumnus.id}>
                                        <List.Item.Meta
                                            avatar={
                                                <AlumniAvatar
                                                    size={50}
                                                    src={
                                                        alumnus.profile_image_url
                                                    }
                                                    name={
                                                        alumnus.first_name ||
                                                        alumnus.last_name
                                                    }
                                                />
                                            }
                                            title={
                                                <Space>
                                                    <span>
                                                        {alumnus.first_name}{" "}
                                                        {alumnus.last_name}
                                                    </span>
                                                </Space>
                                            }
                                            description={
                                                <Space
                                                    direction="vertical"
                                                    size="small"
                                                >
                                                    <Text type="secondary">
                                                        Class of{" "}
                                                        {
                                                            alumnus.graduation_year
                                                        }
                                                    </Text>
                                                    {getEmploymentStatusTag(
                                                        alumnus.employment_status_id,
                                                    )}
                                                    {alumnus.current_company && (
                                                        <Text>
                                                            {alumnus.job_title}{" "}
                                                            at{" "}
                                                            {
                                                                alumnus.current_company
                                                            }
                                                        </Text>
                                                    )}
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </div>
                </Space>
            </Modal>

            {/* Print Preview Modal — forced light theme via wrapClassName.
                #printable-area uses the shared .printable-area-surface
                (fixed real A4 size, see ~/styles/printPreview.css) inside
                the shared scrollable .print-preview-canvas wrapper, so
                this report is pixel-consistent with every other PDF in
                the app and never reflows or gets clipped between mobile
                portrait/landscape. */}
            <Modal
                title="Print Preview - A4 Layout"
                open={printPreviewVisible}
                onCancel={() => setPrintPreviewVisible(false)}
                width={900}
                style={{ top: 16, maxWidth: "calc(100vw - 16px)" }}
                styles={{
                    body: { maxHeight: "78vh", overflowY: "auto", padding: 0 },
                }}
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
                            <Title level={2} style={{ margin: 0 }}>
                                Alumni Directory Report
                            </Title>
                            <Title
                                level={4}
                                style={{
                                    margin: "10px 0",
                                    color: course.color,
                                }}
                            >
                                {course.code} - {course.name}
                            </Title>
                            <Text type="secondary">
                                Generated on: {moment().format("MMMM DD, YYYY")}
                            </Text>
                        </div>

                        {/* Print Statistics */}
                        <Card className="print-block">
                            <Row gutter={16}>
                                <Col span={6}>
                                    <div style={{ textAlign: "center" }}>
                                        <Title level={3}>
                                            {filteredCourseAlumni.length}
                                        </Title>
                                        <Text>Total Alumni</Text>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div style={{ textAlign: "center" }}>
                                        <Title
                                            level={3}
                                            style={{ color: COLORS.antdGreen }}
                                        >
                                            {
                                                filteredCourseAlumni.filter(
                                                    (a) =>
                                                        a.employment_status_id ===
                                                        1,
                                                ).length
                                            }
                                        </Title>
                                        <Text>Employed</Text>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div style={{ textAlign: "center" }}>
                                        <Title
                                            level={3}
                                            style={{ color: COLORS.antdRed }}
                                        >
                                            {
                                                filteredCourseAlumni.filter(
                                                    (a) =>
                                                        a.employment_status_id ===
                                                        2,
                                                ).length
                                            }
                                        </Title>
                                        <Text>Unemployed</Text>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div style={{ textAlign: "center" }}>
                                        <Title
                                            level={3}
                                            style={{ color: COLORS.antdGold }}
                                        >
                                            {
                                                filteredCourseAlumni.filter(
                                                    (a) =>
                                                        a.employment_status_id ===
                                                        3,
                                                ).length
                                            }
                                        </Title>
                                        <Text>Under Employed</Text>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* Print Table */}
                        <Table
                            className="print-block"
                            dataSource={filteredCourseAlumni}
                            pagination={false}
                            size="small"
                            rowKey="id"
                            columns={[
                                {
                                    title: "No.",
                                    key: "index",
                                    width: 50,
                                    render: (_, __, index) => index + 1,
                                },
                                {
                                    title: "Name",
                                    key: "name",
                                    render: (alumnus) =>
                                        `${alumnus.first_name} ${alumnus.last_name}`,
                                },
                                {
                                    title: "Graduation Year",
                                    dataIndex: "graduation_year",
                                    key: "graduation_year",
                                    width: 120,
                                },
                                {
                                    title: "Employment Status",
                                    key: "employment",
                                    width: 150,
                                    render: (alumnus) => {
                                        const statusMap = {
                                            1: "Employed",
                                            2: "Unemployed",
                                            3: "Under Employed",
                                        };
                                        return (
                                            statusMap[
                                                alumnus.employment_status_id
                                            ] || "N/A"
                                        );
                                    },
                                },
                                {
                                    title: "Company",
                                    dataIndex: "current_company",
                                    key: "current_company",
                                    render: (text) => text || "N/A",
                                },
                                {
                                    title: "Position",
                                    dataIndex: "job_title",
                                    key: "job_title",
                                    render: (text) => text || "N/A",
                                },
                            ]}
                        />

                        {/* Print Footer */}
                        <div
                            style={{
                                marginTop: "40px",
                                paddingTop: "20px",
                                borderTop: "1px solid #d9d9d9",
                                textAlign: "center",
                            }}
                        >
                            <Text type="secondary">
                                This is an official document generated from the
                                Alumni Management System
                            </Text>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Print mechanics only — appearance (size/padding/typography/
                table density) lives once, unconditionally, in
                ~/styles/printPreview.css. Duplicating appearance here is
                exactly what let the preview drift from the downloaded
                PDF before. */}
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
