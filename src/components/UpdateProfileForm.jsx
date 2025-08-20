import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../utils/api";

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
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter your name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: "Please enter your phone" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProfileForm