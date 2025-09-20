import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  // گرفتن لیست پروژه‌ها از بکند
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          " https://projectmanegerbackend-1.onrender.com/api/projects",
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

  // فیلتر کردن پروژه‌ها با سرچ
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white text-black shadow px-4 py-3 gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">Projects</h1>

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

          {/* دکمه رفتن به createProject */}
          <Link
            to="/createProject"
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Add Project
          </Link>
        </div>
      </header>

      {/* Projects List */}
      <main className="p-4 flex-1 overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="table w-full bg-base-100 shadow rounded">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project._id}>
                  <td>{project.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        project.status === "active"
                          ? "badge-primary"
                          : project.status === "planning"
                          ? "badge-secondary"
                          : "badge-accent"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
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
