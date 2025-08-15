import React from "react";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Student Dashboard</h1>
        <button className="bg-teal-600 text-white px-3 py-1 rounded">Logout</button>
      </header>
      <main className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">My Quizzes</h2>
          <p>View and attempt your assigned quizzes.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Results</h2>
          <p>Check your quiz performance and scores.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p>Update your account details.</p>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
