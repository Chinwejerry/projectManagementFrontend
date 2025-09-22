//adminDashboard.jsx
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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

  // محاسبه وضعیت پروژه‌ها
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
    <main className="p-4 space-y-6 overflow-y-auto">
      {/* آمار کل */}
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

      {/* لیست پروژه‌ها + نمودار */}
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

      {/* لیست تسک‌ها + نمودار */}
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
    </main>
  );
};

export default AdminDashboardMain;
