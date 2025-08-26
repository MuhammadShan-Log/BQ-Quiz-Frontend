import { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import api from "../utils/api";

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

  if (loading) return <Spin tip="Loading attempts..." />;

  const columns = [
    { title: "Quiz", dataIndex: ["quiz", "title"], key: "quiz" },
    { title: "Student", dataIndex: ["student", "name"], key: "student" },
    { title: "Email", dataIndex: ["student", "email"], key: "email" },
    { title: "Score", dataIndex: "score", key: "score" },
    { title: "Submitted", dataIndex: "submittedAt", key: "submittedAt", render: (v) => new Date(v).toLocaleString() },
  ];

  return <Table columns={columns} dataSource={attempts} rowKey={(r) => `${r.quiz}_${r.student}_${r.submittedAt}`} />;
};

export default TeacherAttempts;


