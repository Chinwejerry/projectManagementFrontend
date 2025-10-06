import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Home,
  Folder,
  Users,
  ClipboardList,
  Compass,
  Mail,
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

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userName = userInfo ? `${userInfo.firstName}` : "User";
  const isAdmin = userInfo?.role === "admin";

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
    <div className="flex h-screen bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover text-cyan-50">
      <div className="flex h-screen b text-white w-screen">
        {/* Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out 
              w-64 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 z-50`}
        >
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h1 className="text-2xl font-bold">{userName}</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="hidden md:flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{userName}</h1>
            <span className="text-sm font-medium">
              {userInfo?.role === "admin" ? "Admin" : "User"}
            </span>
          </div>
          <nav className="flex flex-col space-y-2 ">
            <Link
              to={
                userInfo
                  ? userInfo.role === "admin"
                    ? "/adminDashboard"
                    : "/userDashboard"
                  : "/login"
              }
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
              to="/taskPage"
              className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
            >
              <ClipboardList size={18} /> Tasks
            </Link>

            {isAdmin && (
              <Link
                to="/ai-assistant"
                className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
              >
                <Compass size={18} /> AI Assistant
              </Link>
            )}
            <Link
              to="/messages"
              className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
            >
              <Mail size={18} /> Messages
            </Link>
            {isAdmin && (
              <Link
                to="/usersPage"
                className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
              >
                <Users size={18} /> Users
              </Link>
            )}
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
          <header className="flex flex-col sm:flex-row justify-between items-center   shadow px-4 py-3 gap-3">
            <Link
              to={
                userInfo
                  ? userInfo.role === "admin"
                    ? "/adminDashboard"
                    : "/userDashboard"
                  : "/login"
              }
              className="text-2xl font-bold flex items-center gap-2 text-sky-700"
            >
              Tasks
            </Link>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex text-black items-center border border-white  px-2 rounded w-full">
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
          <main className="p-4 flex-1 overflow-y-auto ">
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.length === 0 && (
                <p className="text-center col-span-full"></p>
              )}

              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="card bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800  z-50 shadow p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/taskDetail/${task._id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-semibold text-lg">{task.title}</h2>
                  </div>
                  <p className="text-gray-300 mb-3">
                    Due: {task.dueDate ? task.dueDate.slice(0, 10) : "N/A"}
                  </p>
                  <p className="text-gray-300 mb-3">
                    Estimated Hours: {task.estimatedDurationHours ?? "N/A"}
                  </p>
                  <span
                    className={` w-28 self-end badge ${
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
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
