import { Modal, Form, Input, Select, Button } from "antd";
import { FormValues, TaskModalProps } from "../../types/types";
const TaskModal: React.FC<TaskModalProps> = ({ isVisible, setIsVisible, editTaskData, onSubmit }) => {
console.log("editTaskData  on model:",editTaskData?.title)
  const handleOk = (values: FormValues) => {
    onSubmit(values); // Call the handler passed from parent component
  };

  return (
    <Modal 
      title={editTaskData ? "Edit Task" : "Add Task"} 
      open={isVisible} 
      onCancel={() => setIsVisible()} 
      footer={null}
    >
      <Form 
        initialValues={{
          title: editTaskData?.title || "",
          description: editTaskData?.description || "",
          status: editTaskData?.status || "To Do"
        }} 
        onFinish={handleOk}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input />
        </Form.Item>
        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="To Do">To Do</Select.Option>
            <Select.Option value="In Progress">In Progress</Select.Option>
            <Select.Option value="Done">Completed</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editTaskData ? "Edit Task" : "Add Task"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
