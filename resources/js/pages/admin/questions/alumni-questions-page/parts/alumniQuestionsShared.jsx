import { Typography, Select, Tabs, Input } from "antd";

export const { Title, Text, Paragraph } = Typography;

export const { Option } = Select;

export const { TabPane } = Tabs;

export const { TextArea } = Input;

// Normalize Upload's value so AntD shows existing images
export const normalizeUploadFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList ? e : e;
};
