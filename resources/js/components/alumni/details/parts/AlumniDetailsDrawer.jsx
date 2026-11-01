import React from "react";
import { BankOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Drawer, Row, Space } from "antd";
import { useAlumniDetailsContext } from "~/components/alumni/details/AlumniDetailsContext";
import { companyInfo } from "~/components/alumni/details/detailsConstants";
import ConfidentialNotice from "~/components/alumni/details/parts/ConfidentialNotice";
import DetailsHeader from "~/components/alumni/details/parts/DetailsHeader";
import DetailsMainColumn from "~/components/alumni/details/parts/DetailsMainColumn";
import DetailsSidebarColumn from "~/components/alumni/details/parts/DetailsSidebarColumn";
import FullDetailsSection from "~/components/alumni/details/parts/FullDetailsSection";

export default function AlumniDetailsDrawer() {
    const { visible, onCancel, loading, viewOnly, onSubmit } =
        useAlumniDetailsContext();

    return (
        <Drawer
            title={
                <Space>
                    <BankOutlined />
                    Alumni Registration Preview - {companyInfo.name}
                </Space>
            }
            open={visible}
            onClose={onCancel}
            width="100%"
            height="100%"
            className="preview-drawer"
            placement="right"
            extra={
                <Space>
                    <Button
                        icon={<CloseOutlined />}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Close
                    </Button>
                    {!viewOnly && (
                        <Button
                            type="primary"
                            onClick={onSubmit}
                            loading={loading}
                        >
                            Submit Application
                        </Button>
                    )}
                </Space>
            }
            styles={{
                body: { padding: 0 },
                header: { borderBottom: "1px solid var(--border)" },
            }}
        >
            <div className=" drawer-content">
                {/* Header Section - OCC Graduation Theme */}
                <DetailsHeader />

                {/* Main Content */}
                <div className="preview-body">
                    <Row gutter={[32, 24]}>
                        {/* Left Column - Main Content */}
                        <DetailsMainColumn />

                        {/* Right Column - Sidebar */}

                        {/* CHANGED: Use canViewFullDetails instead of role === "admin" */}
                        <DetailsSidebarColumn />
                    </Row>

                    {/* CHANGED: Show confidential message only when NOT canViewFullDetails */}
                    <ConfidentialNotice />
                    {/* CHANGED: Use canViewFullDetails instead of role === "admin" */}
                    <FullDetailsSection />
                </div>
            </div>
        </Drawer>
    );
}
