
import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-teal-700 text-white flex flex-col">
      <h1 className="text-2xl font-bold p-4">Teacher Panel</h1>
      <nav className="flex flex-col gap-2 p-4">
        <NavLink to="/teacher-dashboard" className="hover:bg-teal-800 p-2 rounded">Dashboard</NavLink>
        <NavLink to="/courseList" className="hover:bg-teal-800 p-2 rounded">Courses</NavLink>
        <NavLink to="/profile" className="hover:bg-teal-800 p-2 rounded">Profile</NavLink>
      </nav>
    </div>
  )
}

export default Sidebar
