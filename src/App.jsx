import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Teacherdashboard from "./pages/Teacherdashboard.jsx";
import Signup from "./pages/Signup.jsx";
import Studentdashboard from "./pages/Studentdashboard.jsx";
import CourseList from "./pages/CourseList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/teacher-dashboard",
    element: <Teacherdashboard />,
  },
  {
    path: "/student-dashboard",
    element: <Studentdashboard />,
  },
  {
    path: "/courseList",
    element: <CourseList />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
