import React, { useState, useEffect } from "react";
import { Table, Switch, Popconfirm, message, Card, Typography, Row, Col, Statistic, Button, Space, Avatar, Tag } from "antd";
import { UserOutlined, TeamOutlined, MailOutlined, PhoneOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import api from "../utils/api";

const { Title, Text } = Typography;

const fetchStudents = async () => {
  try {
    const response = await api.get("/auth/users/students");
    console.log("response", response);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching Students:", error);
    return [];
  }
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchStudents();
      setStudents(data || []);
      setLoading(false);
    })();
  }, []);

  const handleToggleStatus = async (record) => {
    try {
      const response = await api.patch(`auth/updateprofile/${record._id}`);

      const result = await response.data;

      if (response.ok) {
        message.success(result.message || "Status updated successfully!");
        setStudents((prev) =>
          prev.map((item) =>
            item._id === record._id ? { ...item, status: !item.status } : item
          )
        );
      } else {
        message.error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error("Server error while updating status");
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
            {record.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-800">{record.name}</div>
            <div className="text-sm text-gray-500">Student ID: {record._id?.slice(-8)}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <MailOutlined className="text-teal-600" />
            <Text className="text-sm">{record.email}</Text>
          </div>
          <div className="flex items-center space-x-2">
            <PhoneOutlined className="text-teal-600" />
            <Text className="text-sm">{record.phone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center space-x-2">
          <Tag
            color={status ? "green" : "red"}
            icon={status ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          >
            {status ? "Active" : "Inactive"}
          </Tag>
          <Popconfirm
            title={`Are you sure to ${
              record.status ? "deactivate" : "activate"
            } this account?`}
            onConfirm={() => handleToggleStatus(record)}
            okText="Yes"
            cancelText="No"
          >
            <Switch checked={status} />
          </Popconfirm>
        </div>
      ),
    },
    {
      title: "Enrollment Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Text className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
  ];

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status).length;
  const inactiveStudents = totalStudents - activeStudents;

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
                  Student Management
                </Title>
                <Text className="text-green-100">
                  Manage all student accounts and their status
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
        <Col xs={24} sm={8}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                <CheckCircleOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Active Students</Text>}
                value={activeStudents}
                valueStyle={{ color: "#10b981", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="enhanced-card hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}>
                <CloseCircleOutlined style={{ color: "white", fontSize: "24px" }} />
              </div>
              <Statistic
                title={<Text style={{ color: "#4b5563", fontWeight: "500" }}>Inactive Students</Text>}
                value={inactiveStudents}
                valueStyle={{ color: "#ef4444", fontSize: "28px", fontWeight: "bold" }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Students Table */}
      <Card className="enhanced-card">
        <div className="flex items-center justify-between mb-4">
          <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
            All Students
          </Title>
          <Space>
            <Button
              type="primary"
              className="enhanced-btn"
              icon={<TeamOutlined />}
            >
              Export Data
            </Button>
          </Space>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={students || []}
          loading={loading}
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

export default Students;
