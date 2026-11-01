import React from "react";
import { TrophyOutlined as TrophyIcon } from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";
import { useAlumniDetailsContext } from "~/components/alumni/details/AlumniDetailsContext";

const { Title, Text } = Typography;

export default function FullDetailsSection() {
    const { canViewFullDetails, honors } = useAlumniDetailsContext();

    return (
        canViewFullDetails && (
            <>
                {/* Honors & Awards Section */}
                {honors.length > 0 && (
                    <Card
                        className="preview-card"
                        size="small"
                        style={{ marginTop: 10 }}
                    >
                        <div className="section-header">
                            <TrophyIcon className="section-icon" />
                            <Title level={4} className="section-title">
                                Honors & Awards
                            </Title>
                        </div>
                        <div className="honors-container">
                            <Row gutter={[8, 8]}>
                                {Array.isArray(honors) &&
                                    honors.map((honor, index) => (
                                        <Col
                                            key={index}
                                            xs={24}
                                            sm={12}
                                            md={8}
                                            lg={6}
                                        >
                                            <div className="honor-item">
                                                <TrophyIcon className="honor-icon" />
                                                <Text>{honor}</Text>
                                            </div>
                                        </Col>
                                    ))}
                            </Row>
                        </div>
                    </Card>
                )}
            </>
        )
    );
}
