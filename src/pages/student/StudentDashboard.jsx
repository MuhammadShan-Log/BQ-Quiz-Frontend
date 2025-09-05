import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, message, Spin, Typography, Button, Space, Avatar, List, Empty } from "antd";
import { BookOutlined, FileDoneOutlined, UserOutlined, TrophyOutlined, ClockCircleOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const { Title, Text } = Typography;

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/dashboard/student");
        setStats(data?.data);

        // Fetch recent quizzes
        try {
          const quizzesRes = await api.get("/quizzes/quiz");
          setRecentQuizzes(quizzesRes.data?.slice(0, 5) || []);
        } catch (err) {
          console.log("Could not fetch recent quizzes:", err);
        }
      } catch (err) {
        message.error(err.response?.data?.message || "Failed to fetch student dashboard");
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
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-content space-y-8">
      {/* Welcome Header */}
      <Card
        className="enhanced-card"
        style={{
          background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
          border: "none",
          borderRadius: "16px",
          marginBottom: "10px",
          boxShadow: "0 10px 20px rgba(20, 184, 166, 0.2)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div>
            <Title level={2} style={{ color: "white", marginBottom: "8px" }}>
              Welcome back, Student! 🎓
            </Title>
            <Text style={{ color: "#ccfbf1" }}>
              Continue your learning journey and track your progress
            </Text>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="large"
              className="enhanced-btn"
              onClick={() => navigate("/quizzes/list")}
            >
              View Quizzes
            </Button>
            <Button
              size="large"
              className="border-2 border-white text-white bg-white hover:bg-teal-50 hover:text-teal-600 font-semibold transition-all duration-300"
              onClick={() => navigate("/my-course")}
              icon={<BookOutlined />}
            >
              My Courses
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{
                  background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
                }}
              >
                <BookOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Enrolled Courses</Text>}
                value={stats?.enrolledCourses || 0}
                valueStyle={{ color: "#14b8a6", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{
                  background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
                }}
              >
                <FileDoneOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Attempted Quizzes</Text>}
                value={stats?.attemptedQuizzes || 0}
                valueStyle={{ color: "#14b8a6", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{
                  background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
                }}
              >
                <TrophyOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Average Score</Text>}
                value={stats?.averageScore || 0}
                valueStyle={{ color: "#14b8a6", fontSize: "28px", fontWeight: "bold" }}
                suffix="%"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{
                  background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
                }}
              >
                <ClockCircleOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Study Hours</Text>}
                value={stats?.studyHours || 0}
                valueStyle={{ color: "#14b8a6", fontSize: "28px", fontWeight: "bold" }}
                suffix="hrs"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row gutter={[16, 16]}>
        {/* Recent Quizzes */}
        <Col xs={24} lg={16}>
          <Card className="enhanced-card">
            <div className="flex items-center justify-between mb-4">
              <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
                Available Quizzes
              </Title>
              <Button
                type="link"
                style={{ color: "#14b8a6", fontWeight: "600" }}
                className="hover:text-teal-700"
                onClick={() => navigate("/quizzes/list")}
              >
                View All
              </Button>
            </div>
            {recentQuizzes.length > 0 ? (
              <List
                dataSource={recentQuizzes}
                renderItem={(quiz, index) => (
                  <List.Item
                    style={{ padding: "12px", borderRadius: "8px" }}
                    className="hover:bg-teal-50 transition-all duration-200"
                    actions={[
                      <Button
                        key="view"
                        type="link"
                        icon={<EyeOutlined />}
                        style={{ color: "#14b8a6", borderRadius: "8px" }}
                        className="hover:text-teal-700 hover:bg-teal-100"
                        onClick={() => navigate(`/quizzes/list/${quiz._id}`)}
                      >
                        Take Quiz
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ background: "#14b8a6" }}
                          icon={<FileDoneOutlined />}
                        />
                      }
                      title={
                        <Text strong style={{ color: "#1f2937" }}>
                          {quiz.title}
                        </Text>
                      }
                      description={
                        <div className="text-gray-500">
                          <div>
                            Created: {new Date(quiz.createdAt || Date.now()).toLocaleDateString()}
                          </div>
                          <div>Questions: {quiz.questions?.length || 0}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No quizzes available yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  className="enhanced-btn"
                  onClick={() => navigate("/quizzes/list")}
                >
                  Browse Quizzes
                </Button>
              </Empty>
            )}
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card className="enhanced-card">
            <Title level={4} style={{ marginBottom: "16px", color: "#1f2937" }}>
              Quick Actions
            </Title>
            <div className="space-y-3">
              <Button
                block
                icon={<EyeOutlined />}
                className="enhanced-btn hover:shadow-lg"
                onClick={() => navigate("/quizzes/list")}
              >
                Browse Quizzes
              </Button>
              <Button
                block
                icon={<BookOutlined />}
                className="hover:bg-teal-600 hover:text-white hover:border-teal-600"
                style={{
                  border: "2px solid #14b8a6",
                  color: "#14b8a6",
                  borderRadius: "12px",
                  fontWeight: "600",
                }}
                onClick={() => navigate("/my-course")}
              >
                My Courses
              </Button>
              <Button
                block
                icon={<TrophyOutlined />}
                className="hover:bg-teal-600 hover:text-white hover:border-teal-600"
                style={{
                  border: "2px solid #14b8a6",
                  color: "#14b8a6",
                  borderRadius: "12px",
                  fontWeight: "600",
                }}
                onClick={() => navigate("/profile")}
              >
                View Profile
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;
