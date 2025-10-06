import { useState, useEffect } from "react";
import SearchBar from "../components/search";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
import {
  Home,
  Folder,
  Users,
  ClipboardList,
  Settings,
  UserCircle,
  Menu,
  Compass,
  Mail,
  X,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchFilter, setSearchFilter] = useState("project");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userName = userInfo ? `${userInfo.firstName}` : "User";
  const isAdmin = userInfo?.role === "admin";

  const handleSearch = async ({ query, filter }) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      if (!userInfo || !userInfo.token) {
        console.error("User not authenticated");
        return;
      }

      const endpoint = filter === "project" ? "projects" : "tasks";
      const res = await fetch(
        `https://projectmanegerbackend-1.onrender.com/api/${endpoint}/find?query=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error(`Search failed: ${res.status}`);
      }

      const data = await res.json();
      setSearchFilter(filter); // ✅ store which type was searched
      setSuggestions(data);
      setResults(data);
    } catch (error) {
      console.error("Error in search:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/projects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const projectData = await projectRes.json();

        const taskRes = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const taskData = await taskRes.json();

        setProjects(projectData);
        setTasks(taskData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);
  const statusColors = {
    pending: "#95BDFF", // light blue
    "in-progress": "#FFC3E7", // pink
    completed: "#21AA93", // green
  };

  const projectStatusCounts = {
    pending: 0,
    "in-progress": 0,
    completed: 0,
    backgroundColor: ["#95BDFF", "#FFC3E7", "#21AA93"],
  };
  projects.forEach((p) => projectStatusCounts[p.status]++);

  const taskStatusCounts = {
    pending: 0,
    "in-progress": 0,
    completed: 0,
    backgroundColor: ["#95BDFF", "#FFC3E7", "#21AA93"],
  };
  tasks.forEach((t) => taskStatusCounts[t.status]++);
  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#ffffff", // 👈 makes legend text white
        },
      },
    },
  };

  const projectChartData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          projectStatusCounts.pending,
          projectStatusCounts["in-progress"],
          projectStatusCounts.completed,
        ],
        backgroundColor: Object.values(statusColors),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const taskChartData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          taskStatusCounts.pending,
          taskStatusCounts["in-progress"],
          taskStatusCounts.completed,
        ],
        backgroundColor: Object.values(statusColors),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  if (loading) return <p>Loading...</p>;

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

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 md:hidden p-2"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex justify-between items-center  shadow px-4 py-2">
          <div className="mt-6 ">
            <SearchBar onSearch={handleSearch} suggestions={suggestions} />
            {results.length === 0 ? (
              <p className="text-gray-500"></p>
            ) : (
              <ul className="absolute left-0 right-0 mt-1 bg-sky-700 border border-gray-200 rounded-xl shadow z-10 max-h-48 overflow-y-auto p-4 ml-65">
                {results.map((item) => (
                  <li
                    key={item._id || item.id}
                    className="p-2 cursor-pointer hover:bg-sky-700"
                  >
                    <Link
                      to={
                        searchFilter === "project"
                          ? `/projects/${item._id}`
                          : `/taskDetail/${item._id}`
                      }
                      className="block w-full"
                    >
                      {item.name || item.title} –{" "}
                      {item.category || "Task/Project"}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle button (only mobile) */}
            <button
              className="md:hidden p-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <Link to="/profilePage" className="flex items-center gap-2">
              <UserCircle size={32} className="text-sky-700" />
              <span className="font-medium text-sky-700">{userName}</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Total statistics */}
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 shadow p-4">
              <h3 className="text-lg font-semibold">Total Projects</h3>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
            <div className="card  bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 shadow p-4">
              <h3 className="text-lg font-semibold">Total Tasks</h3>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
          </div>

          {/* Tasks + chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
            <div className="card bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 shadow p-4 lg:col-span-2 max-h-96  overflow-y-auto">
              <h3 className="text-lg font-semibold mb-3">Tasks</h3>
              <ul className="divide-y">
                {tasks.map((t) => (
                  <li key={t._id} className="py-2 flex justify-between gap-4">
                    <span>{t.title}</span>
                    <span
                      className="px-2 py-1 rounded-full text-sm font-semibold text-sky-800 w-30 h-8 flex items-center justify-center"
                      style={{ backgroundColor: statusColors[t.status] }}
                    >
                      {t.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-white card bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Task Status</h3>
              <Pie data={taskChartData} options={chartOptions} />
            </div>
          </div>
          {/* Projects + chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-0">
            <div className="card bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 shadow p-4 lg:col-span-2 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-3">Projects</h3>
              <ul className="divide-y">
                {projects.map((p) => (
                  <li key={p._id} className="py-2 flex justify-between gap-4">
                    <span>{p.name}</span>
                    <span
                      className="px-2 py-1 rounded-full text-sm font-semibold  text-sky-800 w-30 h-8 flex items-center justify-center"
                      style={{ backgroundColor: statusColors[p.status] }}
                    >
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Project Status</h3>
              <Pie data={projectChartData} options={chartOptions} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
