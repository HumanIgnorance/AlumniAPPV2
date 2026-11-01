import React from "react";
import { BookOutlined, TrophyOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Tag, Typography } from "antd";
import { useAlumniDetailsContext } from "~/components/alumni/details/AlumniDetailsContext";

const { Title, Paragraph, Text } = Typography;

export default function DetailsMainColumn() {
    const {
        canViewFullDetails,
        getData,
        getEmploymentStatusColor,
        getEmploymentStatus,
        getCourseName,
    } = useAlumniDetailsContext();

    return (
        <Col xs={24} lg={16}>
            {/* CHANGED: Use canViewFullDetails instead of role === "admin" */}
            {canViewFullDetails && (
                <>
                    {/* Personal Summary */}
                    {getData("bio") && (
                        <Card className="preview-card" size="small">
                            <div className="section-header">
                                <UserOutlined className="section-icon" />
                                <Title level={4} className="section-title">
                                    Personal Summary
                                </Title>
                            </div>
                            <Paragraph className="preview-bio">
                                {getData("bio")}
                            </Paragraph>
                        </Card>
                    )}

                    {/* Career Information */}
                    <Card className="preview-card" size="small">
                        <div className="section-header">
                            <TrophyOutlined className="section-icon" />
                            <Title level={4} className="section-title">
                                Career Information
                            </Title>
                        </div>
                        <div className="career-details">
                            <Row gutter={[16, 12]}>
                                {getData("current_company") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>Current Company:</Text>
                                            <Text>
                                                {getData("current_company")}
                                            </Text>
                                        </div>
                                    </Col>
                                )}

                                {getData("job_title") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>Position:</Text>
                                            <Text>{getData("job_title")}</Text>
                                        </div>
                                    </Col>
                                )}

                                {getData("industry") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>Industry:</Text>
                                            <Text>{getData("industry")}</Text>
                                        </div>
                                    </Col>
                                )}

                                {getData("years_experience") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>Experience:</Text>
                                            <Text>
                                                {getData("years_experience")}{" "}
                                                {getData("years_experience") ===
                                                1
                                                    ? "year"
                                                    : "years"}
                                            </Text>
                                        </div>
                                    </Col>
                                )}

                                {getData("work_location") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>Work Location:</Text>
                                            <Text>
                                                {getData("work_location")}
                                            </Text>
                                        </div>
                                    </Col>
                                )}

                                {getData("salary_range") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>
                                                Annual Salary Range:
                                            </Text>
                                            <Text>
                                                {getData("salary_range")}
                                            </Text>
                                        </div>
                                    </Col>
                                )}

                                {getData("employment_status") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>
                                                Employment Status:
                                            </Text>
                                            <Tag
                                                color={getEmploymentStatusColor()}
                                            >
                                                {getEmploymentStatus()}
                                            </Tag>
                                        </div>
                                    </Col>
                                )}
                            </Row>

                            {/* Career Goals */}
                            {getData("career_goals") && (
                                <div className="subsection">
                                    <Text strong className="subsection-title">
                                        Career Goals
                                    </Text>
                                    <Paragraph className="preview-text">
                                        {getData("career_goals")}
                                    </Paragraph>
                                </div>
                            )}

                            {/* Previous Experience */}
                            {getData("previous_companies") && (
                                <div className="subsection">
                                    <Text strong className="subsection-title">
                                        Previous Experience
                                    </Text>
                                    <Paragraph className="preview-text">
                                        {getData("previous_companies")}
                                    </Paragraph>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Academic Information */}
                    <Card className="preview-card" size="small">
                        <div className="section-header">
                            <BookOutlined className="section-icon" />
                            <Title level={4} className="section-title">
                                Academic Background
                            </Title>
                        </div>

                        <div className="academic-details">
                            <Row gutter={[16, 12]}>
                                {getData("course") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>Course/Degree:</Text>
                                            <Text>{getCourseName()}</Text>
                                        </div>
                                    </Col>
                                )}
                                {getData("enrollment_year") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>Enrollment Year:</Text>
                                            <Text>
                                                {getData("enrollment_year")}
                                            </Text>
                                        </div>
                                    </Col>
                                )}

                                {getData("graduation_year") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>Graduation Year:</Text>
                                            <Text>
                                                {getData("graduation_year")}
                                            </Text>
                                        </div>
                                    </Col>
                                )}

                                {getData("student_id") && (
                                    <Col xs={24} sm={12}>
                                        <div className="detail-item">
                                            <Text strong>Student ID:</Text>
                                            <Text>{getData("student_id")}</Text>
                                        </div>
                                    </Col>
                                )}
                            </Row>

                            {/* Academic Achievements */}
                            {getData("academic_achievements") && (
                                <div className="subsection">
                                    <Text strong className="subsection-title">
                                        Academic Achievements
                                    </Text>
                                    <Paragraph className="preview-text">
                                        {getData("academic_achievements")}
                                    </Paragraph>
                                </div>
                            )}

                            {/* Extracurricular Activities */}
                            {getData("extracurricular") && (
                                <div className="subsection">
                                    <Text strong className="subsection-title">
                                        Extracurricular Activities
                                    </Text>
                                    <Paragraph className="preview-text">
                                        {getData("extracurricular")}
                                    </Paragraph>
                                </div>
                            )}

                            {/* Thesis/Capstone */}
                            {getData("thesis_title") && (
                                <div className="subsection">
                                    <Text strong className="subsection-title">
                                        Thesis/Capstone Project
                                    </Text>
                                    <Paragraph className="preview-text">
                                        {getData("thesis_title")}
                                    </Paragraph>
                                </div>
                            )}
                        </div>
                    </Card>
                </>
            )}
        </Col>
    );
}
