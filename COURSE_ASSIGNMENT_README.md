# Course Assignment System - Frontend Implementation

## Overview
This implementation provides a comprehensive Course Assignment System where:
- **Admin** can assign teachers and students to courses
- **Teachers** can only see their assigned students and courses
- **Students** can self-enroll in courses during registration or later

## Features Implemented

### 1. Admin Features
- **Course Assignment Management** (`src/components/CourseAssignment.jsx`)
  - Assign teachers to courses
  - Assign students to courses
  - View all course assignments
  - Campus ID support for multi-campus scenarios

- **Enhanced Admin Dashboard** (`src/pages/Dashboard.jsx`)
  - Course assignment statistics
  - Assignment rates and enrollment rates
  - Quick navigation to course management
  - Recent assignments overview

- **Course Management** (`src/pages/CourseManagement.jsx`)
  - Create, edit, and delete courses
  - View course details and status
  - Manage course capacity and duration

### 2. Teacher Features
- **Updated Teacher Dashboard** (`src/pages/teacher/TeacherDashboard.jsx`)
  - View assigned courses only
  - See enrolled students in their courses
  - Course and student statistics
  - Quick access to quiz management

### 3. Student Features
- **Student Dashboard** (`src/pages/student/StudentDashboard.jsx`)
  - View enrolled courses
  - See available quizzes
  - Track progress and scores
  - Course completion status

- **Course Self-Enrollment** (`src/components/CourseEnrollment.jsx`)
  - Browse available courses
  - Self-enroll in courses
  - View course details before enrollment
  - Search and filter courses

- **Enhanced Signup Form** (`src/pages/signup.jsx`)
  - Course selection during registration
  - Dynamic course dropdown
  - Automatic course enrollment

## API Integration

The system integrates with your backend API endpoints:

### Course Assignment (Admin Only)
```javascript
// Assign teacher to course
POST /course/assign-teacher
Body: { courseId, teacherId, campusId }

// Assign student to course  
POST /course/assign-student
Body: { studentId, courseId, campusId }
```

### Teacher Routes
```javascript
// Get teacher's students
GET /course/teacher/students

// Get teacher's assigned courses
GET /course/teacher/courses

// Teacher dashboard overview
GET /dashboard/teacher/overview
```

### Student Routes
```javascript
// Get student's enrolled courses
GET /course/student/courses

// Self enroll to course
POST /course/student/enroll

// Student dashboard overview
GET /dashboard/student/overview
```

### Admin Routes
```javascript
// Get all students
GET /auth/users/students

// Get all teachers
GET /auth/users/teachers

// Admin dashboard overview
GET /dashboard/admin/overview
```

## Component Structure

```
src/
├── components/
│   ├── CourseAssignment.jsx      # Admin course assignment management
│   └── CourseEnrollment.jsx      # Student self-enrollment
├── pages/
│   ├── Dashboard.jsx             # Enhanced admin dashboard
│   ├── CourseManagement.jsx      # Course CRUD operations
│   ├── teacher/
│   │   └── TeacherDashboard.jsx  # Updated teacher dashboard
│   └── student/
│       └── StudentDashboard.jsx  # New student dashboard
└── utils/
    └── api.js                    # API configuration
```

## Key Features

### 1. Role-Based Access Control
- **Admin**: Full access to all course assignments and management
- **Teacher**: Only sees assigned courses and students
- **Student**: Can view enrolled courses and self-enroll

### 2. Real-time Updates
- Automatic data refresh after assignments
- Loading states and error handling
- Success/error notifications

### 3. User Experience
- Modern UI with Ant Design components
- Responsive design for all screen sizes
- Intuitive navigation and workflows
- Search and filter capabilities

### 4. Data Validation
- Form validation for all inputs
- Required field checks
- Error handling for API failures

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create `.env` file:
```env
VITE_BASE_URL=http://localhost:5000
```

### 3. Backend Requirements
Ensure your backend provides these endpoints:
- Course management endpoints
- User management endpoints
- Assignment endpoints
- Dashboard statistics endpoints

### 4. Run Development Server
```bash
npm run dev
```

## Usage Examples

### Admin Assigning Teacher to Course
1. Navigate to Course Assignment page
2. Select course from dropdown
3. Select teacher from dropdown
4. Enter campus ID (optional)
5. Click "Assign Teacher"

### Student Self-Enrolling
1. Navigate to Course Enrollment page
2. Browse available courses
3. Click "Enroll" on desired course
4. Confirm enrollment

### Teacher Viewing Students
1. Access Teacher Dashboard
2. View assigned courses
3. Click "View Students" for specific course
4. See enrolled student list

## Customization

### Adding New Fields
To add new fields to course assignments:

1. Update the form components in `CourseAssignment.jsx`
2. Modify the API calls to include new fields
3. Update the table columns to display new data

### Styling Changes
The system uses Tailwind CSS classes and Ant Design components. You can:
- Modify color schemes in the component files
- Update card styles and shadows
- Customize button appearances

### API Endpoint Changes
If your backend endpoints differ:
1. Update the API calls in each component
2. Modify the request/response handling
3. Update error handling for new response formats

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check backend server is running
   - Verify `VITE_BASE_URL` in environment
   - Check CORS configuration

2. **Component Not Rendering**
   - Check browser console for errors
   - Verify component imports
   - Check routing configuration

3. **Data Not Loading**
   - Verify API endpoints are working
   - Check authentication tokens
   - Review API response format

### Debug Mode
Enable debug logging by adding to components:
```javascript
console.log('API Response:', response.data);
console.log('Component State:', state);
```

## Future Enhancements

### Potential Improvements
1. **Bulk Operations**: Assign multiple students/teachers at once
2. **Advanced Filtering**: Filter by campus, department, etc.
3. **Export Functionality**: Export assignment reports
4. **Notification System**: Email notifications for assignments
5. **Audit Trail**: Track assignment history and changes

### Performance Optimizations
1. **Pagination**: Implement server-side pagination for large datasets
2. **Caching**: Cache frequently accessed data
3. **Lazy Loading**: Load components on demand
4. **Debouncing**: Optimize search inputs

## Support

For technical support or questions:
1. Check the browser console for error messages
2. Verify API endpoint responses
3. Review component state and props
4. Check routing configuration

## License

This implementation is part of the BQ-Quiz-Frontend project.
