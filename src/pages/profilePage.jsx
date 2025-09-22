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
    <div className="p-6 max-w-md mx-auto bg-black shadow rounded">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {/* Update Name */}
      <input
        type="text"
        value={user?.firstName || ""}
        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        className="border p-2 rounded w-full mb-3 bg-amber-50 text-gray-700"
      />
      {/* Update Name */}
      <input
        type="text"
        value={user?.lastName || ""}
        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
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
