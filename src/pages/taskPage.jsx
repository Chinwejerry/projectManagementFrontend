import React, { useState } from "react";
import { Search, CheckCircle, Circle } from "lucide-react";

const tasksData = [
  { id: 1, title: "Design Homepage", status: "In Progress", due: "2025-09-20" },
  {
    id: 2,
    title: "Write API Documentation",
    status: "Pending",
    due: "2025-09-22",
  },
  { id: 3, title: "Team Meeting Prep", status: "Completed", due: "2025-09-18" },
  {
    id: 4,
    title: "Implement Login Flow",
    status: "In Progress",
    due: "2025-09-21",
  },
];

const TaskPage = () => {
  const [search, setSearch] = useState("");

  const filteredTasks = tasksData.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white shadow px-4 py-3 gap-3">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <div className="flex items-center bg-gray-100 px-2 rounded w-full sm:w-auto">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent outline-none p-1 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Task List */}
      <main className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="card bg-base-100 shadow p-4 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-semibold text-lg">{task.title}</h2>
                <span
                  className={`badge ${
                    task.status === "Completed"
                      ? "badge-accent"
                      : task.status === "In Progress"
                      ? "badge-primary"
                      : "badge-secondary"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-gray-500 mb-3">Due: {task.due}</p>
              <button className="btn btn-sm btn-outline flex items-center gap-2">
                {task.status === "Completed" ? (
                  <CheckCircle size={16} />
                ) : (
                  <Circle size={16} />
                )}
                {task.status === "Completed" ? "Completed" : "Mark Complete"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TaskPage;
