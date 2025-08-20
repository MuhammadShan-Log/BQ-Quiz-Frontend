import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";

const UpdateProfileForm = ({ user }) => {
  const [form] = Form.useForm();

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
      const response = await fetch(
        `http://localhost:5000/auth/updateprofile/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ if you use JWT auth
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

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

// ✅ Example usage with user data from localStorage
const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")); // stored after login
  return <UpdateProfileForm user={user} />;
};

export default Profile;
