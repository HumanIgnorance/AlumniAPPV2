// Shared option lists for alumni forms (registration + profile). Edit here once.
import { IdcardOutlined, UserOutlined, FileImageOutlined, SafetyCertificateOutlined, BookOutlined } from "@ant-design/icons";

export const ID_TYPES = [
    { value: "student_id", label: "Student ID Card", icon: <IdcardOutlined /> },
    { value: "alumni_id", label: "Alumni ID Card", icon: <UserOutlined /> },
    {
        value: "government_id",
        label: "Government ID",
        icon: <FileImageOutlined />,
    },
    { value: "diploma", label: "Diploma", icon: <SafetyCertificateOutlined /> },
    { value: "transcript", label: "Transcript", icon: <BookOutlined /> },
];

export const employmentStatusOptions = [
    { value: "employed", label: "Employed", color: "green" },
    { value: "unemployed", label: "Unemployed", color: "red" },
    { value: "self-employed", label: "Self-Employed", color: "orange" },
    { value: "freelancer", label: "Freelancer", color: "blue" },
    { value: "graduate_student", label: "Graduate Student", color: "purple" },
    { value: "entrepreneur", label: "Entrepreneur", color: "cyan" },
    {
        value: "seeking_opportunities",
        label: "Seeking Opportunities",
        color: "gold",
    },
];
