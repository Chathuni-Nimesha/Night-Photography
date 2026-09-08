import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProgressUpdates,
  createProgressUpdate,
  updateProgressUpdate,
  deleteProgressUpdate,
} from "../../Redux/LearningProgress/Action";
import { Button, Modal, Form, Input, List, message, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAuthToken } from "../../Config/auth";
import "./LearningProgress.css";

const { Option } = Select;

const friendlyError = "That could not be saved. Please try again.";

const LearningProgress = () => {
  const dispatch = useDispatch();
  const token = getAuthToken();
  const { updates, loading, error } = useSelector((store) => store.learningProgress);
  const [form] = Form.useForm();
  const [modalApi, contextHolder] = Modal.useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (token) dispatch(getProgressUpdates(token));
  }, [dispatch, token]);

  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await dispatch(updateProgressUpdate(token, editing.id, values));
        message.success("Progress note updated");
      } else {
        await dispatch(createProgressUpdate(token, values));
        message.success("Progress note added");
      }
      form.resetFields();
      setIsModalOpen(false);
      setEditing(null);
    } catch {
      message.error(friendlyError);
    }
  };

  const handleTemplateChange = (value) => {
    if (value === "tutorial") {
      form.setFieldsValue({
        title: "Finished a night photography tutorial",
        content: "Worked through a tutorial on [technique].",
      });
    } else if (value === "skill") {
      form.setFieldsValue({
        title: "Practiced a lighting skill",
        content: "Practiced [skill] after dark.",
      });
    } else if (value === "project") {
      form.setFieldsValue({
        title: "Completed a night photography project",
        content: "Finished a project on [subject].",
      });
    }
  };

  const handleDelete = (id) => {
    modalApi.confirm({
      title: "Delete progress note",
      content: "This note will be removed from your craft journey.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await dispatch(deleteProgressUpdate(token, id));
          message.success("Progress note deleted");
        } catch {
          message.error(friendlyError);
        }
      },
    });
  };

  const notes = Array.isArray(updates) ? updates : [];

  return (
    <div className="nl-progress">
      {contextHolder}
      <header className="nl-progress-header">
        <div>
          <p className="nl-auth-kicker" style={{ textAlign: "left" }}>
            Craft journey
          </p>
          <h1>Learning progress</h1>
          <p>Keep notes on tutorials, skills, and projects as you work through night photography craft.</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add note
        </Button>
      </header>

      {error && (
        <section className="nl-empty nl-card">
          <h2>Progress could not be loaded.</h2>
          <p>Something went wrong while fetching your craft notes.</p>
          <div className="nl-empty-actions">
            <Button type="primary" onClick={() => dispatch(getProgressUpdates(token))}>
              Try again
            </Button>
          </div>
        </section>
      )}

      {!error && loading && (
        <div aria-busy="true" aria-label="Loading progress notes">
          <div className="nl-skeleton" style={{ height: "4.5rem", marginBottom: "0.75rem" }} />
          <div className="nl-skeleton" style={{ height: "4.5rem", marginBottom: "0.75rem" }} />
          <div className="nl-skeleton" style={{ height: "4.5rem" }} />
        </div>
      )}

      {!error && !loading && notes.length === 0 && (
        <section className="nl-empty nl-card">
          <h2>No progress notes yet.</h2>
          <p>Record what you practiced. Notes appear here only after you add them.</p>
          <div className="nl-empty-actions">
            <Button
              type="primary"
              onClick={() => {
                setEditing(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Add a note
            </Button>
          </div>
        </section>
      )}

      {!error && !loading && notes.length > 0 && (
        <List
          className="nl-progress-list"
          dataSource={notes}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <Button
                  key="edit"
                  icon={<EditOutlined />}
                  size="small"
                  aria-label="Edit progress note"
                  onClick={() => {
                    setEditing(item);
                    form.setFieldsValue(item);
                    setIsModalOpen(true);
                  }}
                />,
                <Button
                  key="delete"
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  aria-label="Delete progress note"
                  onClick={() => handleDelete(item.id)}
                />,
              ]}
            >
              <List.Item.Meta title={item.title} description={item.content} />
            </List.Item>
          )}
        />
      )}

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editing ? "Save" : "Add note"}
        title={editing ? "Edit progress note" : "Add progress note"}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {!editing && (
            <Form.Item label="Starting point">
              <Select placeholder="Optional template" onChange={handleTemplateChange} allowClear>
                <Option value="tutorial">Night photography tutorial</Option>
                <Option value="skill">Lighting skill</Option>
                <Option value="project">Photography project</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter a title" }]}>
            <Input placeholder="What you practiced" />
          </Form.Item>

          <Form.Item name="content" label="Details" rules={[{ required: true, message: "Please enter details" }]}>
            <Input.TextArea rows={4} placeholder="What did you learn or complete?" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LearningProgress;
