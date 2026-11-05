import React from "react";
import { BankOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Drawer, Grid, Row, Space } from "antd";
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
    // Phones: short one-line title + Close/Submit moved to a bottom bar,
    // so nothing can overlap in the header on any screen width.
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    const actionButtons = (
        <>
            <Button
                icon={<CloseOutlined />}
                onClick={onCancel}
                disabled={loading}
                size={isMobile ? "large" : "middle"}
                block={isMobile}
            >
                Close
            </Button>
            {!viewOnly && (
                <Button
                    type="primary"
                    onClick={onSubmit}
                    loading={loading}
                    size={isMobile ? "large" : "middle"}
                    block={isMobile}
                >
                    Submit Application
                </Button>
            )}
        </>
    );

    return (
        <Drawer
            title={
                <span className="preview-drawer-title">
                    <BankOutlined />
                    <span className="preview-drawer-title-text">
                        {isMobile
                            ? "Registration Preview"
                            : `Alumni Registration Preview - ${companyInfo.name}`}
                    </span>
                </span>
            }
            open={visible}
            onClose={onCancel}
            width="100%"
            height="100%"
            className="preview-drawer"
            placement="right"
            extra={!isMobile ? <Space>{actionButtons}</Space> : null}
            footer={
                isMobile ? (
                    <div className="preview-drawer-footer">
                        {actionButtons}
                    </div>
                ) : null
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
