import React, { useState } from "react";
import { Search, Plus, Users, Calendar } from "lucide-react";

const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "Active",
    start: "2025-09-01",
    end: "2025-10-15",
    team: 4,
  },
  {
    id: 2,
    name: "Mobile App",
    status: "Planning",
    start: "2025-09-10",
    end: "2025-11-01",
    team: 3,
  },
  {
    id: 3,
    name: "Marketing Campaign",
    status: "Completed",
    start: "2025-08-01",
    end: "2025-09-01",
    team: 5,
  },
  {
    id: 4,
    name: "CRM Integration",
    status: "Active",
    start: "2025-09-05",
    end: "2025-12-01",
    team: 2,
  },
];

const ProjectsPage = () => {
  const [search, setSearch] = useState("");

  const filteredProjects = initialProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Page Header */}
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
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Project
          </button>
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
                <th>Start Date</th>
                <th>End Date</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        project.status === "Active"
                          ? "badge-primary"
                          : project.status === "Planning"
                          ? "badge-secondary"
                          : "badge-accent"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td>{project.start}</td>
                  <td>{project.end}</td>
                  <td className="flex items-center gap-1">
                    <Users size={16} /> {project.team}
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
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

export default ProjectsPage;
