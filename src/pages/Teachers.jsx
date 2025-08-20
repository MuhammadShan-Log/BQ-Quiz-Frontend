import React, { useState, useEffect } from "react";
import { Table, Switch, Popconfirm, message } from "antd";

const API_GET_TEACHERS = "http://localhost:5000/auth/users/teacher";
const API_UPDATE_PROFILE = "http://localhost:5000/auth/updateprofile";

const fetchTeachers = async () => {
  try {
    const response = await fetch(API_GET_TEACHERS, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return Array.isArray(data) ? data : data.users || [];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
};

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchTeachers();
      setTeachers(data || []);
    })();
  }, []);

  const handleToggleStatus = async (record) => {
    try {
      const response = await fetch(`${API_UPDATE_PROFILE}/${record._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !record.status }),
      });

      const result = await response.json();

      if (response.ok) {
        message.success(result.message || "Status updated successfully!");
        setTeachers((prev) =>
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
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <Popconfirm
          title={`Are you sure to ${record.status ? "deactivate" : "activate"
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

  return (
    <Table rowKey="_id" columns={columns} dataSource={teachers || []} />
  );
};

export default Teachers;
