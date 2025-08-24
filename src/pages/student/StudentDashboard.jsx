import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, message, Avatar, Space, Progress } from 'antd';
import { 
  BookOutlined, 
  FileDoneOutlined, 
  TrophyOutlined,
  UserOutlined,
  PlayCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching student dashboard data..."); // Debug log
      
      const [coursesRes, quizzesRes, overviewRes] = await Promise.all([
        api.get('/course/student/courses'),
        api.get('/quiz/student/available'),
        api.get('/dashboard/student/overview')
      ]);

      console.log("Student API Responses:", { coursesRes, quizzesRes, overviewRes }); // Debug log

      setEnrolledCourses(coursesRes.data?.courses || []);
      setAvailableQuizzes(quizzesRes.data?.quizzes || []);
      
      if (overviewRes.data) {
        setStats({
          totalCourses: overviewRes.data.totalCourses || 0,
          totalQuizzes: overviewRes.data.totalQuizzes || 0,
          completedQuizzes: overviewRes.data.completedQuizzes || 0,
          averageScore: overviewRes.data.averageScore || 0
        });
      }
    } catch (error) {
      console.error("Error fetching student dashboard:", error);
      message.error(`Failed to fetch dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const courseColumns = [
    {
      title: 'Course',
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
      title: 'Teacher',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-sm text-gray-500">{record.teacherEmail}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => (
        <Progress 
          percent={record.progress || 0} 
          size="small" 
          status="active"
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          size="small" 
          type="primary"
          onClick={() => navigate(`/student/course/${record._id}/quizzes`)}
          icon={<FileDoneOutlined />}
        >
          View Quizzes
        </Button>
      )
    }
  ];

  const quizColumns = [
    {
      title: 'Quiz',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">Course: {record.courseName}</div>
        </div>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} minutes`
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        if (record.isCompleted) {
          return <Tag color="green">Completed</Tag>;
        } else if (record.isActive) {
          return <Tag color="blue">Active</Tag>;
        } else {
          return <Tag color="orange">Upcoming</Tag>;
        }
      }
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score, record) => {
        if (record.isCompleted) {
          return (
            <div className="flex items-center space-x-2">
              <span className="font-medium">{score}%</span>
              {score >= 80 && <TrophyOutlined style={{ color: '#faad14' }} />}
            </div>
          );
        }
        return '-';
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        if (record.isCompleted) {
          return (
            <Button 
              size="small"
              onClick={() => navigate(`/student/quiz/${record._id}/result`)}
              icon={<EyeOutlined />}
            >
              View Result
            </Button>
          );
        } else if (record.isActive) {
          return (
            <Button 
              size="small" 
              type="primary"
              onClick={() => navigate(`/student/quiz/${record._id}/start`)}
              icon={<PlayCircleOutlined />}
            >
              Start Quiz
            </Button>
          );
        } else {
          return <span className="text-gray-400">Not available yet</span>;
        }
      }
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Welcome! Here's your learning progress and available quizzes.</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <Statistic
              title="Enrolled Courses"
              value={stats.totalCourses}
              prefix={<BookOutlined style={{ color: '#1890ff', fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <Statistic
              title="Available Quizzes"
              value={stats.totalQuizzes}
              prefix={<FileDoneOutlined style={{ color: '#52c41a', fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <Statistic
              title="Completed Quizzes"
              value={stats.completedQuizzes}
              prefix={<TrophyOutlined style={{ color: '#faad14', fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md">
            <Statistic
              title="Average Score"
              value={stats.averageScore}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#eb2f96', fontSize: 22 }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Enrolled Courses */}
      <Card title="My Enrolled Courses" className="shadow-md mb-6">
        <Table 
          columns={courseColumns} 
          dataSource={enrolledCourses}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Available Quizzes */}
      <Card title="Available Quizzes" className="shadow-md">
        <Table 
          columns={quizColumns} 
          dataSource={availableQuizzes}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default StudentDashboard;
