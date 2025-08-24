import React, { useState, useEffect } from "react";
import { Table, Switch, Popconfirm, message } from "antd";
import api from "../utils/api";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  console.log("On Teachers page");
  
  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const response = await api.get("/auth/users/teachers"); 
      console.log(response);
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching teachers:", error);
      message.error("Failed to load teachers");
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      const data = await fetchTeachers();
      setTeachers(data || []);
    })();
  }, []);

  // Toggle teacher active/inactive
  const handleToggleStatus = async (record) => {
    try {
      const response = await api.patch(`/auth/updateprofile/${record._id}`, {
        status: !record.status,
      });

      message.success(response.data?.message || "Status updated successfully!");

      setTeachers((prev) =>
        prev.map((item) =>
          item._id === record._id ? { ...item, status: !item.status } : item
        )
      );
    } catch (error) {
      console.error("Update error:", error);
      message.error(
        error.response?.data?.message || "Server error while updating status"
      );
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <Popconfirm
          title={`Are you sure to ${
            record.status ? "deactivate" : "activate"
          } this account?`}
          onConfirm={() => handleToggleStatus(record)}
          okText="Yes"
          cancelText="No"
        >
          <Switch checked={record.status} />
        </Popconfirm>
      ),
    },
  ];

  return <Table rowKey="_id" columns={columns} dataSource={teachers || []} />;
};

export default Teachers;
