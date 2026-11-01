import {
    Modal,
    Form,
    Radio,
    Space,
    Input,
    Switch,
    Row,
    Col,
    Upload,
    Button,
} from "antd";
import {
    PictureOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { normalizeUploadFile } from "~/pages/admin/questions/alumni-questions-page/parts/alumniQuestionsShared";
import { useAlumniQuestionsContext } from "~/pages/admin/questions/alumni-questions-page/AlumniQuestionsContext";

export default function AlumniQuestionsAddEditQuestion() {
    const {
        editingQuestion,
        isModalVisible,
        handleFormCancel,
        form,
        handleSubmit,
        questionTypes,
    } = useAlumniQuestionsContext();

    return (
        <Modal
            title={editingQuestion ? "Edit Question" : "Add New Question"}
            open={isModalVisible}
            onCancel={handleFormCancel}
            footer={null}
            width="min(800px, 94vw)"
            className="question-modal"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="question-form"
            >
                <div className="form-sections">
                    <div className="form-section">
                        <div className="section-header">
                            <h3>Question Details</h3>
                            <div className="section-divider"></div>
                        </div>
                        <div className="section-content">
                            <Form.Item
                                name="type"
                                label="Question Type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select question type",
                                    },
                                ]}
                            >
                                <Radio.Group className="qm-question-type-radio">
                                    <Space
                                        direction="vertical"
                                        style={{ width: "100%" }}
                                    >
                                        {questionTypes.map((type) => (
                                            <Radio
                                                key={type.value}
                                                value={type.value}
                                                className="qm-question-type-option"
                                            >
                                                <Space>
                                                    {type.icon}
                                                    {type.label}
                                                </Space>
                                            </Radio>
                                        ))}
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                name="question"
                                label="Question Text"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter question text",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Enter your question here..."
                                    className="form-textarea"
                                />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Description is required",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={2}
                                    placeholder="Additional context or instructions for this question..."
                                    className="form-textarea"
                                />
                            </Form.Item>

                            <Form.Item
                                name="required"
                                label="Required"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Required"
                                    unCheckedChildren="Optional"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.type !== currentValues.type
                        }
                    >
                        {({ getFieldValue }) =>
                            getFieldValue("type") === "abcd" && (
                                <div className="form-section">
                                    <div className="section-header">
                                        <h3>Multiple Choice Options</h3>
                                        <div className="section-divider"></div>
                                    </div>
                                    <div className="section-content">
                                        <Form.List name="choices">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(
                                                        (field, index) => (
                                                            <div
                                                                key={field.key}
                                                                className="choice-item"
                                                            >
                                                                <Row
                                                                    gutter={[
                                                                        16, 12,
                                                                    ]}
                                                                    align="middle"
                                                                >
                                                                    <Col
                                                                        xs={4}
                                                                        sm={3}
                                                                        md={2}
                                                                    >
                                                                        <div className="choice-letter">
                                                                            {String.fromCharCode(
                                                                                65 +
                                                                                    index,
                                                                            )}
                                                                        </div>
                                                                    </Col>
                                                                    <Col
                                                                        xs={20}
                                                                        sm={9}
                                                                        md={10}
                                                                    >
                                                                        <Form.Item
                                                                            {...field}
                                                                            name={[
                                                                                field.name,
                                                                                "image",
                                                                            ]}
                                                                            fieldKey={[
                                                                                field.fieldKey,
                                                                                "image",
                                                                            ]}
                                                                            label="Option Image"
                                                                            valuePropName="value"
                                                                            getValueFromEvent={
                                                                                normalizeUploadFile
                                                                            }
                                                                        >
                                                                            <Upload
                                                                                listType="picture-card"
                                                                                beforeUpload={() =>
                                                                                    false
                                                                                }
                                                                                maxCount={
                                                                                    1
                                                                                }
                                                                                fileList={
                                                                                    form.getFieldValue(
                                                                                        [
                                                                                            "choices",
                                                                                            field.name,
                                                                                            "image",
                                                                                        ],
                                                                                    )
                                                                                        ?.fileList ||
                                                                                    []
                                                                                }
                                                                                onChange={(
                                                                                    info,
                                                                                ) => {
                                                                                    const choices =
                                                                                        form.getFieldValue(
                                                                                            "choices",
                                                                                        ) ||
                                                                                        [];
                                                                                    choices[
                                                                                        field.name
                                                                                    ] =
                                                                                        {
                                                                                            ...(choices[
                                                                                                field
                                                                                                    .name
                                                                                            ] ||
                                                                                                {}),
                                                                                            image: {
                                                                                                fileList:
                                                                                                    info.fileList,
                                                                                            },
                                                                                        };
                                                                                    form.setFieldsValue(
                                                                                        {
                                                                                            choices,
                                                                                        },
                                                                                    );
                                                                                }}
                                                                                onRemove={() => {
                                                                                    const choices =
                                                                                        form.getFieldValue(
                                                                                            "choices",
                                                                                        ) ||
                                                                                        [];
                                                                                    choices[
                                                                                        field.name
                                                                                    ] =
                                                                                        {
                                                                                            ...(choices[
                                                                                                field
                                                                                                    .name
                                                                                            ] ||
                                                                                                {}),
                                                                                            image: {
                                                                                                fileList:
                                                                                                    [],
                                                                                            },
                                                                                        };
                                                                                    form.setFieldsValue(
                                                                                        {
                                                                                            choices,
                                                                                        },
                                                                                    );
                                                                                    return true;
                                                                                }}
                                                                            >
                                                                                {(form.getFieldValue(
                                                                                    [
                                                                                        "choices",
                                                                                        field.name,
                                                                                        "image",
                                                                                    ],
                                                                                )
                                                                                    ?.fileList
                                                                                    ?.length ||
                                                                                    0) >=
                                                                                1 ? null : (
                                                                                    <div>
                                                                                        <PictureOutlined />
                                                                                        <div
                                                                                            style={{
                                                                                                marginTop: 8,
                                                                                            }}
                                                                                        >
                                                                                            Upload
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </Upload>
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col
                                                                        xs={24}
                                                                        sm={9}
                                                                        md={10}
                                                                    >
                                                                        <Form.Item
                                                                            {...field}
                                                                            name={[
                                                                                field.name,
                                                                                "interpretation",
                                                                            ]}
                                                                            fieldKey={[
                                                                                field.fieldKey,
                                                                                "interpretation",
                                                                            ]}
                                                                            label="Interpretation Text"
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message:
                                                                                        "Please enter interpretation text",
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Input.TextArea
                                                                                rows={
                                                                                    2
                                                                                }
                                                                                placeholder="Enter what this choice represents..."
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col
                                                                        xs={24}
                                                                        sm={3}
                                                                        md={2}
                                                                        className="choice-remove-col"
                                                                    >
                                                                        {fields.length >
                                                                            2 && (
                                                                            <Button
                                                                                type="text"
                                                                                danger
                                                                                icon={
                                                                                    <DeleteOutlined />
                                                                                }
                                                                                onClick={() =>
                                                                                    remove(
                                                                                        field.name,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <span className="choice-remove-label">
                                                                                    Remove
                                                                                    choice
                                                                                </span>
                                                                            </Button>
                                                                        )}
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        ),
                                                    )}
                                                    <Form.Item>
                                                        <Button
                                                            className="add-choice-btn"
                                                            type="dashed"
                                                            onClick={() =>
                                                                add()
                                                            }
                                                            icon={
                                                                <PlusOutlined />
                                                            }
                                                            block
                                                            disabled={
                                                                fields.length >=
                                                                4
                                                            }
                                                        >
                                                            Add Choice{" "}
                                                            {fields.length}/4
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                    </div>
                                </div>
                            )
                        }
                    </Form.Item>
                </div>

                <div className="form-actions">
                    <Button onClick={handleFormCancel}>Cancel</Button>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.type !== currentValues.type
                        }
                    >
                        {({ getFieldValue }) => {
                            const currentType = getFieldValue("type");
                            const typeLabel =
                                currentType === "abcd"
                                    ? "ABCD Question"
                                    : "Rating Question";
                            return (
                                <Button type="primary" htmlType="submit">
                                    {editingQuestion
                                        ? `Update ${typeLabel}`
                                        : `Add ${typeLabel}`}
                                </Button>
                            );
                        }}
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
}
