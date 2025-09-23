//taskPage.jsx
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // 📌 دریافت تسک‌ها
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 📌 فیلتر تسک‌ها بر اساس جستجو
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-4">Loading tasks...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
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

        {/* دکمه اضافه کردن تسک برای ادمین */}
        {user?.role === "admin" && (
          <button
            className="btn btn-primary ml-4"
            onClick={() => navigate("/createTask")}
          >
            Add Task
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.length === 0 && (
            <p className="text-center col-span-full">No tasks found.</p>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="card bg-base-100 shadow p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/taskDetail/${task._id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-semibold text-lg">{task.title}</h2>
                <span
                  className={`badge ${
                    task.status === "completed"
                      ? "badge-accent"
                      : task.status === "in-progress"
                      ? "badge-primary"
                      : "badge-secondary"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-gray-500 mb-3">
                Due: {task.dueDate ? task.dueDate.slice(0, 10) : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TaskPage;
