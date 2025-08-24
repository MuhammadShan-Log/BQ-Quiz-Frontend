import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const SimpleTest = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [localStorageData, setLocalStorageData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    
    setUserInfo(user);
    setLocalStorageData({
      user: user,
      token: token,
      hasUser: !!user,
      hasToken: !!token,
      userRole: user?.role || 'none'
    });

    console.log("SimpleTest - User info:", user);
    console.log("SimpleTest - Token:", token);
  }, []);

  const testNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    console.log("Current localStorage state:", {
      user: localStorage.getItem("user"),
      token: localStorage.getItem("token")
    });
    navigate(path);
  };

  const clearStorage = () => {
    localStorage.clear();
    setUserInfo(null);
    setLocalStorageData({});
    console.log("LocalStorage cleared");
  };

  const goToLogin = () => {
    navigate("/");
  };

  return (
    <div className="p-6">
      <Title level={2}>🔍 Debug & Test Component</Title>
      <Text type="secondary">Use this to test routing and debug issues</Text>
      
      <Divider />
      
      <Card title="📊 Current State" className="mb-4">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>User Info:</Text>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          </div>
          
          <div>
            <Text strong>LocalStorage Status:</Text>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
          </div>
        </Space>
      </Card>

      <Card title="🧪 Test Navigation" className="mb-4">
        <Space wrap>
          <Button 
            type="primary" 
            onClick={() => testNavigation('/dashboard')}
            disabled={!localStorageData.hasUser}
          >
            Admin Dashboard
          </Button>
          
          <Button 
            type="default" 
            onClick={() => testNavigation('/teacher/dashboard')}
            disabled={!localStorageData.hasUser}
          >
            Teacher Dashboard
          </Button>
          
          <Button 
            type="default" 
            onClick={() => testNavigation('/student/dashboard')}
            disabled={!localStorageData.hasUser}
          >
            Student Dashboard
          </Button>
          
          <Button 
            type="default" 
            onClick={() => testNavigation('/admin/course-assignment')}
            disabled={!localStorageData.hasUser}
          >
            Course Assignment
          </Button>
          
          <Button 
            type="default" 
            onClick={() => testNavigation('/admin/api-test')}
            disabled={!localStorageData.hasUser}
          >
            API Test
          </Button>
        </Space>
      </Card>

      <Card title="🛠️ Actions" className="mb-4">
        <Space wrap>
          <Button 
            onClick={clearStorage}
            danger
          >
            Clear LocalStorage
          </Button>
          
          <Button 
            onClick={goToLogin}
            type="default"
          >
            Go to Login
          </Button>
          
          <Button 
            onClick={() => window.location.reload()}
            type="default"
          >
            Reload Page
          </Button>
        </Space>
      </Card>

      <Card title="📝 Instructions">
        <Paragraph>
          1. <Text strong>Login first</Text> with any role (admin/teacher/student)
        </Paragraph>
        <Paragraph>
          2. <Text strong>Check the Current State</Text> to see user info and token
        </Paragraph>
        <Paragraph>
          3. <Text strong>Test Navigation</Text> to different routes
        </Paragraph>
        <Paragraph>
          4. <Text strong>Check Console</Text> (F12) for debug logs
        </Paragraph>
        <Paragraph>
          5. If stuck, use <Text strong>Clear LocalStorage</Text> and login again
        </Paragraph>
      </Card>
    </div>
  );
};

export default SimpleTest;
