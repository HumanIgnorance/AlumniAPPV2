import React from "react";
import {
    CameraOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    Radio,
    Row,
    Select,
    Typography,
    Upload,
} from "antd";
import dayjs from "dayjs";
import { useRegistrationContext } from "~/pages/auth/registration/RegistrationContext";
import axios from "~/utils/axiosConfig";

// Real-world names: accents (Peña), hyphens, apostrophes, periods (Jr.)
const NAME_PATTERN = /^[\p{L}\s.'’-]+$/u;
const NAME_PATTERN_OPTIONAL = /^[\p{L}\s.'’-]*$/u;

// "Peña-Dela Cruz" -> "penadelacruz": a-z only, so it is safe inside the
// occ.<lastname>.<firstword>@gmail.com rule and its RegExp.
const emailSlug = (value = "") =>
    String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z]/g, "")
        .toLowerCase();

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function PersonalInfoStep() {
    const {
        profileUploadProps,
        profileImage,
        profileUploadButton,
        setProfileImage,
        form,
        showImportantNotice,
        setShowImportantNotice,
    } = useRegistrationContext();

    return (
        <div className="form-step">
            <Title level={3} style={{ marginBottom: 0 }}>
                Personal Information
            </Title>

            <Text
                type="secondary"
                style={{
                    display: "block",
                    marginBottom: 24,
                }}
            >
                Tell us about yourself
            </Text>

            <Divider />

            <Row gutter={[24, 16]}>
                <Col span={24} className="avatar-upload-section">
                    <div className="avatar-upload">
                        <Text strong>Profile Picture</Text>
                        <div className="avatar-upload-container">
                            <Upload
                                {...profileUploadProps}
                                className="avatar-uploader"
                            >
                                {profileImage ? (
                                    <div className="avatar-preview">
                                        <img
                                            src={
                                                profileImage ||
                                                "/placeholder.svg"
                                            }
                                            alt="avatar"
                                        />
                                        <div className="avatar-edit-overlay">
                                            <CameraOutlined />
                                            <div>Change Photo</div>
                                        </div>
                                    </div>
                                ) : (
                                    profileUploadButton
                                )}
                            </Upload>
                            {profileImage && (
                                <Button
                                    type="link"
                                    danger
                                    onClick={() => setProfileImage(null)}
                                    className="remove-photo-btn"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                        <Text type="secondary" className="upload-hint">
                            Recommended: Square image, 500x500px, max 5MB
                        </Text>
                    </div>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="first_name"
                        label={
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <UserOutlined />
                                First Name
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "Please enter your first name",
                            },
                            {
                                pattern: NAME_PATTERN,
                                message: "First name may contain letters, spaces, hyphens, apostrophes and periods only",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your first name"
                            onChange={(e) => {
                                let value = e.target.value;

                                // Remove numbers & special characters
                                value = value.replace(/[^A-Za-z\s]/g, "");

                                // Update the form value properly
                                form.setFieldsValue({ first_name: value });
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="last_name"
                        label={
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <UserOutlined />
                                Last Name
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "Please enter your last name",
                            },
                            {
                                pattern: NAME_PATTERN,
                                message: "Last name may contain letters, spaces, hyphens, apostrophes and periods only",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your last name"
                            onChange={(e) => {
                                let value = e.target.value;

                                // Remove numbers & special characters
                                value = value.replace(/[^A-Za-z\s]/g, "");

                                // Update the form value properly
                                form.setFieldsValue({ last_name: value });
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="middle_name"
                        label={
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <UserOutlined />
                                Middle Name {"(Optional)"}
                            </span>
                        }
                        rules={[
                            {
                                pattern: NAME_PATTERN_OPTIONAL,
                                message:
                                    "Middle name may contain letters, spaces, hyphens, apostrophes and periods only",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your middle name"
                            onChange={(e) => {
                                let value = e.target.value;

                                // Remove any number or special characters
                                value = value.replace(/[^A-Za-z\s]/g, "");

                                // Update Ant Design form value properly
                                form.setFieldsValue({ middle_name: value });
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="suffix" label="Suffix">
                        <Select size="large" placeholder="Select suffix">
                            <Option value="">None</Option>
                            <Option value="Jr.">Jr.</Option>
                            <Option value="Sr.">Sr.</Option>
                            <Option value="II">II</Option>
                            <Option value="III">III</Option>
                            <Option value="IV">IV</Option>
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
                        name="email"
                        label={
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <MailOutlined />
                                Email Address
                            </span>
                        }
                        dependencies={["first_name", "last_name"]}
                        rules={[
                            {
                                required: true,
                                message: "Please enter your email",
                            },
                            {
                                type: "email",
                                message: "Please enter a valid email",
                            },
                            {
                                validator: async (_, value) => {
                                    if (!value) return Promise.resolve();

                                    const firstName =
                                        form
                                            .getFieldValue("first_name")
                                            ?.trim() || "";
                                    const lastName =
                                        form
                                            .getFieldValue("last_name")
                                            ?.trim() || "";

                                    // First word of the first name only
                                    const firstWord = emailSlug(
                                        firstName.split(/\s+/)[0],
                                    );

                                    // Remove spaces from last name
                                    const cleanLastName = emailSlug(lastName);

                                    // Email format:
                                    // occ.lastname.firstword(optional letters/numbers)@gmail.com
                                    const emailRegex = new RegExp(
                                        `^occ\\.${cleanLastName}\\.${firstWord}[a-zA-Z0-9]*@gmail\\.com$`,
                                        "i",
                                    );

                                    if (!emailRegex.test(value.trim())) {
                                        return Promise.reject(
                                            new Error(
                                                `Email must start with: occ.${cleanLastName}.${firstWord}@gmail.com`,
                                            ),
                                        );
                                    }

                                    try {
                                        const res = await axios.get(
                                            "check-email",
                                            {
                                                params: {
                                                    email: value.trim(),
                                                },
                                                silent: true,
                                            },
                                        );

                                        if (res.data.exists) {
                                            return Promise.reject(
                                                new Error(
                                                    "This email is already in use",
                                                ),
                                            );
                                        }

                                        return Promise.resolve();
                                    } catch (err) {
                                        console.error(
                                            "Email validation error:",
                                            err,
                                        );
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ]}
                        validateTrigger={["onBlur"]}
                    >
                        <Input
                            size="large"
                            placeholder="occ.lastname.firstname@gmail.com"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="phone"
                        label={
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <PhoneOutlined />
                                Phone Number
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "Please enter your phone number",
                            },
                            {
                                pattern: /^09\d{9}$/,
                                message:
                                    "Phone number must be 11 digits and start with 09",
                            },
                            {
                                validator: async (_, value) => {
                                    if (!value) return Promise.resolve();

                                    const phoneRegex = /^(09|\+639)\d{9}$/;

                                    if (!phoneRegex.test(value)) {
                                        return Promise.reject(
                                            new Error(
                                                "Please enter a valid Philippine mobile number",
                                            ),
                                        );
                                    }

                                    try {
                                        const res = await axios.get(
                                            "check-phone",
                                            {
                                                params: {
                                                    phone: value,
                                                },

                                                silent: true,
                                            },
                                        );

                                        if (res.data.exists) {
                                            return Promise.reject(
                                                new Error(
                                                    "This phone number is already in use",
                                                ),
                                            );
                                        }

                                        return Promise.resolve();
                                    } catch (err) {
                                        console.error(
                                            "Phone validation error:",
                                            err,
                                        );

                                        return Promise.resolve();
                                    }
                                },
                            },
                        ]}
                        validateTrigger={["onBlur"]}
                    >
                        <Input
                            size="large"
                            maxLength={11}
                            onChange={(e) => {
                                // only allow numbers — BUT do not force starting with 09
                                const value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 11);
                                form.setFieldsValue({ phone: value });
                            }}
                            placeholder="09XXXXXXXXX"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="address"
                        label={
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <EnvironmentOutlined />
                                Current Address
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "Please enter your address",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your complete address"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="birth_date"
                        label="Date of Birth | Only 2006 and Earlier Years Are Selectable"
                        rules={[
                            {
                                required: true,
                                message: "Please select your birth date",
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            size="large"
                            placeholder="Select your birth date"
                            disabledDate={(current) => {
                                const twentyYearsAgo = dayjs().subtract(
                                    20,
                                    "year",
                                );
                                return (
                                    current &&
                                    current.isAfter(twentyYearsAgo, "day")
                                );
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[
                            {
                                required: true,
                                message: "Please select your gender",
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="male">Male</Radio>
                            <Radio value="female">Female</Radio>
                            <Radio value="other">Other</Radio>
                            <Radio value="prefer_not_to_say">
                                Prefer not to say
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item name="bio" label="Personal Bio">
                        <TextArea
                            rows={4}
                            placeholder="Tell us about yourself, your interests, and your background..."
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                {/* First Column - Password */}
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                            {
                                min: 6,
                                message:
                                    "Password must be at least 6 characters!",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Enter password"
                            size="large"
                        />
                    </Form.Item>
                </Col>

                {/* Second Column - Confirm Password */}
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your password!",
                            },

                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(
                                        new Error("Passwords do not match!"),
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Confirm password"
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
}
