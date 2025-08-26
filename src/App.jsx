import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Signup from "./pages/signup.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import CourseList from "./pages/CourseList";
import CourseManagement from "./pages/CourseManagement.jsx";
import AddQuiz from "./pages/teacher/AddQuiz.jsx";
import QuizList from "./pages/teacher/QuizList.jsx";
import Students from "./pages/Students.jsx";
import Teachers from "./pages/Teachers.jsx";
import Profile from "./pages/Profile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import Logout from "./pages/Logout.jsx";
import NotFound from "./pages/NotFound.jsx";
import QuizDetail from "./components/teacher/QuizDetail.jsx";
import UpdateQuiz from "./pages/teacher/UpdateQuiz.jsx";
import StartQuiz from "./pages/student/StartQuiz.jsx";
import { ToastContainer } from "react-toastify";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import MyCourses from "./pages/MyCourses.jsx";

// Import new components
import CourseAssignment from "./components/CourseAssignment.jsx";
import CourseEnrollment from "./components/CourseEnrollment.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ApiTest from "./components/ApiTest.jsx";
import SimpleTest from "./components/SimpleTest.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import TeacherStudents from "./pages/TeacherStudents.jsx";
import TeacherAttempts from "./pages/TeacherAttempts.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Signup /> },
  {
    path: "/",
    element: <AdminLayout />,
    errorElement: <NotFound />,
    children: [
      // Admin Routes
      { 
        path: "dashboard", 
        element: <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: "admin/course-assignment", 
        element: <ProtectedRoute allowedRoles={["admin"]}><CourseAssignment /></ProtectedRoute> 
      },
      { 
        path: "admin/course-management", 
        element: <ProtectedRoute allowedRoles={["admin"]}><CourseManagement /></ProtectedRoute> 
      },
      { 
        path: "admin/api-test", 
        element: <ProtectedRoute allowedRoles={["admin"]}><ApiTest /></ProtectedRoute> 
      },
      { 
        path: "test", 
        element: <SimpleTest />
      },
      
      // Teacher Routes
      { 
        path: "teacher/dashboard", 
        element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute> 
      },
      { 
        path: "teacher/courses", 
        element: <ProtectedRoute allowedRoles={["teacher"]}><CourseList /></ProtectedRoute> 
      },
      { 
        path: "teacher/quizzes/add", 
        element: <ProtectedRoute allowedRoles={["teacher"]}><AddQuiz /></ProtectedRoute> 
      },
      { 
        path: "teacher/quizzes/list", 
        element: <ProtectedRoute allowedRoles={["teacher"]}><QuizList /></ProtectedRoute> 
      },
      { 
        path: "teacher/quizzes/list/:id", 
        element: <ProtectedRoute allowedRoles={["teacher"]}><QuizDetail /></ProtectedRoute> 
      },
      { 
        path: "teacher/quizzes/list/:id/update", 
        element: <ProtectedRoute allowedRoles={["teacher"]}><UpdateQuiz /></ProtectedRoute> 
      },
      { 
        path: "teacher/getstudents", 
        element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherStudents/></ProtectedRoute> 
      },
      { 
        path: "teacher/attempts", 
        element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherAttempts /></ProtectedRoute> 
      },

      
      // Student Routes
      { 
        path: "student/dashboard", 
        element: <ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute> 
      },
      { 
        path: "student/quiz/:id/start", 
        element: <ProtectedRoute allowedRoles={["student"]}><StartQuiz /></ProtectedRoute> 
      },
      
      // General Routes (accessible to all roles)
      { path: "courses", element: <CourseList /> },
      { path: "my-course", element: <ProtectedRoute allowedRoles={["student"]}><MyCourses /></ProtectedRoute> },
      { path: "quizzes/add", element: <AddQuiz /> },
      { path: "quizzes/list", element: <QuizList /> },
      { path: "quizzes/list/:id", element: <QuizDetail /> },
      { path: "quizzes/list/:id/update", element: <UpdateQuiz /> },
      { path: "quizzes/quiz/:id/start", element: <StartQuiz /> },
      { path: "students", element: <Students /> },
      { path: "teachers", element: <Teachers /> },
      { path: "profile", element: <Profile /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "logout", element: <Logout /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="colored"
      />
    </>
  );
}

export default App;
