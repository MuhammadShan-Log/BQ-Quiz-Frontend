import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, message } from 'antd';
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Title, Text } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      
      message.success('Password changed successfully!');
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enhanced-content">
      <Card className="enhanced-card">
        <div className="enhanced-card-header">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <LockOutlined className="text-2xl text-white" />
            </div>
            <div>
              <Title level={2} className="text-white mb-0">
                Change Password
              </Title>
              <Text className="text-green-100">
                Update your account password for better security
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Card className="enhanced-card">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <LockOutlined className="text-3xl text-white" />
            </div>
            <Title level={2} className="text-gray-800 mb-3">
              Update Your Password
            </Title>
            <Text className="text-gray-600 text-lg">
              Please enter your current password and choose a new secure password
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[
                { required: true, message: 'Please enter your current password!' }
              ]}
            >
              <Input.Password
                placeholder="Enter your current password"
                prefix={<LockOutlined className="text-gray-400" />}
                size="large"
                className="enhanced-input"
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                visibilityToggle={{
                  visible: showCurrentPassword,
                  onVisibleChange: setShowCurrentPassword
                }}
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter a new password!' },
                { min: 8, message: 'Password must be at least 8 characters!' }
              ]}
            >
              <Input.Password
                placeholder="Enter your new password"
                prefix={<LockOutlined className="text-gray-400" />}
                size="large"
                className="enhanced-input"
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                visibilityToggle={{
                  visible: showNewPassword,
                  onVisibleChange: setShowNewPassword
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm your new password"
                prefix={<LockOutlined className="text-gray-400" />}
                size="large"
                className="enhanced-input"
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                visibilityToggle={{
                  visible: showConfirmPassword,
                  onVisibleChange: setShowConfirmPassword
                }}
              />
            </Form.Item>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircleOutlined className="text-blue-600 mt-1" />
                <div>
                  <Text className="text-blue-800 font-medium block">Password Requirements:</Text>
                  <ul className="text-blue-700 text-sm mt-2 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Mix of uppercase and lowercase letters</li>
                    <li>• Include numbers and special characters</li>
                    <li>• Avoid common words or personal information</li>
                  </ul>
                </div>
              </div>
            </div>

            <Form.Item className="mb-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="enhanced-btn flex-1 py-3 h-auto text-lg font-semibold"
                  icon={<CheckCircleOutlined />}
                >
                  Update Password
                </Button>
                <Button
                  size="large"
                  className="hover:border-primary-teal hover:text-primary-teal flex-1 py-3 h-auto text-lg font-semibold"
                  onClick={() => form.resetFields()}
                >
                  Reset Form
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default ChangePassword;
