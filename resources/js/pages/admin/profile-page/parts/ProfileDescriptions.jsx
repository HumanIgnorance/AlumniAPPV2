import { Descriptions, Input, Select } from "antd";
import { industryOptions } from "~/utils/constant";
import {
    Option,
    TextArea,
} from "~/pages/admin/profile-page/parts/profileShared";
import { useProfileContext } from "~/pages/admin/profile-page/ProfileContext";

export default function ProfileDescriptions() {
    const { isEditMode, editedValues, handleFieldChange, detailedProfile } =
        useProfileContext();

    return (
        <Descriptions column={1} size="small" className="profile-descriptions">
            <Descriptions.Item label="Current Company">
                {isEditMode ? (
                    <Input
                        value={editedValues.current_company}
                        onChange={(e) =>
                            handleFieldChange("current_company", e.target.value)
                        }
                        placeholder="Enter current company"
                    />
                ) : (
                    detailedProfile?.professionalInfo?.currentCompany
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Job Title">
                {isEditMode ? (
                    <Input
                        value={editedValues.job_title}
                        onChange={(e) =>
                            handleFieldChange("job_title", e.target.value)
                        }
                        placeholder="Enter job title"
                    />
                ) : (
                    detailedProfile?.professionalInfo?.jobTitle
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Industry">
                {isEditMode ? (
                    <Select
                        value={editedValues.industry}
                        placeholder="Select or type industry"
                        style={{ width: "100%" }}
                        showSearch
                        allowClear
                        onChange={(value) =>
                            handleFieldChange("industry", value)
                        }
                        onBlur={(e) => {
                            const value = e.target.value;
                            if (
                                value &&
                                !industryOptions.includes(value) &&
                                value !== "Not Provided"
                            ) {
                                handleFieldChange("industry", value);
                            }
                        }}
                        filterOption={(input, option) =>
                            option?.children
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                    >
                        <Option key="none" value="Not Provided">
                            Prefer not to say
                        </Option>
                        {industryOptions.map((industry) => (
                            <Option key={industry} value={industry}>
                                {industry}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    detailedProfile?.professionalInfo?.industry
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Years of Experience">
                {isEditMode ? (
                    <Input
                        type="number"
                        min={1}
                        max={10}
                        value={editedValues.years_experience}
                        onChange={(e) => {
                            let value = e.target.value;
                            if (
                                value === "" ||
                                (Number(value) >= 1 && Number(value) <= 10)
                            ) {
                                handleFieldChange("years_experience", value);
                            }
                        }}
                        placeholder="Enter years of experience (1-10)"
                    />
                ) : (
                    detailedProfile?.professionalInfo?.yearsExperience
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Annual Salary Range ₱">
                {isEditMode ? (
                    <Select
                        value={editedValues.salary_range || undefined}
                        onChange={(value) =>
                            handleFieldChange("salary_range", value)
                        }
                        placeholder="Select annual salary range"
                        style={{ width: "100%" }}
                    >
                        <Option value="0-150000">₱0 - ₱150,000 per year</Option>
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
                ) : (
                    detailedProfile?.professionalInfo?.salaryRange
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Work Location">
                {isEditMode ? (
                    <Input
                        value={editedValues.work_location}
                        onChange={(e) =>
                            handleFieldChange("work_location", e.target.value)
                        }
                        placeholder="Enter work location"
                    />
                ) : (
                    detailedProfile?.professionalInfo?.workLocation
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Previous Companies">
                {isEditMode ? (
                    <TextArea
                        value={editedValues.previous_companies}
                        onChange={(e) =>
                            handleFieldChange(
                                "previous_companies",
                                e.target.value,
                            )
                        }
                        placeholder="Enter previous companies (comma separated)"
                        rows={2}
                    />
                ) : Array.isArray(
                      detailedProfile?.professionalInfo?.previousCompanies,
                  ) ? (
                    detailedProfile.professionalInfo.previousCompanies.join(
                        ", ",
                    )
                ) : (
                    detailedProfile?.professionalInfo?.previousCompanies
                )}
            </Descriptions.Item>
        </Descriptions>
    );
}
