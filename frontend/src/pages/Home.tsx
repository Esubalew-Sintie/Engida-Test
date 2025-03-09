import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/store";
import { getTasks, addTask, editTask, removeTask } from "../store/taskSlice";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { Layout, Spin, notification } from "antd";
import TaskTable from "../components/tasks/TaskTable";
import TaskModal from "../components/tasks/TaskModal";
import { Task } from "../store/taskSlice";
import {
  PaginationComponent,
  TaskFilters,
} from "../components/tasks/TaskFilter";
import AppHeader from "../components/common/Header";
import AppFooter from "../components/common/Footer";

const { Content } = Layout;

const TaskList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editTaskData, setEditTaskData] = useState<Task | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return navigate("/login");
      try {
        const response = await dispatch(
          getTasks({
            token,
            page: pagination.current,
            limit: pagination.pageSize,
            search,
            status: status || "",
          })
        ).unwrap();
        setPagination((prev) => ({ ...prev, total: response.total }));
      } catch (error) {
        console.log(error);
        notification.error({ message: "Failed to fetch tasks" });
      }
    };

    fetchTasks();
  }, [dispatch, token, navigate, search, status, pagination.current]);

  const handleEditTask = (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setEditTaskData(task);
      setIsModalVisible(true);
    } else {
      notification.error({ message: "Task not found" });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!token) return navigate("/login");
    try {
      await dispatch(removeTask({ id, token })).unwrap();
      notification.success({ message: "Task deleted successfully" });
      dispatch(
        getTasks({
          token,
          page: pagination.current,
          limit: pagination.pageSize,
          search,
          status: status || "",
        })
      );
    } catch (error) {
      console.log(error);
      notification.error({ message: "Failed to delete task" });
    }
  };

  const handleAddEditTask = async (values: {
    title: string;
    description: string;
    status: string;
  }) => {
    if (!token) return navigate("/login");
    try {
      if (editTaskData) {
        await dispatch(
          editTask({ ...values, id: editTaskData.id, token })
        ).unwrap();
        notification.success({ message: "Task updated successfully" });
      } else {
        await dispatch(addTask({ ...values, token })).unwrap();
        notification.success({ message: "Task added successfully" });
      }

      setIsModalVisible(false);
      setEditTaskData(undefined);
      dispatch(
        getTasks({
          token,
          page: pagination.current,
          limit: pagination.pageSize,
          search,
          status: status || "",
        })
      );
    } catch (error) {
      console.log(error);
      notification.error({ message: "Failed to save task" });
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout className="min-h-screen" >
      <AppHeader onAddTask={() => setIsModalVisible(true)} />

      <Content className="p-6 bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Manage Your Tasks Efficiently
          </h2>

          <div className="mb-4 flex flex-wrap items-center gap-4">
            <TaskFilters
              search={search}
              setSearch={setSearch}
              statusFilter={status}
              setStatusFilter={setStatus}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <TaskTable
              tasks={tasks}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
            />
          )}

          <PaginationComponent
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>
      </Content>

      <AppFooter />

      <TaskModal
        key={editTaskData?.id}
        isVisible={isModalVisible}
        setIsVisible={handleCancelModal}
        editTaskData={editTaskData}
        onSubmit={handleAddEditTask}
      />
    </Layout>
  );
};

export default TaskList;
