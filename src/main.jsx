import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Teacherdashboard from './pages/Teacherdashboard.jsx';
import Signup from './pages/signup.jsx';
import Studentdashboard from './pages/Studentdashboard.jsx';
import StudentInstruction from './pages/studentinstruction/StudentInstruction.jsx';



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
  
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
