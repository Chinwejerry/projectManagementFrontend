//userDashboard.jsx
import { useState, useEffect } from "react";
import { Search, UserCircle } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskRes = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const taskData = await taskRes.json();

        const projectRes = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/projects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const projectData = await projectRes.json();

        setTasks(taskData);
        setProjects(projectData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  // آماده‌سازی داده برای نمودار Pie تسک‌ها
  const taskStatusCounts = {
    pending: 0,
    "in-progress": 0,
    completed: 0,
  };
  tasks.forEach((t) => {
    if (taskStatusCounts[t.status] !== undefined) taskStatusCounts[t.status]++;
  });

  const taskChartData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          taskStatusCounts["pending"],
          taskStatusCounts["in-progress"],
          taskStatusCounts["completed"],
        ],
        backgroundColor: ["#facc15", "#3b82f6", "#16a34a"],
      },
    ],
  };

  // آماده‌سازی داده برای نمودار Pie پروژه‌ها
  const projectStatusCounts = {
    pending: 0,
    "in-progress": 0,
    completed: 0,
  };
  projects.forEach((p) => {
    if (projectStatusCounts[p.status] !== undefined)
      projectStatusCounts[p.status]++;
  });

  const projectChartData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          projectStatusCounts["pending"],
          projectStatusCounts["in-progress"],
          projectStatusCounts["completed"],
        ],
        backgroundColor: ["#facc15", "#3b82f6", "#16a34a"],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center bg-white shadow px-4 py-2">
        <div className="flex items-center gap-2 bg-gray-100 px-2 rounded">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks or projects..."
            className="bg-transparent outline-none p-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <UserCircle size={32} className="text-gray-600" />
          <span className="font-medium text-black">uuu</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Tasks Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow p-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">Assigned Tasks</h3>
            <ul className="divide-y">
              {tasks.map((t) => (
                <li key={t._id} className="py-2 flex justify-between">
                  <span>{t.title}</span>
                  <span
                    className={`badge ${
                      t.status === "completed"
                        ? "badge-success"
                        : t.status === "in-progress"
                        ? "badge-primary"
                        : "badge-warning"
                    }`}
                  >
                    {t.status.replace("-", " ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card bg-base-100 shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Tasks Status</h3>
            <Pie data={taskChartData} />
          </div>
        </div>

        {/* Projects Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow p-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">Projects Overview</h3>
            <ul className="divide-y">
              {projects.map((p) => (
                <li key={p._id} className="py-2 flex justify-between">
                  <span>{p.name}</span>
                  <span
                    className={`badge ${
                      p.status === "completed"
                        ? "badge-success"
                        : p.status === "in-progress"
                        ? "badge-primary"
                        : "badge-warning"
                    }`}
                  >
                    {p.status.replace("-", " ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card bg-base-100 shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Projects Status</h3>
            <Pie data={projectChartData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
