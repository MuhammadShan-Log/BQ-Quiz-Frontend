import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Button,
  Avatar,
  List,
  Typography,
  Empty,
} from "antd";
import {
  BookOutlined,
  TeamOutlined,
  FileDoneOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import api from "../../utils/api";

const { Title, Text } = Typography;

const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        // Fetch dashboard stats
        const { data } = await api.get("/dashboard/teacher");
        setStats(data);

        // Fetch recent quizzes
        try {
          const quizzesRes = await api.get("/quizzes/quiz");
          setRecentQuizzes(quizzesRes.data?.slice(0, 5) || []);
        } catch (err) {
          console.log("Could not fetch recent quizzes:", err);
        }

        // Fetch recent students
        try {
          const studentsRes = await api.get("/course/teacher/getstudents");
          setRecentStudents(studentsRes.data?.data?.slice(0, 5) || []);
        } catch (err) {
          console.log("Could not fetch recent students:", err);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
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
              Welcome back, Teacher! 👋
            </Title>
            <Text style={{ color: "#ccfbf1" }}>
              Manage your quizzes, students, and courses
            </Text>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="enhanced-btn"
              onClick={() => navigate("/quizzes/add")}
            >
              Create Quiz
            </Button>
            <Button
              size="large"
              className="border-2 border-white text-white bg-white hover:bg-teal-50 hover:text-teal-600 font-semibold transition-all duration-300"
              onClick={() => navigate("/quizzes/list")}
              icon={<EyeOutlined />}
            >
              View Quizzes
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      {stats && (
        <Row gutter={[16, 16]}>
          {stats.totalCourses !== undefined && (
            <Col xs={24} sm={12} lg={6}>
              <Card
                className="enhanced-card hover:scale-105 transition-all duration-300"
              >
                <div className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
                    }}
                  >
                    <BookOutlined
                      style={{ color: "white", fontSize: "24px" }}
                    />
                  </div>
                  <Statistic
                    title={
                      <Text style={{ color: "#4b5563", fontWeight: "500" }}>
                        Total Courses
                      </Text>
                    }
                    value={stats.totalCourses || 0}
                    valueStyle={{
                      color: "#14b8a6",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </div>
              </Card>
            </Col>
          )}
          {stats.totalStudents !== undefined && (
            <Col xs={24} sm={12} lg={6}>
              <Card
                className="enhanced-card hover:scale-105 transition-all duration-300"
              >
                <div className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
                    }}
                  >
                    <TeamOutlined
                      style={{ color: "white", fontSize: "24px" }}
                    />
                  </div>
                  <Statistic
                    title={
                      <Text style={{ color: "#4b5563", fontWeight: "500" }}>
                        Total Students
                      </Text>
                    }
                    value={stats.totalStudents || 0}
                    valueStyle={{
                      color: "#14b8a6",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </div>
              </Card>
            </Col>
          )}
          {stats.totalQuizzes !== undefined && (
            <Col xs={24} sm={12} lg={6}>
              <Card
                className="enhanced-card hover:scale-105 transition-all duration-300"
              >
                <div className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
                    }}
                  >
                    <FileDoneOutlined
                      style={{ color: "white", fontSize: "24px" }}
                    />
                  </div>
                  <Statistic
                    title={
                      <Text style={{ color: "#4b5563", fontWeight: "500" }}>
                        Quizzes Created
                      </Text>
                    }
                    value={stats.totalQuizzes || 0}
                    valueStyle={{
                      color: "#14b8a6",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </div>
              </Card>
            </Col>
          )}
          {stats.averageScore !== undefined && (
            <Col xs={24} sm={12} lg={6}>
              <Card
                className="enhanced-card hover:scale-105 transition-all duration-300"
              >
                <div className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
                    }}
                  >
                    <FileDoneOutlined
                      style={{ color: "white", fontSize: "24px" }}
                    />
                  </div>
                  <Statistic
                    title={
                      <Text style={{ color: "#4b5563", fontWeight: "500" }}>
                        Average Score
                      </Text>
                    }
                    value={stats.averageScore || 0}
                    valueStyle={{
                      color: "#14b8a6",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                    suffix="%"
                  />
                </div>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {/* Main Content Area */}
      <Row gutter={[16, 16]}>
        {/* Recent Quizzes */}
        <Col xs={24} lg={16}>
          <Card className="enhanced-card">
            <div className="flex items-center justify-between mb-4">
              <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
                Recent Quizzes
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
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                    }}
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
                        View
                      </Button>,
                      <Button
                        key="edit"
                        type="link"
                        icon={<EditOutlined />}
                        style={{ color: "#3b82f6", borderRadius: "8px" }}
                        className="hover:text-blue-700 hover:bg-blue-100"
                        onClick={() =>
                          navigate(`/quizzes/list/${quiz._id}/update`)
                        }
                      >
                        Edit
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
                            Created:{" "}
                            {new Date(
                              quiz.createdAt || Date.now()
                            ).toLocaleDateString()}
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
                description="No quizzes created yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="enhanced-btn"
                  onClick={() => navigate("/quizzes/add")}
                >
                  Create Your First Quiz
                </Button>
              </Empty>
            )}
          </Card>
        </Col>

        {/* Quick Actions & Recent Students */}
        <Col xs={24} lg={8}>
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="enhanced-card">
              <Title
                level={4}
                style={{ marginBottom: "16px", color: "#1f2937" }}
              >
                Quick Actions
              </Title>
              <div className="space-y-3">
                <Button
                  block
                  icon={<PlusOutlined />}
                  className="enhanced-btn hover:shadow-lg"
                  onClick={() => navigate("/quizzes/add")}
                >
                  Create New Quiz
                </Button>
                <Button
                  block
                  icon={<EyeOutlined />}
                  className="hover:bg-teal-600 hover:text-white hover:border-teal-600"
                  style={{
                    border: "2px solid #14b8a6",
                    color: "#14b8a6",
                    borderRadius: "12px",
                    fontWeight: "600",
                  }}
                  onClick={() => navigate("/quizzes/list")}
                >
                  View All Quizzes
                </Button>
                <Button
                  block
                  icon={<TeamOutlined />}
                  className="hover:bg-teal-600 hover:text-white hover:border-teal-600"
                  style={{
                    border: "2px solid #14b8a6",
                    color: "#14b8a6",
                    borderRadius: "12px",
                    fontWeight: "600",
                  }}
                  onClick={() => navigate("/teacher/getstudents")}
                >
                  Manage Students
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
                  onClick={() => navigate("/teacher/courses")}
                >
                  Course Management
                </Button>
              </div>
            </Card>

            {/* Recent Students */}
            <Card className="enhanced-card">
              <div className="flex items-center justify-between mb-4">
                <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
                  Recent Students
                </Title>
                <Button
                  type="link"
                  style={{ color: "#14b8a6", fontWeight: "600" }}
                  className="hover:text-teal-700"
                  onClick={() => navigate("/teacher/getstudents")}
                >
                  View All
                </Button>
              </div>
              {recentStudents.length > 0 ? (
                <List
                  size="small"
                  dataSource={recentStudents}
                  renderItem={(student, index) => (
                    <List.Item
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                      }}
                      className="hover:bg-teal-50 transition-all duration-200"
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size="small"
                            style={{ background: "#14b8a6" }}
                            icon={<UserOutlined />}
                          />
                        }
                        title={
                          <Text
                            strong
                            style={{ fontSize: "14px", color: "#1f2937" }}
                          >
                            {student.name || `Student ${index + 1}`}
                          </Text>
                        }
                        description={
                          <div className="text-gray-500 text-xs">
                            <div>{student.email}</div>
                            <div>
                              Joined:{" "}
                              {new Date(
                                student.createdAt || Date.now()
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  description="No students enrolled yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  imageStyle={{ height: 60 }}
                />
              )}
            </Card>
          </div>
        </Col>
      </Row>

      {/* No Data State */}
      {!stats && recentQuizzes.length === 0 && recentStudents.length === 0 && (
        <Card className="enhanced-card text-center py-12">
          <Empty
            description="No data available yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <div className="space-y-3">
              <Text style={{ color: "#4b5563" }}>
                Start by creating your first quiz or enrolling students
              </Text>
              <div className="space-x-3">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="enhanced-btn hover:shadow-lg"
                  onClick={() => navigate("/quizzes/add")}
                >
                  Create Quiz
                </Button>
                <Button
                  icon={<TeamOutlined />}
                  className="hover:bg-teal-600 hover:text-white hover:border-teal-600"
                  style={{
                    border: "2px solid #14b8a6",
                    color: "#14b8a6",
                    borderRadius: "12px",
                    fontWeight: "600",
                  }}
                  onClick={() => navigate("/teacher/getstudents")}
                >
                  View Students
                </Button>
              </div>
            </div>
          </Empty>
        </Card>
      )}
    </div>
  );
};

export default TeacherDashboard;
