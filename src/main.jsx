import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Teacherdashboard from './pages/Teacherdashboard.jsx';
import Signup from './pages/signup.jsx';
import Studentdashboard from './pages/Studentdashboard.jsx';
import StudentInstruction from './pages/studentinstruction/StudentInstruction.jsx';
import Quizpage from './pages/Student-Quiz-page/Quizpage.jsx';
import ThankYouPage from './pages/Student-thankyou-page/thankyoupage.jsx'; // <-- Add this line

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup/>,
  },
  {
    path: "/teacher-dashboard",
    element: <Teacherdashboard/>,
  },
  {
    path: "/student-dashboard",
    element: <Studentdashboard/>,
  },
  {
    path: "/student-instruction",
    element: <StudentInstruction />,
  },
  {
    path: "/quiz",
    element: <Quizpage />,
  },
  {
    path: "/thankyou", // <-- Add this route
    element: <ThankYouPage />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
