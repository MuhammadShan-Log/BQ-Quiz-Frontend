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
  Typography,
  Avatar,
  Row,
  Col,
} from "antd";
import { UploadOutlined, FileTextOutlined, ArrowLeftOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import api from "../../utils/api";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

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
    <div className="enhanced-content space-y-8">
      {/* Header */}
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
                <FileTextOutlined className="text-3xl text-white" />
              </div>
              <div>
                <Title level={1} className="text-white mb-2 font-bold">
                  Create New Quiz
                </Title>
                <Text className="text-green-100 text-lg">
                  Upload CSV questions and add custom questions to create your quiz
                </Text>
                <div className="mt-2 flex items-center space-x-4 text-green-200">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <Text className="text-sm">CSV Upload</Text>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <Text className="text-sm">Custom Questions</Text>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <Text className="text-sm">Preview & Create</Text>
                  </div>
                </div>
              </div>
            </div>
            <Button
              icon={<ArrowLeftOutlined />}
              size="large"
              className="hover:border-primary-teal hover:text-primary-teal border-2 border-white text-white bg-white/10 hover:bg-white hover:text-teal-600 font-semibold transition-all duration-300"
              onClick={() => navigate("/quizzes/list")}
            >
              Back to Quizzes
            </Button>
          </div>
        </div>
      </Card>

      {/* Quiz Title Section */}
      <Card className="enhanced-card">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm">1</span>
            </div>
            <Title level={3} className="mb-0 text-gray-800">Quiz Information</Title>
          </div>
        </div>
        
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="text-gray-700 font-semibold text-lg">Quiz Title</span>}
            name="title"
            rules={[{ required: true, message: "Please enter quiz title" }]}
          >
            <Input 
              size="large" 
              className="enhanced-input text-lg" 
              placeholder="Enter a descriptive title for your quiz"
              style={{ padding: '12px 16px' }}
            />
          </Form.Item>
        </Form>
      </Card>

      {/* CSV Upload Section */}
      <Card className="enhanced-card">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm">2</span>
            </div>
            <Title level={3} className="mb-0 text-gray-800">Upload CSV Questions</Title>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <Text className="text-blue-800 font-medium block mb-1">CSV Format Requirements</Text>
                <Text className="text-blue-700 text-sm">
                  Your CSV should have columns: question, option_a, option_b, option_c, option_d, correct_answer
                </Text>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Upload
            beforeUpload={(file) => {
              setCsvFile(file);
              return false;
            }}
            accept=".csv"
            maxCount={1}
            showUploadList={false}
          >
            <div className="border-2 border-dashed border-teal-300 rounded-lg p-8 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 cursor-pointer">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <UploadOutlined className="text-2xl text-teal-600" />
                </div>
                <div>
                  <Title level={4} className="text-gray-700 mb-2">Click to Upload CSV File</Title>
                  <Text className="text-gray-500">or drag and drop your CSV file here</Text>
                </div>
                <Button 
                  icon={<UploadOutlined />} 
                  className="enhanced-btn"
                  size="large"
                >
                  Choose File
                </Button>
              </div>
            </div>
          </Upload>
          
          {csvFile && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FileTextOutlined className="text-green-600 text-lg" />
                </div>
                <div className="text-center">
                  <Text className="text-green-800 font-semibold text-lg block">File Selected Successfully!</Text>
                  <Text className="text-green-600">{csvFile.name}</Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Custom Questions Section */}
      <Card className="enhanced-card">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm">3</span>
            </div>
            <Title level={3} className="mb-0 text-gray-800">Custom Questions (Optional)</Title>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <Text className="text-amber-800 font-medium block mb-1">Optional Additional Questions</Text>
                <Text className="text-amber-700 text-sm">
                  Add extra questions that aren't in your CSV file. These will be included in your quiz.
                </Text>
              </div>
            </div>
          </div>
        </div>
        
        <Form.List name="customQuestions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} className="enhanced-card mb-6 border-2 border-teal-100 hover:border-teal-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">{name + 1}</span>
                      </div>
                      <Title level={4} className="mb-0 text-gray-700">Custom Question {name + 1}</Title>
                    </div>
                    <Button 
                      type="text" 
                      danger 
                      onClick={() => remove(name)}
                      className="hover:bg-red-50 hover:text-red-600 px-3 py-1 rounded-lg transition-all duration-200"
                      icon={<span className="text-lg">×</span>}
                    >
                      Remove
                    </Button>
                  </div>
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[
                      { required: true, message: "Enter custom question" },
                    ]}
                  >
                    <Input.TextArea 
                      placeholder="Enter your custom question here..." 
                      className="enhanced-input"
                      rows={3}
                      style={{ fontSize: '16px' }}
                    />
                  </Form.Item>
                </Card>
              ))}
              
              <div className="text-center">
                <Button 
                  type="dashed" 
                  onClick={() => add()}
                  className="w-full h-16 border-2 border-dashed border-teal-300 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 text-teal-600 font-semibold"
                  icon={<PlusOutlined className="text-xl" />}
                >
                  <span className="text-lg">Add Custom Question</span>
                </Button>
              </div>
            </>
          )}
        </Form.List>
      </Card>

      {/* Submit Section */}
      <Card className="enhanced-card">
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <SaveOutlined className="text-2xl text-white" />
            </div>
            <Title level={3} className="text-gray-800 mb-2">Ready to Create Your Quiz?</Title>
            <Text className="text-gray-600 text-lg">
              Review your quiz title and questions, then click create to generate your quiz.
            </Text>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              size="large"
              className="hover:border-primary-teal hover:text-primary-teal px-8 py-3 h-auto"
              onClick={() => navigate("/quizzes/list")}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              size="large" 
              htmlType="submit"
              className="enhanced-btn px-12 py-3 h-auto text-lg font-semibold"
              icon={<SaveOutlined />}
            >
              Create Quiz
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddQuiz;
  