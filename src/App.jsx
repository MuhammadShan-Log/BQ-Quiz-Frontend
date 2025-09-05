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
  { 
    path: "/", 
    element: <Signup /> 
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/admin/course-assignment",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminLayout><CourseAssignment /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/admin/course-management",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminLayout><CourseManagement /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/admin/api-test",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminLayout><ApiTest /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/test",
    element: <AdminLayout><SimpleTest /></AdminLayout>
  },
  {
    path: "/teacher/dashboard",
    element: <ProtectedRoute allowedRoles={["teacher"]}><AdminLayout><TeacherDashboard /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/teacher/courses",
    element: <ProtectedRoute allowedRoles={["teacher"]}><AdminLayout><CourseList /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/teacher/quizzes/add",
    element: <ProtectedRoute allowedRoles={["teacher"]}><AdminLayout><AddQuiz /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/teacher/quizzes/list",
    element: <ProtectedRoute allowedRoles={["teacher"]}><AdminLayout><QuizList /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/teacher/quizzes/list/:id",
    element: <ProtectedRoute allowedRoles={["teacher"]}><AdminLayout><QuizDetail /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/teacher/quizzes/list/:id/update",
    element: <ProtectedRoute allowedRoles={["teacher"]}><AdminLayout><UpdateQuiz /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/teacher/getstudents",
    element: <ProtectedRoute allowedRoles={["teacher"]}><AdminLayout><TeacherStudents /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/teacher/attempts",
    element: <ProtectedRoute allowedRoles={["teacher"]}><AdminLayout><TeacherAttempts /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/student/dashboard",
    element: <ProtectedRoute allowedRoles={["student"]}><AdminLayout><StudentDashboard /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/student/quiz/:id/start",
    element: <ProtectedRoute allowedRoles={["student"]}><AdminLayout><StartQuiz /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/courses",
    element: <AdminLayout><CourseList /></AdminLayout>
  },
  {
    path: "/my-course",
    element: <ProtectedRoute allowedRoles={["student"]}><AdminLayout><MyCourses /></AdminLayout></ProtectedRoute>
  },
  {
    path: "/quizzes/add",
    element: <AdminLayout><AddQuiz /></AdminLayout>
  },
  {
    path: "/quizzes/list",
    element: <AdminLayout><QuizList /></AdminLayout>
  },
  {
    path: "/quizzes/list/:id",
    element: <AdminLayout><QuizDetail /></AdminLayout>
  },
  {
    path: "/quizzes/list/:id/update",
    element: <AdminLayout><UpdateQuiz /></AdminLayout>
  },
  {
    path: "/quizzes/quiz/:id/start",
    element: <AdminLayout><StartQuiz /></AdminLayout>
  },
  {
    path: "/students",
    element: <AdminLayout><Students /></AdminLayout>
  },
  {
    path: "/teachers",
    element: <AdminLayout><Teachers /></AdminLayout>
  },
  {
    path: "/profile",
    element: <AdminLayout><Profile /></AdminLayout>
  },
  {
    path: "/change-password",
    element: <AdminLayout><ChangePassword /></AdminLayout>
  },
  {
    path: "/logout",
    element: <AdminLayout><Logout /></AdminLayout>
  },
  {
    path: "*",
    element: <NotFound />
  }
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
