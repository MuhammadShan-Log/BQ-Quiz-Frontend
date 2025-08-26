import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, message, Spin } from "antd";
import { BookOutlined, FileDoneOutlined } from "@ant-design/icons";
import api from "../../utils/api";

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard/student");
        setStats(data?.data);
      } catch (err) {
        message.error(err.response?.data?.message || "Failed to fetch student dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Spin tip="Loading student dashboard..." />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card className="shadow-md">
            <Statistic
              title="Enrolled Courses"
              value={stats?.enrolledCourses || 0}
              prefix={<BookOutlined style={{ color: "#1890ff", fontSize: 22 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card className="shadow-md">
            <Statistic
              title="Attempted Quizzes"
              value={stats?.attemptedQuizzes || 0}
              prefix={<FileDoneOutlined style={{ color: "#52c41a", fontSize: 22 }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;
