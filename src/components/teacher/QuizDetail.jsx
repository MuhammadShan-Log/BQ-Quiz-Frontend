import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { 
  message, 
  Button, 
  Card, 
  Spin, 
  Space, 
  Typography, 
  Tag, 
  Avatar, 
  Row, 
  Col, 
  Statistic,
  Divider,
  Badge,
  Tooltip
} from "antd";
import { 
  EditOutlined, 
  EyeOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

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
        setLoading(true);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">Loading quiz details...</div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <QuestionCircleOutlined className="text-6xl text-gray-400 mb-4" />
        <Title level={3} className="text-gray-600">Quiz not found</Title>
        <Text className="text-gray-500">The quiz you're looking for doesn't exist or has been removed.</Text>
      </div>
    );
  }

  // Flatten all custom questions
  const allCustomQuestions = quiz.customQuestions?.flatMap((q) => {
    let parsed;
    try {
      parsed = JSON.parse(q);
    } catch {
      parsed = [q];
    }
    return flattenQuestions(parsed);
  }) || [];

  const totalQuestions = (quiz.questions?.length || 0) + allCustomQuestions.length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                icon={<ArrowLeftOutlined />}
                type="text"
                className="text-white mr-4"
                onClick={() => navigate(-1)}
              />
              <div>
                <Title level={2} className="text-white mb-2">
                  {quiz.title}
                </Title>
                <div className="flex items-center space-x-4 text-green-100">
                  <span className="flex items-center">
                    <FileTextOutlined className="mr-2" />
                    {totalQuestions} questions
                  </span>
                  <span className="flex items-center">
                    <ClockCircleOutlined className="mr-2" />
                    Created {new Date(quiz.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <Tag color="green" className="ml-2">Active</Tag>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                size="large"
                className="enhanced-btn"
                onClick={() => navigate(`update`)}
              >
                Edit Quiz
              </Button>
              <Button 
                icon={<EyeOutlined />}
                size="large"
                className="border-white text-white hover:bg-white hover:text-green-600"
                onClick={() => navigate(`/quizzes/list/${id}/update`)}
              >
                View Attempts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="enhanced-card text-center">
            <Statistic
              title="Total Questions"
              value={totalQuestions}
              prefix={<QuestionCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="enhanced-card text-center">
            <Statistic
              title="Regular Questions"
              value={quiz.questions?.length || 0}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="enhanced-card text-center">
            <Statistic
              title="Custom Questions"
              value={allCustomQuestions.length}
              prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="enhanced-card text-center">
            <Statistic
              title="Quiz Status"
              value="Active"
              prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Questions Section */}
      <Card className="enhanced-card">
        <div className="flex items-center justify-between mb-6">
          <Title level={3} className="mb-0">Quiz Questions</Title>
          <Badge 
            count={totalQuestions} 
            showZero 
            style={{ backgroundColor: '#52c41a' }}
          />
        </div>

        <div className="space-y-6">
          {/* Regular Questions */}
          {quiz.questions?.map((question, index) => (
            <Card 
              key={question._id || index}
              className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow duration-200"
              size="small"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <Avatar 
                      size={32}
                      style={{ backgroundColor: '#1890ff' }}
                      className="mr-3"
                    >
                      {index + 1}
                    </Avatar>
                    <Title level={4} className="mb-0">
                      {question.questionText}
                    </Title>
                  </div>
                  
                  <div className="ml-12 space-y-2">
                    {Object.entries(question.options || {}).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          question.correctAnswer === key
                            ? "bg-green-50 border-green-500 text-green-800"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {key.toUpperCase()}. {value}
                          </span>
                          {question.correctAnswer === key && (
                            <CheckCircleOutlined className="text-green-600 text-lg" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="ml-4">
                  <Tag color="blue" className="text-xs">
                    Regular Question
                  </Tag>
                </div>
              </div>
            </Card>
          ))}

          {/* Custom Questions */}
          {allCustomQuestions.map((customQuestion, index) => (
            <Card 
              key={`custom-${index}`}
              className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow duration-200"
              size="small"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <Avatar 
                      size={32}
                      style={{ backgroundColor: '#faad14' }}
                      className="mr-3"
                    >
                      {(quiz.questions?.length || 0) + index + 1}
                    </Avatar>
                    <Title level={4} className="mb-0">
                      Custom Question
                    </Title>
                  </div>
                  
                  <div className="ml-12">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <Text className="text-orange-800">{customQuestion}</Text>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <Tag color="orange" className="text-xs">
                    Custom Question
                  </Tag>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Questions State */}
        {totalQuestions === 0 && (
          <div className="text-center py-12">
            <QuestionCircleOutlined className="text-6xl text-gray-400 mb-4" />
            <Title level={4} className="text-gray-600 mb-2">No Questions Added</Title>
            <Text className="text-gray-500">
              This quiz doesn't have any questions yet. Add some questions to make it functional.
            </Text>
            <div className="mt-4">
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                className="enhanced-btn"
                onClick={() => navigate(`update`)}
              >
                Add Questions
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Quiz Actions */}
      <Card className="enhanced-card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <Text className="text-gray-600">
              Ready to make changes to this quiz?
            </Text>
          </div>
          <div className="flex space-x-3">
            <Button 
              icon={<EditOutlined />}
              size="large"
              className="enhanced-btn"
              onClick={() => navigate(`update`)}
            >
              Edit Quiz
            </Button>
            <Button 
              icon={<EyeOutlined />}
              size="large"
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => navigate(`/quizzes/list/${id}/update`)}
            >
              View Attempts
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuizDetail;
