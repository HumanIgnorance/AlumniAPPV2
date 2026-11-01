import "~/pages/admin/questions/styles";
import { Layout } from "~/components";
import { Card, Tabs, Badge, Button, Table, Modal, Space } from "antd";
import {
    OrderedListOutlined,
    UnorderedListOutlined,
    QuestionCircleOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { COLORS } from "~/config/theme";
import {
    TabPane,
    Title,
    Text,
} from "~/pages/admin/questions/alumni-questions-page/parts/alumniQuestionsShared";
import { AlumniQuestionsProvider } from "~/pages/admin/questions/alumni-questions-page/AlumniQuestionsContext";
import useAlumniQuestionsController from "~/pages/admin/questions/alumni-questions-page/hooks/useAlumniQuestionsController";
import AlumniQuestionsModernHeroHeader from "~/pages/admin/questions/alumni-questions-page/parts/AlumniQuestionsModernHeroHeader";
import AlumniQuestionsResultsTab from "~/pages/admin/questions/alumni-questions-page/parts/AlumniQuestionsResultsTab";
import AlumniQuestionsQuestionsTab from "~/pages/admin/questions/alumni-questions-page/parts/AlumniQuestionsQuestionsTab";
import AlumniQuestionsQuizDetailsModal from "~/pages/admin/questions/alumni-questions-page/parts/AlumniQuestionsQuizDetailsModal";
import AlumniQuestionsQuizCreationEditing from "~/pages/admin/questions/alumni-questions-page/parts/AlumniQuestionsQuizCreationEditing";
import AlumniQuestionsAddEditQuestion from "~/pages/admin/questions/alumni-questions-page/parts/AlumniQuestionsAddEditQuestion";
import AlumniQuestionsQuizResultDetails from "~/pages/admin/questions/alumni-questions-page/parts/AlumniQuestionsQuizResultDetails";

function AlumniQuestionsPage() {
    const ctx = useAlumniQuestionsController();
    const {
        activeTab,
        setActiveTab,
        quizzes_result,
        quizzes,
        questions,
        openQuizDrawer,
        quizColumns,
        isDiscardConfirmVisible,
        handleContinueEditing,
        handleDiscardChanges,
    } = ctx;

    return (
        <AlumniQuestionsProvider value={ctx}>
            <Layout>
                <div className="alumni-questions-container">
                    {/* ===== Modern Hero Header ===== */}
                    <AlumniQuestionsModernHeroHeader />
                    {/* ===== /Modern Hero Header ===== */}

                    {/* Tabs */}
                    <Card style={{ marginTop: 20 }}>
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            className="questions-tabs"
                        >
                            <TabPane
                                tab={
                                    <span>
                                        <OrderedListOutlined />
                                        Quizzes Result
                                        <Badge
                                            count={quizzes_result.length}
                                            style={{
                                                backgroundColor:
                                                    COLORS.antdBlue,
                                                marginLeft: 8,
                                            }}
                                        />
                                    </span>
                                }
                                key="quizzes-result"
                            />
                            <TabPane
                                tab={
                                    <span>
                                        <UnorderedListOutlined />
                                        All Quizzes
                                        <Badge
                                            count={quizzes.length}
                                            style={{
                                                backgroundColor:
                                                    COLORS.antdBlue,
                                                marginLeft: 8,
                                            }}
                                        />
                                    </span>
                                }
                                key="quizzes"
                            />
                            <TabPane
                                tab={
                                    <span>
                                        <QuestionCircleOutlined />
                                        All Questions
                                        <Badge
                                            count={questions.length}
                                            style={{
                                                backgroundColor:
                                                    COLORS.antdGreen,
                                                marginLeft: 8,
                                            }}
                                        />
                                    </span>
                                }
                                key="questions"
                            />
                        </Tabs>

                        <AlumniQuestionsResultsTab />

                        {activeTab === "quizzes" && (
                            <div className="quizzes-tab-content">
                                {quizzes.length === 0 ? (
                                    <Card className="empty-state-card">
                                        <div className="empty-state-content">
                                            <UnorderedListOutlined
                                                style={{
                                                    fontSize: 48,
                                                    color: COLORS.antdGray5,
                                                }}
                                            />
                                            <Title level={4}>
                                                No Quizzes Created
                                            </Title>
                                            <Text type="secondary">
                                                Create your first quiz to get
                                                started with assessments
                                            </Text>
                                            <br />
                                            <Button
                                                type="primary"
                                                onClick={() => openQuizDrawer()}
                                            >
                                                Create First Quiz
                                            </Button>
                                        </div>
                                    </Card>
                                ) : (
                                    <Table
                                        className="quizzes-table"
                                        columns={quizColumns}
                                        dataSource={quizzes}
                                        rowKey="id"
                                        pagination={{
                                            pageSize: 10,
                                            showSizeChanger: true,
                                        }}
                                        scroll={{ x: 700 }}
                                    />
                                )}
                            </div>
                        )}

                        <AlumniQuestionsQuestionsTab />
                    </Card>

                    {/* Quiz Details Modal */}
                    <AlumniQuestionsQuizDetailsModal />

                    {/* Quiz Creation/Editing Drawer */}
                    <AlumniQuestionsQuizCreationEditing />

                    {/* Add/Edit Question Modal */}
                    <AlumniQuestionsAddEditQuestion />

                    {/* Smart Close / Discard Changes Confirmation */}
                    <Modal
                        title={
                            <Space>
                                <WarningOutlined
                                    style={{
                                        color: "var(--warning, #f59e0b)",
                                        fontSize: "22px",
                                    }}
                                />
                                <span>Discard Changes?</span>
                            </Space>
                        }
                        open={isDiscardConfirmVisible}
                        onCancel={handleContinueEditing}
                        footer={[
                            <Button
                                key="continue"
                                onClick={handleContinueEditing}
                            >
                                Continue Editing
                            </Button>,
                            <Button
                                key="discard"
                                danger
                                type="primary"
                                onClick={handleDiscardChanges}
                            >
                                Discard Changes
                            </Button>,
                        ]}
                        centered
                    >
                        <p style={{ margin: 0 }}>
                            You have unsaved changes. Are you sure you want to
                            discard your progress?
                        </p>
                    </Modal>

                    {/* Quiz Result Details Modal */}
                    <AlumniQuestionsQuizResultDetails />
                </div>
            </Layout>
        </AlumniQuestionsProvider>
    );
}

export default AlumniQuestionsPage;
