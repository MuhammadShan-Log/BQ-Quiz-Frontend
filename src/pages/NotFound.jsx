import React from "react";
import { Card, Button, Typography, Space, Result } from "antd";
import { HomeOutlined, ArrowLeftOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="enhanced-content">
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
              <ExclamationCircleOutlined className="text-3xl text-white" />
            </div>
            <div className="text-center">
              <Title level={1} className="text-white mb-2 font-bold">
                404 - Page Not Found
              </Title>
              <Text className="text-green-100 text-lg">
                Oops! The page you're looking for doesn't exist
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Card className="enhanced-card">
        <div className="text-center py-12">
          <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center rounded-full shadow-2xl"
            style={{ background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)" }}>
            <ExclamationCircleOutlined className="text-6xl text-white" />
          </div>
          
          <Title level={2} className="text-gray-800 mb-4">
            Page Not Found
          </Title>
          <Text className="text-gray-600 text-lg mb-8 block">
            Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              type="primary"
              icon={<HomeOutlined />}
              size="large"
              className="enhanced-btn px-8 py-3 h-auto text-lg font-semibold"
              onClick={() => navigate("/")}
            >
              Go to Homepage
            </Button>
            <Button
              icon={<ArrowLeftOutlined />}
              size="large"
              className="hover:border-primary-teal hover:text-primary-teal px-8 py-3 h-auto text-lg font-semibold"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
          
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="text-left">
                <Text className="text-teal-800 font-medium block mb-2">Helpful Tips:</Text>
                <ul className="text-teal-700 text-sm space-y-1">
                  <li>• Check the URL spelling</li>
                  <li>• Use the navigation menu</li>
                  <li>• Try refreshing the page</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
