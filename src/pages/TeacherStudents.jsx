// pages/dashboard/TeacherStudents.jsx
import React, { useEffect, useState } from "react";
import { Card, Table, Tag, message, Typography, Row, Col, Statistic, Button, Space, Avatar } from "antd";
import { UserOutlined, BookOutlined, TeamOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import api from "../utils/api";

const { Title, Text } = Typography;

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeacherStudents();
  }, []);

  const fetchTeacherStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/course/teacher/getstudents");
      console.log(res.data);
      
      setStudents(res.data.data || []);
    } catch (error) {
      console.error("fetchTeacherStudents error:", error);
      message.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)" }}
          >
            {record.student?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-800">{record.student?.name}</div>
            <div className="text-sm text-gray-500">{record.student?.email}</div>
            <div className="text-sm text-gray-500">{record.student?.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Course",
      key: "course",
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <BookOutlined className="text-teal-600" />
          <div>
            <div className="font-medium">{record.course?.courseName}</div>
            <div className="text-sm text-gray-500">Code: {record.course?.courseCode}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Campus",
      dataIndex: ["campus", "name"],
      key: "campus",
      render: (campus) => campus ? <Tag color="blue">{campus}</Tag> : <Tag color="default">Not specified</Tag>,
    },
    {
      title: "Enrollment Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div className="flex items-center space-x-2">
          <CalendarOutlined className="text-gray-400" />
          <span className="text-sm">
            {date ? new Date(date).toLocaleDateString() : "Not available"}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="green" icon={<UserOutlined />}>Enrolled</Tag>,
    },
  ];

  const totalStudents = students.length;

  return (
    <div className="enhanced-content space-y-6">
      {/* Header */}
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <TeamOutlined className="text-2xl text-white" />
              </div>
              <div>
                <Title level={2} className="text-white mb-0">
                  My Students
                </Title>
                <Text className="text-green-100">
                  View and manage your enrolled students
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)" }}>
                <TeamOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Total Students</Text>}
                value={totalStudents}
                valueStyle={{ color: "#14b8a6", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Students Table */}
      <Card className="enhanced-card">
        <div className="flex items-center justify-between mb-4">
          <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
            Enrolled Students
          </Title>
        </div>
        <Table
          columns={columns}
          dataSource={students}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} students`,
          }}
          className="enhanced-table"
        />
      </Card>
    </div>
  );
};

export default TeacherStudents;
