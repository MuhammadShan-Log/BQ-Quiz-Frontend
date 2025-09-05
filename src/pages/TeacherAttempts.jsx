import { useEffect, useState } from "react";
import { Table, Spin, message, Card, Typography, Row, Col, Statistic, Avatar, Tag } from "antd";
import { FileTextOutlined, UserOutlined, TrophyOutlined, CalendarOutlined } from "@ant-design/icons";
import api from "../utils/api";

const { Title, Text } = Typography;

const TeacherAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const { data } = await api.get("/quizzes/quiz/attempts");
        setAttempts(data?.attempts || data?.data || []);
      } catch (err) {
        message.error("Failed to load attempts");
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading attempts...</p>
        </div>
      </div>
    );
  }

  const columns = [
    {
      title: "Quiz",
      key: "quiz",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            icon={<FileTextOutlined />}
            style={{ background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)" }}
          />
          <div>
            <div className="font-semibold text-gray-800">{record.quizId?.title || "Unknown Quiz"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
          >
            {record.studentId?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-800">{record.studentId?.name || "Unknown Student"}</div>
            <div className="text-sm text-gray-500">{record.studentId?.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Score",
      key: "score",
      render: (_, record) => (
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-600">{record.score || 0}</div>
          <Tag color="green" icon={<TrophyOutlined />}>
            {record.score > 0 ? "Passed" : "Failed"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Submitted",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (date) => (
        <div className="flex items-center space-x-2">
          <CalendarOutlined className="text-gray-400" />
          <span className="text-sm">
            {date ? new Date(date).toLocaleString() : "Not available"}
          </span>
        </div>
      ),
    },
  ];

  const totalAttempts = attempts.length;
  const averageScore = attempts.length > 0 
    ? (attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / attempts.length).toFixed(1)
    : 0;

  return (
    <div className="enhanced-content space-y-6">
      {/* Header */}
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FileTextOutlined className="text-2xl text-white" />
            </div>
            <div>
              <Title level={2} className="text-white mb-0">
                Quiz Attempts
              </Title>
              <Text className="text-green-100">
                View and analyze student quiz attempts
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)" }}>
                <FileTextOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Total Attempts</Text>}
                value={totalAttempts}
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
                <TrophyOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Average Score</Text>}
                value={averageScore}
                valueStyle={{ color: "#10b981", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Attempts Table */}
      <Card className="enhanced-card">
        <div className="flex items-center justify-between mb-4">
          <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
            Student Attempts
          </Title>
        </div>
        <Table
          columns={columns}
          dataSource={attempts}
          loading={loading}
          rowKey={(r) => `${r.quiz}_${r.student}_${r.submittedAt}`}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} attempts`,
          }}
          className="enhanced-table"
        />
      </Card>
    </div>
  );
};

export default TeacherAttempts;


