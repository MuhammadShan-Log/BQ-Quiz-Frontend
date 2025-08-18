import React from 'react'
import Sidebar from '../components/sidebar'

const CourseList= () => {
  return (
  
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add Course</button>
      </div>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Timings</th>
            <th>Days</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* map courses here */}
          <tr>
            <td>CS101</td>
            <td>Intro to CS</td>
            <td>9:00 AM - 11:00 AM</td>
            <td>Mon, Wed</td>
            <td><span className="text-green-600">Active</span></td>
            <td>Admin</td>
            <td>
              <button className="text-blue-600 mr-2">Edit</button>
              <button className="text-red-600">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <form className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow space-y-4">
        <input type="text" placeholder="Course Name" className="w-full border p-2 rounded" />
        <textarea placeholder="Course Description" className="w-full border p-2 rounded"></textarea>
        <input type="text" placeholder="Course Code" className="w-full border p-2 rounded" />
        <input type="text" placeholder="Timings (e.g. 9AM-11AM)" className="w-full border p-2 rounded" />
        <input type="text" placeholder="Days (e.g. Mon, Wed, Fri)" className="w-full border p-2 rounded" />
        <label className="flex items-center space-x-2">
          <input type="checkbox" defaultChecked />
          <span>Active</span>
        </label>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
      </form>





    </div>

  )
}

export default CourseList