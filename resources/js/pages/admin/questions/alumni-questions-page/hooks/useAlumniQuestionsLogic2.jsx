import axiosConfig from "~/utils/axiosConfig";
import { message, Tag, Space, Tooltip, Button, Popconfirm } from "antd";
import {
    EyeOutlined,
    EditOutlined,
    CheckSquareOutlined,
    DeleteOutlined,
    StarOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import { useState, useMemo } from "react";
import { Text } from "~/pages/admin/questions/alumni-questions-page/parts/alumniQuestionsShared";

export default function useAlumniQuestionsLogic2({
    refetchQuizzes,
    setViewingQuiz,
    setIsQuizDetailsModalVisible,
    isTouchDevice,
    openQuizDrawer,
    setActive,
    addQuestionToQuiz,
    quizQuestions,
    quizzes_result,
}) {
    const deleteQuiz = async (quizId) => {
        try {
            const { data } = await axiosConfig.delete(`/quizzes/${quizId}`);

            if (data.success) {
                message.success("Quiz deleted successfully!");
                refetchQuizzes();
            } else {
                message.error(data.message || "Failed to delete quiz");
            }
        } catch (error) {
            console.error("Quiz deletion error:", error);
            message.error("Deletion failed");
        }
    };

    const viewQuizDetails = (quiz) => {
        setViewingQuiz(quiz);
        setIsQuizDetailsModalVisible(true);
    };

    const closeQuizDetailsModal = () => {
        setIsQuizDetailsModalVisible(false);
        setViewingQuiz(null);
    };

    const quizColumns = [
        {
            title: "Quiz Name",
            dataIndex: "title",
            key: "title",
            width: 180,
            render: (text, record) => (
                <div className="quiz-name-cell">
                    <Text strong className="quiz-name-cell__title">
                        {text}
                    </Text>
                    <div className="quiz-name-cell__meta">
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {record.questions?.length || 0} questions • Updated{" "}
                            {new Date(record.updated_at).toLocaleDateString()}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 120,
            render: (type) => {
                const color = type === "rate" ? "blue" : "green";
                return <Tag color={color}>{type}</Tag>;
            },
        },
        {
            title: "Active ?",
            dataIndex: "isActive",
            key: "isActive",
            width: 120,
            render: (isActive) =>
                isActive ? <Tag color="green">Yes</Tag> : null,
        },
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
            render: (_, record) =>
                new Date(record.created_at).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip
                        title="View Details"
                        trigger={isTouchDevice ? [] : ["hover"]}
                        open={isTouchDevice ? false : undefined}
                    >
                        <Button
                            className="quiz-action-btn"
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => viewQuizDetails(record)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Edit Quiz"
                        trigger={isTouchDevice ? [] : ["hover"]}
                        open={isTouchDevice ? false : undefined}
                    >
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openQuizDrawer(record)}
                            style={{ color: COLORS.antdBlue }}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Set Active"
                        trigger={isTouchDevice ? [] : ["hover"]}
                        open={isTouchDevice ? false : undefined}
                    >
                        <Button
                            type="text"
                            icon={<CheckSquareOutlined />}
                            onClick={() => setActive(record)}
                            style={{ color: COLORS.antdGreen }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title={<span>Delete Quiz</span>}
                        description={
                            <span>
                                Are you sure you want to delete this quiz?
                            </span>
                        }
                        onConfirm={() => deleteQuiz(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip
                            title="Delete"
                            trigger={isTouchDevice ? [] : ["hover"]}
                            open={isTouchDevice ? false : undefined}
                        >
                            <Button
                                type="text"
                                danger
                                icon={
                                    <DeleteOutlined
                                        style={{ color: COLORS.antdRed }}
                                    />
                                }
                                style={{ color: COLORS.antdRed }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const questionColumns = [
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 130,
            className: "qm-col-type",
            render: (type) => (
                <Tag
                    color={type === "rate" ? "blue" : "green"}
                    icon={
                        type === "rate" ? (
                            <StarOutlined />
                        ) : (
                            <UnorderedListOutlined />
                        )
                    }
                    style={{ whiteSpace: "nowrap" }}
                >
                    {type === "rate" ? "Rating" : "Multiple Choice"}
                </Tag>
            ),
        },
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
            ellipsis: true,
            render: (text, record) => (
                <div>
                    <Text strong>{text}</Text>
                    {record.description && (
                        <div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                {record.description}
                            </Text>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => addQuestionToQuiz(record)}
                    disabled={quizQuestions.find((q) => q.id === record.id)}
                >
                    Add
                </Button>
            ),
        },
    ];

    const quizResultColumns = [
        {
            title: "Name",
            dataIndex: "user",
            key: "user",
            render: (record) => (
                <div>
                    <Text strong>{record?.name}</Text>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 120,
            render: (type) => {
                const color = type === "rate" ? "blue" : "green";
                return <Tag color={color}>{type}</Tag>;
            },
        },
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
            align: "center",
            render: (_, record) =>
                new Date(record.created_at).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            width: 200,
            align: "center",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip
                        title="View Details"
                        trigger={isTouchDevice ? [] : ["hover"]}
                        open={isTouchDevice ? false : undefined}
                    >
                        <Button
                            className="quiz-action-btn"
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => viewQuizResultDetails(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const [
        isQuizResultDetailsModalVisible,
        setIsQuizResultDetailsModalVisible,
    ] = useState(false);
    const [viewingQuizResult, setViewingQuizResult] = useState(null);

    const viewQuizResultDetails = (record) => {
        setViewingQuizResult(record);
        setIsQuizResultDetailsModalVisible(true);
    };

    const closeQuizResultDetailsModal = () => {
        setIsQuizResultDetailsModalVisible(false);
        setViewingQuizResult(null);
    };

    // ============ QUIZ RESULT SEARCH & FILTER ============
    const [quizResultSearch, setQuizResultSearch] = useState("");
    const [quizResultTypeFilter, setQuizResultTypeFilter] = useState("all");

    const filteredQuizResults = useMemo(() => {
        const list = Array.isArray(quizzes_result) ? quizzes_result : [];
        return list.filter((record) => {
            const name = record.user?.name || "";
            const matchesSearch = name
                .toLowerCase()
                .includes(quizResultSearch.toLowerCase());
            const matchesType =
                quizResultTypeFilter === "all" ||
                record.type === quizResultTypeFilter;
            return matchesSearch && matchesType;
        });
    }, [quizzes_result, quizResultSearch, quizResultTypeFilter]);

    return {
        closeQuizDetailsModal,
        quizColumns,
        questionColumns,
        quizResultColumns,
        isQuizResultDetailsModalVisible,
        viewingQuizResult,
        closeQuizResultDetailsModal,
        quizResultSearch,
        setQuizResultSearch,
        quizResultTypeFilter,
        setQuizResultTypeFilter,
        filteredQuizResults,
    };
}
