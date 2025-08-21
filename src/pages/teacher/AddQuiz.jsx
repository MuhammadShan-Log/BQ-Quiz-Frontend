import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../utils/api";
import { toast } from "react-toastify";

const AddQuiz = () => {
  const navigate = useNavigate();
  const [csvFile, setCsvFile] = useState(null);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (!csvFile) {
      message.error("CSV file is required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);

    if (values.customQuestions && values.customQuestions.length > 0) {
      formData.append(
        "customQuestions",
        JSON.stringify(values.customQuestions)
      );
    }

    formData.append("file", csvFile);

    try {
      const res = await api.post(`/quizzes/quiz`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res);
      toast.success("Quiz created successfully!");
      navigate(`/quizzes/list`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create quiz");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Quiz</h1>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Quiz Title */}
        <Form.Item
          label="Quiz Title"
          name="title"
          rules={[{ required: true, message: "Please enter quiz title" }]}
        >
          <Input size="large" />
        </Form.Item>

        {/* CSV Upload */}
        <Divider>Upload CSV Questions (required)</Divider>
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

        {/* Custom Questions */}
        <Divider>Custom Questions (optional)</Divider>
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

        {/* Submit */}
        <Form.Item className="mt-6">
          <Button type="primary" size="large" htmlType="submit">
            Create Quiz
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddQuiz;
