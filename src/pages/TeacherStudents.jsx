// pages/dashboard/TeacherStudents.jsx
import React, { useEffect, useState } from "react";
import { Card, Table, Tag, message } from "antd";
import { UserOutlined, BookOutlined } from "@ant-design/icons";
import api from "../utils/api";

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
      dataIndex: ["student", "name"],
      key: "student",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.student?.name}</span>
          <span className="text-gray-500 text-sm">{record.student?.email}</span>
          <span className="text-gray-500 text-sm">{record.student?.phone}</span>
        </div>
      ),
    },
    {
      title: "Course",
      dataIndex: ["course", "courseName"],
      key: "course",
      render: (_, record) => (
        <div>
          <BookOutlined /> {record.course?.courseName} (
          {record.course?.courseCode})
        </div>
      ),
    },
    {
      title: "Campus",
      dataIndex: ["campus", "name"],
      key: "campus",
      render: (campus) => campus || "-",
    },
    {
      title: "Enrollment Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleString() : "Not available",
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="green">Enrolled</Tag>,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        <UserOutlined /> My Students
      </h1>

      <Card className="shadow-md">
        <Table
          columns={columns}
          dataSource={students}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default TeacherStudents;
