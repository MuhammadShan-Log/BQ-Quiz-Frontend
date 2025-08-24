import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, Button, Table, Tag, Space, message } from "antd";
import {
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  FileDoneOutlined,
  SettingOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const cardStyle = {
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalQuizzes: 0,
    assignedCourses: 0,
    enrolledStudents: 0
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const navigate = useNavigate();

  // Check user role and redirect if needed
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Dashboard - User check:", user);
    
    if (!user || !user.role) {
      console.log("No user found, redirecting to login");
      navigate("/");
      return;
    }

    // Redirect based on role
    if (user.role === "teacher") {
      console.log("Teacher detected, redirecting to teacher dashboard");
      navigate("/teacher/dashboard");
      return;
    } else if (user.role === "student") {
      console.log("Student detected, redirecting to student dashboard");
      navigate("/student/dashboard");
      return;
    }

    // Only admin should stay here
    if (user.role !== "admin") {
      console.log("Unknown role, redirecting to login");
      navigate("/");
      return;
    }

    console.log("Admin detected, fetching dashboard data");
    fetchDashboardData();
  }, [navigate]);



  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewRes, assignmentsRes] = await Promise.all([
        api.get('/dashboard/admin/overview'),
        api.get('/course/assignments/recent')
      ]);

      if (overviewRes.data) {
        setStats({
          totalCourses: overviewRes.data.totalCourses || 0,
          totalTeachers: overviewRes.data.totalTeachers || 0,
          totalStudents: overviewRes.data.totalStudents || 0,
          totalQuizzes: overviewRes.data.totalQuizzes || 0,
          assignedCourses: overviewRes.data.assignedCourses || 0,
          enrolledStudents: overviewRes.data.enrolledStudents || 0
        });
      }

      setRecentAssignments(assignmentsRes.data.assignments || []);
    } catch (error) {
      message.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const assignmentColumns = [
    {
      title: 'Course',
      dataIndex: 'courseName',
      key: 'courseName',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">ID: {record.courseId}</div>
        </div>
      )
    },
    {
      title: 'Teacher',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.teacherEmail}</div>
        </div>
      )
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      key: 'studentCount',
      render: (count) => (
        <Tag color="blue">{count || 0} students</Tag>
      )
    },
    {
      title: 'Assignment Date',
      dataIndex: 'assignedAt',
      key: 'assignedAt',
      render: (date, record) => {
        if (date) {
          return new Date(date).toLocaleString();
        }
        if (record.teacherAssignedAt) {
          return `Teacher: ${new Date(record.teacherAssignedAt).toLocaleString()}`;
        }
        if (record.studentAssignedAt) {
          return `Student: ${new Date(record.studentAssignedAt).toLocaleString()}`;
        }
        return 'Recently assigned';
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small"
            onClick={() => navigate('/admin/course-assignment')}
            icon={<SettingOutlined />}
          >
            Manage
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and course assignment management</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title="Total Courses"
              value={stats.totalCourses}
              prefix={<BookOutlined style={{ color: "#1890ff", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title="Total Teachers"
              value={stats.totalTeachers}
              prefix={<TeamOutlined style={{ color: "#52c41a", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<UserOutlined style={{ color: "#faad14", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title="Total Quizzes"
              value={stats.totalQuizzes}
              prefix={<FileDoneOutlined style={{ color: "#eb2f96", fontSize: 22 }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Course Assignment Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title="Assigned Courses"
              value={stats.assignedCourses}
              prefix={<BookOutlined style={{ color: "#13c2c2", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title="Enrolled Students"
              value={stats.enrolledStudents}
              prefix={<UserOutlined style={{ color: "#722ed1", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title="Assignment Rate"
              value={stats.totalCourses > 0 ? Math.round((stats.assignedCourses / stats.totalCourses) * 100) : 0}
              suffix="%"
              prefix={<SettingOutlined style={{ color: "#f5222d", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle} bordered={true}>
            <Statistic
              title="Enrollment Rate"
              value={stats.totalStudents > 0 ? Math.round((stats.enrolledStudents / stats.totalStudents) * 100) : 0}
              suffix="%"
              prefix={<UserOutlined style={{ color: "#fa8c16", fontSize: 22 }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={24}>
          <Card title="Quick Actions" className="shadow-md">
            <Space wrap>
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin/course-assignment')}
              >
                Manage Course Assignments
              </Button>
              <Button 
                size="large"
                icon={<TeamOutlined />}
                onClick={() => navigate('/teachers')}
              >
                View Teachers
              </Button>
              <Button 
                size="large"
                icon={<UserOutlined />}
                onClick={() => navigate('/students')}
              >
                View Students
              </Button>
              <Button 
                size="large"
                icon={<BookOutlined />}
                onClick={() => navigate('/courses')}
              >
                View Courses
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Assignments */}
      <Card 
        title="Recent Course Assignments" 
        className="shadow-md"
        extra={
          <Button 
            type="primary"
            onClick={() => navigate('/admin/course-assignment')}
            icon={<SettingOutlined />}
          >
            Manage All Assignments
          </Button>
        }
      >
        <Table 
          columns={assignmentColumns} 
          dataSource={recentAssignments}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
