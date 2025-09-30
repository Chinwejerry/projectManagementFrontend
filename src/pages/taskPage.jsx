import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-4">Loading tasks...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex h-screen bg-gray-100 text-cyan-50">
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
        {/* Navbar */}
        <div className="flex flex-col flex-1">
          <header className="flex flex-col sm:flex-row justify-between items-center bg-white text-black shadow px-4 py-3 gap-3">
            <Link
              to="/adminDashboard"
              className="text-2xl font-bold flex items-center gap-2 text-sky-700"
            >
              Tasks
            </Link>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center bg-gray-100 px-2 rounded w-full">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="bg-transparent outline-none p-1 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {user?.role === "admin" && (
                <Link
                  to="/createTask"
                  className="btn btn-primary flex items-center gap-2 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 z-50"
                >
                  <Plus size={16} /> Add Tasks
                </Link>
              )}
            </div>
          </header>

          {/* Main content */}
          <main className="p-4 flex-1 overflow-y-auto">
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.length === 0 && (
                <p className="text-center col-span-full">No tasks found.</p>
              )}

              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="card bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800  z-50 shadow p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-50"
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
      </div>
    </div>
  );
};

export default TaskPage;
