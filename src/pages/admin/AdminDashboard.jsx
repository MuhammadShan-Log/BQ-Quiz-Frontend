import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, message, Spin, Typography, Button, Space } from "antd";
import { BookOutlined, TeamOutlined, UserOutlined, FileDoneOutlined, CheckCircleOutlined, DashboardOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard/admin");
        setStats(data?.data);
      } catch (err) {
        message.error(err.response?.data?.message || "Failed to fetch admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-content space-y-8">
      {/* Header */}
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <DashboardOutlined className="text-2xl text-white" />
              </div>
              <div>
                <Title level={2} className="text-white mb-0">
                  Admin Dashboard
                </Title>
                <Text className="text-green-100">
                  Overview of system statistics and management
                </Text>
              </div>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="enhanced-btn"
                onClick={() => navigate("/courses")}
              >
                Manage Courses
              </Button>
              <Button
                icon={<EyeOutlined />}
                className="hover:border-primary-teal hover:text-primary-teal"
                onClick={() => navigate("/students")}
              >
                View Students
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)" }}>
                <BookOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Total Courses</Text>}
                value={stats?.totalCourses || 0}
                valueStyle={{ color: "#14b8a6", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                <TeamOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Total Students</Text>}
                value={stats?.totalStudents || 0}
                valueStyle={{ color: "#10b981", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}>
                <UserOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Total Teachers</Text>}
                value={stats?.totalTeachers || 0}
                valueStyle={{ color: "#8b5cf6", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                <FileDoneOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Total Quizzes</Text>}
                value={stats?.totalQuizzes || 0}
                valueStyle={{ color: "#f59e0b", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" }}>
                <CheckCircleOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Total Enrolments</Text>}
                value={stats?.totalEnrolments || 0}
                valueStyle={{ color: "#06b6d4", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
