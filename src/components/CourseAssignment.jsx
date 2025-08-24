import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, message, Table, Tag, Space, Modal, Input } from 'antd';
import { UserAddOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Option } = Select;

const CourseAssignment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('teacher'); // 'teacher' or 'student'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching data..."); // Debug log
      
      const [coursesRes, teachersRes, studentsRes] = await Promise.all([
        api.get('/course/list'),
        api.get('/auth/users/teachers'),
        api.get('/auth/users/students')
      ]);

      console.log("API Responses:", { coursesRes, teachersRes, studentsRes }); // Debug log

      setCourses(coursesRes.data.data || []);
      setTeachers(teachersRes.data?.users || []);
      setStudents(studentsRes.data?.users || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = async (values) => {
    try {
      setLoading(true);
      const response = await api.post('/course/assign-teacher', {
        courseId: values.courseId,
        teacherId: values.teacherId,
        campusId: values.campusId || 'default',
        assignedAt: new Date().toISOString()
      });
      
      console.log('Teacher assignment response:', response.data);
      message.success('Teacher assigned successfully!');
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error('Teacher assignment error:', error);
      message.error(error.response?.data?.message || 'Failed to assign teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStudent = async (values) => {
    try {
      setLoading(true);
      const response = await api.post('/course/assign-student', {
        studentId: values.studentId,
        courseId: values.courseId,
        campusId: values.campusId || 'default',
        assignedAt: new Date().toISOString()
      });
      
      console.log('Student assignment response:', response.data);
      message.success('Student assigned successfully!');
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error('Student assignment error:', error);
      message.error(error.response?.data?.message || 'Failed to assign student');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Course',
      dataIndex: 'courseName',
      key: 'courseName',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">ID: {record.courseId}</div>
        </div>
      )
    },
    {
      title: 'Teacher',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.teacherEmail}</div>
        </div>
      )
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      key: 'studentCount',
      render: (count) => (
        <Tag color="blue">{count || 0} students</Tag>
      )
    },
    {
      title: 'Assignment Time',
      dataIndex: 'assignedAt',
      key: 'assignedAt',
      render: (time, record) => {
        if (time) {
          return new Date(time).toLocaleString();
        }
        return record.teacherAssignedAt ? new Date(record.teacherAssignedAt).toLocaleString() : 'Recently assigned';
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            onClick={() => showModal('student')}
            icon={<UserAddOutlined />}
          >
            Add Student
          </Button>
          <Button 
            size="small" 
            onClick={() => showModal('teacher')}
            icon={<TeamOutlined />}
          >
            Change Teacher
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Course Assignment Management</h1>
        <p className="text-gray-600">Assign teachers and students to courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card 
          title="Assign Teacher to Course" 
          icon={<TeamOutlined />}
          className="shadow-md"
        >
          <Form form={form} onFinish={handleAssignTeacher} layout="vertical">
            <Form.Item
              name="courseId"
              label="Course"
              rules={[{ required: true, message: 'Please select a course!' }]}
            >
              <Select placeholder="Select course" loading={loading}>
                {courses.map(course => (
                  <Option key={course._id} value={course._id}>
                    {course.courseName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="teacherId"
              label="Teacher"
              rules={[{ required: true, message: 'Please select a teacher!' }]}
            >
              <Select placeholder="Select teacher" loading={loading}>
                {teachers.map(teacher => (
                  <Option key={teacher._id} value={teacher._id}>
                    {teacher.name} ({teacher.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="campusId"
              label="Campus ID"
            >
              <Input placeholder="Enter campus ID (optional)" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="w-full"
                icon={<TeamOutlined />}
              >
                Assign Teacher
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card 
          title="Assign Student to Course" 
          icon={<UserAddOutlined />}
          className="shadow-md"
        >
          <Form form={form} onFinish={handleAssignStudent} layout="vertical">
            <Form.Item
              name="courseId"
              label="Course"
              rules={[{ required: true, message: 'Please select a course!' }]}
            >
              <Select placeholder="Select course" loading={loading}>
                {courses.map(course => (
                  <Option key={course._id} value={course._id}>
                    {course.courseName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="studentId"
              label="Student"
              rules={[{ required: true, message: 'Please select a student!' }]}
            >
              <Select placeholder="Select student" loading={loading}>
                {students.map(student => (
                  <Option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="campusId"
              label="Campus ID"
            >
              <Input placeholder="Enter campus ID (optional)" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="w-full"
                icon={<UserAddOutlined />}
              >
                Assign Student
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Card title="Course Assignments Overview" className="shadow-md">
        <Table 
          columns={columns} 
          dataSource={assignments}
          loading={loading}
          rowKey="courseId"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`${modalType === 'teacher' ? 'Assign Teacher' : 'Assign Student'} to Course`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="courseId"
            label="Course"
            rules={[{ required: true, message: 'Please select a course!' }]}
          >
            <Select placeholder="Select course">
              {courses.map(course => (
                <Option key={course._id} value={course._id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {modalType === 'teacher' ? (
            <Form.Item
              name="teacherId"
              label="Teacher"
              rules={[{ required: true, message: 'Please select a teacher!' }]}
            >
              <Select placeholder="Select teacher">
                {teachers.map(teacher => (
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
              rules={[{ required: true, message: 'Please select a student!' }]}
            >
              <Select placeholder="Select student">
                {students.map(student => (
                  <Option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="campusId"
            label="Campus ID"
          >
            <Input placeholder="Enter campus ID (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseAssignment;
