import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Signup from "./pages/Signup.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CourseList from "./pages/CourseList";
import AddQuiz from "./pages/AddQuiz.jsx";
import QuizList from "./pages/QuizList.jsx";
import Students from "./pages/Students.jsx";
import Teachers from "./pages/Teachers.jsx";
import Profile from "./pages/Profile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import Logout from "./pages/Logout.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Signup /> },
  {
    path: "/",
    element: <AdminLayout />, 
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "courses", element: <CourseList /> },
      { path: "quizzes/add", element: <AddQuiz /> },
      { path: "quizzes/list", element: <QuizList /> },
      { path: "students", element: <Students /> },
      { path: "teachers", element: <Teachers /> },
      { path: "profile", element: <Profile /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
