import { useEffect, useState } from "react";
import { Table, Button, Spin, Flex, message } from "antd";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  // Added State Role
  const [role, setRole] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const { data } = await api.get("/quizzes/quiz");
      setQuizzes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    // Added fetch role from localstorage so we can conditonally render student and teacher 
    const user = JSON.parse(localStorage.getItem("user"))
    if (user?.role) {
      setRole(user.role)
    }
  }, []);

  const copyQuiz = async (id) => {
    console.log(window.location.origin);

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
    } finally {
      setLoading(false);
    }
  };

  const columns =
    role === 'student'
      ? [
        { title: "Title", dataIndex: "title", key: "title" },
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <Link to={`/quizzes/quiz/${record._id}/start`}>
              <Button type="primary">Start Quiz</Button>
            </Link>
          ),
        },
      ]
      :[
      { title: "Title", dataIndex: "title", key: "title" },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Flex gap="middle" wrap>
            <Link to={`/quizzes/list/${record._id}`}>
              <Button type="primary">View</Button>
            </Link>
            <Button
              color="danger"
              variant="solid"
              onClick={() => handleQuizDelete(record._id)}
            >
              Delete
            </Button>
          </Flex>
        ),
      },
      {
        title: "Get Link",
        key: "getlink",
        render: (_, record) => (
          <Button
            color="green"
            variant="solid"
            onClick={() => copyQuiz(record._id)}
          >
            Copy
          </Button>
        ),
      },
  ];

  if (loading) return <Spin tip="Loading..." />;

  return <Table columns={columns} dataSource={quizzes} rowKey="_id" />;
};

export default QuizList;
