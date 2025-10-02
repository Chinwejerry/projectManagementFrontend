import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [weeklyCapacityHours, setWeeklyCapacityHours] = useState(40);
  const [skillLevel, setSkillLevel] = useState("junior");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://projectmanegerbackend-1.onrender.com/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch user");
        }

        const data = await response.json();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setRole(data.role || "user");
        setTechnicalSkills(data.technicalSkills || []);
        setWeeklyCapacityHours(data.weeklyCapacityHours || 40);
        setSkillLevel(data.skillLevel || "junior");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSkillChange = (skill) => {
    if (technicalSkills.includes(skill)) {
      setTechnicalSkills(technicalSkills.filter((s) => s !== skill));
    } else {
      setTechnicalSkills([...technicalSkills, skill]);
    }
  };

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://projectmanegerbackend-1.onrender.com/api/users/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            role,
            technicalSkills,
            weeklyCapacityHours,
            skillLevel,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update user");
      }

      alert("User updated successfully!");
      navigate("/usersPage");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-4">Loading user...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800">
      <span
        className="p-4 text-cyan-50 flex items-start"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft />
      </span>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 z-50 p-6 rounded-2xl shadow w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4">Edit User</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Email (read-only)
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border rounded p-2 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Technical Skills */}
            <div className="flex flex-col">
              <label className="mb-1">Technical Skills</label>
              <div className="flex flex-wrap gap-2">
                {[
                  "tester",
                  "backend programmer",
                  "frontend programmer",
                  "UI/UX",
                  "DevOps",
                  "R&D",
                  "Other",
                ].map((skill) => (
                  <label key={skill} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={technicalSkills.includes(skill)}
                      onChange={() => handleSkillChange(skill)}
                    />
                    <span className="text-white">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Weekly Capacity */}
            <input
              type="number"
              placeholder="Weekly Capacity (hours)"
              className="border border-white text-white bg-transparent p-2 rounded"
              value={weeklyCapacityHours}
              onChange={(e) => setWeeklyCapacityHours(Number(e.target.value))}
              min={1}
              max={168}
            />

            {/* Skill Level */}
            <select
              className="border border-white bg-transparent p-2 rounded"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="expert">Expert</option>
            </select>

            <div className="flex justify-between">
              <Link
                to="/usersPage"
                className="px-4 py-2 rounded bg-sky-700 hover:bg-gray-400"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 py-2 rounded text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
