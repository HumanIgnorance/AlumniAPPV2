import React from "react";
import {
    GithubOutlined,
    GlobalOutlined,
    LinkedinOutlined,
    TrophyOutlined,
    TwitterOutlined,
} from "@ant-design/icons";
import {
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Tag,
    Typography,
} from "antd";
import { statusColors } from "~/pages/auth/registration/registrationConstants";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";
import { industryOptions } from "~/utils/constant";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function CareerInfoStep() {
    const { statuses, setIsUnemployed, form, isUnemployed } =
        useRegistrationContext();

    return (
        <div className="form-step">
            <Title level={3}>Career Information</Title>
            <Text type="secondary">
                Tell us about your professional journey
            </Text>

            <Divider />

            <Row gutter={[24, 16]}>
                <Col xs={24}>
                    <Form.Item
                        name="employment_status_id"
                        label="Current Employment Status"
                        rules={[
                            {
                                required: true,
                                message: "Please select employment status",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            placeholder="Select your employment status"
                            onChange={(value) => {
                                const selected = statuses.find(
                                    (s) => s.id === value,
                                );

                                const unemployedSelected = selected?.status_name
                                    ?.toLowerCase()
                                    .includes("unemployed");

                                setIsUnemployed(unemployedSelected);

                                // Clear all fields when unemployed
                                if (unemployedSelected) {
                                    form.setFieldsValue({
                                        currentCompany: undefined,
                                        jobTitle: undefined,
                                        industry: undefined,
                                        yearsExperience: undefined,
                                        salaryRange: undefined,
                                        workLocation: undefined,
                                        careerGoals: undefined,
                                        previousCompanies: undefined,
                                    });
                                }
                            }}
                        >
                            {Array.isArray(statuses) &&
                                statuses.map((status) => (
                                    <Option key={status.id} value={status.id}>
                                        <Tag
                                            color={
                                                statusColors[
                                                    status.status_name
                                                ] || "default"
                                            }
                                        >
                                            {status.status_name}
                                        </Tag>
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                </Col>

                {!isUnemployed && (
                    <>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="currentCompany"
                                label="Current Company/Organization"
                            >
                                <Input
                                    size="large"
                                    placeholder="Enter your current company"
                                    prefix={<GlobalOutlined />}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="jobTitle"
                                label="Job Title/Position"
                            >
                                <Input
                                    size="large"
                                    placeholder="Enter your job title"
                                    prefix={<TrophyOutlined />}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item name="industry" label="Industry">
                                <Select
                                    size="large"
                                    disabled={isUnemployed}
                                    placeholder="Select industry"
                                >
                                    {industryOptions.map((industry) => (
                                        <Option key={industry} value={industry}>
                                            {industry}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="yearsExperience"
                                label="Years of Experience"
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    size="large"
                                    disabled={isUnemployed}
                                    min={1} // minimum 1
                                    max={10} // maximum 10
                                    step={1} // only whole numbers
                                    stringMode={false}
                                    parser={(value) => value.replace(/\D/g, "")} // remove non-numeric characters
                                    placeholder="0"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="salaryRange"
                                label="Current Annual Salary Range (PHP)"
                            >
                                <Select
                                    size="large"
                                    disabled={isUnemployed}
                                    placeholder="Select annual salary range"
                                >
                                    <Option value="0-150000">
                                        ₱0 - ₱150,000 per year
                                    </Option>
                                    <Option value="150001-300000">
                                        ₱150,001 - ₱300,000 per year
                                    </Option>
                                    <Option value="300001-500000">
                                        ₱300,001 - ₱500,000 per year
                                    </Option>
                                    <Option value="500001-750000">
                                        ₱500,001 - ₱750,000 per year
                                    </Option>
                                    <Option value="750001-1000000">
                                        ₱750,001 - ₱1,000,000 per year
                                    </Option>
                                    <Option value="1000001-1250000">
                                        ₱1,000,001 - ₱1,250,000 per year
                                    </Option>
                                    <Option value="1250001-1500000">
                                        ₱1,250,001 - ₱1,500,000 per year
                                    </Option>
                                    <Option value="prefer_not_to_say">
                                        Prefer not to say
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="workLocation"
                                label="Work Location"
                            >
                                <Input
                                    size="large"
                                    disabled={isUnemployed}
                                    placeholder="City, State, Country"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="careerGoals"
                                label="Career Goals & Aspirations"
                            >
                                <TextArea
                                    rows={3}
                                    disabled={isUnemployed}
                                    placeholder="Describe your career goals and where you see yourself in the next 5 years..."
                                    maxLength={400}
                                    showCount
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="previousCompanies"
                                label="Previous Companies/Positions"
                            >
                                <TextArea
                                    rows={3}
                                    disabled={isUnemployed}
                                    placeholder="List your previous work experiences (Company - Position - Duration)..."
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>
                        </Col>
                    </>
                )}

                <Divider />

                <Col xs={24}>
                    <Title level={5}>
                        <GlobalOutlined /> Social Media & Professional Links
                    </Title>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="linkedin" label="LinkedIn Profile">
                        <Input
                            size="large"
                            placeholder="https://linkedin.com/in/yourprofile"
                            prefix={<LinkedinOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="github" label="GitHub Profile">
                        <Input
                            size="large"
                            placeholder="https://github.com/yourusername"
                            prefix={<GithubOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="portfolio" label="Portfolio Website">
                        <Input
                            size="large"
                            placeholder="https://yourportfolio.com"
                            prefix={<GlobalOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="twitter" label="Twitter/X Profile">
                        <Input
                            size="large"
                            placeholder="https://twitter.com/yourusername"
                            prefix={<TwitterOutlined />}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
}
