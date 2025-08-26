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
          key: "course-management",
          icon: <BookOutlined />,
          label: "Course Management",
          children: [
            {
              key: "all-courses",
              label: <Link to="/courses">All Courses</Link>,
            },
            {
              key: "course-assignment",
              label: (
                <Link to="/admin/course-assignment">Course Assignment</Link>
              ),
            },
          ],
        },
        {
          key: "users",
          icon: <UserOutlined />,
          label: "User Management",
          children: [
            {
              key: "students",
              label: <Link to="/students">Students</Link>,
            },
            {
              key: "teachers",
              label: <Link to="/teachers">Teachers</Link>,
            },
          ],
        },
        {
          key: "profile",
          icon: <ProfileOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
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
          label: <Link to="/teacher/dashboard">Dashboard</Link>,
        },
        {
          key: "teacher-courses",
          icon: <BookOutlined />,
          label: <Link to="/teacher/courses">My Courses</Link>,
          // children: [
          //   {
          //     key: "my-course",
          //     label: <Link to="/my-course">My Course</Link>,
          //   },
          //   {
          //     key: "assigned-courses",
          //     label: <Link to="/teacher/courses">My Courses</Link>,
          //   },
          // ],
        },
        {
          key: "quizzes",
          icon: <FileTextOutlined />,
          label: "Quiz Management",
          children: [
            {
              key: "add-quiz",
              label: <Link to="/quizzes/add">Add Quiz</Link>,
            },
            {
              key: "quiz-list",
              label: <Link to="/quizzes/list">My Quizzes</Link>,
            },
          ],
        },
        {
          key: "students",
          icon: <UserOutlined />,
          label: <Link to="/teacher/getstudents">My Students</Link>,
        },
        {
          key: "profile",
          icon: <ProfileOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
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
          label: <Link to="/student/dashboard">Dashboard</Link>,
        },
        {
          key: "student-courses",
          icon: <BookOutlined />,
          label: "Course Management",
          children: [
            {
              key: "my-courses",
              label: <Link to="/my-course">My Courses</Link>,
            },
     
          ],
        },
        {
          key: "quizzes",
          icon: <FileTextOutlined />,
          label: "Quizzes",
          children: [
            {
              key: "quiz-list",
              label: <Link to="/quizzes/list">Available Quizzes</Link>,
            },
            // {
            //   key: "start-quiz",
            //   label: <Link to="/quizzes/quiz/:id/start">Start Quiz</Link>,
            // },
          ],
        },
        {
          key: "profile",
          icon: <ProfileOutlined />,
          label: <Link to="/profile">Profile</Link>,
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <Link to="/logout">Logout</Link>,
        },
      ],
    },
  ];

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      // console.log("AdminLayout - User:", user);
      // console.log("AdminLayout - Token:", token);

      if (!user || !user.role || !token) {
        console.log("Missing user, role, or token, redirecting to login");
        window.location.href = "/";
        return;
      }

      const { role } = user;
      console.log("Current user role:", role); // Debug log

      if (role === "admin") {
        setMenu(adminMenu);
      } else if (role === "student") {
        setMenu(studentMenu);
      } else if (role === "teacher") {
        setMenu(teacherMenu);
      } else {
        console.error("Unknown role:", role);
        setMenu(studentMenu); // Default fallback
      }
    } catch (error) {
      console.error("Error in AdminLayout useEffect:", error);
      window.location.href = "/";
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
