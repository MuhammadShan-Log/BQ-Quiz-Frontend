import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, message, Avatar, Space } from 'antd';
import { 
  BookOutlined, 
  TeamOutlined, 
  FileDoneOutlined, 
  UserOutlined,
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalQuizzes: 0,
    activeQuizzes: 0
  });
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [myStudents, setMyStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching teacher dashboard data..."); // Debug log
      
      const [coursesRes, studentsRes, overviewRes] = await Promise.all([
        api.get('/course/teacher/courses'),
        api.get('/course/teacher/students'),
        api.get('/dashboard/teacher/overview')
      ]);

      console.log("Teacher API Responses:", { coursesRes, studentsRes, overviewRes }); // Debug log

      setAssignedCourses(coursesRes.data?.courses || []);
      setMyStudents(studentsRes.data?.students || []);
      
      if (overviewRes.data) {
        setStats({
          totalCourses: overviewRes.data.totalCourses || 0,
          totalStudents: overviewRes.data.totalStudents || 0,
          totalQuizzes: overviewRes.data.totalQuizzes || 0,
          activeQuizzes: overviewRes.data.activeQuizzes || 0
        });
      }
    } catch (error) {
      console.error("Error fetching teacher dashboard:", error);
      message.error(`Failed to fetch dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const courseColumns = [
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">ID: {record._id}</div>
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            type="primary"
            onClick={() => navigate(`/teacher/course/${record._id}/students`)}
            icon={<TeamOutlined />}
          >
            View Students
          </Button>
          <Button 
            size="small"
            onClick={() => navigate(`/teacher/course/${record._id}/quizzes`)}
            icon={<FileDoneOutlined />}
          >
            Manage Quizzes
          </Button>
        </Space>
      )
    }
  ];

  const studentColumns = [
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Course',
      dataIndex: 'courseName',
      key: 'courseName',
      render: (text) => <Tag color="green">{text}</Tag>
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          size="small"
          onClick={() => navigate(`/teacher/student/${record._id}/progress`)}
          icon={<EyeOutlined />}
        >
          View Progress
        </Button>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your courses and students.</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <Statistic
              title="Assigned Courses"
              value={stats.totalCourses}
              prefix={<BookOutlined style={{ color: '#1890ff', fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<TeamOutlined style={{ color: '#52c41a', fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <Statistic
              title="Total Quizzes"
              value={stats.totalQuizzes}
              prefix={<FileDoneOutlined style={{ color: '#faad14', fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <Statistic
              title="Active Quizzes"
              value={stats.activeQuizzes}
              prefix={<FileDoneOutlined style={{ color: '#eb2f96', fontSize: 22 }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Assigned Courses */}
      <Card 
        title="My Assigned Courses" 
        className="shadow-md mb-6"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/teacher/add-quiz')}
          >
            Create Quiz
          </Button>
        }
      >
        <Table 
          columns={courseColumns} 
          dataSource={assignedCourses}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* My Students */}
      <Card title="My Students" className="shadow-md">
        <Table 
          columns={studentColumns} 
          dataSource={myStudents}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default TeacherDashboard;
