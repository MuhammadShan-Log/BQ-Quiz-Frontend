import { Form, Input, Button } from "antd";
// import { loginUser } from "../services/api";

export default function LoginPage() {
  const onFinish = async (values) => {
    try {
      const data = await loginUser(values.email, values.password);
      localStorage.setItem("token", data.token);
      console.log("Login success", data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="email" rules={[{ required: true }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Login
      </Button>
    </Form>
  );
}
