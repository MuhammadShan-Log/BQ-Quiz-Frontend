import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  ProfileOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const adminMenu = [
    {
      type: "group", 
      label: "Admin",
      children: [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
          key: "courses",
          icon: <BookOutlined />,
          label: "Courses",
          children: [
            {
              key: "add-course",
              label: <Link to="/courses/add">Add Course</Link>,
            },
            {
              key: "course-list",
              label: <Link to="/courses/list">Course List</Link>,
            },
          ],
        },
        {
          key: "quizzes",
          icon: <FileTextOutlined />,
          label: "Quizzes",
          children: [
            {
              key: "add-quiz",
              label: <Link to="/quizzes/add">Add Quiz</Link>,
            },
            {
              key: "quiz-list",
              label: <Link to="/quizzes/list">Quiz List</Link>,
            },
            {
              key: "Take Quiz",
              label: <Link to="/quizzes/take">Take Quiz</Link>,
            },
          ],
        },
        {
          key: "students",
          icon: <UserOutlined />,
          label: <Link to="/students">Students</Link>,
        },
        {
          key: "teachers",
          icon: <TeamOutlined />,
          label: <Link to="/teachers">Teachers</Link>,
        },
        {
          key: "profile",
          icon: <ProfileOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
        {
          key: "change-password",
          icon: <LockOutlined />,
          label: <Link to="/change-password">Change Password</Link>,
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Logout",
        },
      ],
    },
  ];

  return (
    <Layout>
      <Sider
        style={{ background: "#0f7142" }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="bq-logo">
          <img src="/public/logo.png" alt="Logo" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={adminMenu}
          style={{ background: "#0f7142" }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
