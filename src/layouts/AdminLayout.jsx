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
  BellOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  Button,
  Layout,
  Menu,
  theme,
  Avatar,
  Badge,
  Input,
  Dropdown,
  Space,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;
const { Search } = Input;

const AdminLayout = ({ children }) => {
  const [menu, setMenu] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
          key: "attempts",
          icon: <FileTextOutlined />,
          label: <Link to="/teacher/attempts">Quiz Attempts</Link>,
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const userMenuItems = [
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
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!userData || !userData.role || !token) {
        console.log("Missing user, role, or token, redirecting to login");
        window.location.href = "/";
        return;
      }

      setUser(userData);
      const { role } = userData;
      console.log("Current user role:", role);

      if (role === "admin") {
        setMenu(adminMenu);
      } else if (role === "student") {
        setMenu(studentMenu);
      } else if (role === "teacher") {
        setMenu(teacherMenu);
      } else {
        console.error("Unknown role:", role);
        setMenu(studentMenu);
      }
    } catch (error) {
      console.error("Error in AdminLayout useEffect:", error);
      window.location.href = "/";
    }
  }, []);

  return (
    <Layout className="min-h-screen">
      <Sider
        className="enhanced-sidebar"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
          boxShadow: "var(--shadow-xl)",
          minHeight: "100vh",
          transition: "all 0.3s",
          padding: 0,
        }}
      >
        <div className="ant-layout-sider-children">
          <div
            className="bq-logo enhanced-logo "
            style={{
              display: "flex",
              alignItems: "center",
              padding: collapsed ? "16px" : "24px",
              gap: "12px",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <img
              src="/public/logo.png"
              alt="Logo"
              style={{ width: 40, height: 40 }}
            />
            {!collapsed && (
              <div className="logo-text">
                <h3 className="text-white font-bold text-lg mb-0">BQ Quiz</h3>
                <p className="text-green-200 text-xs mt-1">Learning Portal</p>
              </div>
            )}
          </div>

          <div
            className="menu-container sticky top-0 z-50 "
            style={{ marginTop: 16 }}
          >
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["dashboard"]}
              items={menu}
              className="enhanced-menu"
              style={{
                background: "transparent",
                border: "none",
                fontSize: "16px",
              }}
              itemStyle={{
                borderRadius: "8px",
                margin: "4px 0",
                transition: "background 0.2s",
              }}
            />
          </div>
        </div>
      </Sider>

      <Layout>
        <Header
          className="enhanced-header "
          style={{
            padding: "0 24px",
            background: "white",
            height: "100px",
            display: "inline",
            borderBottom: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)",
            backdropFilter: "blur(8px)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div className="flex items-center justify-between bg-white h-20 ">
            <div className="header-left flex items-center gap-4">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="sidebar-toggle"
                style={{
                  fontSize: "20px",
                  width: 48,
                  height: 48,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "background 0.2s",
                }}
              />

              <div className="search-container mt-8 hover:border-teal-400">
                <Search
                  placeholder="Search courses, quizzes, users..."
                  allowClear
                  style={{
                    width: 300,
                    borderRadius: "24px",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  className="enhanced-search"
                />
              </div>
            </div>

            <div className="header-right flex items-center gap-6">
              <Badge count={5} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="notification-btn"
                  style={{
                    fontSize: "20px",
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    color: "var(--text-secondary)",
                    background: "#fff",
                    transition: "background 0.2s",
                  }}
                />
              </Badge>

              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div
                  className="user-profile flex items-center mt-4 gap-2 cursor-pointer"
                  style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
                    transition: "background 0.2s",
                  }}
                >
                  <Avatar
                    size={40}
                    style={{
                      backgroundColor: "#06986C",
                      cursor: "pointer",
                      fontWeight: "bold",
                      marginTop: "4px",
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  {!collapsed && (
                    <div className="user-info flex flex-col ml-2">
                      <span className="user-name font-semibold text-white">
                        {user?.name || "User"}
                      </span>
                      <span className="user-role capitalize text-green-300 text-xs">
                        {user?.role || "Student"}
                      </span>
                    </div>
                  )}
                  <span style={{ marginLeft: 8, color: "#222" }}>
                    <DownArrowIcon />
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>

        <Content
          className="enhanced-content"
          style={{
            margin: "24px",
            padding: "32px",
            minHeight: "calc(100vh - 112px)",
            background: "var(--bg-primary)",
            borderRadius: "24px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-light)",
            transition: "box-shadow 0.2s",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

const DownArrowIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
    <path
      d="M4 6l4 4 4-4"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AdminLayout;
