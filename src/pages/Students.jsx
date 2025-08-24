import React, { useState, useEffect } from "react";
import { Table, Switch, Popconfirm, message } from "antd";
import api from "../utils/api";

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

  useEffect(() => {
    (async () => {
      const data = await fetchStudents();
      setStudents(data || []);
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
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (_, record) => (
    //     <Popconfirm
    //       title={`Are you sure to ${
    //         record.status ? "deactivate" : "activate"
    //       } this account?`}
    //       onConfirm={() => handleToggleStatus(record)}
    //       okText="Yes"
    //       cancelText="No"
    //     >
    //       <Switch checked={record.status} />
    //     </Popconfirm>
    //   ),
    // },
  ];

  return <Table rowKey="_id" columns={columns} dataSource={students || []} />;
};

export default Students;
