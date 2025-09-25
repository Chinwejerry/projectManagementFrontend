import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const CreateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
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
            password, // 🔑 required
            role, // optional
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

  return (
    <div className="flex justify-center bg-gray-100 items-center min-h-screen  p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-black text-black shadow rounded-lg p-6 w-80 flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold">Create New User</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="First Name"
          className="border p-2 rounded  bg-amber-50"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="border p-2 rounded  bg-amber-50"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded  bg-amber-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded  bg-amber-50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="border p-2 rounded  bg-amber-50"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
