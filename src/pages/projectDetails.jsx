import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowBigLeft } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    startDate: "",
    endDate: "",
    members: [],
    estimatedDurationHours: 0, // ← اضافه شد
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(
          `https://projectmanegerbackend-1.onrender.com/api/projects/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProject(data);
        setFormData({
          name: data.name,
          description: data.description,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          members: data.members.map((m) => m._id),
          estimatedDurationHours: data.estimatedDurationHours || 0, // ← اضافه شد
        });
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(
          `https://projectmanegerbackend-1.onrender.com/api/tasks?projectId=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data } = await axios.get(
          `https://projectmanegerbackend-1.onrender.com/api/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchProject();
    fetchTasks();
    fetchUsers();
  }, [id, token]);

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberToggle = (userId) => {
    setFormData((prev) => {
      const newMembers = prev.members.includes(userId)
        ? prev.members.filter((id) => id !== userId)
        : [...prev.members, userId];
      return { ...prev, members: newMembers };
    });
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put(
        `https://projectmanegerbackend-1.onrender.com/api/projects/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(data);
      setEditing(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDelete = async () => {
    if (tasks.length > 0) {
      alert("Cannot delete project because it has tasks!");
      return;
    }
    try {
      await axios.delete(
        `https://projectmanegerbackend-1.onrender.com/api/projects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (!project) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800">
      <span
        className="p-4 text-cyan-50 flex items-start"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft />
      </span>
      <div className="flex flex-col min-h-screen bg-gray-100 p-4 space-y-3">
        <div className="card bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 z-50 w-96 md:w-[100%] shadow rounded-lg p-6 flex flex-col gap-4">
          {editing ? (
            <div className="flex flex-col gap-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleEditChange}
                className="border border-white text-white p-2 rounded w-full"
                placeholder="Project Name"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleEditChange}
                className="border border-white text-white p-2 rounded w-full"
                placeholder="Description"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleEditChange}
                className="border border-white text-white p-2 rounded w-full"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {/* Estimated Duration */}
              <input
                type="number"
                min="0"
                name="estimatedDurationHours"
                value={formData.estimatedDurationHours}
                onChange={handleEditChange}
                className="border border-white text-white p-2 rounded w-full"
                placeholder="Estimated Duration Hours"
              />

              {/* Members checkboxes */}
              <div>
                <p className="font-semibold text-white">Members:</p>
                {loadingUsers ? (
                  <p>Loading users...</p>
                ) : (
                  allUsers.map((user) => (
                    <label key={user._id} className="block">
                      <input
                        type="checkbox"
                        checked={formData.members.includes(user._id)}
                        onChange={() => handleMemberToggle(user._id)}
                        className="mr-2"
                      />
                      {user.firstName} {user.lastName} ({user.email})
                    </label>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <p className="text-white">{project.description}</p>
              <p>
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${
                    project.status === "pending"
                      ? "bg-pink-500"
                      : project.status === "in-progress"
                      ? "bg-purple-500"
                      : "bg-green-500"
                  }`}
                >
                  {project.status}
                </span>
              </p>
              <p className="text-white">
                Created By: {project.createdBy?.firstName}{" "}
                {project.createdBy?.lastName}
              </p>
              <p className="text-white">
                Created At: {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <p className="white">
                Start Date: {new Date(project.startDate).toLocaleDateString()}
              </p>
              <p className="white">
                End Date: {new Date(project.endDate).toLocaleDateString()}
              </p>
              <p className="white">
                Estimated Duration: {project.estimatedDurationHours} hours
              </p>

              <div>
                <p className="font-semibold text-white">Members:</p>
                {project.members && project.members.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {project.members.map((m) => (
                      <li key={m._id} className="text-white">
                        {m.firstName} {m.lastName} ({m.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No members assigned</p>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={tasks.length > 0}
                  className={`px-4 py-2 rounded ${
                    tasks.length > 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-400 text-white hover:bg-red-700"
                  }`}
                >
                  Delete
                </button>
              </div>
              {tasks.length > 0 && (
                <p className="text-red-500 mt-2">
                  Project has tasks, cannot delete.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tasks List */}
        <div className="card bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 z-50 w-96 md:w-[100%] shadow rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-4 text-white">Tasks</h2>
          {tasks.length === 0 ? (
            <p>No tasks for this project.</p>
          ) : (
            <table className="table-auto w-full border-collapse border border-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-white border border-white px-4 py-2 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800">
                    Title
                  </th>
                  <th className="border text-white border-white px-4 py-2 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800">
                    Assigned To
                  </th>
                  <th className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 text-white border border-white px-4 py-2">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-sky-700">
                    <td className="border px-4 py-2 border-white">
                      {task.title}
                    </td>
                    <td className="border px-4 py-2 border-white">
                      {task.assignedUserName || "Unassigned"}
                    </td>
                    <td className="border px-4 py-2 border-white">
                      {task.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
