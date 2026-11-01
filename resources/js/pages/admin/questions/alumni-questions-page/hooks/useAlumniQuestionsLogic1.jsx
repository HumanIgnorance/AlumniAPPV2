import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";
import useQuestions from "~/hooks/useQuestions";
import useQuiz from "~/hooks/useQuiz";
import useQuizResult from "~/hooks/useQuizResult";
import { useState, useRef, useMemo } from "react";
import { Form, message } from "antd";
import { StarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import axiosConfig from "~/utils/axiosConfig";

export default function useAlumniQuestionsLogic1() {
    const isTouchDevice = useIsTouchDevice();
    const {
        isLoading,
        data: questions = [],
        isFetching,
        refetch,
    } = useQuestions();
    const {
        isLoading: isLoadingQuizzes,
        data: quizzes = [],
        isFetching: isFetchingQuizzes,
        refetch: refetchQuizzes,
    } = useQuiz();

    const {
        isLoading: isLoadingQuizzesResult,
        data: quizzes_result = [],
        isFetching: isFetchingQuizzesResult,
        refetch: refetchQuizzesResult,
    } = useQuizResult();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [isDiscardConfirmVisible, setIsDiscardConfirmVisible] =
        useState(false);
    const initialSnapshotRef = useRef(null);
    const [activeTab, setActiveTab] = useState("quizzes-result");
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [isQuizDrawerVisible, setIsQuizDrawerVisible] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [title, setTitle] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [isSaving, setIsSaving] = useState(false);
    const [form] = Form.useForm();

    const [isQuizDetailsModalVisible, setIsQuizDetailsModalVisible] =
        useState(false);
    const [viewingQuiz, setViewingQuiz] = useState(null);

    const questionTypes = [
        { value: "rate", label: "Rating Question", icon: <StarOutlined /> },
        {
            value: "abcd",
            label: "Multiple Choice (ABCD)",
            icon: <UnorderedListOutlined />,
        },
    ];

    const filteredQuestions = useMemo(() => {
        const list = Array.isArray(questions) ? questions : [];

        return list.filter((question) => {
            const matchesSearch =
                question.question
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                question.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesType =
                filterType === "all" || question.type === filterType;

            return matchesSearch && matchesType;
        });
    }, [questions, searchTerm, filterType]);

    // Normalizes the form's current values into a comparable string so we can
    // tell whether anything has actually changed since the modal was opened.
    const snapshotFormState = (values) => {
        const choices = (values.choices || []).map((choice) => ({
            letter: choice?.letter || "",
            interpretation: choice?.interpretation || "",
            image:
                choice?.image?.fileList?.[0]?.url ||
                choice?.image?.fileList?.[0]?.uid ||
                null,
        }));

        return JSON.stringify({
            type: values.type || "",
            question: values.question || "",
            description: values.description || "",
            required: !!values.required,
            choices: values.type === "abcd" ? choices : [],
        });
    };

    // True if the form's current state differs from what it was when the
    // modal was opened — covers both a blank create form being filled in and
    // an edit form being changed away from its original values.
    const isFormDirty = () => {
        if (initialSnapshotRef.current === null) return false;
        return (
            snapshotFormState(form.getFieldsValue()) !==
            initialSnapshotRef.current
        );
    };

    // Show modal for adding/editing question
    const showModal = (question = null) => {
        setEditingQuestion(question);
        if (question) {
            // Prefer choices_with_urls (full image URL) over raw choices (storage path only)
            const sourceChoices =
                (question.choices_with_urls && question.choices_with_urls.length
                    ? question.choices_with_urls
                    : question.choices) || [];

            const choices = sourceChoices.map((choice, i) => ({
                letter: choice.letter || String.fromCharCode(65 + i),
                interpretation: choice.interpretation || "",
                image: choice.image
                    ? {
                          fileList: [
                              {
                                  uid: `existing-${i}`,
                                  name: `choice-${choice.letter || i}.jpg`,
                                  status: "done",
                                  url: choice.image, // full URL so the preview renders
                              },
                          ],
                      }
                    : undefined,
            }));

            form.setFieldsValue({
                type: question.type,
                question: question.question,
                description: question.description,
                required: question.required,
                choices,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                type: "rate",
                required: true,
            });
        }
        initialSnapshotRef.current = snapshotFormState(form.getFieldsValue());
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingQuestion(null);
        form.resetFields();
        initialSnapshotRef.current = null;
    };

    // Smart close: clicking the X, backdrop, or Cancel only closes right away
    // if nothing has changed since the modal opened. Otherwise we ask first.
    const handleFormCancel = () => {
        if (isFormDirty()) {
            setIsDiscardConfirmVisible(true);
            return;
        }
        handleCancel();
    };

    const handleContinueEditing = () => {
        setIsDiscardConfirmVisible(false);
    };

    const handleDiscardChanges = () => {
        setIsDiscardConfirmVisible(false);
        handleCancel();
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            formData.append("type", values.type);
            formData.append("question", values.question);
            formData.append("description", values.description || "");
            formData.append("required", values.required);

            if (values.type === "abcd" && values.choices) {
                values.choices.forEach((choice, index) => {
                    formData.append(
                        `choices[${index}][interpretation]`,
                        choice.interpretation || "",
                    );
                    formData.append(
                        `choices[${index}][letter]`,
                        choice.letter || String.fromCharCode(65 + index),
                    );

                    // Detect a freshly picked file in any of AntD Upload's shapes
                    const fileList = choice.image?.fileList || [];
                    const newFile =
                        fileList.find((f) => f.originFileObj)?.originFileObj ||
                        choice.image?.file?.originFileObj ||
                        (choice.image?.file instanceof File
                            ? choice.image.file
                            : null);

                    if (newFile) {
                        formData.append(`choices[${index}][image]`, newFile);
                    } else if (fileList[0]?.url) {
                        // Keep existing image — pass URL back so backend doesn't wipe it
                        formData.append(
                            `choices[${index}][existing_image]`,
                            fileList[0].url,
                        );
                    }
                });
            }

            const endpoint = editingQuestion
                ? `/questions/${editingQuestion.id}`
                : "/questions";

            // Laravel: spoof PUT via _method when editing
            if (editingQuestion) {
                formData.append("_method", "PUT");
            }

            const response = await axiosConfig.post(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                refetch();
                message.success(
                    editingQuestion
                        ? "Question updated successfully!"
                        : "Question added successfully!",
                );
            }

            handleCancel();
        } catch (error) {
            message.error("Failed to save question");
            console.error("❌ Error saving question:", error);
        }
    };

    const setActive = async (item) => {
        try {
            const formData = new FormData();
            formData.append("id", item?.id);
            formData.append("type", item?.type);

            const response = await axiosConfig.post("/quiz-active", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                refetchQuizzes();
                message.success("Quiz set active!");
            }
        } catch (error) {
            message.error("Failed to save question");
            console.error("❌ Error saving question:", error);
        }
    };

    const handleDelete = (questionId) => {
        message.success("Question removed in frontend only!");
        refetch({
            select: (old) => old.filter((q) => q.id !== questionId),
        });
    };

    const openQuizDrawer = (quiz = null) => {
        setCurrentQuiz(quiz);
        setQuizQuestions(quiz ? quiz.questions : []);
        setIsQuizDrawerVisible(true);
    };

    const closeQuizDrawer = () => {
        setIsQuizDrawerVisible(false);
        setCurrentQuiz(null);
        setQuizQuestions([]);
        setSearchTerm("");
        setFilterType("all");
    };

    const addQuestionToQuiz = (question) => {
        if (quizQuestions.find((q) => q.id === question.id)) {
            message.warning("Question already added to quiz");
            return;
        }

        setQuizQuestions((prev) => [
            ...prev,
            {
                ...question,
                displayOrder: prev.length + 1,
            },
        ]);
        message.success("Question added to quiz");
    };

    const removeQuestionFromQuiz = (questionId) => {
        setQuizQuestions((prev) => prev.filter((q) => q.id !== questionId));
        message.success("Question removed from quiz");
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(quizQuestions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({
            ...item,
            displayOrder: index + 1,
        }));

        setQuizQuestions(updatedItems);
    };

    const saveQuiz = async () => {
        if (filterType === "all") {
            message.error("Please select a question category");
            return;
        }

        if (!title?.trim()) {
            message.error("Please enter a quiz title");
            return;
        }

        setIsSaving(true);
        const questionIds = quizQuestions.map((question) => question.id);
        try {
            const formData = new FormData();
            formData.append("type", filterType);
            formData.append("questions", questionIds);
            formData.append("title", title.trim());

            const response = await axiosConfig.post("/quizzes", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                message.success("🎉 Quiz created successfully!");
                refetchQuizzes();
                closeQuizDrawer();
            }
        } catch (error) {
            message.error("❌ Failed to save quiz");
            console.error("Error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        isTouchDevice,
        isLoading,
        questions,
        refetchQuizzes,
        quizzes,
        quizzes_result,
        isModalVisible,
        editingQuestion,
        isDiscardConfirmVisible,
        activeTab,
        setActiveTab,
        isQuizDrawerVisible,
        currentQuiz,
        quizQuestions,
        searchTerm,
        setSearchTerm,
        title,
        setTitle,
        filterType,
        setFilterType,
        isSaving,
        form,
        isQuizDetailsModalVisible,
        setIsQuizDetailsModalVisible,
        viewingQuiz,
        setViewingQuiz,
        questionTypes,
        filteredQuestions,
        showModal,
        handleFormCancel,
        handleContinueEditing,
        handleDiscardChanges,
        handleSubmit,
        setActive,
        openQuizDrawer,
        closeQuizDrawer,
        addQuestionToQuiz,
        removeQuestionFromQuiz,
        handleDragEnd,
        saveQuiz,
    };
}
