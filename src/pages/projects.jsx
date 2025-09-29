import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

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
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white text-black shadow px-4 py-3 gap-3">
        <Link
          to="/adminDashboard"
          className="text-2xl font-bold flex items-center gap-2 text-sky-700"
        >
          Projects
        </Link>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-gray-100 px-2 rounded w-full">
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
      <main className="p-4 flex-1 overflow-y-auto bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800">
        <div className="overflow-x-auto">
          <table className="table w-full bg-white shadow rounded text-left">
            <thead>
              <tr>
                <th className="text-left">Project Name</th>
                <th className="text-center">Status</th>
                <th className="text-center">Created At</th>
                <th className="text-left">Created By</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-100">
                  <td>
                    <Link
                      to={`/projects/${project._id}`}
                      className="font-semibold text-sky-700 hover:text-sky-900 hover:underline transition-colors duration-200"
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
                    {project.createdBy?.firstName} {project.createdBy?.lastName}
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
  );
};

export default Projects;
