import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import {
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

const cardStyle = {
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const Dashboard = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card style={cardStyle} bordered={true}>
          <Statistic
            title="Courses"
            value={24}
            prefix={<BookOutlined style={{ color: "#1890ff", fontSize: 22 }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card style={cardStyle} bordered={true}>
          <Statistic
            title="Teachers"
            value={12}
            prefix={<TeamOutlined style={{ color: "#52c41a", fontSize: 22 }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card style={cardStyle} bordered={true}>
          <Statistic
            title="Students"
            value={320}
            prefix={<UserOutlined style={{ color: "#faad14", fontSize: 22 }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card style={cardStyle} bordered={true}>
          <Statistic
            title="Quizzes"
            value={18}
            prefix={<FileDoneOutlined style={{ color: "#eb2f96", fontSize: 22 }} />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
