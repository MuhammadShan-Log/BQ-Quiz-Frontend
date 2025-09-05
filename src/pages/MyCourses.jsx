import React, { useEffect, useState } from 'react';
import { Card, Row, Col, message, Spin, Tag, Typography } from 'antd';
import { BookOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Title, Text } = Typography;

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get('/course/student/courses');
        setCourses(response.data.data || []);
      } catch (error) {
        message.error('Failed to fetch your courses');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading your courses..." />
      </div>
    );
  }

  return (
    <div className="enhanced-content space-y-6">
      {/* Header */}
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <BookOutlined className="text-2xl text-white" />
            </div>
            <div>
              <Title level={2} className="text-white mb-0">
                My Enrolled Courses
              </Title>
              <Text className="text-green-100">
                View and manage your enrolled courses
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {courses.length === 0 ? (
        <Card className="enhanced-card text-center py-20">
          <div className="text-gray-500">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOutlined className="text-4xl text-teal-600" />
            </div>
            <Title level={3} className="text-gray-700 mb-3">
              No Courses Enrolled
            </Title>
            <Text className="text-gray-500 text-lg mb-6 block">
              You haven't enrolled in any courses yet.
            </Text>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="text-left">
                  <Text className="text-blue-800 font-medium block mb-2">Get Started:</Text>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Contact your teacher for course enrollment</li>
                    <li>• Check available courses in the course list</li>
                    <li>• Ask your administrator for help</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {courses.map((enrollment) => (
            <Col xs={24} sm={12} lg={8} key={enrollment._id}>
              <Card 
                className="enhanced-card h-full hover:scale-105 transition-all duration-300"
                title={
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <BookOutlined className="text-teal-600" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      {enrollment.course?.courseName || 'Course Name Not Available'}
                    </span>
                  </div>
                }
              >
                <div className="space-y-3">
                  <div>
                    <Text strong>Course Code:</Text>
                    <br />
                    <Text code>{enrollment.course?.courseCode || 'N/A'}</Text>
                  </div>
                  
                  <div>
                    <Text strong>Description:</Text>
                    <br />
                    <Text type="secondary">
                      {enrollment.course?.courseDescription || 'No description available'}
                    </Text>
                  </div>

                  <div>
                    <Text strong>Teacher:</Text>
                    <br />
                    <div className="flex items-center mt-1">
                      <UserOutlined className="mr-1 text-gray-500" />
                      <Text>{enrollment.teacher?.name || 'Teacher not assigned'}</Text>
                    </div>
                  </div>

                  {enrollment.course?.timings && (
                    <div>
                      <Text strong>Timings:</Text>
                      <br />
                      <div className="flex items-center mt-1">
                        <CalendarOutlined className="mr-1 text-gray-500" />
                        <Text>{enrollment.course.timings}</Text>
                      </div>
                    </div>
                  )}

                  {enrollment.course?.days && (
                    <div>
                      <Text strong>Days:</Text>
                      <br />
                      <div className="mt-1">
                        {enrollment.course.days.split(',').map((day, index) => (
                          <Tag key={index} color="blue" className="mb-1">
                            {day.trim()}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Tag color="green" icon={<BookOutlined />}>Enrolled</Tag>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MyCourses;