import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Signup from "./pages/Signup.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CourseList from "./pages/CourseList";
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
import { ToastContainer } from "react-toastify";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Signup /> },
  {
    path: "/",
    element: <AdminLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "dashboard", element: <TeacherDashboard /> },
      { path: "courses", element: <CourseList /> },
      { path: "quizzes/add", element: <AddQuiz /> },
      { path: "quizzes/list", element: <QuizList /> },
      { path: "quizzes/list/:id", element: <QuizDetail /> },
      { path: "quizzes/list/:id/update", element: <UpdateQuiz /> },
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
