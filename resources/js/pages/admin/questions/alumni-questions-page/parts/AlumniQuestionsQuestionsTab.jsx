import { Space, Input, Select, Card, Button, Table, Tooltip } from "antd";
import {
    SearchOutlined,
    QuestionCircleOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import {
    Text,
    Option,
    Title,
} from "~/pages/admin/questions/alumni-questions-page/parts/alumniQuestionsShared";
import { useAlumniQuestionsContext } from "~/pages/admin/questions/alumni-questions-page/AlumniQuestionsContext";

export default function AlumniQuestionsQuestionsTab() {
    const {
        activeTab,
        filteredQuestions,
        questions,
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        showModal,
        questionColumns,
        isTouchDevice,
    } = useAlumniQuestionsContext();

    return (
        (activeTab === "questions" && (
            <div className="questions-tab-content">
                <div className="table-header">
                    <Text strong>
                        Total Questions: {filteredQuestions.length}
                        {filteredQuestions.length !== questions.length &&
                            ` (${questions.length} total)`}
                    </Text>
                    <Space>
                        <Input
                            placeholder="Search questions..."
                            prefix={<SearchOutlined />}
                            style={{ width: 250 }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select
                            placeholder="Filter by type"
                            style={{ width: 150 }}
                            value={filterType}
                            onChange={setFilterType}
                        >
                            <Option value="all">All Types</Option>
                            <Option value="rate">Rating</Option>
                            <Option value="abcd">Multiple Choice</Option>
                        </Select>
                    </Space>
                </div>

                {filteredQuestions.length === 0 && questions.length > 0 ? (
                    <Card className="empty-state-card">
                        <div className="empty-state-content">
                            <SearchOutlined
                                style={{
                                    fontSize: 48,
                                    color: COLORS.antdGray5,
                                }}
                            />
                            <Title level={4}>No Questions Found</Title>
                            <Text type="secondary">
                                No questions match your search or filter
                                criteria
                            </Text>
                            <br />
                            <Button
                                type="default"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterType("all");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </Card>
                ) : questions.length === 0 ? (
                    <Card className="empty-state-card">
                        <div className="empty-state-content">
                            <QuestionCircleOutlined
                                style={{
                                    fontSize: 48,
                                    color: COLORS.antdGray5,
                                }}
                            />
                            <Title level={4}>No Questions Available</Title>
                            <Text type="secondary">
                                Create some questions first to build your
                                quizzes
                            </Text>
                            <br />
                            <Button type="primary" onClick={() => showModal()}>
                                Create First Question
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Table
                        columns={[
                            ...questionColumns,
                            {
                                title: "Actions",
                                key: "actions",
                                width: 120,
                                render: (_, record) => (
                                    <Space size="small">
                                        <Tooltip
                                            title="Edit"
                                            trigger={
                                                isTouchDevice ? [] : ["hover"]
                                            }
                                            open={
                                                isTouchDevice
                                                    ? false
                                                    : undefined
                                            }
                                        >
                                            <Button
                                                className="quiz-action-btn"
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() =>
                                                    showModal(record)
                                                }
                                            />
                                        </Tooltip>
                                    </Space>
                                ),
                            },
                        ]}
                        dataSource={filteredQuestions}
                        rowKey="id"
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                    />
                )}
            </div>
        )) ??
        null
    );
}
