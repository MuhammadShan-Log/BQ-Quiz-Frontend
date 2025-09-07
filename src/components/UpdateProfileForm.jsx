import React, { useEffect } from "react";
import { Form, Input, Button, message, Card, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import api from "../utils/api";

const { Title, Text } = Typography;

const UpdateProfileForm = ({ user }) => {
  const [form] = Form.useForm();
  console.log(user);
  
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        phone: user.phone,
        email: user.email,
        password: "",
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    try {
      const { data } = await api.get(`/auth/updateprofile/${user.id}`);

      if (response.ok) {
        message.success("Profile updated successfully!");
        // ✅ update localStorage so UI is consistent
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        message.error(data.message || "Failed to update profile!");
      }
    } catch (error) {
      console.error("Update Error:", error);
      message.error("Something went wrong!");
    }
  };

  return (
    <div className="enhanced-content">
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <UserOutlined className="text-2xl text-white" />
            </div>
            <div>
              <Title level={2} className="text-white mb-0">
                Update Profile
              </Title>
              <Text className="text-green-100">
                Update your personal information
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Card className="enhanced-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-2xl mx-auto"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input className="enhanced-input" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter your phone" }]}
          >
            <Input className="enhanced-input" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input className="enhanced-input" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password className="enhanced-input" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="enhanced-btn" block>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateProfileForm