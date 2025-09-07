import React from 'react'
import { Card, Button, Typography, Space, Result } from "antd";
import { LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Logout = () => {
  const navigate = useNavigate();

  const onConfirm = () => { 
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/')
  }

  const onCancel = () => {
    navigate(-1)
  }

  return (
    <div className="enhanced-content">
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
              <LogoutOutlined className="text-3xl text-white" />
            </div>
            <div className="text-center">
              <Title level={1} className="text-white mb-2 font-bold">
                Confirm Logout
              </Title>
              <Text className="text-green-100 text-lg">
                Are you sure you want to sign out?
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Card className="enhanced-card">
        <div className="text-center py-12">
          <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center rounded-full shadow-2xl"
            style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}>
            <LogoutOutlined className="text-6xl text-white" />
          </div>
          
          <Title level={2} className="text-gray-800 mb-4">
            Sign Out Confirmation
          </Title>
          <Text className="text-gray-600 text-lg mb-8 block">
            Are you sure you want to logout from your account? You will need to sign in again to access your data.
          </Text>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="text-left">
                <Text className="text-red-800 font-medium block mb-2">Before you leave:</Text>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Save any unsaved work</li>
                  <li>• Your session will be terminated</li>
                  <li>• You'll need to sign in again</li>
                  <li>• All temporary data will be lost</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              icon={<ArrowLeftOutlined />}
              size="large"
              className="hover:border-primary-teal hover:text-primary-teal px-8 py-3 h-auto text-lg font-semibold"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              size="large"
              className="enhanced-btn px-8 py-3 h-auto text-lg font-semibold"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                border: "none",
              }}
              onClick={onConfirm}
            >
              Yes, Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Logout;
