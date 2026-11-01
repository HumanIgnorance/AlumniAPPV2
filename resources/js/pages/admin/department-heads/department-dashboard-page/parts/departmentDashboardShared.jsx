import { Typography, Select } from "antd";
import { COLORS } from "~/config/theme";

export const { Title, Text } = Typography;

export const { Option } = Select;

export const courseFolders = [
    {
        id: 1,
        code: "BSIT",
        name: "Bachelor of Science in Information Technology",
        color: COLORS.f5222d,
    },
    {
        id: 2,
        code: "BSEd",
        name: "Bachelor in Teacher Education",
        color: COLORS.antdBlue,
    },
    {
        id: 3,
        code: "BEED",
        name: "Bachelor of Elementary Education",
        color: COLORS.antdBlue,
    },
    {
        id: 4,
        code: "BSBA",
        name: "Bachelor of Science in Business Administration",
        color: COLORS.antdGold,
    },
];
