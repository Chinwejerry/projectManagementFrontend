//createUser.jsx
import { useState } from "react";
import { ArrowBigLeft } from "lucide-react";

const CreateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [weeklyCapacityHours, setWeeklyCapacityHours] = useState(40);
  const [skillLevel, setSkillLevel] = useState("junior");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in as admin first");
        window.location.href = "/login";
        return;
      }

      const res = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            role,
            technicalSkills,
            weeklyCapacityHours,
            skillLevel,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create user");
      }

      const data = await res.json();
      console.log("Created user:", data);

      alert("User created successfully ✅");
      window.location.href = "/usersPage";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillChange = (skill) => {
    if (technicalSkills.includes(skill)) {
      setTechnicalSkills(technicalSkills.filter((s) => s !== skill));
    } else {
      setTechnicalSkills([...technicalSkills, skill]);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 ">
      <span
        className="p-4 text-cyan-50 flex items-start"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft />
      </span>
      <div className="flex justify-center bg-gray-100 items-center min-h-screen p-4">
        <form
          onSubmit={handleSubmit}
          className="text-white bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 z-50 shadow rounded-lg p-6 w-80 flex flex-col gap-4"
        >
          <h1 className="text-xl font-bold text-white">Create New User</h1>
          {error && <p className="text-red-500">{error}</p>}

          <input
            type="text"
            placeholder="First Name"
            className="border text-white p-2 rounded border-white bg-transparent"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border border-white text-white bg-transparent p-2 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-white text-white bg-transparent p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-white text-white bg-transparent p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="border border-white bg-transparent p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

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

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 z-50 border border-white text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
