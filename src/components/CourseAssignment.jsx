// components/CourseAssignment.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Input,
} from "antd";
import { UserAddOutlined, TeamOutlined } from "@ant-design/icons";
import api from "../utils/api";
import { toast } from "react-toastify";


const { Option } = Select;

const CourseAssignment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("teacher"); // 'teacher' | 'student'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, teachersRes, studentsRes] = await Promise.all([
        api.get("/course"),
        api.get("/auth/users/teachers"),
        api.get("/auth/users/students"),
      ]);

      setCourses(coursesRes.data?.data || []);
      setTeachers(teachersRes.data || []);
      console.log(studentsRes.data?.data);
      
      setStudents(studentsRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = async (values) => {
    try {
      setLoading(true);

      const payload = {
        courseId: values.courseId,
        teacherId: values.teacherId,
      };
      if (values.campusId) {
        payload.campusId = values.campusId; // only if user entered something
      }

      const response = await api.post("/course/assign-teacher", payload);

      toast.success(response.data?.message || "Teacher assigned successfully!");
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error("Teacher assignment error:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to assign teacher"
      );
    } finally {
      setLoading(false);
    }

 

  };


  const handleAssignStudent = async (values) => {
    try {
      setLoading(true);

      const payload = {
        studentId: values.studentId,
        courseId: values.courseId,
      };
      if (values.campusId) {
        payload.campusId = values.campusId; // only if user entered something
      }

      const response = await api.post("/course/assign-student", payload);

      toast.success(response.data?.message || "Student assigned successfully!");
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error("Student assignment error:", error.response?.data || error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to assign student"
      );
    } finally {
      setLoading(false);
    }
  };

  const showModal = (type, record = null) => {
    setModalType(type);
    setIsModalVisible(true);
    form.resetFields();
    if (record?._id) {
      // Pre-select the course when opening from row action
      form.setFieldsValue({ courseId: record._id });
    }
  };

  const handleModalOk = () => {
    form.submit(); // triggers onFinish & validation
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
      render: (text, record) => (
        <div>
          <div className="font-medium">{record.courseName}</div>
          <div className="text-sm text-gray-500">ID: {record._id}</div>
        </div>
      ),
    },
    {
      title: "Teacher",
      dataIndex: "teacher",
      key: "teacher",
      render: (teacher) =>
        teacher ? (
          <div>
            <div className="font-medium">{teacher.name}</div>
            <div className="text-sm text-gray-500">{teacher.email}</div>
          </div>
        ) : (
          <Tag color="red">Not Assigned</Tag>
        ),
    },
    {
  title: "Enrolled Students",
  dataIndex: "students",
  key: "students",
  render: (students ) =>
    students ? (
      <div>
        {students.map((s) => (
          <Tag key={s._id}>{s.name}</Tag>
        ))}
      </div>
    ) : (
      <Tag color="red">No Students</Tag>
    ),
},

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (time) => (time ? new Date(time).toLocaleString() : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => showModal("student", record)}
            icon={<UserAddOutlined />}
          >
            Add Student
          </Button>
          <Button
            size="small"
            onClick={() => showModal("teacher", record)}
            icon={<TeamOutlined />}
          >
            {record.teacher ? "Change Teacher" : "Assign Teacher"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Course Assignment Management
        </h1>
        <p className="text-gray-600">Assign teachers and students to courses</p>
      </div>

      <Card title="Course Assignments Overview" className="shadow-md">
        <Table
          columns={columns}
          dataSource={courses}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`${
          modalType === "teacher" ? "Assign Teacher" : "Assign Student"
        } to Course`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={
            modalType === "teacher" ? handleAssignTeacher : handleAssignStudent
          }
        >
          <Form.Item
            name="courseId"
            label="Course"
            rules={[{ required: true, message: "Please select a course!" }]}
          >
            <Select
              placeholder="Select course"
              showSearch
              optionFilterProp="children"
            >
              {courses.map((course) => (
                <Option key={course._id} value={course._id}>
                  {course.courseName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {modalType === "teacher" ? (
            <Form.Item
              name="teacherId"
              label="Teacher"
              rules={[{ required: true, message: "Please select a teacher!" }]}
            >
              <Select
                placeholder="Select teacher"
                showSearch
                optionFilterProp="children"
              >
                {teachers.map((teacher) => (
                  <Option key={teacher._id} value={teacher._id}>
                    {teacher.name} ({teacher.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              name="studentId"
              label="Student"
              rules={[{ required: true, message: "Please select a student!" }]}
            >
              <Select
                placeholder="Select student"
                showSearch
                optionFilterProp="children"
              >
                {students.map((student) => (
                  <Option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item name="campusId" label="Campus ID">
            <Input placeholder="Enter campus ID (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseAssignment;
