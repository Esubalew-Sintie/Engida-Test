import { Table, Button, Badge } from "antd";
import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

// Define your Task type and TaskTable props
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

interface TaskTableProps {
  tasks: Task[];
  handleEditTask: (id: string) => void;
  handleDeleteTask: (id: string) => void;
}

// TaskTable Component
const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  handleEditTask,
  handleDeleteTask,
}) => {
  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status:string) => {
        const statusColors: { [key: string]: string } = {
          "To Do": "red",
          "In Progress": "blue",
          "Done": "green",
        };
        return <Badge color={statusColors[status]} text={status} />;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string ) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_:string, record:Task) => (
        <>
          <Button
            onClick={() => handleEditTask(record.id)}
            icon={<EditOutlined />}
            className="mr-2"
            size="small"
            style={{ borderRadius: "4px", padding: "0 8px" }}
            shape="round"
            type="primary"
            ghost
          />
          <Button
            onClick={() => handleDeleteTask(record.id)}
            icon={<DeleteOutlined />}
            danger
            size="small"
            style={{ borderRadius: "4px", padding: "0 8px" }}
            shape="round"
          />
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tasks}
      rowKey="id"
      pagination={false}
    />
  );
};

export default TaskTable;
