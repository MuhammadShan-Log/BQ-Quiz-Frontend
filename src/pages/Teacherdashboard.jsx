import React from "react";
import Sidebar from "../components/sidebar";
import { Route, Routes } from "react-router-dom";
import CourseList from "./CourseList";
import StudentDashboard from "./Studentdashboard";

const Teacherdashboard = () => {
  return (
    <div>
      <div className="content">
        <Sidebar />
        <div>
          <Routes>
            <Route path="/dashboard/profile" element={<Teacherdashboard />} />
            <Route path="/dashboard/courses" element={<CourseList />} />
            <Route path="/dashboard/students" element={<StudentDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Teacherdashboard;
