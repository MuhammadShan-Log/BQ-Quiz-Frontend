import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Radio, Space, Button, message, Steps } from "antd";
import api from "../../utils/api";

const StartQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/quiz/${id}/start`);
        setQuiz(data);
      } catch (err) {
        console.error(err);
        message.error("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionChange = (qId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    if (Object.keys(answers).length !== quiz.questions.length) {
      message.warning("Please answer all questions before submitting.");
      return;
    }

  
    setSubmitting(true);
    try {
      const { data } = await api.post(`/quizzes/quiz/submit`, {
        quizId: id,
        answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })),
      });

      setResult(data);
      message.success("Quiz submitted!");
    } catch (err) {
      console.error(err);
      message.error("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  if (loading) return <Spin tip="Loading..." />;
  if (!quiz) return <p>Quiz not found</p>;

  const steps = quiz.questions.map((q, index) => ({
    title: `Q${index + 1}`,
    status: answers[q._id] ? "finish" : "wait",
    content: (
      <Card
        key={q._id}
        type="inner"
        title={`Q${index + 1}: ${q.questionText}`}
        className="mb-2"
      >
        <Radio.Group
          onChange={(e) => handleOptionChange(q._id, e.target.value)}
          value={answers[q._id] || null}
        >
          <Space direction="vertical">
            {Object.entries(q.options).map(([key, value]) => (
              <Radio key={key} value={key}>
                {value}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Card>
    ),
  }));

  return (
    <div className="space-y-4">
      <Card title={quiz.title}>
        <Steps current={current} size="small">
          {steps.map((item, i) => (
            <Steps.Step
              key={i}
              title={item.title}
              status={item.status}
            />
          ))}
        </Steps>

        <div className="my-6">{steps[current].content}</div>

        <div className="flex justify-between mt-4">
          {current > 0 && (
            <Button onClick={prev} disabled={result !== null}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next} disabled={result !== null}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={submitting}
              disabled={result !== null}
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </Card>

      {/* {result && (
        <Card title="Results" className="mt-4">
          <p>
            <strong>Score:</strong> {result.score} / {quiz.questions.length}
          </p>
          <ul className="list-disc ml-5">
            {result.details?.map((item, i) => (
              <li key={i}>
                Q{i + 1}:{" "}
                {item.correct
                  ? "✅ Correct"
                  : `❌ Wrong (Correct Answer: ${item.correctAnswer})`}
              </li>
            ))}
          </ul>
        </Card>
      )} */}
    </div>
  );
};

export default StartQuiz;
