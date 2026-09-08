import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createLearningPlan,
  getLearningPlans,
  updateLearningPlan,
  deleteLearningPlan,
  addTopicToPlan,
  updateTopic,
  deleteTopic,
  addResourceToTopic,
  updateResource,
  deleteResource,
} from "../../Redux/LearningPlan/Action";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Checkbox,
  List,
  Card,
  Space,
  message,
  Collapse,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { getAuthToken } from "../../Config/auth";
import "./LearningPlan.css";

const { Panel } = Collapse;
const { TextArea } = Input;

const friendlyError = "That could not be saved. Please try again.";

const LearningPlan = () => {
  const dispatch = useDispatch();
  const token = getAuthToken();
  const { learningPlan } = useSelector((store) => store);
  const [planForm] = Form.useForm();
  const [topicForm] = Form.useForm();
  const [resourceForm] = Form.useForm();
  const [modalApi, contextHolder] = Modal.useModal();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePanelKey, setActivePanelKey] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planModal, setPlanModal] = useState({
    open: false,
    mode: "create",
    currentPlan: null,
  });
  const [topicModal, setTopicModal] = useState({
    open: false,
    mode: "create",
    currentTopic: null,
    planId: null,
  });
  const [resourceModal, setResourceModal] = useState({
    open: false,
    mode: "create",
    currentResource: null,
    topicId: null,
  });

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      await dispatch(getLearningPlans(token));
    } catch {
      setError("Craft plans could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, token]);

  const handleCreatePlan = async (values) => {
    try {
      await dispatch(
        createLearningPlan({
          jwt: token,
          planData: values,
        })
      );
      setPlanModal({ ...planModal, open: false });
      planForm.resetFields();
      message.success("Learning plan created");
    } catch {
      message.error(friendlyError);
    }
  };

  const handleUpdatePlan = async (values) => {
    try {
      await dispatch(
        updateLearningPlan({
          jwt: token,
          planId: planModal.currentPlan.id,
          planData: values,
        })
      );
      setPlanModal({ ...planModal, open: false });
      planForm.resetFields();
      message.success("Learning plan updated");
    } catch {
      message.error(friendlyError);
    }
  };

  const handleDeletePlan = (planId) => {
    modalApi.confirm({
      title: "Delete learning plan",
      content: "This plan, its topics, and resources will be removed.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await dispatch(
            deleteLearningPlan({
              jwt: token,
              planId,
            })
          );
          setSelectedPlan(null);
          message.success("Learning plan deleted");
        } catch {
          message.error(friendlyError);
        }
      },
    });
  };

  const handleCreateTopic = async (values) => {
    try {
      await dispatch(
        addTopicToPlan({
          jwt: token,
          planId: topicModal.planId,
          topicData: {
            ...values,
            targetCompletionDate: values.targetCompletionDate?.format("YYYY-MM-DD") || null,
          },
        })
      );
      setTopicModal({ ...topicModal, open: false });
      topicForm.resetFields();
      message.success("Topic added");
    } catch {
      message.error(friendlyError);
    }
  };

  const handleUpdateTopic = async (values) => {
    try {
      await dispatch(
        updateTopic({
          jwt: token,
          topicId: topicModal.currentTopic.id,
          topicData: {
            ...values,
            targetCompletionDate: values.targetCompletionDate?.format("YYYY-MM-DD") || null,
          },
        })
      );
      setTopicModal({ ...topicModal, open: false });
      topicForm.resetFields();
      message.success("Topic updated");
    } catch {
      message.error(friendlyError);
    }
  };

  const handleDeleteTopic = (topicId) => {
    modalApi.confirm({
      title: "Delete topic",
      content: "This topic and its resources will be removed.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await dispatch(
            deleteTopic({
              jwt: token,
              topicId,
            })
          );
          message.success("Topic deleted");
        } catch {
          message.error(friendlyError);
        }
      },
    });
  };

  const handleCreateResource = async (values) => {
    try {
      await dispatch(
        addResourceToTopic({
          jwt: token,
          topicId: resourceModal.topicId,
          resourceData: values,
        })
      );
      setResourceModal({ ...resourceModal, open: false });
      resourceForm.resetFields();
      message.success("Resource added");
    } catch {
      message.error(friendlyError);
    }
  };

  const handleUpdateResource = async (values) => {
    try {
      await dispatch(
        updateResource({
          jwt: token,
          resourceId: resourceModal.currentResource.id,
          resourceData: values,
        })
      );
      setResourceModal({ ...resourceModal, open: false });
      resourceForm.resetFields();
      message.success("Resource updated");
    } catch {
      message.error(friendlyError);
    }
  };

  const handleDeleteResource = (resourceId) => {
    modalApi.confirm({
      title: "Delete resource",
      content: "Remove this resource from the topic?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await dispatch(
            deleteResource({
              jwt: token,
              resourceId,
            })
          );
          message.success("Resource deleted");
        } catch {
          message.error(friendlyError);
        }
      },
    });
  };

  const showPlanModal = (mode = "create", plan = null) => {
    setPlanModal({
      open: true,
      mode,
      currentPlan: plan,
    });
    if (mode === "edit") {
      planForm.setFieldsValue({
        title: plan.title,
        description: plan.description,
      });
    }
  };

  const showTopicModal = (mode = "create", topic = null, planId = null) => {
    setTopicModal({
      open: true,
      mode,
      currentTopic: topic,
      planId,
    });
    if (mode === "edit") {
      topicForm.setFieldsValue({
        title: topic.title,
        description: topic.description,
        completed: topic.completed,
        targetCompletionDate: topic.targetCompletionDate ? moment(topic.targetCompletionDate) : null,
      });
    }
  };

  const showResourceModal = (mode = "create", resource = null, topicId = null) => {
    setResourceModal({
      open: true,
      mode,
      currentResource: resource,
      topicId,
    });
    if (mode === "edit") {
      resourceForm.setFieldsValue({
        url: resource.url,
        description: resource.description,
      });
    }
  };

  const handlePanelChange = (key) => {
    const keys = Array.isArray(key) ? key : key ? [String(key)] : [];
    setActivePanelKey(keys);
    if (keys.length > 0) {
      const planId = keys[0];
      const selected = learningPlan.plans.find((plan) => plan.id.toString() === planId.toString());
      setSelectedPlan(selected);
    } else {
      setSelectedPlan(null);
    }
  };

  const completedCount = selectedPlan?.topics?.filter((topic) => topic.completed).length || 0;
  const topicCount = selectedPlan?.topics?.length || 0;

  return (
    <div className="nl-craft">
      {contextHolder}
      <header className="nl-craft-header">
        <div>
          <p className="nl-auth-kicker" style={{ textAlign: "left" }}>
            Craft
          </p>
          <h1>Night photography craft</h1>
          <p>Build learning plans, work through topics, and keep the resources you return to after dark.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showPlanModal()}>
          New plan
        </Button>
      </header>

      {error && (
        <section className="nl-empty nl-card">
          <h2>Craft could not be loaded.</h2>
          <p>Something went wrong while fetching your learning plans.</p>
          <div className="nl-empty-actions">
            <Button type="primary" onClick={loadPlans}>
              Try again
            </Button>
          </div>
        </section>
      )}

      {!error && loading && (
        <div className="nl-craft-status" aria-busy="true" aria-label="Loading craft plans">
          <div className="nl-skeleton" style={{ height: "4.5rem", marginBottom: "0.75rem" }} />
          <div className="nl-skeleton" style={{ height: "4.5rem", marginBottom: "0.75rem" }} />
          <div className="nl-skeleton" style={{ height: "4.5rem" }} />
        </div>
      )}

      {!error && !loading && learningPlan.plans?.length === 0 && (
        <section className="nl-empty nl-card nl-craft-empty">
          <h2>No learning plans yet.</h2>
          <p>Start a plan for a technique you want to practice — long exposure, city light, or quiet scenes.</p>
          <div className="nl-empty-actions">
            <Button type="primary" onClick={() => showPlanModal()}>
              Create a plan
            </Button>
          </div>
        </section>
      )}

      {!error && !loading && learningPlan.plans?.length > 0 && (
        <>
          <Collapse activeKey={activePanelKey} onChange={handlePanelChange}>
            {learningPlan.plans.map((plan) => (
              <Panel
                header={
                  <div className="nl-craft-plan-title">
                    <span>{plan.title}</span>
                    <Tag>{plan.topics?.length || 0} topics</Tag>
                  </div>
                }
                key={plan.id.toString()}
                extra={
                  <Space onClick={(event) => event.stopPropagation()}>
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      aria-label="Add topic"
                      onClick={() => showTopicModal("create", null, plan.id)}
                    />
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      aria-label="Edit plan"
                      onClick={() => showPlanModal("edit", plan)}
                    />
                    <Button
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      aria-label="Delete plan"
                      onClick={() => handleDeletePlan(plan.id)}
                    />
                  </Space>
                }
              >
                {plan.description && <p className="nl-craft-muted">{plan.description}</p>}

                <div className="mt-4">
                  <div className="nl-craft-section-head">
                    <h3>Topics</h3>
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => showTopicModal("create", null, plan.id)}
                    >
                      Add topic
                    </Button>
                  </div>

                  {plan.topics?.length > 0 ? (
                    <List
                      dataSource={plan.topics}
                      renderItem={(topic) => (
                        <List.Item className="!px-0">
                          <Card
                            size="small"
                            className="nl-craft-topic-card"
                            title={
                              <div className="flex items-center">
                                <Checkbox
                                  checked={topic.completed}
                                  className="mr-2"
                                  aria-label={`Mark ${topic.title} complete`}
                                  onChange={(event) => {
                                    dispatch(
                                      updateTopic({
                                        jwt: token,
                                        topicId: topic.id,
                                        topicData: {
                                          ...topic,
                                          completed: event.target.checked,
                                        },
                                      })
                                    );
                                  }}
                                />
                                <span className={topic.completed ? "line-through" : ""}>{topic.title}</span>
                              </div>
                            }
                            extra={
                              <Space>
                                <Button
                                  size="small"
                                  icon={<PlusOutlined />}
                                  aria-label="Add resource"
                                  onClick={() => showResourceModal("create", null, topic.id)}
                                />
                                <Button
                                  size="small"
                                  icon={<EditOutlined />}
                                  aria-label="Edit topic"
                                  onClick={() => showTopicModal("edit", topic, plan.id)}
                                />
                                <Button
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  danger
                                  aria-label="Delete topic"
                                  onClick={() => handleDeleteTopic(topic.id)}
                                />
                              </Space>
                            }
                          >
                            {topic.description && <p className="nl-craft-muted">{topic.description}</p>}
                            {topic.targetCompletionDate && (
                              <div className="mt-2">
                                <Tag>Target: {new Date(topic.targetCompletionDate).toLocaleDateString()}</Tag>
                                {new Date(topic.targetCompletionDate) < new Date() && !topic.completed && (
                                  <Tag className="ml-2 ant-tag-red">Past target</Tag>
                                )}
                              </div>
                            )}

                            {topic.resources?.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium mb-2">Resources</h4>
                                <List
                                  size="small"
                                  dataSource={topic.resources}
                                  renderItem={(resource) => (
                                    <List.Item className="!px-0">
                                      <div className="nl-craft-resource">
                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="nl-craft-link"
                                        >
                                          <LinkOutlined className="mr-2" aria-hidden="true" />
                                          {resource.description || resource.url}
                                        </a>
                                        <Space>
                                          <Button
                                            size="small"
                                            icon={<EditOutlined />}
                                            aria-label="Edit resource"
                                            onClick={() => showResourceModal("edit", resource, topic.id)}
                                          />
                                          <Button
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            danger
                                            aria-label="Delete resource"
                                            onClick={() => handleDeleteResource(resource.id)}
                                          />
                                        </Space>
                                      </div>
                                    </List.Item>
                                  )}
                                />
                              </div>
                            )}
                          </Card>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <div className="nl-craft-inline-empty">
                      <p className="nl-craft-muted">No topics yet</p>
                      <Button
                        className="mt-2"
                        icon={<PlusOutlined />}
                        onClick={() => showTopicModal("create", null, plan.id)}
                      >
                        Add a topic
                      </Button>
                    </div>
                  )}
                </div>
              </Panel>
            ))}
          </Collapse>

          {selectedPlan && (
            <section className="nl-craft-selected nl-card">
              <h2>{selectedPlan.title}</h2>
              {selectedPlan.description && <p className="nl-craft-muted mb-4">{selectedPlan.description}</p>}
              <p className="nl-craft-count">
                {topicCount > 0
                  ? `${completedCount} of ${topicCount} topics completed`
                  : "No topics to track yet"}
              </p>
              {topicCount > 0 && (
                <div className="nl-craft-bar" aria-hidden="true">
                  <span style={{ width: `${(completedCount / topicCount) * 100}%` }} />
                </div>
              )}
            </section>
          )}
        </>
      )}

      <Modal
        title={planModal.mode === "create" ? "Create learning plan" : "Edit learning plan"}
        open={planModal.open}
        onCancel={() => setPlanModal({ ...planModal, open: false })}
        onOk={() => planForm.submit()}
        okText={planModal.mode === "create" ? "Create" : "Save"}
        destroyOnClose
        width={600}
      >
        <Form
          form={planForm}
          onFinish={planModal.mode === "create" ? handleCreatePlan : handleUpdatePlan}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Plan title"
            rules={[
              { required: true, message: "Please enter a plan title" },
              { max: 100, message: "Title must be less than 100 characters" },
            ]}
          >
            <Input placeholder="Long exposure after dark" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ max: 500, message: "Description must be less than 500 characters" }]}
          >
            <TextArea rows={4} placeholder="What you want to practice, and why" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={topicModal.mode === "create" ? "Add topic" : "Edit topic"}
        open={topicModal.open}
        onCancel={() => setTopicModal({ ...topicModal, open: false })}
        onOk={() => topicForm.submit()}
        okText={topicModal.mode === "create" ? "Add topic" : "Save"}
        destroyOnClose
        width={600}
      >
        <Form
          form={topicForm}
          onFinish={topicModal.mode === "create" ? handleCreateTopic : handleUpdateTopic}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Topic title"
            rules={[
              { required: true, message: "Please enter a topic title" },
              { max: 100, message: "Title must be less than 100 characters" },
            ]}
          >
            <Input placeholder="Metering city light" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ max: 500, message: "Description must be less than 500 characters" }]}
          >
            <TextArea rows={3} placeholder="What this topic covers" />
          </Form.Item>
          <Form.Item name="targetCompletionDate" label="Target completion date">
            <DatePicker style={{ width: "100%" }} placeholder="Select a date" />
          </Form.Item>
          <Form.Item name="completed" valuePropName="checked">
            <Checkbox>Mark as completed</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={resourceModal.mode === "create" ? "Add resource" : "Edit resource"}
        open={resourceModal.open}
        onCancel={() => setResourceModal({ ...resourceModal, open: false })}
        onOk={() => resourceForm.submit()}
        okText={resourceModal.mode === "create" ? "Add resource" : "Save"}
        destroyOnClose
        width={600}
      >
        <Form
          form={resourceForm}
          onFinish={resourceModal.mode === "create" ? handleCreateResource : handleUpdateResource}
          layout="vertical"
        >
          <Form.Item
            name="url"
            label="Resource URL"
            rules={[
              { required: true, message: "Please enter a URL" },
              { type: "url", message: "Enter a valid URL" },
            ]}
          >
            <Input prefix={<LinkOutlined />} placeholder="https://" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description (optional)"
            rules={[{ max: 200, message: "Description must be less than 200 characters" }]}
          >
            <Input placeholder="Brief note about this resource" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LearningPlan;
