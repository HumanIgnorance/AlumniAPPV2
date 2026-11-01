// Job-post sections shown on the public home and job-posts pages.
import { CheckCircleOutlined, ClockCircleOutlined, FileOutlined } from "@ant-design/icons";

export const JOB_SECTIONS = [
    { value: "full-time", label: "Full-time", icon: <CheckCircleOutlined /> },
    { value: "part-time", label: "Part-time", icon: <ClockCircleOutlined /> },
    { value: "contract", label: "Contract", icon: <FileOutlined /> },
];
