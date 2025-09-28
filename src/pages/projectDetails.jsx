import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
    members: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const token = localStorage.getItem("token");

  // fetch project, tasks, and users
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
          members: data.members.map((m) => m._id),
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
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow rounded p-6 mb-6">
        {editing ? (
          <div className="flex flex-col gap-3">
            <input
              name="name"
              value={formData.name}
              onChange={handleEditChange}
              className="border p-2 rounded w-full"
              placeholder="Project Name"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleEditChange}
              className="border p-2 rounded w-full"
              placeholder="Description"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleEditChange}
              className="border p-2 rounded w-full"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Members checkboxes */}
            <div>
              <p className="font-semibold">Members:</p>
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
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-sky-700">{project.name}</h1>
            <p>{project.description}</p>
            <p>
              Status:{" "}
              <span
                className={`px-2 py-1 rounded text-white ${
                  project.status === "pending"
                    ? "bg-yellow-500"
                    : project.status === "in-progress"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
              >
                {project.status}
              </span>
            </p>
            <p>
              Created By: {project.createdBy?.firstName}{" "}
              {project.createdBy?.lastName}
            </p>
            <p>
              Created At: {new Date(project.createdAt).toLocaleDateString()}
            </p>

            {/* نمایش اعضای پروژه */}
            <div>
              <p className="font-semibold">Members:</p>
              {project.members && project.members.length > 0 ? (
                <ul className="list-disc list-inside">
                  {project.members.map((m) => (
                    <li key={m._id}>
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={tasks.length > 0}
                className={`px-4 py-2 rounded ${
                  tasks.length > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
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
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks for this project.</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Assigned To</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{task.title}</td>
                  <td className="border px-4 py-2">
                    {task.assignedUserName || "Unassigned"}
                  </td>
                  <td className="border px-4 py-2">{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
