import { useEffect, useState } from "react";
import { 
  Table, 
  Button, 
  Spin, 
  Flex, 
  message, 
  Card, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Typography, 
  Avatar, 
  Tooltip,
  Popconfirm,
  Badge,
  Row,
  Col,
  Statistic
} from "antd";
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CopyOutlined, 
  PlayCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  FilterOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/quizzes/quiz");
      setQuizzes(data);
      setFilteredQuizzes(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) {
      setRole(user.role);
    }
  }, []);

  // Filter quizzes based on search and status
  useEffect(() => {
    let filtered = quizzes;
    
    if (searchText) {
      filtered = filtered.filter(quiz => 
        quiz.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(quiz => quiz.status === statusFilter);
    }
    
    setFilteredQuizzes(filtered);
  }, [searchText, statusFilter, quizzes]);

  const copyQuiz = async (id) => {
    try {
      const quizLink = `${window.location.origin}/quizzes/quiz/${id}/start`;
      await navigator.clipboard.writeText(quizLink);
      toast.success("Quiz link copied to clipboard!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy quiz link");
    }
  };

  const handleQuizDelete = async (id) => {
    try {
      await api.delete(`/quizzes/quiz/${id}`);
      toast.success("Quiz deleted successfully!");
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete quiz!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'default';
      case 'archived': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'draft': return 'Draft';
      case 'archived': return 'Archived';
      default: return 'Unknown';
    }
  };

  const columns = role === 'student' ? [
    {
      title: "Quiz",
      key: "quiz",
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            size={40}
            icon={<FileTextOutlined />}
            style={{ backgroundColor: '#52c41a' }}
            className="mr-3"
          />
          <div>
            <Text strong className="text-base">{record.title}</Text>
            <div className="text-gray-500 text-sm">
              {record.questions?.length || 0} questions
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={getStatusColor(record.status || 'active')}>
          {getStatusText(record.status || 'active')}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<PlayCircleOutlined />}
          className="enhanced-btn"
          onClick={() => navigate(`/quizzes/quiz/${record._id}/start`)}
        >
          Start Quiz
        </Button>
      ),
    },
  ] : [
    {
      title: "Quiz",
      key: "quiz",
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            size={40}
            icon={<FileTextOutlined />}
            style={{ backgroundColor: '#52c41a' }}
            className="mr-3"
          />
          <div>
            <Text strong className="text-base">{record.title}</Text>
            <div className="text-gray-500 text-sm">
              {record.questions?.length || 0} questions • Created {new Date(record.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={getStatusColor(record.status || 'active')}>
          {getStatusText(record.status || 'active')}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Quiz">
            <Button 
              type="primary" 
              icon={<EyeOutlined />}
              size="small"
              onClick={() => navigate(`/quizzes/list/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit Quiz">
            <Button 
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/quizzes/list/${record._id}/update`)}
            />
          </Tooltip>
          <Tooltip title="Copy Quiz Link">
            <Button 
              icon={<CopyOutlined />}
              size="small"
              onClick={() => copyQuiz(record._id)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Quiz"
            description="Are you sure you want to delete this quiz? This action cannot be undone."
            onConfirm={() => handleQuizDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Tooltip title="Delete Quiz">
              <Button 
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">Loading quizzes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-content space-y-6">
      {/* Header Section */}
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FileTextOutlined className="text-2xl text-white" />
              </div>
              <div>
                <Title level={2} className="text-white mb-0">
                  {role === 'student' ? 'Available Quizzes' : 'Quiz Management'}
                </Title>
                <Text className="text-green-100">
                  {role === 'student' 
                    ? 'Browse and take available quizzes' 
                    : 'Create, manage, and monitor your quizzes'
                  }
                </Text>
              </div>
            </div>
            {role !== 'student' && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                size="large"
                className="enhanced-btn"
                onClick={() => navigate("/quizzes/add")}
              >
                Create New Quiz
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      {role !== 'student' && (
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card className="enhanced-card hover:scale-105 transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)" }}>
                <FileTextOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Total Quizzes</Text>}
                value={quizzes.length}
                valueStyle={{ color: "#14b8a6", fontSize: "28px", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="enhanced-card hover:scale-105 transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                <FileTextOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Active Quizzes</Text>}
                value={quizzes.filter(q => q.status === 'active').length}
                valueStyle={{ color: "#10b981", fontSize: "28px", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="enhanced-card hover:scale-105 transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                <FileTextOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Draft Quizzes</Text>}
                value={quizzes.filter(q => q.status === 'draft').length}
                valueStyle={{ color: "#f59e0b", fontSize: "28px", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="enhanced-card hover:scale-105 transition-all duration-300 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}>
                <FileTextOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Total Questions</Text>}
                value={quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0)}
                valueStyle={{ color: "#8b5cf6", fontSize: "28px", fontWeight: "bold" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Search and Filters */}
      <Card className="enhanced-card">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <Search
              placeholder="Search quizzes..."
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-md"
            />
            {role !== 'student' && (
              <Select
                placeholder="Filter by status"
                value={statusFilter}
                onChange={setStatusFilter}
                size="large"
                className="min-w-32"
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="draft">Draft</Option>
                <Option value="archived">Archived</Option>
              </Select>
            )}
          </div>
          <Button 
            icon={<ReloadOutlined />}
            onClick={fetchQuizzes}
            className="hover:border-primary-teal hover:text-primary-teal"
            style={{
              border: "2px solid #14b8a6",
              color: "#14b8a6",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            Refresh
          </Button>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <Text className="text-gray-600">
            Showing {filteredQuizzes.length} of {quizzes.length} quizzes
          </Text>
        </div>

        {/* Enhanced Table */}
        <Table 
          columns={columns} 
          dataSource={filteredQuizzes} 
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} quizzes`,
          }}
          className="enhanced-table"
          rowClassName="hover:bg-gray-50 transition-colors duration-200"
        />
      </Card>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && !loading && (
        <Card className="enhanced-card text-center py-12">
          <div className="text-gray-500">
            <FileTextOutlined className="text-6xl mb-4 block" />
            <Title level={4} className="text-gray-600 mb-2">
              {searchText || statusFilter !== 'all' 
                ? 'No quizzes found' 
                : 'No quizzes available'
              }
            </Title>
            <Text className="text-gray-500">
              {searchText || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : role === 'student' 
                  ? 'Check back later for new quizzes' 
                  : 'Create your first quiz to get started'
              }
            </Text>
            {role !== 'student' && (
              <div className="mt-4">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  className="enhanced-btn"
                  onClick={() => navigate("/quizzes/add")}
                >
                  Create Your First Quiz
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuizList;
