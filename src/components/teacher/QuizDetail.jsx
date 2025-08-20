import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { message, Button, Card, Spin, Space } from "antd";

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: recursively flatten nested arrays
  const flattenQuestions = (arr) => {
    return arr.reduce((acc, item) => {
      if (Array.isArray(item)) {
        acc.push(...flattenQuestions(item));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/quiz/${id}`);
        setQuiz(res.data);
      } catch (err) {
        message.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) return <Spin tip="Loading..." />;

  if (!quiz) return <p className="p-4">Quiz not found</p>;

  // Flatten all custom questions
  const allCustomQuestions = quiz.customQuestions.flatMap((q) => {
    let parsed;
    try {
      parsed = JSON.parse(q);
    } catch {
      parsed = [q];
    }
    return flattenQuestions(parsed);
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Regular questions */}
        {quiz.questions?.map((q, index) => (
          <Card
            key={q._id}
            className="mb-4"
            title={`Q${index + 1}: ${q.questionText}`}
          >
            <ul className="space-y-2">
              {Object.entries(q.options).map(([key, value]) => (
                <li
                  key={key}
                  className={`p-2 rounded-lg border ${
                    q.correctAnswer === key
                      ? "bg-green-100 border-green-500 font-bold"
                      : "bg-gray-50"
                  }`}
                >
                  {value}
                  {q.correctAnswer === key && (
                    <span className="ml-2 text-green-600">✔</span>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        ))}

        {/* Custom questions */}
        {allCustomQuestions.map((cq, index) => (
          <Card
            key={`custom-${index}`}
            className="mb-4"
            title={`Custom Q${quiz.questions.length + index + 1}`}
            variant="outlined"
          >
            <p>{cq}</p>
          </Card>
        ))}
      </Space>

      <div className="flex justify-end mt-4">
        <Button type="primary" onClick={() => navigate(`update`)}>
          Edit Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizDetail;
