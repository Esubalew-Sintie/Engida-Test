import { Layout, Button } from "antd";
import { PlusOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

interface HeaderProps {
  onAddTask: () => void;
}

const AppHeader = ({ onAddTask }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Header  className="bg-gradient-to-r  bg-white to-purple-600 p-4 flex justify-between items-center text-white shadow-md">
      <h1 className="text-2xl text-white font-semibold">Task Manager</h1>
      <div className="flex space-x-4 ">
        <Button
          icon={<PlusOutlined />}
          onClick={onAddTask}
          color="orange"
          variant="solid"
          className=" w-24  font-bold"
        >
          Add Task
        </Button>
       
        <Button
          type="default"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="bg-white text-blue-500 hover:bg-gray-200"
        >
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader;
