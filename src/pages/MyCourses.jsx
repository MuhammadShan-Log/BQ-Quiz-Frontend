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
    <div className="p-6">
      <Title level={2} className="mb-6">
        <BookOutlined className="mr-2" />
        My Enrolled Courses
      </Title>

      {courses.length === 0 ? (
        <Card className="text-center">
          <Text type="secondary">You haven't enrolled in any courses yet.</Text>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {courses.map((enrollment) => (
            <Col xs={24} sm={12} lg={8} key={enrollment._id}>
              <Card 
                className="h-full shadow-md hover:shadow-lg transition-shadow"
                title={
                  <div className="flex items-center">
                    <BookOutlined className="mr-2 text-blue-500" />
                    {enrollment.course?.courseName || 'Course Name Not Available'}
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
                    <Tag color="green">Enrolled</Tag>
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