import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Radio, Space } from "antd";
import api from "../utils/api";

const Quiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/quiz/${id}`);
        setQuiz(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) return <Spin tip="Loading..." />;
  if (!quiz) return <p>Quiz not found</p>;

  return (
    <div className="space-y-4">
      <Card title={quiz.title}>
        {quiz.questions.map((q, index) => (
          <Card
            key={q._id}
            type="inner"
            title={`Q${index + 1}: ${q.questionText}`}
            className="mb-2"
          >
            <Radio.Group>
              <Space direction="vertical">
                {Object.entries(q.options).map(([key, value]) => (
                  <Radio key={key} value={key}>
                    {value}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Card>
        ))}
      </Card>
    </div>
  );
};

export default Quiz;
