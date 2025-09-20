import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in as admin first");
        navigate("/login");
        return;
      }

      const res = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            status,
            members: [], // can add later
            attachments: [], // can add later
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      await res.json();

      alert("Project created successfully ✅");
      navigate("/projects"); // return to projects page
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
        <h1 className="text-xl font-bold text-white">Create New Project</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Project Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="planning">Planning</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
