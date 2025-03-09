import { Layout } from "antd";

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="text-center bg-gray-800 text-white p-4 mt-6">
      <p className="text-sm">
        © {new Date().getFullYear()} Task Manager | Built with  by Esubalew Sintie
      </p>
    </Footer>
  );
};

export default AppFooter;
