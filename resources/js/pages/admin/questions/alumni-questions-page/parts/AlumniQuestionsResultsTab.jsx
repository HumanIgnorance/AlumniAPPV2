import { Space, Input, Select, Empty, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
    Text,
    Option,
} from "~/pages/admin/questions/alumni-questions-page/parts/alumniQuestionsShared";
import { useAlumniQuestionsContext } from "~/pages/admin/questions/alumni-questions-page/AlumniQuestionsContext";

export default function AlumniQuestionsResultsTab() {
    const {
        activeTab,
        filteredQuizResults,
        quizzes_result,
        quizResultSearch,
        setQuizResultSearch,
        quizResultTypeFilter,
        setQuizResultTypeFilter,
        quizResultColumns,
    } = useAlumniQuestionsContext();

    return (
        (activeTab === "quizzes-result" && (
            <div className="quizzes-tab-content">
                <div className="table-header">
                    <Text strong>
                        Total Results: {filteredQuizResults.length}
                        {filteredQuizResults.length !== quizzes_result.length &&
                            ` (${quizzes_result.length} total)`}
                    </Text>
                    <Space>
                        <Input
                            placeholder="Search by name..."
                            prefix={<SearchOutlined />}
                            allowClear
                            style={{ width: 250 }}
                            value={quizResultSearch}
                            onChange={(e) =>
                                setQuizResultSearch(e.target.value)
                            }
                        />
                        <Select
                            placeholder="Filter by type"
                            style={{ width: 150 }}
                            value={quizResultTypeFilter}
                            onChange={setQuizResultTypeFilter}
                        >
                            <Option value="all">All Types</Option>
                            <Option value="abcd">ABCD Quiz</Option>
                            <Option value="rating">Rating Quiz</Option>
                        </Select>
                    </Space>
                </div>

                {filteredQuizResults.length === 0 ? (
                    <Empty
                        description={
                            quizResultSearch || quizResultTypeFilter !== "all"
                                ? "No results match your search."
                                : "No quiz submissions yet."
                        }
                        style={{ padding: "40px 0" }}
                    />
                ) : (
                    <Table
                        columns={quizResultColumns}
                        dataSource={filteredQuizResults}
                        rowKey="id"
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                    />
                )}
            </div>
        )) ??
        null
    );
}
