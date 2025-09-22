import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        navigate("/login");
        return;
      }

      const payload = parseJwt(token);
      if (!payload) {
        navigate("/login");
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
      if (newPassword) updateData.password = newPassword; // only send if provided

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

      if (!res.ok) throw new Error("Failed to update profile");

      alert("Profile updated ✅");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-black shadow rounded">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {/* Update Name */}
      <input
        type="text"
        value={user?.firstName || ""}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        className="border p-2 rounded w-full mb-3 bg-amber-50 text-gray-700"
      />
      {/* Update Name */}
      <input
        type="text"
        value={user?.lastName || ""}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        className="border p-2 rounded w-full mb-3 bg-amber-50 text-gray-700"
      />

      {/* Email - read only */}
      <input
        type="email"
        value={user?.email || ""}
        disabled
        className="border p-2 rounded w-full mb-3 bg-amber-50 text-gray-700 "
      />

      {/* Change Password */}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border p-2 rounded w-full mb-3 bg-amber-50 text-gray-300"
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border p-2 rounded w-full mb-3 bg-amber-50 text-gray-300"
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProfilePage;
