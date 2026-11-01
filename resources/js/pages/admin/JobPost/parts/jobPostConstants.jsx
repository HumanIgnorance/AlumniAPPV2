import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    FileOutlined,
    IdcardOutlined,
    TeamOutlined,
} from "@ant-design/icons";

// Accepted/legitimate job reference sources shown to admins/alumni
export const REFERENCE_SOURCE_OPTIONS = [
    { value: "facebook", label: "Facebook Job Post" },
    { value: "company_website", label: "Company Website" },
    { value: "linkedin", label: "LinkedIn Job Post" },
    { value: "jobstreet", label: "JobStreet" },
    { value: "indeed", label: "Indeed" },
    { value: "kalibrr", label: "Kalibrr" },
    { value: "official_portal", label: "Official Recruitment Portal" },
    { value: "other", label: "Other" },
];

export const LEGITIMATE_JOB_SOURCES = [
    { name: "LinkedIn", url: "https://www.linkedin.com/jobs" },
    { name: "JobStreet", url: "https://www.jobstreet.com.ph" },
    { name: "Indeed", url: "https://ph.indeed.com" },
    { name: "Kalibrr", url: "https://www.kalibrr.com" },
    { name: "Facebook Jobs", url: "https://www.facebook.com" },
    { name: "DOLE Jobs", url: "https://jobs.dole.gov.ph" },
    { name: "Government Careers", url: "https://csc.gov.ph/career" },
];

// ============ VALID ID TYPES LIST ============
export const VALID_ID_TYPES = [
    {
        value: "philid",
        label: "Philippine National ID (PhilID/ePhilID)",
        icon: <IdcardOutlined />,
    },
    {
        value: "umid",
        label: "UMID (Unified Multi-Purpose ID)",
        icon: <IdcardOutlined />,
    },
    { value: "passport", label: "Passport", icon: <IdcardOutlined /> },
    {
        value: "drivers_license",
        label: "Driver's License",
        icon: <IdcardOutlined />,
    },
    { value: "sss", label: "SSS ID", icon: <IdcardOutlined /> },
    { value: "philhealth", label: "PhilHealth ID", icon: <IdcardOutlined /> },
    { value: "pagibig", label: "Pag-IBIG ID", icon: <IdcardOutlined /> },
    { value: "prc", label: "PRC ID", icon: <IdcardOutlined /> },
    { value: "nbi", label: "NBI Clearance", icon: <IdcardOutlined /> },
    { value: "voters", label: "Voter's ID", icon: <IdcardOutlined /> },
];

// ============ ACCEPTED FILE FORMATS (BASED ON BACKEND VALIDATION) ============
export const ACCEPTED_FORMATS = {
    BANNER_IMAGE: {
        accept: ".jpeg,.jpg,.png,.gif,.webp",
        hint: "Accepted formats: JPEG, JPG, PNG, GIF, WEBP (Max: 5MB)",
    },
    RESUME: {
        accept: ".pdf,.doc,.docx",
        hint: "Accepted formats: PDF, DOC, DOCX (Max: 5MB)",
    },
    ID_DOCUMENT: {
        accept: ".jpg,.jpeg",
        hint: "Accepted formats: JPG, JPEG (Max: 5MB)",
    },
    OTHER_DOCUMENT: {
        accept: ".jpg,.jpeg,.pdf,.doc,.docx",
        hint: "Accepted formats: JPG, JPEG, PDF, DOC, DOCX (Max: 5MB)",
    },
};

// Job Type Options with colors and icons
export const jobTypeOptions = [
    {
        value: "all",
        label: "All Types",
        color: "default",
        icon: <TeamOutlined />,
    },
    {
        value: "Full-time",
        label: "Full-time",
        color: "green",
        icon: <CheckCircleOutlined />,
    },
    {
        value: "Part-time",
        label: "Part-time",
        color: "blue",
        icon: <ClockCircleOutlined />,
    },
    {
        value: "Contract",
        label: "Contract",
        color: "orange",
        icon: <FileOutlined />,
    },
];

// Status Options
export const statusOptions = [
    { value: "all", label: "All Status", color: "default" },
    { value: "pending", label: "Pending Review", color: "orange" },
    { value: "approved", label: "Approved", color: "green" },
    { value: "rejected", label: "Rejected", color: "red" },
];

// Sort Options
export const sortOptions = [
    { value: "date-desc", label: "Date: Latest First" },
    { value: "date-asc", label: "Date: Oldest First" },
    { value: "salary-desc", label: "Salary: High to Low" },
    { value: "salary-asc", label: "Salary: Low to High" },
    { value: "title-asc", label: "Title: A to Z" },
    { value: "title-desc", label: "Title: Z to A" },
];

// Expiration Days Options
export const expirationOptions = [
    { value: null, label: "No Expiration" },
    { value: 7, label: "1 Week" },
    { value: 14, label: "2 Weeks" },
    { value: 21, label: "3 Weeks" },
    { value: 30, label: "1 Month" },
    { value: 60, label: "2 Months" },
    { value: 90, label: "3 Months" },
    { value: 180, label: "6 Months" },
    { value: 365, label: "1 Year" },
];
