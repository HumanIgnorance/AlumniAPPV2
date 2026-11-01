import React from "react";
import { IdcardOutlined, WarningOutlined } from "@ant-design/icons";
import {
    Col,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Switch,
    Typography,
} from "antd";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";
import axios from "~/utils/axiosConfig";
import { awardsOptions, latinHonors } from "~/utils/constant";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function AcademicInfoStep() {
    const {
        isLoading,
        courses,
        showImportantNotice,
        setShowImportantNotice,
        form,
        setSelectedGradYear,
        selectedGradYear,
    } = useRegistrationContext();

    return (
        <div className="form-step">
            <Title level={3}>Academic Information</Title>
            <Text type="secondary">
                Tell us about your educational background
            </Text>

            <Divider />

            <Row gutter={[24, 16]}>
                <Col xs={24}>
                    <Form.Item
                        name="course_id"
                        label="Course/Degree"
                        rules={[
                            {
                                required: true,
                                message: "Please select your course",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            placeholder="Select your course"
                            showSearch
                            optionFilterProp="children"
                            loading={isLoading}
                        >
                            {Array.isArray(courses) &&
                                courses.map((course) => (
                                    <Option key={course.id} value={course.id}>
                                        {course.course_code}(
                                        {course.course_name})
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                </Col>
                {showImportantNotice && (
                    <Col span={24}>
                        <div className="alumni-important-notice" role="alert">
                            <button
                                type="button"
                                className="alumni-important-notice__close"
                                onClick={() => setShowImportantNotice(false)}
                                aria-label="Dismiss notice"
                            >
                                ×
                            </button>
                            <div className="alumni-important-notice__icon">
                                <WarningOutlined />
                            </div>
                            <div className="alumni-important-notice__body">
                                <div className="alumni-important-notice__title">
                                    Important Notice
                                </div>
                                <p className="alumni-important-notice__text">
                                    Your <strong>Email Address</strong> and{" "}
                                    <strong>Student ID Number</strong> must{" "}
                                    <strong>exactly match</strong> your records
                                    in the{" "}
                                    <strong>
                                        Student Information System (SIS)
                                    </strong>
                                    . We use these to verify you are a
                                    legitimate student / alumnus of Opol
                                    Community College.
                                </p>
                                <ul className="alumni-important-notice__list">
                                    <li>
                                        Use your <strong>@gmail.com</strong>{" "}
                                        account registered in SIS.
                                    </li>
                                    <li>
                                        Student ID format:{" "}
                                        <strong>YYYY-S-NNNNN</strong> (e.g.,{" "}
                                        <strong>2021-2-04062</strong>).
                                    </li>
                                    <li>
                                        Mismatched, fake, or invalid information
                                        will result in{" "}
                                        <strong>
                                            automatic account rejection
                                        </strong>
                                        .
                                    </li>
                                </ul>
                                <p className="alumni-important-notice__text">
                                    Forgot your email or Student ID?{" "}
                                    <a
                                        href="https://sis.occph.com/login"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="alumni-important-notice__link"
                                    >
                                        Recover them on SIS →
                                    </a>
                                </p>
                            </div>
                        </div>
                    </Col>
                )}
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="studentId"
                        label={
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <IdcardOutlined />
                                Student ID
                            </span>
                        }
                        extra="Just type the numbers. Dashes are automatically added."
                        rules={[
                            {
                                required: true,
                                message: "Please enter your student ID",
                            },
                            {
                                pattern: /^\d{4}-\d-\d{5}$/,
                                message:
                                    "Format must be YYYY-S-NNNNN (e.g., 2021-2-04062)",
                            },
                            {
                                validator: async (_, value) => {
                                    if (!value) return Promise.resolve();

                                    // Validate format first
                                    const studentIdRegex = /^\d{4}-\d-\d{5}$/;

                                    if (!studentIdRegex.test(value)) {
                                        return Promise.reject(
                                            new Error(
                                                "Format must be YYYY-S-NNNNN",
                                            ),
                                        );
                                    }

                                    try {
                                        const res = await axios.get(
                                            "check-student-id",
                                            {
                                                params: {
                                                    studentId: value,
                                                },

                                                // IMPORTANT
                                                silent: true,
                                            },
                                        );

                                        if (res.data.exists) {
                                            return Promise.reject(
                                                new Error(
                                                    "This student ID is already in use",
                                                ),
                                            );
                                        }

                                        return Promise.resolve();
                                    } catch (err) {
                                        console.error(
                                            "Student ID validation error:",
                                            err,
                                        );

                                        // Prevent annoying refresh/reset feeling
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ]}
                        validateTrigger={["onBlur"]}
                    >
                        <Input
                            size="large"
                            placeholder="2021-2-04062"
                            maxLength={12}
                            onChange={(e) => {
                                let value = e.target.value;

                                // Remove all characters except numbers
                                value = value.replace(/[^0-9]/g, "");

                                // Apply formatting as YYYY-S-NNNNN
                                if (value.length > 4)
                                    value =
                                        value.slice(0, 4) +
                                        "-" +
                                        value.slice(4);
                                if (value.length > 6)
                                    value =
                                        value.slice(0, 6) +
                                        "-" +
                                        value.slice(6);

                                form.setFieldsValue({ studentId: value });
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="graduationYear"
                        label="Graduation Year (4th Year)"
                        rules={[
                            {
                                required: true,
                                message: "Please select graduation year",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            placeholder="Expected Graduation Year"
                            onChange={(value) => {
                                setSelectedGradYear(value);
                                form.setFieldsValue({
                                    enrollmentYear: value - 1,
                                }); // reset enrollment
                            }}
                        >
                            {Array.from({ length: 30 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="enrollmentYear"
                        label="Enrollment Year (4th Year)"
                        rules={[
                            {
                                required: true,
                                message: "Please select your enrollment year",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            placeholder="Enrollment year"
                            disabled={!selectedGradYear}
                        >
                            {selectedGradYear && (
                                <Option value={selectedGradYear - 1}>
                                    {selectedGradYear - 1}
                                </Option>
                            )}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="honors" label="Honors/Awards">
                        <Select
                            mode="tags"
                            size="large"
                            placeholder="Add honors or choose awards received"
                            tokenSeparators={[","]}
                            onChange={(values) => {
                                let newValues = [...values];

                                // "None" is exclusive
                                if (newValues.includes("None")) {
                                    if (
                                        newValues[newValues.length - 1] ===
                                        "None"
                                    ) {
                                        newValues = ["None"];
                                    } else {
                                        newValues = newValues.filter(
                                            (item) => item !== "None",
                                        );
                                    }
                                }

                                // Only one Latin Honor can exist
                                const selectedLatinHonors = newValues.filter(
                                    (item) =>
                                        latinHonors.includes(item) &&
                                        item !== "None",
                                );

                                if (selectedLatinHonors.length > 1) {
                                    const latestLatinHonor =
                                        selectedLatinHonors[
                                            selectedLatinHonors.length - 1
                                        ];

                                    newValues = newValues.filter(
                                        (item) =>
                                            !latinHonors.includes(item) ||
                                            item === latestLatinHonor,
                                    );
                                }

                                form.setFieldsValue({
                                    honors: newValues,
                                });
                            }}
                        >
                            {awardsOptions.map((award) => (
                                <Option key={award} value={award}>
                                    {award}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item
                        name="thesisTitle"
                        label="Thesis/Capstone Title"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please enter your thesis or capstone project title",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your thesis or capstone project title"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="academicAchievements"
                        label="Academic Achievements"
                    >
                        <TextArea
                            rows={3}
                            placeholder="List any academic achievements, research projects, or notable accomplishments..."
                            maxLength={300}
                            showCount
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="extracurricular"
                        label="Extracurricular Activities"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Describe your involvement in clubs, organizations, sports, or other activities..."
                            maxLength={300}
                            showCount
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="continueEducation"
                        label="Plan to Continue Education?"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
}
