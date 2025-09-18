import React, { useState } from "react";
import { Calendar, Search, Plus, Edit, Trash2 } from "lucide-react";

const initialWorklogs = [
  {
    id: 1,
    date: "2025-09-18",
    project: "Website Redesign",
    task: "Homepage Design",
    hours: 4,
  },
  {
    id: 2,
    date: "2025-09-18",
    project: "Mobile App",
    task: "Login Flow",
    hours: 3,
  },
  {
    id: 3,
    date: "2025-09-17",
    project: "Marketing Campaign",
    task: "Social Media Ads",
    hours: 2,
  },
];

const Worklog = () => {
  const [worklogs, setWorklogs] = useState(initialWorklogs);
  const [search, setSearch] = useState("");

  const filteredWorklogs = worklogs.filter(
    (w) =>
      w.project.toLowerCase().includes(search.toLowerCase()) ||
      w.task.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white shadow px-4 py-3 gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar size={24} /> Worklog
        </h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-gray-100 px-2 rounded w-full">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search project or task..."
              className="bg-transparent outline-none p-1 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Entry
          </button>
        </div>
      </header>

      {/* Worklog Table */}
      <main className="p-4 flex-1 overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="table w-full bg-base-100 shadow rounded">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Task</th>
                <th>Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorklogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.date}</td>
                  <td>{log.project}</td>
                  <td>{log.task}</td>
                  <td>{log.hours}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-sm btn-outline btn-success flex items-center gap-1">
                      <Edit size={14} /> Edit
                    </button>
                    <button className="btn btn-sm btn-outline btn-error flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredWorklogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No worklog entries found.
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

export default Worklog;
