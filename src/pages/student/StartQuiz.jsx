import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, Radio, Space, Button, message, Steps, Modal, Typography, Progress, Result } from "antd";
import { PlayCircleOutlined, CheckCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import api from "../../utils/api";

const { Title, Text } = Typography;

const StartQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [current, setCurrent] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

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
      setSuccessModalOpen(true);
    } catch (err) {
      console.error(err);
      message.error("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }
  
  if (!quiz) {
    return (
      <div className="enhanced-content">
        <Card className="enhanced-card text-center py-16">
          <Result
            status="404"
            title="Quiz Not Found"
            subTitle="The quiz you're looking for doesn't exist or has been removed."
            extra={
              <Button type="primary" className="enhanced-btn" onClick={() => navigate("/quizzes/list")}>
                Back to Quizzes
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const steps = quiz.questions.map((q, index) => ({
    title: `Q${index + 1}`,
    status: answers[q._id] ? "finish" : "wait",
    content: (
      <Card
        key={q._id}
        className="enhanced-card mb-4"
        title={
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-semibold">{index + 1}</span>
            </div>
            <span className="text-lg font-medium">{q.questionText}</span>
          </div>
        }
      >
        <Radio.Group
          onChange={(e) => handleOptionChange(q._id, e.target.value)}
          value={answers[q._id] || null}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            {Object.entries(q.options).map(([key, value]) => (
              <Radio key={key} value={key} className="w-full p-3 hover:bg-teal-50 rounded-lg transition-colors">
                <span className="font-medium">{key.toUpperCase()}:</span> {value}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Card>
    ),
  }));

  const progress = ((Object.keys(answers).length / quiz.questions.length) * 100).toFixed(0);

  return (
    <div className="enhanced-content space-y-6">
      {/* Header */}
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <PlayCircleOutlined className="text-2xl text-white" />
              </div>
              <div>
                <Title level={2} className="text-white mb-0">{quiz.title}</Title>
                <Text className="text-green-100">
                  {quiz.questions.length} questions • Take your time to answer carefully
                </Text>
              </div>
            </div>
            <Button
              icon={<ArrowLeftOutlined />}
              className="hover:border-primary-teal hover:text-primary-teal"
              onClick={() => navigate("/quizzes/list")}
            >
              Back to Quizzes
            </Button>
          </div>
        </div>
      </Card>

      {/* Progress */}
      <Card className="enhanced-card">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Text strong>Progress</Text>
            <Text>{Object.keys(answers).length} / {quiz.questions.length} answered</Text>
          </div>
          <Progress 
            percent={parseInt(progress)} 
            strokeColor={{
              '0%': '#14b8a6',
              '100%': '#059669',
            }}
            className="mb-4"
          />
        </div>

        <Steps current={current} size="small" className="mb-6">
          {steps.map((item, i) => (
            <Steps.Step
              key={i}
              title={item.title}
              status={item.status}
            />
          ))}
        </Steps>

        <div className="my-6">{steps[current].content}</div>

        <div className="flex justify-between mt-6">
          {current > 0 && (
            <Button 
              onClick={prev} 
              disabled={result !== null}
              icon={<ArrowLeftOutlined />}
              className="hover:border-primary-teal hover:text-primary-teal"
            >
              Previous
            </Button>
          )}
          <div className="flex space-x-3">
            {current < steps.length - 1 && (
              <Button 
                type="primary" 
                onClick={next} 
                disabled={result !== null}
                className="enhanced-btn"
                icon={<ArrowRightOutlined />}
              >
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitting}
                disabled={result !== null}
                className="enhanced-btn"
                icon={<CheckCircleOutlined />}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Modal
        open={successModalOpen}
        onOk={() => navigate("/student/dashboard")}
        onCancel={() => navigate("/student/dashboard")}
        okText="Go to Dashboard"
        cancelText="Close"
        title="Quiz Submitted Successfully!"
        className="enhanced-modal"
        width={500}
        centered
      >
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircleOutlined className="text-4xl text-white" />
          </div>
          <Title level={3} className="text-gray-800 mb-3">
            🎉 Congratulations!
          </Title>
          <Text className="text-gray-600 mb-6 block text-lg">
            Your quiz has been submitted successfully.
          </Text>
          {result && (
            <div className="bg-gradient-to-r from-teal-50 to-green-50 border border-teal-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
                <Text className="text-teal-800 font-bold text-lg">Your Results</Text>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {result.score} / {quiz.questions.length}
                </div>
                <div className="text-lg text-teal-700 font-semibold">
                  {Math.round((result.score / quiz.questions.length) * 100)}% Score
                </div>
                <div className="mt-3">
                  {Math.round((result.score / quiz.questions.length) * 100) >= 80 ? (
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                      🏆 Excellent Work!
                    </span>
                  ) : Math.round((result.score / quiz.questions.length) * 100) >= 60 ? (
                    <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                      👍 Good Job!
                    </span>
                  ) : (
                    <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full font-semibold">
                      📚 Keep Learning!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <Text className="text-gray-500 text-sm">
            You can view your results anytime in your dashboard.
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default StartQuiz;
