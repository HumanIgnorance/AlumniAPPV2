import {
    Drawer,
    Space,
    Tag,
    Button,
    Card,
    Input,
    Select,
    Empty,
    Table,
} from "antd";
import {
    SearchOutlined,
    MenuOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
    Text,
    Option,
} from "~/pages/admin/questions/alumni-questions-page/parts/alumniQuestionsShared";
import { useAlumniQuestionsContext } from "~/pages/admin/questions/alumni-questions-page/AlumniQuestionsContext";

export default function AlumniQuestionsQuizCreationEditing() {
    const {
        currentQuiz,
        isQuizDrawerVisible,
        closeQuizDrawer,
        quizQuestions,
        isSaving,
        title,
        filterType,
        saveQuiz,
        filteredQuestions,
        searchTerm,
        setSearchTerm,
        setTitle,
        setFilterType,
        isLoading,
        questionColumns,
        handleDragEnd,
        removeQuestionFromQuiz,
    } = useAlumniQuestionsContext();

    return (
        <Drawer
            title={
                <Space className="qm-drawer-title" wrap>
                    {currentQuiz ? "Edit Quiz" : "Create New Quiz"}
                    {currentQuiz && <Tag color="blue">{currentQuiz.title}</Tag>}
                </Space>
            }
            placement="right"
            size="large"
            open={isQuizDrawerVisible}
            onClose={closeQuizDrawer}
            width="90vw"
            className="quiz-drawer"
            extra={
                <Space className="qm-drawer-extra" wrap>
                    <Text type="secondary" className="qm-drawer-count">
                        {quizQuestions.length} questions selected
                    </Text>
                    <Button onClick={closeQuizDrawer}>Cancel</Button>
                    <Button
                        loading={isSaving}
                        disabled={!title || filterType === "all"}
                        type="primary"
                        onClick={saveQuiz}
                    >
                        {currentQuiz ? "Update Quiz" : "Create Quiz"}
                    </Button>
                </Space>
            }
        >
            <div className="quiz-drawer-content">
                <div className="questions-panel">
                    <Card
                        title="Available Questions"
                        className="questions-list-card"
                        extra={
                            <Space>
                                <Text type="secondary">
                                    {filteredQuestions.length} questions
                                </Text>
                            </Space>
                        }
                    >
                        <div className="search-filters">
                            <Input
                                placeholder="Search questions..."
                                prefix={<SearchOutlined />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ marginBottom: 16 }}
                            />
                            <Input
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ marginBottom: 16 }}
                            />
                            <Select
                                value={filterType}
                                onChange={setFilterType}
                                style={{ width: "100%", marginBottom: 16 }}
                            >
                                <Option value="all">All Question Types</Option>
                                <Option value="rate">Rating Questions</Option>
                                <Option value="abcd">Multiple Choice</Option>
                            </Select>
                        </div>

                        {filteredQuestions.length === 0 && !isLoading ? (
                            <Empty
                                description="No questions found"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ) : (
                            <Table
                                columns={questionColumns}
                                dataSource={filteredQuestions}
                                rowKey="id"
                                pagination={false}
                                scroll={{ y: 400, x: 480 }}
                                size="small"
                                loading={isLoading}
                            />
                        )}
                    </Card>
                </div>

                <div className="quiz-builder-panel">
                    <Card
                        title="Quiz Builder"
                        className="quiz-builder-card"
                        extra={
                            <Space>
                                <Text strong>Display Order</Text>
                                <Text type="secondary">Drag to reorder</Text>
                            </Space>
                        }
                    >
                        {quizQuestions.length === 0 ? (
                            <Empty
                                description="No questions added to quiz"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ) : (
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="quiz-questions">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="quiz-questions-list"
                                        >
                                            {quizQuestions.map(
                                                (question, index) => (
                                                    <Draggable
                                                        key={question.id}
                                                        draggableId={question.id.toString()}
                                                        index={index}
                                                    >
                                                        {(
                                                            provided,
                                                            snapshot,
                                                        ) => (
                                                            <div
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                className={`quiz-question-item ${snapshot.isDragging ? "dragging" : ""}`}
                                                            >
                                                                <div
                                                                    className="question-drag-handle"
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <MenuOutlined />
                                                                </div>
                                                                <div className="question-content">
                                                                    <div className="question-header">
                                                                        <Space>
                                                                            <Tag
                                                                                color={
                                                                                    question.type ===
                                                                                    "rate"
                                                                                        ? "blue"
                                                                                        : "green"
                                                                                }
                                                                            >
                                                                                {question.type ===
                                                                                "rate"
                                                                                    ? "Rating"
                                                                                    : "Multiple Choice"}
                                                                            </Tag>
                                                                            <Text
                                                                                strong
                                                                            >
                                                                                #
                                                                                {index +
                                                                                    1}
                                                                            </Text>
                                                                            {question.required && (
                                                                                <Tag color="red">
                                                                                    Required
                                                                                </Tag>
                                                                            )}
                                                                        </Space>
                                                                        <Button
                                                                            type="text"
                                                                            danger
                                                                            icon={
                                                                                <DeleteOutlined />
                                                                            }
                                                                            onClick={() =>
                                                                                removeQuestionFromQuiz(
                                                                                    question.id,
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <Text
                                                                        strong
                                                                        style={{
                                                                            display:
                                                                                "block",
                                                                            marginTop: 4,
                                                                        }}
                                                                    >
                                                                        {
                                                                            question.question
                                                                        }
                                                                    </Text>
                                                                    {question.description && (
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                display:
                                                                                    "block",
                                                                                marginTop: 4,
                                                                            }}
                                                                        >
                                                                            {
                                                                                question.description
                                                                            }
                                                                        </Text>
                                                                    )}
                                                                    {question.type ===
                                                                        "abcd" &&
                                                                        question.choices && (
                                                                            <div className="choices-preview">
                                                                                <Text
                                                                                    type="secondary"
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "12px",
                                                                                        marginTop: 8,
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        question
                                                                                            .choices
                                                                                            .length
                                                                                    }{" "}
                                                                                    options
                                                                                    with
                                                                                    images
                                                                                </Text>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ),
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )}
                    </Card>
                </div>
            </div>
        </Drawer>
    );
}
