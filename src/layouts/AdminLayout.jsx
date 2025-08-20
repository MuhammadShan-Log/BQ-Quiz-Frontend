import React, { useEffect, useState } from "react";
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
  const [menu, setMenu] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const allMenu = [
    {
      type: "group",
      label: "Admin Dashboard Menu",
      children: [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
          key: "courses",
          icon: <BookOutlined />,
          label: <Link to="/courses">Courses</Link>,
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
        // {
        //   key: "change-password",
        //   icon: <LockOutlined />,
        //   label: <Link to="/change-password">Change Password</Link>,
        // },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <Link to="/logout">Logout</Link>,
        },
      ],
    },
    {
      type: "group",
      label: "Teacher Dashboard Menu",
      children: [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
          key: "students",
          icon: <UserOutlined />,
          label: <Link to="/students">My Students</Link>,
        },
        {
          key: "my course",
          icon: <BookOutlined />,
          label: "Courses",
          children: [
            {
              key: "my-course-1",
              label: <Link to="/my-course">My Course</Link>,
            },
            {
              key: "add-quiz",
              label: <Link to="/quizzes/add">Add Quiz</Link>,
            },
            {
              key: "quiz-list",
              label: <Link to="/quizzes/list">Quiz List</Link>,
            },
          ],
        },

        {
          key: "profile",
          icon: <ProfileOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
        // {
        //   key: "change-password",
        //   icon: <LockOutlined />,
        //   label: <Link to="/change-password">Change Password</Link>,
        // },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <Link to="/logout">Logout</Link>,
        },
      ],
    },

    {
      type: "group",
      label: "Student Dashboard Menu",
      children: [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
          key: "my courses",
          icon: <BookOutlined />,
          label: "My Course",
          children: [
            {
              key: "my course",
              label: <Link to="/my-course">Course</Link>,
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
          key: "profile",
          icon: <ProfileOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
        // {
        //   key: "change-password",
        //   icon: <LockOutlined />,
        //   label: <Link to="/change-password">Change Password</Link>,
        // },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <Link to="/logout">Logout</Link>,
        },
      ],
    },
  ];

  const adminMenu = [
    {
      type: "group",
      label: "Admin Menu",
      children: [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
          key: "courses",
          icon: <BookOutlined />,
          label: <Link to="/courses">Courses</Link>,
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
        // {
        //   key: "change-password",
        //   icon: <LockOutlined />,
        //   label: <Link to="/change-password">Change Password</Link>,
        // },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <Link to="/logout">Logout</Link>,
        },
      ],
    },
  ];

  const teacherMenu = [
    {
      type: "group",
      label: "Teacher Menu",
      children: [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
          key: "students",
          icon: <UserOutlined />,
          label: <Link to="/students">My Students</Link>,
        },
        {
          key: "my course",
          icon: <BookOutlined />,
          label: "Courses",
          children: [
            {
              key: "my-course-1",
              label: <Link to="/my-course">My Course</Link>,
            },
            {
              key: "quiz-list",
              label: <Link to="/quizzes/list">My Quizzes</Link>,
            },
            {
              key: "add-quiz",
              label: <Link to="/quizzes/add">Add Quiz</Link>,
            },
          ],
        },

        {
          key: "profile",
          icon: <ProfileOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
        // {
        //   key: "change-password",
        //   icon: <LockOutlined />,
        //   label: <Link to="/change-password">Change Password</Link>,
        // },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <Link to="/logout">Logout</Link>,
        },
      ],
    },
  ];

  const studentMenu = [
    {
      type: "group",
      label: "Student Menu",
      children: [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
          key: "my courses",
          icon: <BookOutlined />,
          label: "My Course",
          children: [
            {
              key: "my course",
              label: <Link to="/my-course">Course</Link>,
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
          key: "profile",
          icon: <ProfileOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
        // {
        //   key: "change-password",
        //   icon: <LockOutlined />,
        //   label: <Link to="/change-password">Change Password</Link>,
        // },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <Link to="/logout">Logout</Link>,
        },
      ],
    },
  ];

  useEffect(() => {
    let { role } = JSON.parse(localStorage.getItem("user"));

    if (role == "admin") {
      setMenu(adminMenu);
    } else if (role == "student") {
      setMenu(studentMenu);
    } else if (role == "teacher") {
      setMenu(teacherMenu);
    }
  }, []);

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
          items={menu}
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
