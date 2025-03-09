import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { register } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Input, Button, Card, Typography, Form, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    setLoading(true);
    setErrorMessage("");
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registrationData } = values;
      const resultAction = await dispatch(register(registrationData));

      if (resultAction.type === "auth/register/fulfilled") {
        message.success("Registration successful! Redirecting...");
        navigate("/login");
      } else {
        const errorMsg =
          (resultAction.payload as string) ||
          "Registration failed. Please try again.";
        setErrorMessage(errorMsg);
        message.error(errorMsg);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong. Please try again later.");
      message.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/images/engida-travel-bg.jpg')" }}
    >
      <Card className="shadow-lg rounded-xl p-6 w-full max-w-xs bg-white backdrop-blur-md border border-green-500">
        <Title level={3} className="text-center mb-4 text-green-700 font-bold">
          Create an Account
        </Title>
        <Text className="block text-center text-gray-500 mb-3">
          Join Engida Travel and start your journey today!
        </Text>
        {errorMessage && (
          <Text className="block text-center text-red-700 mb-3">
            {errorMessage}
          </Text>
        )}
        <Form form={form} layout="vertical" onFinish={handleRegister}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="text-green-500" />}
              placeholder="Full Name"
              className="rounded-lg px-4 py-2 border border-green-300 focus:ring focus:ring-green-500"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="text-green-500" />}
              placeholder="Email"
              className="rounded-lg px-4 py-2 border border-green-300 focus:ring focus:ring-green-500"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              {
                validator: async (_, value) => {
                  if (!value || value.length < 6) {
                    return Promise.reject(
                      "Password must be at least 6 characters"
                    );
                  }
                  if (!/[A-Z]/.test(value)) {
                    return Promise.reject(
                      "Password must contain at least one uppercase letter"
                    );
                  }
                  if (!/[0-9]/.test(value)) {
                    return Promise.reject(
                      "Password must contain at least one number"
                    );
                  }
                  if (!/[!@#$%^&*]/.test(value)) {
                    return Promise.reject(
                      "Password must contain at least one special character"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-green-500" />}
              placeholder="Password"
              className="rounded-lg px-4 py-2 border border-green-300 focus:ring focus:ring-green-500"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("The two passwords do not match");
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-green-500" />}
              placeholder="Confirm Password"
              className="rounded-lg px-4 py-2 border border-green-300 focus:ring focus:ring-green-500"
            />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg w-full py-2"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </Form>
        <Text className="block text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Sign in
          </a>
        </Text>
      </Card>
    </div>
  );
};

export default Register;
