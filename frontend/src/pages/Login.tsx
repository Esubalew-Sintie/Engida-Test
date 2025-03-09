import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Input, Button, Card, Typography, Form, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token != "undefined") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const resultAction = await dispatch(login(values));

      if (resultAction.type === "auth/login/fulfilled") {
        const { access_token } = resultAction?.payload || {};
        if (access_token) {
          localStorage.setItem("token", access_token);
          message.success("Login successful!");
          navigate("/");
        } else {
          setErrorMessage("Login failed : Invalid email or password.");

          message.error("Login failed: Invalid email or password.");
        }
      } else {
        const errorMsg =
          (resultAction.payload as string) ||
          "Invalid email or password. Please try again.";
        console.log("Login failed:", errorMsg);
        setErrorMessage(errorMsg);

        message.error(errorMessage);
      }
    } catch (error) {
      console.log("Error during login:", error);
      setErrorMessage("Something went wrong. Please try again later.");

      message.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      console.log("Login finished");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/images/engida-travel-bg.jpg')" }}
    >
      <Card className="shadow-lg rounded-xl p-6 w-full max-w-xs bg-white backdrop-blur-md border border-blue-500">
        <Title level={3} className="text-center mb-4 text-blue-700 font-bold">
          Welcome to Engida Travel
        </Title>
        <Text className="block text-center text-gray-500 mb-3">
          Discover new destinations. Sign in to manage your travel plans.
        </Text>
        {errorMessage && (
          <Text className="block text-center text-red-700 mb-3">
            {errorMessage}
          </Text>
        )}

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="text-blue-500" />}
              placeholder="Email"
              className="rounded-lg px-4 py-2 border border-blue-300 focus:ring focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              {
                validator: async (_, value) => {
                  if (!value)
                    return Promise.reject("Please enter your password");
                  if (value.length < 6)
                    return Promise.reject(
                      "Password must be at least 6 characters"
                    );
                  if (!/[A-Z]/.test(value))
                    return Promise.reject(
                      "Password must contain at least one uppercase letter"
                    );
                  if (!/[0-9]/.test(value))
                    return Promise.reject(
                      "Password must contain at least one number"
                    );
                  if (!/[!@#$%^&*]/.test(value))
                    return Promise.reject(
                      "Password must contain at least one special character"
                    );
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-blue-500" />}
              placeholder="Password"
              className="rounded-lg px-4 py-2 border border-blue-300 focus:ring focus:ring-blue-500"
            />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg w-full py-2"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
        <Text className="block text-center text-sm text-gray-600 mt-4">
          New to Engida Travel?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Create an account
          </a>
        </Text>
      </Card>
    </div>
  );
};

export default Login;
