import React from "react";
import { Search, UserCircle } from "lucide-react";

const UserDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center bg-white shadow px-4 py-2">
        <div className="flex items-center gap-2 bg-gray-100 px-2 rounded">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks or projects..."
            className="bg-transparent outline-none p-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <UserCircle size={32} className="text-gray-600" />
          <span className="font-medium">John Doe</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow p-4">
            <h3 className="text-lg font-semibold">Assigned Tasks</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="card bg-base-100 shadow p-4">
            <h3 className="text-lg font-semibold">Projects</h3>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div className="card bg-base-100 shadow p-4">
            <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card bg-base-100 shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Recent Tasks</h3>
          <ul className="divide-y">
            <li className="py-2 flex justify-between">
              <span>Design Homepage</span>
              <span className="badge badge-primary">In Progress</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Write API Documentation</span>
              <span className="badge badge-secondary">Pending</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Team Meeting Preparation</span>
              <span className="badge badge-accent">Completed</span>
            </li>
          </ul>
        </div>

        {/* Projects List */}
        <div className="card bg-base-100 shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Projects Overview</h3>
          <ul className="divide-y">
            <li className="py-2 flex justify-between">
              <span>Website Redesign</span>
              <span className="badge badge-primary">Active</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Mobile App</span>
              <span className="badge badge-secondary">Planning</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Marketing Campaign</span>
              <span className="badge badge-accent">Completed</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
