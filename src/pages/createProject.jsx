import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  //const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load users");
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // const handleMemberChange = (e) => {
  //   const value = Array.from(
  //     e.target.selectedOptions,
  //     (option) => option.value
  //   );
  //   setSelectedMembers(value);
  // };

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
            startDate,
            endDate,
            type,
            members: selectedMembers,
            attachments: [],
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      alert("Project created successfully ✅");
      navigate("/projects");
    } catch (err) {
      console.error("Create project error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800">
      <span
        className="p-4 text-cyan-50 flex items-start"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft />
      </span>
      <div className="flex justify-center items-center min-h-screen bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 z-50 shadow rounded-lg p-6 w-96 flex flex-col gap-4"
        >
          <h1 className="text-xl font-bold text-white">Create New Project</h1>

          {error && <p className="text-red-500">{error}</p>}

          <input
            type="text"
            placeholder="Project Name"
            className="border border-white text-white bg-transparent p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="border border-white text-white bg-transparent p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="text-white">Start Date</label>
          <input
            type="date"
            className="border border-white bg-transparent text-white p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label className="text-white">Due Date</label>
          <input
            type="date"
            className="border border-white bg-transparent text-white p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {/* NEW: Type dropdown */}
          <select
            className="border border-white text-white bg-transparent p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">-- Select Type --</option>
            <option value="Support">Support</option>
            <option value="Training">Training</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Production">Production</option>
            <option value="R&D">R&D</option>
          </select>

          {/* Status dropdown */}
          <select
            className="border border-white text-white bg-transparent p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">-- Select Status --</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <label className="text-white">Select Members:</label>
          <div className="flex flex-col max-h-40 text-black overflow-y-auto border p-2 rounded bg-sky-300">
            {loadingUsers ? (
              <p>Loading users...</p>
            ) : (
              users.map((user) => (
                <label key={user._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={selectedMembers.includes(user._id)}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (e.target.checked) {
                        setSelectedMembers([...selectedMembers, value]);
                      } else {
                        setSelectedMembers(
                          selectedMembers.filter((id) => id !== value)
                        );
                      }
                    }}
                  />
                  {user.firstName} {user.lastName}
                </label>
              ))
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-700 border border-white text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
//here
