import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, message, Modal, Form, Input, Select, DatePicker } from 'antd';
import { 
  BookOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import api from '../utils/api';

const { Option } = Select;
const { TextArea } = Input;

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/course/list');
      setCourses(res.data.data || []);
    } catch (error) {
      message.error('Failed to fetch courses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (course = null) => {
    setEditingCourse(course);
    if (course) {
      form.setFieldsValue({
        name: course.name,
        description: course.description,
        duration: course.duration,
        maxStudents: course.maxStudents,
        status: course.status || 'active'
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingCourse(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log("Submitting course data:", values); // Debug log
      
      if (editingCourse) {
        const response = await api.put(`/course/${editingCourse._id}`, values);
        console.log("Update response:", response); // Debug log
        message.success('Course updated successfully!');
      } else {
        const response = await api.post('/course', values);
        console.log("Create response:", response); // Debug log
        message.success('Course created successfully!');
      }
      handleModalCancel();
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save course';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this course?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await api.patch(`/course/${courseId}`);
          message.success('Course deleted successfully!');
          fetchCourses();
        } catch (error) {
          message.error('Failed to delete course');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.description}</div>
        </div>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => duration ? `${duration} weeks` : 'Not specified'
    },
    {
      title: 'Max Students',
      dataIndex: 'maxStudents',
      key: 'maxStudents',
      render: (max) => max || 'Unlimited'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status || 'active'}
        </Tag>
      )
    },
    {
      title: 'Teacher',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (text) => (
        <div className="flex items-center space-x-2">
          <TeamOutlined />
          <span>{text || 'Not assigned'}</span>
        </div>
      )
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      key: 'studentCount',
      render: (count) => (
        <div className="flex items-center space-x-2">
          <UserOutlined />
          <span>{count || 0}</span>
        </div>
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
        if (record.teacherAssignedAt) {
          return `Teacher: ${new Date(record.teacherAssignedAt).toLocaleString()}`;
        }
        if (record.studentAssignedAt) {
          return `Student: ${new Date(record.studentAssignedAt).toLocaleString()}`;
        }
        return 'Not assigned';
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small"
            onClick={() => showModal(record)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            danger
            onClick={() => handleDelete(record._id)}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="enhanced-content space-y-6">
      {/* Header */}
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <BookOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-0">Course Management</h1>
                <p className="text-green-100 mb-0">Manage all courses in the system</p>
              </div>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              className="enhanced-btn"
              onClick={() => showModal()}
            >
              Add New Course
            </Button>
          </div>
        </div>
      </Card>

      <Card className="enhanced-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-0">All Courses</h3>
        </div>
        <Table 
          columns={columns} 
          dataSource={courses}
          loading={loading}
          rowKey="_id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
          }}
          className="enhanced-table"
        />
      </Card>

      <Modal
        title={editingCourse ? 'Edit Course' : 'Add New Course'}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Course Name"
            rules={[{ required: true, message: 'Please enter course name!' }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter course description!' }]}
          >
            <TextArea rows={3} placeholder="Enter course description" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (weeks)"
          >
            <Input type="number" placeholder="Enter duration in weeks" />
          </Form.Item>

          <Form.Item
            name="maxStudents"
            label="Maximum Students"
          >
            <Input type="number" placeholder="Enter maximum number of students" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="active"
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="archived">Archived</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="enhanced-btn"
              >
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
              <Button 
                onClick={handleModalCancel}
                className="hover:border-primary-teal hover:text-primary-teal"
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;
