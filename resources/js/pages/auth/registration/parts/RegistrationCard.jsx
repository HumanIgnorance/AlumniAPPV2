import React from "react";
import {
    ArrowLeftOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Divider,
    Form,
    Progress,
    Space,
    Steps,
    Tag,
    Typography,
} from "antd";
import { companyInfo } from "~/config/institution";
import { COLORS } from "~/config/theme";
import AcademicInfoStep from "~/pages/auth/registration/parts/AcademicInfoStep";
import CareerInfoStep from "~/pages/auth/registration/parts/CareerInfoStep";
import DocumentsStep from "~/pages/auth/registration/parts/DocumentsStep";
import PersonalInfoStep from "~/pages/auth/registration/parts/PersonalInfoStep";
import ReviewSubmitStep from "~/pages/auth/registration/parts/ReviewSubmitStep";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";

const { Title, Text } = Typography;
const { Step } = Steps;

export default function RegistrationCard() {
    const {
        handleBackToLogin,
        calculateProgress,
        currentStep,
        steps,
        form,
        saveFormData,
        handlePrev,
        handleNext,
        handlePreview,
        profileImage,
        idDocuments,
    } = useRegistrationContext();

    return (
        <Card className="registration-card">
            <div className="back-to-login-section">
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBackToLogin}
                    className="back-to-login-btn"
                >
                    Back to Login
                </Button>
            </div>
            {/* ===== Modern Hero Header ===== */}
            <div className="company-header">
                <div className="company-logo-section">
                    <Avatar
                        src={companyInfo.logo}
                        size={64}
                        shape="square"
                        className="company-logo"
                    />
                    <div className="company-info">
                        <Tag
                            className="ant-tag"
                            color="processing"
                            style={{ marginBottom: 8 }}
                        >
                            <SafetyCertificateOutlined /> Official Alumni Portal
                        </Tag>
                        <Title level={2} className="company-name">
                            {companyInfo.name}
                        </Title>
                        <Text className="company-slogan">
                            {companyInfo.slogan}
                        </Text>
                        <div className="company-details">
                            <Space size={[16, 6]} wrap>
                                <Space size={6}>
                                    <GlobalOutlined />
                                    <Text type="secondary">
                                        {companyInfo.website}
                                    </Text>
                                </Space>
                                <Space size={6}>
                                    <EnvironmentOutlined />
                                    <Text type="secondary">
                                        {companyInfo.address}
                                    </Text>
                                </Space>
                            </Space>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Registration Title ===== */}
            <div className="registration-header">
                <Title level={3}>Alumni Registration Portal</Title>
                <Text type="secondary">
                    Join the {companyInfo.name} alumni network and stay
                    connected with classmates, mentors, and your university
                    community.
                </Text>
            </div>

            <Divider />

            {/* Progress Bar */}
            <div className="progress-section">
                <Progress
                    percent={calculateProgress()}
                    showInfo={false}
                    strokeColor={{
                        "0%": COLORS.indigo600,
                        "100%": COLORS.sky500,
                    }}
                />
                <Text type="secondary">
                    {typeof currentStep === "number"
                        ? `Step ${currentStep + 1} of ${steps.length}`
                        : "Review your application"}
                </Text>
            </div>

            {/* Stepper */}
            <Steps
                current={typeof currentStep === "number" ? currentStep : steps.length - 1}
                className="registration-steps"
            >
                {steps.map((step, index) => (
                    <Step key={index} title={step.title} icon={step.icon} />
                ))}
            </Steps>

            <Divider />

            {/* Form Content */}
            <Form
                form={form}
                layout="vertical"
                className="registration-form"
                onValuesChange={saveFormData}
                initialValues={{
                    gender: "male",
                    newsletter: true,
                    contactPermission: true,
                }}
            >
                {/* {currentStep === 0 && <PersonalInfoStep />}
                {currentStep === 1 && <AcademicInfoStep />}
                {currentStep === 2 && <CareerInfoStep />}
                {currentStep === 3 && <DocumentsStep />}
                {currentStep === 4 && <ReviewSubmitStep />} */}
                {(currentStep === 0 || currentStep === "all") && (
                    <PersonalInfoStep />
                )}
                {(currentStep === 1 || currentStep === "all") && (
                    <AcademicInfoStep />
                )}
                {(currentStep === 2 || currentStep === "all") && (
                    <CareerInfoStep />
                )}
                {(currentStep === 3 || currentStep === "all") && (
                    <DocumentsStep />
                )}
                {(currentStep === 4 || currentStep === "all") && (
                    <ReviewSubmitStep />
                )}
            </Form>

            {/* Navigation Buttons */}
            <Divider />

            <div className="navigation-buttons">
                <Space size="large">
                    {currentStep > 0 && (
                        <Button size="large" onClick={handlePrev}>
                            Previous
                        </Button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                        <Button
                            type="primary"
                            size="large"
                            onClick={handlePreview}
                            disabled={!profileImage || idDocuments.length === 0}
                        >
                            Submit Application
                        </Button>
                    )}
                </Space>
            </div>

            {/* Footer */}
            <Divider />
            <div className="registration-footer">
                <Space
                    direction="vertical"
                    align="center"
                    style={{ width: "100%" }}
                >
                    {/* <Text type="secondary">{companyInfo.name} Alumni Association</Text> */}
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        © 2025 {companyInfo.name}. All rights reserved.
                    </Text>
                </Space>
            </div>
        </Card>
    );
}
