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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../utils/api";
import { toast } from "react-toastify";

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

  if (loading) return <Spin tip="Loading quiz..." />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Quiz</h1>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Quiz Title"
          name="title"
          rules={[{ required: true, message: "Please enter quiz title" }]}
        >
          <Input size="large" />
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
          <Button icon={<UploadOutlined />}>Select CSV File</Button>
        </Upload>
        {csvFile && <p className="mt-2">Selected file: {csvFile.name}</p>}

        <Divider>Edit Questions</Divider>
        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Card
                  key={key}
                  title={`Q${index + 1}`}
                  className="mb-4"
                  size="small"
                  style={{ padding: "16px" }}
                >
                  <Form.Item
                    {...restField}
                    label="Question Text"
                    name={[name, "questionText"]}
                    rules={[{ required: true, message: "Enter question text" }]}
                  >
                    <Input />
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
                        <Input />
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

                  <Button type="dashed" danger onClick={() => remove(name)}>
                    Remove Question
                  </Button>
                </Card>
              ))}
              <Button type="dashed" onClick={() => add()} className="mb-4">
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
                    <Input placeholder="Custom question" />
                  </Form.Item>
                  <Button type="link" danger onClick={() => remove(name)}>
                    Remove
                  </Button>
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()}>
                Add Custom Question
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item className="mt-6">
          <Button type="primary" size="large" htmlType="submit">
            Update Quiz
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateQuiz;
