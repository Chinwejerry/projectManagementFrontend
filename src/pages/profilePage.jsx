import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const payload = parseJwt(token);
      if (!payload) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch(
          `https://projectmanegerbackend-1.onrender.com/api/users/${payload.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const payload = parseJwt(token);

    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const updateData = { ...user };
      if (newPassword) updateData.password = newPassword;

      const res = await fetch(
        `https://projectmanegerbackend-1.onrender.com/api/users/${payload.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update profile");
      }

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token); // refresh after password change
      }

      setUser(data);
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      alert("Profile updated ✅");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 ">
      <span
        className="p-4 text-cyan-50  flex items-start"
        onClick={() => window.history.back()}
      >
        <ArrowBigLeft />
      </span>
      <div className="flex justify-center items-center bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover min-h-screen">
        <div className=" p-6 max-w-md mx-auto bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 shadow rounded">
          <h1 className="text-2xl font-bold mb-4 text-white">My Profile</h1>

          {/* Update Name */}
          <input
            type="text"
            value={user?.firstName || ""}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            className="border border-white text-white p-2 rounded w-full mb-3 "
          />
          {/* Update Name */}
          <input
            type="text"
            value={user?.lastName || ""}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            className="border border-white text-white p-2 rounded w-full mb-3 "
          />

          {/* Email - read only */}
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="border border-white text-white p-2 rounded w-full mb-3  "
          />

          {/* Change Password */}
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-white text-white p-2 rounded w-full mb-3 "
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border text-white border-white p-2 rounded w-full mb-3 "
          />

          <button
            onClick={handleUpdate}
            className="
            self-end border border-white bg-sky-700 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
