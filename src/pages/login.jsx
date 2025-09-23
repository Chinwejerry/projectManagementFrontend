import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      localStorage.setItem("user", JSON.stringify(data));

      // redirect to dashboard or users page
      window.location.href = "/adminDashboard";
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
        className="bg-black shadow rounded-lg p-6 w-80 flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold">Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded bg-amber-50 text-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded bg-amber-50 text-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
