import React from "react";
import {
    ClockCircleOutlined,
    EyeOutlined,
    GlobalOutlined,
    IdcardOutlined,
    MailOutlined,
    SafetyCertificateOutlined,
    TrophyOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Alert, Button, Divider, Modal, Space, Typography } from "antd";
import { COLORS } from "~/config/theme";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";

const { Title, Paragraph } = Typography;

export default function PrivacyPolicyModal() {
    const { isPrivacyModalOpen, setIsPrivacyModalOpen } =
        useRegistrationContext();

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
                    <SafetyCertificateOutlined
                        style={{ fontSize: "20px", color: COLORS.antdBlue }}
                    />
                    <span>Privacy Policy</span>
                </div>
            }
            open={isPrivacyModalOpen}
            onCancel={() => setIsPrivacyModalOpen(false)}
            footer={[
                <Button
                    key="close"
                    type="primary"
                    onClick={() => setIsPrivacyModalOpen(false)}
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

            <Alert
                message="Compliant with the Data Privacy Act of 2012 (Republic Act No. 10173)"
                description="Opol Community College processes your personal data in accordance with RA 10173, its Implementing Rules and Regulations, and the issuances of the National Privacy Commission (NPC)."
                type="info"
                showIcon
                icon={<SafetyCertificateOutlined />}
                style={{ marginBottom: 16 }}
            />

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div>
                    <Title level={5}>
                        <SafetyCertificateOutlined /> 1. Who We Are
                    </Title>
                    <Paragraph>
                        This Privacy Policy is issued by the{" "}
                        <strong>Opol Community College Alumni Office</strong>,
                        in coordination with the{" "}
                        <strong>Guidance and Counseling Office</strong>, both
                        based at ZONE C. Salva St, Opol, 9016 Misamis Oriental.
                        Together they act as the Personal Information Controller
                        (PIC) for the alumni registration and tracing system
                        found at alumni.occph.com, and are responsible for the
                        lawful, fair, and transparent processing of your
                        personal data.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <IdcardOutlined /> 2. Information We Collect
                    </Title>
                    <Paragraph>
                        When you register, we collect personal information that
                        you voluntarily provide, including your full name, birth
                        date, gender, contact number, email address, and home
                        address. We also collect academic records (course,
                        student ID number, graduation year, honors, thesis
                        title) and professional information (employer, job
                        title, industry, years of experience, and work
                        location). Uploaded files such as your profile photo,
                        student/alumni ID, government-issued ID, diploma, or
                        transcript may constitute{" "}
                        <strong>sensitive personal information</strong> under
                        Section 3(l) of RA 10173 and are treated with heightened
                        protection.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <TrophyOutlined /> 3. Role of the Guidance and
                        Counseling Office
                    </Title>
                    <Paragraph>
                        The <strong>Guidance Counselor</strong>, through the
                        Guidance and Counseling Office, collects and processes
                        alumni data as part of the College's institutional
                        tracer study and career-tracking program. This includes
                        your employment status, employer information, and
                        feedback from the rating and image-based quizzes. This
                        data helps the Guidance Office assess graduate outcomes,
                        recommend career and further-education pathways, refer
                        qualified alumni to job opportunities, and report
                        aggregated, de-identified statistics to school
                        administration and, where required, to the Commission on
                        Higher Education (CHED). The Guidance Counselor accesses
                        only the information reasonably necessary for these
                        functions and is bound by the same confidentiality
                        obligations as Alumni Office staff.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <EyeOutlined /> 4. Purpose and Legal Basis for
                        Processing
                    </Title>
                    <Paragraph>
                        Your data is processed based on your{" "}
                        <strong>consent</strong> (RA 10173, Sec. 12(a) and Sec.
                        13(a) for sensitive information), given when you tick
                        the registration consent box, and is used to: maintain
                        accurate alumni records; conduct tracer studies and
                        career/employment tracking through the Guidance
                        Counselor; facilitate alumni networking, events, and job
                        postings; send official updates and notifications; and
                        improve Alumni Office and Guidance Office programs and
                        services. We do not use your data for any purpose
                        incompatible with these declared purposes, and we never
                        sell your personal data.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <GlobalOutlined /> 5. Disclosure and Sharing of
                        Information
                    </Title>
                    <Paragraph>
                        Access to your personal data is limited to authorized
                        Alumni Office and Guidance and Counseling Office
                        personnel who need it to perform their official
                        functions. Your profile is visible to other verified
                        alumni only for directory and networking purposes;
                        sensitive documents (IDs, diploma, transcript) are never
                        shown to other alumni. We may share limited employment
                        or contact information with prospective employers or
                        partner organizations only with your explicit, separate
                        consent, for job-referral purposes. We may also disclose
                        information when required by law, court order, or a
                        lawful request from CHED or another government agency.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <SafetyCertificateOutlined /> 6. Data Protection and
                        Security Measures
                    </Title>
                    <Paragraph>
                        We implement organizational, physical, and technical
                        security measures proportionate to the nature of the
                        data we hold, consistent with the NPC's security
                        standards. These include encrypted storage, secure
                        authentication, access controls restricted to authorized
                        personnel, and regular review of our systems. In the
                        event of a personal data breach that poses real risk to
                        you, we will notify the National Privacy Commission and
                        affected data subjects in accordance with RA 10173 and
                        its IRR.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <ClockCircleOutlined /> 7. Data Retention
                    </Title>
                    <Paragraph>
                        Your personal data is retained for as long as you remain
                        an active alumni member and for a reasonable period
                        thereafter for institutional record-keeping, tracer
                        studies, and accreditation reporting, or as required by
                        applicable law and school policy. Data that is no longer
                        necessary for these purposes will be securely disposed
                        of or anonymized.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <UserOutlined /> 8. Your Rights as a Data Subject
                    </Title>
                    <Paragraph>
                        Under Section 16 of RA 10173, you have the right to: be
                        informed that your data is being processed; access your
                        personal data; request correction of inaccurate data;
                        object to or withdraw consent for processing; request
                        erasure or blocking of data that is incomplete,
                        outdated, or unlawfully obtained; data portability; and
                        to be indemnified for damages arising from unlawful
                        processing. To exercise any of these rights, please
                        contact the Alumni Office or Guidance and Counseling
                        Office through the Messages page of this system, or
                        visit our office at ZONE C. Salva St, Opol, 9016 Misamis
                        Oriental. We will act on verified requests within a
                        reasonable period, consistent with NPC guidelines.
                    </Paragraph>
                </div>

                <div>
                    <Title level={5}>
                        <MailOutlined /> 9. Complaints and Contact
                    </Title>
                    <Paragraph>
                        If you believe your personal data has been processed
                        unlawfully, you may raise your concern with the Alumni
                        Office first. You also have the right to file a
                        complaint with the{" "}
                        <strong>National Privacy Commission</strong> (
                        <a
                            href="https://www.privacy.gov.ph"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.privacy.gov.ph
                        </a>
                        ) if the matter is not resolved to your satisfaction. We
                        will notify you of any material changes to this Privacy
                        Policy and, where required, seek your renewed consent
                        before implementing them.
                    </Paragraph>
                </div>
            </Space>
        </Modal>
    );
}
