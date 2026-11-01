import React from "react";
import { Card, Typography } from "antd";
import { useAlumniDetailsContext } from "~/components/alumni/details/AlumniDetailsContext";

const { Title, Text } = Typography;

export default function ConfidentialNotice() {
    const { canViewFullDetails } = useAlumniDetailsContext();

    return (
        !canViewFullDetails && (
            <>
                <Card
                    className="preview-card"
                    size="small"
                    style={{
                        marginTop: 10,
                        borderColor: "red",
                    }}
                >
                    <div
                        className="section-header"
                        style={{
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Title
                            level={3}
                            style={{
                                color: "red",
                                textAlign: "center",
                                marginBottom: 0,
                                letterSpacing: 2,
                                fontWeight: "bold",
                            }}
                        >
                            CONFIDENTIAL
                        </Title>
                        <Text
                            style={{
                                textAlign: "center",
                                fontStyle: "italic",
                            }}
                        >
                            Admin Access Only
                        </Text>
                    </div>

                    <div
                        style={{
                            marginTop: 20,
                            textAlign: "center",
                            padding: "10px 20px",
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>
                            This section contains confidential information.
                        </Text>
                    </div>
                </Card>
            </>
        )
    );
}
