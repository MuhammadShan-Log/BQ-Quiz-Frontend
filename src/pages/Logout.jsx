import React from 'react'
import { Card, Button, Typography, Space, Result } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

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
    navigate('/dashboard')
  }
  
  

  return (
    <div
    // style={{
    //   display: "flex",
    //   justifyContent: "center",
    //   alignItems: "center",
    //   height: "100vh",
    //   background: "#f0f2f5",
    // }}
    >
      <Card
        style={{ width: 400, textAlign: "center", borderRadius: 12 }}
        bordered={true}
      >
        <Result
          icon={<LogoutOutlined style={{ fontSize: 50, color: "#fa541c" }} />}
          title={<Title level={3}>Logout</Title>}
          subTitle={
            <Text type="secondary">
              Are you sure you want to logout from your account?
            </Text>
          }
          extra={
            <Space>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" danger icon={<LogoutOutlined />} onClick={onConfirm}>
                Logout
              </Button>
            </Space>
          }
        />
      </Card>
    </div>
    // <div className='lo'>
    //   <h1>Your are logged Out!</h1>
    //   <Button href='/'>Back to Login</Button>
    // </div>
  )
}

export default Logout;
