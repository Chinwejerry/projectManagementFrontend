import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://projectmanegerbackend-1.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await res.json();

      // save token (and maybe user info) in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ token: data.token, ...data })
      );

      localStorage.setItem("role", data.role);

      // redirect to dashboard or users page

      if (data.role === "admin") {
        navigate("/adminDashboard"); // 👈 admin’s landing page
      } else {
        navigate("/userDashboard"); // 👈 regular user’s landing page
      }
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
        className="bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800  z-50 shadow rounded-lg p-6 w-80 flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold">Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="border bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 z-50 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
