import { useEffect, useState } from "react";
import { Table, Button, Spin, Flex, message } from "antd";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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

  const columns = [
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
  ];

  if (loading) return <Spin tip="Loading..." />;

  return <Table columns={columns} dataSource={quizzes} rowKey="_id" />;
};

export default QuizList;
