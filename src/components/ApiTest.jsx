import React, { useState } from 'react';
import { Card, Button, message, Space, Divider, Typography } from 'antd';
import api from '../utils/api';

const { Title, Text } = Typography;

const ApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const testApiCall = async (endpoint, method = 'GET', data = null) => {
    try {
      setLoading(true);
      console.log(`Testing ${method} ${endpoint}`, data);
      
      let response;
      if (method === 'GET') {
        response = await api.get(endpoint);
      } else if (method === 'POST') {
        response = await api.post(endpoint, data);
      } else if (method === 'PUT') {
        response = await api.put(endpoint, data);
      } else if (method === 'DELETE') {
        response = await api.delete(endpoint);
      }

      console.log(`Response from ${endpoint}:`, response);
      
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          success: true,
          data: response.data,
          status: response.status
        }
      }));

      message.success(`${endpoint} - Success!`);
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error);
      
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          success: false,
          error: error.message,
          response: error.response?.data,
          status: error.response?.status
        }
      }));

      message.error(`${endpoint} - Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testEndpoints = [
    { endpoint: '/course/list', method: 'GET', label: 'Get All Courses' },
    { endpoint: '/auth/users/teachers', method: 'GET', label: 'Get Teachers' },
    { endpoint: '/auth/users/students', method: 'GET', label: 'Get Students' },
    { endpoint: '/dashboard/admin/overview', method: 'GET', label: 'Admin Dashboard' },
    { endpoint: '/dashboard/teacher/overview', method: 'GET', label: 'Teacher Dashboard' },
    { endpoint: '/dashboard/student/overview', method: 'GET', label: 'Student Dashboard' },
    { endpoint: '/course/teacher/courses', method: 'GET', label: 'Teacher Courses' },
    { endpoint: '/course/teacher/students', method: 'GET', label: 'Teacher Students' },
    { endpoint: '/course/student/courses', method: 'GET', label: 'Student Courses' },
  ];

  const testPostEndpoints = [
    { 
      endpoint: '/course/create', 
      method: 'POST', 
      label: 'Create Course',
      data: {
        name: 'Test Course',
        description: 'This is a test course',
        duration: 12,
        maxStudents: 30,
        status: 'active'
      }
    },
    { 
      endpoint: '/course/assign-teacher', 
      method: 'POST', 
      label: 'Assign Teacher',
      data: {
        courseId: 'test-course-id',
        teacherId: 'test-teacher-id',
        campusId: 'test-campus'
      }
    },
    { 
      endpoint: '/course/assign-student', 
      method: 'POST', 
      label: 'Assign Student',
      data: {
        courseId: 'test-course-id',
        studentId: 'test-student-id',
        campusId: 'test-campus'
      }
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>API Testing Tool</Title>
      <Text type="secondary">Use this to test your backend API endpoints</Text>
      
      <Divider />
      
      <Card title="GET Endpoints" className="mb-4">
        <Space wrap>
          {testEndpoints.map(({ endpoint, method, label }) => (
            <Button
              key={endpoint}
              onClick={() => testApiCall(endpoint, method)}
              loading={loading}
              type="primary"
            >
              {label}
            </Button>
          ))}
        </Space>
      </Card>

      <Card title="POST Endpoints" className="mb-4">
        <Space wrap>
          {testPostEndpoints.map(({ endpoint, method, label, data }) => (
            <Button
              key={endpoint}
              onClick={() => testApiCall(endpoint, method, data)}
              loading={loading}
              type="default"
            >
              {label}
            </Button>
          ))}
        </Space>
      </Card>

      <Card title="Test Results">
        {Object.entries(results).map(([endpoint, result]) => (
          <div key={endpoint} className="mb-4 p-3 border rounded">
            <Text strong>{endpoint}</Text>
            <div className="mt-2">
              {result.success ? (
                <div>
                  <Text type="success">✅ Success</Text>
                  <div className="mt-1">
                    <Text code>Status: {result.status}</Text>
                  </div>
                  <div className="mt-1">
                    <Text code>Data: {JSON.stringify(result.data, null, 2)}</Text>
                  </div>
                </div>
              ) : (
                <div>
                  <Text type="danger">❌ Failed</Text>
                  <div className="mt-1">
                    <Text code>Error: {result.error}</Text>
                  </div>
                  {result.status && (
                    <div className="mt-1">
                      <Text code>Status: {result.status}</Text>
                    </div>
                  )}
                  {result.response && (
                    <div className="mt-1">
                      <Text code>Response: {JSON.stringify(result.response, null, 2)}</Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default ApiTest;
