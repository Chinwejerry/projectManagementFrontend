import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [types, setTypes] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // fetch all projects
  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const res = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/projects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load projects");
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [token]);

  // fetch members of selected project
  useEffect(() => {
    if (!projectId) {
      setProjectMembers([]);
      return;
    }

    const fetchProjectMembers = async () => {
      setLoadingMembers(true);
      try {
        const res = await fetch(
          `https://projectmanegerbackend-1.onrender.com/api/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to load project members");

        const users = data.members.filter((member) => member.role === "user");
        setProjectMembers(users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchProjectMembers();
  }, [projectId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        alert("Please log in first");
        navigate("/login");
        setLoading(false);
        return;
      }

      const res = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            projectId,
            assignedTo,
            priority,
            dueDate,
            startDate,
            types,
            status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create task");

      alert("Task created successfully ✅");
      navigate("/taskPage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 ">
      <span
        className="p-4 text-cyan-50  flex items-start"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft />
      </span>
      <div className="flex justify-center items-center min-h-screen bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 shadow rounded-lg p-6 w-96 flex flex-col gap-4"
        >
          <h1 className="text-xl font-bold text-white">Create New Task</h1>

          {error && <p className="text-red-500">{error}</p>}

          <input
            type="text"
            placeholder="Task Title"
            className="border border-white bg-transparent text-white p-2 rounded "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="border border-white bg-transparent text-white p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border border-white bg-transparent text-white p-2 rounded"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          >
            <option value="">-- Select Project --</option>
            {loadingProjects ? (
              <option disabled>Loading projects...</option>
            ) : (
              projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.name}
                </option>
              ))
            )}
          </select>

          <select
            className="border border-white text-white p-2 rounded"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">-- Assign To (optional) --</option>
            {loadingMembers ? (
              <option disabled>Loading members...</option>
            ) : (
              projectMembers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))
            )}
          </select>

          <select
            className="border border-white bg-transparent text-white p-2 rounded"
            value={types}
            onChange={(e) => setTypes(e.target.value)}
            required
          >
            <option value="">-- Select Type --</option>
            <option value="Support">Support</option>
            <option value="Training">Training</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Production">Production</option>
            <option value="R&D">R&D</option>
          </select>

          <select
            className="border border-white bg-transparent text-white p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">-- Select Status --</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="border border-white bg-transparent text-white p-2 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="">-- Select Priority --</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            className="border border-white bg-transparent text-white p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border border-white bg-transparent text-white p-2 rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-700 border border-white text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
