import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Space,
  Card,
  Divider,
  Upload,
  message,
  Radio,
  Spin,
  Typography,
  Avatar,
  Row,
  Col,
} from "antd";
import { UploadOutlined, FileTextOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import api from "../../utils/api";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const UpdateQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [csvFile, setCsvFile] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/quiz/${id}`);
        form.setFieldsValue(data);
      } catch (err) {
        console.error(err);
        message.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, form]);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);

    if (values.customQuestions) {
      formData.append(
        "customQuestions",
        JSON.stringify(values.customQuestions)
      );
    }

    if (csvFile) {
      formData.append("file", csvFile);
    } else if (values.questions) {
      formData.append("questions", JSON.stringify(values.questions));
    }

    try {
      const res = await api.put(`/quizzes/quiz/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);

      toast.success("Quiz updated successfully!");
      navigate(`/quizzes/list/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quiz");
    }
  };

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

  return (
    <div className="enhanced-content space-y-6">
      {/* Header */}
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FileTextOutlined className="text-2xl text-white" />
              </div>
              <div>
                <Title level={2} className="text-white mb-0">
                  Update Quiz
                </Title>
                <Text className="text-green-100">
                  Modify your quiz questions and settings
                </Text>
              </div>
            </div>
            <Button
              icon={<ArrowLeftOutlined />}
              className="hover:border-primary-teal hover:text-primary-teal"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
        </div>
      </Card>

      <Card className="enhanced-card">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Quiz Title"
            name="title"
            rules={[{ required: true, message: "Please enter quiz title" }]}
          >
            <Input size="large" className="enhanced-input" />
          </Form.Item>

          {/* CSV Upload */}
          <Divider>Upload CSV Questions (optional)</Divider>
          <Upload
            beforeUpload={(file) => {
              setCsvFile(file);
              return false;
            }}
            accept=".csv"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} className="enhanced-btn">Select CSV File</Button>
          </Upload>
          {csvFile && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Text className="text-green-800">Selected file: {csvFile.name}</Text>
            </div>
          )}

          <Divider>Edit Questions</Divider>
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card
                    key={key}
                    title={
                      <div className="flex items-center space-x-2">
                        <Avatar size={24} style={{ background: "#14b8a6" }}>
                          {index + 1}
                        </Avatar>
                        <span>Question {index + 1}</span>
                      </div>
                    }
                    className="enhanced-card mb-4"
                    size="small"
                  >
                    <Form.Item
                      {...restField}
                      label="Question Text"
                      name={[name, "questionText"]}
                      rules={[{ required: true, message: "Enter question text" }]}
                    >
                      <Input className="enhanced-input" />
                    </Form.Item>

                    <Space direction="vertical" className="mb-2">
                      {["a", "b", "c", "d"].map((opt) => (
                        <Form.Item
                          key={opt}
                          label={`Option ${opt.toUpperCase()}`}
                          name={[name, "options", opt]}
                          rules={[
                            { required: true, message: "Enter option text" },
                          ]}
                        >
                          <Input className="enhanced-input" />
                        </Form.Item>
                      ))}
                    </Space>

                    <Form.Item
                      label="Correct Answer"
                      name={[name, "correctAnswer"]}
                      rules={[
                        { required: true, message: "Select correct answer" },
                      ]}
                    >
                      <Radio.Group>
                        {["a", "b", "c", "d"].map((opt) => (
                          <Radio key={opt} value={opt}>
                            {opt.toUpperCase()}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>

                    <Button 
                      type="dashed" 
                      danger 
                      onClick={() => remove(name)}
                      className="hover:border-red-500 hover:text-red-500"
                    >
                      Remove Question
                    </Button>
                  </Card>
              ))}
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  className="mb-4 hover:border-primary-teal hover:text-primary-teal"
                >
                  Add Question
                </Button>
              </>
            )}
          </Form.List>

          <Divider>Custom Questions</Divider>
          <Form.List name="customQuestions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline" className="mb-2">
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[
                        { required: true, message: "Enter custom question" },
                      ]}
                    >
                      <Input placeholder="Custom question" className="enhanced-input" />
                    </Form.Item>
                    <Button 
                      type="link" 
                      danger 
                      onClick={() => remove(name)}
                      className="hover:text-red-500"
                    >
                      Remove
                    </Button>
                  </Space>
                ))}
                <Button 
                  type="dashed" 
                  onClick={() => add()}
                  className="hover:border-primary-teal hover:text-primary-teal"
                >
                  Add Custom Question
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item className="mt-6">
            <Button 
              type="primary" 
              size="large" 
              htmlType="submit"
              className="enhanced-btn"
              icon={<SaveOutlined />}
            >
              Update Quiz
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateQuiz;
