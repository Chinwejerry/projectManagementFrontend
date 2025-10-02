import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Home,
  Folder,
  Users,
  ClipboardList,
  LogOut,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "https://projectmanegerbackend-1.onrender.com/api/projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover text-cyan-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out 
        w-64 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 z-50`}
      >
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h1 className="text-2xl font-bold">Admin</h1>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <h1 className="hidden md:block text-2xl font-bold mb-6"> Admin</h1>
        <nav className="flex flex-col space-y-2 ">
          <Link
            to="/adminDashboard"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <Home size={18} /> Dashboard
          </Link>
          <Link
            to="/projects"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <Folder size={18} /> Projects
          </Link>
          <Link
            to="/usersPage"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <Users size={18} /> Users
          </Link>
          <Link
            to="/taskPage"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <ClipboardList size={18} /> Tasks
          </Link>
          <Link
            to="/messages"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <ClipboardList size={18} /> Messages
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <LogOut size={18} /> Logout
          </Link>
        </nav>
      </aside>
      {/* Header */}
      <div className="flex flex-col flex-1">
        <header className="flex flex-col sm:flex-row justify-between items-center  text-black shadow px-4 py-3 gap-3">
          <Link
            to="/adminDashboard"
            className="text-2xl font-bold flex items-center gap-2 text-sky-700"
          >
            Projects
          </Link>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center border border-white px-2 rounded w-full">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search projects..."
                className="bg-transparent outline-none p-1 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {user?.role === "admin" && (
              <Link
                to="/createProject"
                className="btn btn-primary flex items-center gap-2 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 z-50"
              >
                <Plus size={16} /> Add Project
              </Link>
            )}
          </div>
        </header>

        {/* Projects List */}
        <main className="p-4 flex-1 overflow-y-auto">
          <div className="overflow-x-auto ">
            <table className="table w-full bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800  shadow rounded text-left">
              <thead>
                <tr className="text-white">
                  <th className="text-left">Project Name</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Created At</th>
                  <th className="text-left">Created By</th>
                  <th className="text-left">Start Date</th>
                  <th className="text-left">End Date</th>
                  <th className="text-left">Estimated Hours</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-sky-700">
                    <td>
                      <Link
                        to={`/projects/${project._id}`}
                        className="font-semibold hover:text-white text-white hover:underline transition-colors duration-200"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          project.status === "pending"
                            ? "badge-warning"
                            : project.status === "in-progress"
                            ? "badge-info"
                            : project.status === "completed"
                            ? "badge-success"
                            : "badge-ghost"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {project.createdBy?.firstName}{" "}
                      {project.createdBy?.lastName}
                    </td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects;
