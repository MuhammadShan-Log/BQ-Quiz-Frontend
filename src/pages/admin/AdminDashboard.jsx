import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, message, Spin } from "antd";
import { BookOutlined, TeamOutlined, UserOutlined, FileDoneOutlined, CheckCircleOutlined } from "@ant-design/icons";
import api from "../../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard/admin");
        setStats(data);
      } catch (err) {
        message.error(err.response?.data?.message || "Failed to fetch admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Spin tip="Loading admin dashboard..." />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="shadow-md">
            <Statistic
              title="Total Courses"
              value={stats?.totalCourses || 0}
              prefix={<BookOutlined style={{ color: "#1890ff", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="shadow-md">
            <Statistic
              title="Total Students"
              value={stats?.totalStudents || 0}
              prefix={<TeamOutlined style={{ color: "#52c41a", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="shadow-md">
            <Statistic
              title="Total Teachers"
              value={stats?.totalTeachers || 0}
              prefix={<UserOutlined style={{ color: "#722ed1", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="shadow-md">
            <Statistic
              title="Total Quizzes"
              value={stats?.totalQuizzes || 0}
              prefix={<FileDoneOutlined style={{ color: "#faad14", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="shadow-md">
            <Statistic
              title="Total Enrolments"
              value={stats?.totalEnrolments || 0}
              prefix={<CheckCircleOutlined style={{ color: "#13c2c2", fontSize: 22 }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
