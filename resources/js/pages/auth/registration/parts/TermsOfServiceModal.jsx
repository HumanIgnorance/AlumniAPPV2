import React from "react";
import {
    BookOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    GlobalOutlined,
    IdcardOutlined,
    MailOutlined,
    SafetyCertificateOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { Button, Divider, Modal, Space, Typography } from "antd";
import { COLORS } from "~/config/theme";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";

const { Title, Paragraph } = Typography;

export default function TermsOfServiceModal() {
    const { isTermsModalOpen, setIsTermsModalOpen } = useRegistrationContext();

    return (
        <Modal
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <IdcardOutlined
                        style={{ fontSize: "20px", color: COLORS.antdBlue }}
                    />
                    <span>Terms of Service</span>
                </div>
            }
            open={isTermsModalOpen}
            onCancel={() => setIsTermsModalOpen(false)}
            footer={[
                <Button
                    key="close"
                    type="primary"
                    onClick={() => setIsTermsModalOpen(false)}
                >
                    Close
                </Button>,
            ]}
            width={700}
            styles={{
                body: { maxHeight: "60vh", overflowY: "auto" },
            }}
        >
            <Divider />

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div>
                    <Title level={5}>
                        <CheckCircleOutlined /> 1. Acceptance of Terms
                    </Title>
                    <Paragraph>
                        These Terms of Service govern your use of the Opol
                        Community College Alumni Information System
                        (alumni.occph.com), operated by the{" "}
                        <strong>Alumni Office</strong> in coordination with the{" "}
                        <strong>Guidance and Counseling Office</strong>. By
                        registering as an alumni member, you agree to comply
                        with these Terms and all applicable Philippine laws,
                        including the Data Privacy Act of 2012 (RA 10173). If
                        you do not agree with any part of these Terms, please do
                        not complete the registration process.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <IdcardOutlined /> 2. Eligibility and Accurate
                        Information
                    </Title>
                    <Paragraph>
                        Registration is open to individuals who have studied at
                        or graduated from Opol Community College. You agree to
                        provide accurate, current, and complete information,
                        including truthful academic records and valid
                        identification documents, and to update such information
                        as necessary. Submitting false, fraudulent, or
                        misleading information, including falsified IDs or
                        academic documents, may result in denial or termination
                        of your alumni membership and, where applicable,
                        referral to appropriate authorities.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <TrophyOutlined /> 3. Guidance Office Tracer Study and
                        Career Tracking
                    </Title>
                    <Paragraph>
                        By registering, you acknowledge that the Guidance
                        Counselor may contact you regarding tracer studies,
                        employment surveys, and career or further-education
                        opportunities, and may use your employment and feedback
                        data (including quiz responses) to support institutional
                        planning, accreditation, and reporting to the College
                        and, where required, CHED. Participation in optional
                        surveys and quizzes helps the College improve programs
                        for current and future students but does not affect your
                        standing as a registered alumnus.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <GlobalOutlined /> 4. Use of Services
                    </Title>
                    <Paragraph>
                        Alumni services are provided for networking,
                        professional development, job referrals, events, and
                        maintaining your connection with Opol Community College.
                        You agree not to use these services for any unlawful
                        purpose, to harass or spam other members, to
                        misrepresent your identity, or to engage in any activity
                        that could harm the College's reputation, the Alumni or
                        Guidance Office, or other members' experience.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <BookOutlined /> 5. Intellectual Property
                    </Title>
                    <Paragraph>
                        All content provided through the alumni platform,
                        including text, graphics, logos, and software, is the
                        property of Opol Community College or its content
                        suppliers and is protected under the Intellectual
                        Property Code of the Philippines (RA 8293). You may not
                        reproduce, distribute, or create derivative works from
                        this content without prior written permission.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <SafetyCertificateOutlined /> 6. Data Privacy
                    </Title>
                    <Paragraph>
                        Your use of this system is also governed by our Privacy
                        Policy, which explains how the Alumni Office and
                        Guidance and Counseling Office collect, use, and protect
                        your personal data in compliance with RA 10173. By
                        agreeing to these Terms, you confirm that you have read
                        and understood the Privacy Policy.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <ClockCircleOutlined /> 7. Modifications and Termination
                    </Title>
                    <Paragraph>
                        We reserve the right to modify these Terms at any time.
                        Material changes will be posted on the platform and,
                        where required by law, we will seek your renewed
                        consent. Continued use of alumni services after changes
                        take effect constitutes acceptance of the modified
                        Terms. We may suspend or terminate your account for
                        violations of these Terms or of the Privacy Policy.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <MailOutlined /> 8. Limitation of Liability and
                        Governing Law
                    </Title>
                    <Paragraph>
                        Alumni services are provided on an "as is" basis. Opol
                        Community College makes no warranties, express or
                        implied, regarding the accuracy, reliability, or
                        availability of the services, and shall not be liable
                        for indirect, incidental, or consequential damages
                        arising from your use of the system, except as required
                        by law. These Terms are governed by the laws of the
                        Republic of the Philippines. For questions, concerns, or
                        to exercise your rights under these Terms, please
                        contact the Alumni Office through the Messages page or
                        visit us at ZONE C. Salva St, Opol, 9016 Misamis
                        Oriental.
                    </Paragraph>
                </div>
            </Space>
        </Modal>
    );
}
