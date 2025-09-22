import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [types, setTypes] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // فرض بر اینه که پروژه‌ها و کاربران رو جداگانه از API بگیری و گزینه‌ها رو تو state ذخیره کنی
  // برای ساده بودن اینجا آرایه های ثابت استفاده کردم
  const projects = [
    { _id: "64f0c123456789abcdef1234", name: "Project A" },
    { _id: "64f0c123456789abcdef5678", name: "Project B" },
  ];
  const users = [
    { _id: "64f0d123456789abcdef4321", name: "Ali Reza" },
    { _id: "64f0d123456789abcdef8765", name: "Sara Ahmadi" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first");
        navigate("/login");
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
            types,
            status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        throw new Error(data.message || "Failed to create task");


      }

      alert("Task created successfully ✅");
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url(images/1.png)] bg-no-repeat bg-center bg-cover p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-black shadow rounded-lg p-6 w-96 flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-white">Create New Task</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"

          placeholder="Project Name"
          className="border p-2  text-gray-300 bg-amber-50 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}

          required
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded  text-gray-300 bg-amber-50"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select

          className="border p-2 rounded  text-gray-300 bg-amber-50"

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
          className="border p-2 rounded"
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
          className="border p-2 rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
