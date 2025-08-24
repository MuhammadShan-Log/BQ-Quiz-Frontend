import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Switch,
  notification,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../utils/api";

const CourseList = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();
  const [userRole, setUserRole] = useState(JSON.parse(localStorage.getItem("user"))?.role);

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/course');
      // adjust according to your API response
      console.log("Courses: ", res);
      
      setCourses(res ? res.data.data : []);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch courses",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Open modal for Add/Edit
  const openModal = (course = null) => {
    setEditingCourse(course);
    setIsModalOpen(true);
    if (course) {
      form.setFieldsValue(course);
    } else {
      form.resetFields();
    }
  };

  // Save Course (Add/Edit)
  const handleSave = async () => {
    console.log("Adding course");
    
    try {
      const values = await form.validateFields();

      // get user from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role == "admin") {
        if (user?.id) {
          values.createdBy = user.id; // inject createdBy
        }

        if (editingCourse) {
          // update course
          console.log(editingCourse._id);
          
          const res = await api.put(`/course/${editingCourse._id}`, values);
          console.log(res);
          
          notification.success({ message: "Course updated successfully" });
        } else {
          // add new course
          console.log("Adding course...");
          const res = await api.post("/course", values);
          console.log("Added course...");
                    console.log(res);

          notification.success({ message: "Course added successfully" });
        }
      } else {
        notification.error({
          message: "Error",
          description: "Admin can add or edit the courses.",
        });
      }

      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong",
      });
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    try {
      await axios.patch(`/course/${id}`);
      notification.success({ message: "Course deleted successfully" });
      fetchCourses();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete course",
      });
    }
  };

  let columns = [
  {
    title: "Course Name",
    dataIndex: "courseName",
  },
  {
    title: "Description",
    dataIndex: "courseDescription",
  },
  {
    title: "Code",
    dataIndex: "courseCode",
  },
  {
    title: "Timings",
    dataIndex: "timings",
  },
  {
    title: "Days",
    dataIndex: "days",
  },
];
console.log("userRole is:", userRole);

 if(userRole === "admin") {
  columns = [
    ...columns,
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => <Switch checked={status} disabled />,
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => openModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this course?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
}


  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        {userRole == "admin" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Add Course
          </Button>
        )}
      </Space>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={courses}
        bordered
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingCourse ? "Edit Course" : "Add Course"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText={editingCourse ? "Update Course" : "Add Course"}
      >
        <Form layout="vertical" form={form}>
          {/* Course Name */}
          <Form.Item
            label="Course Name"
            name="courseName"
            rules={[
              { required: true, message: "Course name is required" },
              { min: 3, message: "Course name must be at least 3 characters" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Course Description */}
          <Form.Item
            label="Course Description"
            name="courseDescription"
            rules={[
              { required: true, message: "Course description is required" },
              { min: 5, message: "Description must be at least 5 characters" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          {/* Course Code */}
          <Form.Item
            label="Course Code"
            name="courseCode"
            rules={[{ required: true, message: "Course code is required" }]}
          >
            <Input />
          </Form.Item>

          {/* Timings */}
          <Form.Item
            label="Timings"
            name="timings"
            rules={[{ required: true, message: "Course timings are required" }]}
          >
            <Input />
          </Form.Item>

          {/* Days */}
          <Form.Item
            label="Days"
            name="days"
            rules={[{ required: true, message: "Course days are required" }]}
          >
            <Input />
          </Form.Item>

          {/* Created By (User ID) */}

          {/* Status */}
          <Form.Item
            label="Status"
            name="status"
            valuePropName="checked"
            rules={[{ required: true, message: "Course status is required" }]}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseList;
