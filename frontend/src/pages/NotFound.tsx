import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you are looking for does not exist."
        extra={
          <Button
            type="primary"
            onClick={goHome}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
