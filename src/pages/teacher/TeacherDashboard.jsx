import { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Table, Spin, Typography, message } from "antd";
import api from "../../utils/api";

const { Title } = Typography;

const TeacherDashboard = () => {
  const [stats, setStats] = useState({ quizCount: 0, questionCount: 0 });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const statsRes = await api.get("dashboard/teacher/overview");
        setStats(statsRes.data);

        const quizzesRes = await api.get("dashboard/teacher/recent-quizzes");
        setRecentQuizzes(quizzesRes.data);
      } catch (error) {
        console.error(error);
        message.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Questions",
      key: "questions",
      render: (_, quiz) =>
        (quiz.questions?.length || 0) + (quiz.customQuestions?.length || 0),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Teacher Dashboard</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic title="Total Quizzes" value={stats.quizCount} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Total Questions" value={stats.questionCount} />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Quizzes">
        <Table
          columns={columns}
          dataSource={recentQuizzes}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default TeacherDashboard;
