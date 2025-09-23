//adminDashboard.jsx

import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
import {
  Home,
  Folder,
  Users,
  Settings,
  Search,
  ClipboardList,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router";

const AdminDashboardMain = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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

  const projectStatusCounts = {
    pending: 0,
    "in-progress": 0,
    completed: 0,
  };
  projects.forEach((p) => projectStatusCounts[p.status]++);

  const taskStatusCounts = {
    pending: 0,
    "in-progress": 0,
    completed: 0,
  };
  tasks.forEach((t) => taskStatusCounts[t.status]++);

  const projectChartData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          projectStatusCounts.pending,
          projectStatusCounts["in-progress"],
          projectStatusCounts.completed,
        ],
        backgroundColor: ["#FFCE56", "#36A2EB", "#4BC0C0"],
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
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center text-black bg-white shadow px-4 py-2">
        <div className="flex items-center gap-2 bg-gray-100  px-2 rounded">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none p-1"
          />
        </div>
        <Link to="/profilePage" className="flex items-center gap-2">
          <UserCircle size={32} className="text-gray-600" />
          <span className="font-medium">Admin</span>
        </Link>
      </header>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-base-200 p-4">
        <h1 className="text-2xl font-bold mb-6">PM Admin</h1>
        <nav className="flex flex-col space-y-2">
          <Link
            to="/adminDashboard"
            className="flex items-center gap-2 p-2 rounded hover:bg-base-300"
          >
            <Home size={18} /> Dashboard
          </Link>
          <Link
            to="/projects"
            className="flex items-center gap-2 p-2 rounded hover:bg-base-300"
          >
            <Folder size={18} /> Projects
          </Link>
          <Link
            to="/usersPage"
            className="flex items-center gap-2 p-2 rounded hover:bg-base-300"
          >
            <Users size={18} /> Users
          </Link>
          <Link
            to="/taskPage"
            className="flex items-center gap-2 p-2 rounded hover:bg-base-300"
          >
            <ClipboardList size={18} /> Tasks
          </Link>
          <Link
            to="#"
            className="flex items-center gap-2 p-2 rounded hover:bg-base-300"
          >
            <Settings size={18} /> Settings
          </Link>
        </nav>
      </aside>
      {/* Total statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow p-4">
          <h3 className="text-lg font-semibold">Total Projects</h3>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <h3 className="text-lg font-semibold">Total Tasks</h3>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>
      </div>
      {/* List of projects + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow p-4 lg:col-span-2 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3">Projects</h3>
          <ul className="divide-y">
            {projects.map((p) => (
              <li key={p._id} className="py-2 flex justify-between">
                <span>{p.name}</span>
                <span
                  className={`badge ${
                    p.status === "completed" ? "badge-success" : "badge-warning"
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Project Status</h3>
          <Pie data={projectChartData} />
        </div>
      </div>
      {/* Task list + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow p-4 lg:col-span-2 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3">Tasks</h3>
          <ul className="divide-y">
            {tasks.map((t) => (
              <li key={t._id} className="py-2 flex justify-between">
                <span>{t.title}</span>
                <span
                  className={`badge ${
                    t.status === "completed" ? "badge-success" : "badge-warning"
                  }`}
                >
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Task Status</h3>
          <Pie data={taskChartData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;
