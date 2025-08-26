import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, message, Table, Tag, Space, Input, Modal, Descriptions } from 'antd';
import { BookOutlined, UserOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Option } = Select;
const { Search } = Input;

const CourseEnrollment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching course enrollment data..."); // Debug log
      
      const [coursesRes, enrolledRes] = await Promise.all([
        api.get('/course/list'),
        api.get('/course/student/courses')
      ]);

      console.log("Enrollment API Responses:", { coursesRes, enrolledRes }); // Debug log

      setCourses(coursesRes.data?.data || []);
      setEnrolledCourses(enrolledRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching enrollment data:", error);
      message.error(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (values) => {
    try {
      setLoading(true);
      const response = await api.post('/course/student/enroll', {
        courseId: values.courseId,
        campusId: values.campusId || 'default',
        enrolledAt: new Date().toISOString()
      });
      
      console.log('Enrollment response:', response.data);
      message.success('Successfully enrolled in course!');
      form.resetFields();
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Enrollment error:', error);
      message.error(error.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };

  const showCourseDetails = (course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedCourse(null);
  };

  // Filter courses based on search text and exclude already enrolled courses
  const filteredCourses = courses.filter(course => {
    const isNotEnrolled = !enrolledCourses.some(enrolled => enrolled.course?._id === course._id);
    const matchesSearch = course.courseName?.toLowerCase().includes(searchText.toLowerCase()) ||
                         course.courseDescription?.toLowerCase().includes(searchText.toLowerCase());
    return isNotEnrolled && matchesSearch;
  });

  const courseColumns = [
    {
      title: 'Course',
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
      title: 'Teacher',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <span>{text || 'Not assigned yet'}</span>
        </Space>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => duration ? `${duration} weeks` : 'Not specified'
    },
    {
      title: 'Enrollment Time',
      dataIndex: 'enrollmentTime',
      key: 'enrollmentTime',
      render: (time, record) => {
        if (record.isEnrolled) {
          return time ? new Date(time).toLocaleString() : 'Recently enrolled';
        }
        return 'Not enrolled';
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small"
            onClick={() => showCourseDetails(record)}
            icon={<BookOutlined />}
          >
            View Details
          </Button>
          <Button 
            size="small" 
            type="primary"
            onClick={() => {
              form.setFieldsValue({ courseId: record._id });
              form.submit();
            }}
            icon={<PlusOutlined />}
          >
            Enroll
          </Button>
        </Space>
      )
    }
  ];

  const enrolledColumns = [
    {
      title: 'Course',
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
      title: 'Teacher',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <span>{text || 'Not assigned yet'}</span>
        </Space>
      )
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color="green">Enrolled</Tag>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Course Enrollment</h1>
        <p className="text-gray-600">Browse and enroll in available courses</p>
      </div>

      {/* Quick Enrollment Form */}
      <Card title="Quick Enrollment" className="shadow-md mb-6">
        <Form form={form} onFinish={handleEnroll} layout="inline">
          <Form.Item
            name="courseId"
            rules={[{ required: true, message: 'Please select a course!' }]}
            className="flex-1"
          >
            <Select placeholder="Select course to enroll" loading={loading}>
              {filteredCourses.map(course => (
                <Option key={course._id} value={course._id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="campusId">
            <Input placeholder="Campus ID (optional)" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<PlusOutlined />}
            >
              Enroll Now
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Available Courses */}
      <Card 
        title="Available Courses" 
        className="shadow-md mb-6"
        extra={
          <Search
            placeholder="Search courses..."
            allowClear
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        }
      >
        <Table 
          columns={courseColumns} 
          dataSource={filteredCourses}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Enrolled Courses */}
      <Card title="My Enrolled Courses" className="shadow-md">
        <Table 
          columns={enrolledColumns} 
          dataSource={enrolledCourses}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Course Details Modal */}
      <Modal
        title="Course Details"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Close
          </Button>,
          <Button 
            key="enroll" 
            type="primary" 
            onClick={() => {
              if (selectedCourse) {
                form.setFieldsValue({ courseId: selectedCourse._id });
                form.submit();
                handleModalCancel();
              }
            }}
            icon={<PlusOutlined />}
          >
            Enroll Now
          </Button>
        ]}
        width={600}
      >
        {selectedCourse && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Course Name">
              {selectedCourse.name}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selectedCourse.description || 'No description available'}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {selectedCourse.duration ? `${selectedCourse.duration} weeks` : 'Not specified'}
            </Descriptions.Item>
            <Descriptions.Item label="Teacher">
              {selectedCourse.teacherName || 'Not assigned yet'}
            </Descriptions.Item>
            <Descriptions.Item label="Course ID">
              {selectedCourse._id}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CourseEnrollment;
