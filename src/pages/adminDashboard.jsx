import React from "react";

import {
  Home,
  Folder,
  Users,
  Settings,
  Search,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-base-200 p-4">
        <h1 className="text-2xl font-bold mb-6">PM Admin</h1>
        <nav className="flex flex-col space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 p-2 rounded hover:bg-base-300"
          >
            <Home size={18} /> Dashboard
          </Link>
          <Link
            to="/projects"
            className="flex items-center gap-2 p-2 rounded hover:bg-base-300"
          >
            <Folder size={18} /> Projects
          </Link>
          <Link
            to="/usersPage"
            className="flex items-center gap-2 p-2 rounded hover:bg-base-300"
          >
            <Users size={18} /> Users
          </Link>
          <Link
            to="#"
            className="flex items-center gap-2 p-2 rounded hover:bg-base-300"
          >
            <Settings size={18} /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="flex justify-between items-center text-black bg-white shadow px-4 py-2">
          <div className="flex items-center gap-2 bg-gray-100  px-2 rounded">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none p-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <UserCircle size={32} className="text-gray-600" />
            <span className="font-medium">Admin</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 space-y-6 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card bg-base-100 shadow p-4">
              <h3 className="text-lg font-semibold">Total Projects</h3>
              <p className="text-2xl font-bold">42</p>
            </div>
            <div className="card bg-base-100 shadow p-4">
              <h3 className="text-lg font-semibold">Tasks in Progress</h3>
              <p className="text-2xl font-bold">128</p>
            </div>
            <div className="card bg-base-100 shadow p-4">
              <h3 className="text-lg font-semibold">Active Users</h3>
              <p className="text-2xl font-bold">16</p>
            </div>
          </div>

          {/* Recent Projects + Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="card bg-base-100 shadow p-4 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Recent Projects</h3>
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

            {/* Task Progress Placeholder */}
            <div className="card bg-base-100 shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Task Progress</h3>
              <div className="flex flex-col gap-2">
                <progress
                  className="progress progress-primary"
                  value="70"
                  max="100"
                ></progress>
                <progress
                  className="progress progress-secondary"
                  value="40"
                  max="100"
                ></progress>
                <progress
                  className="progress progress-accent"
                  value="90"
                  max="100"
                ></progress>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
