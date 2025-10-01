//usersPage.jsx
import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  LogOut,
  Plus,
  Home,
  Folder,
  Users,
  ClipboardList,
  Settings,
  X,
} from "lucide-react";
import { Link } from "react-router";

const UsersPage = () => {
  const [users, setUsers] = useState([]); // state for users
  const [search, setSearch] = useState(""); // state for search
  const [loading, setLoading] = useState(true); // state for loading
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  // state for errors

  // Fetch users from backend API (mock example)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // after login, store it here
        const response = await fetch(
          "https://projectmanegerbackend-1.onrender.com/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized – please log in as an admin");
          }
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  // runs only once on component mount

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      (user.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (user.lastName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (user.role?.toLowerCase() || "").includes(search.toLowerCase())
  );
  // Handle loading and errors
  if (loading) return <p className="p-4">Loading users...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://projectmanegerbackend-1.onrender.com/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete user");
      }

      // Remove from state without refetch
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover text-cyan-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out 
           w-64 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 z-50`}
      >
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h1 className="text-2xl font-bold">Admin</h1>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <h1 className="hidden md:block text-2xl font-bold mb-6"> Admin</h1>
        <nav className="flex flex-col space-y-2 ">
          <Link
            to="/adminDashboard"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <Home size={18} /> Dashboard
          </Link>
          <Link
            to="/projects"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <Folder size={18} /> Projects
          </Link>
          <Link
            to="/usersPage"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <Users size={18} /> Users
          </Link>
          <Link
            to="/taskPage"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <ClipboardList size={18} /> Tasks
          </Link>
          <Link
            to="/messages"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <ClipboardList size={18} /> Messages
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 p-2 rounded hover:bg-sky-600"
          >
            <LogOut size={18} /> Logout
          </Link>
        </nav>
      </aside>
      {/* Page Header */}
      <div className="flex flex-col flex-1">
        <header className="flex flex-col sm:flex-row justify-between items-center  text-black shadow px-4 py-3 gap-3">
          <Link
            to="/adminDashboard"
            className="text-2xl font-bold flex items-center gap-2 text-sky-700"
          >
            Users
          </Link>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center border border-white  px-2 rounded w-full">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                className="bg-transparent outline-none p-1 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {user?.role === "admin" && (
              <Link
                to="/createUser"
                className="btn btn-primary flex items-center gap-2 bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 z-50"
              >
                <Plus size={16} /> Add Users
              </Link>
            )}
          </div>
        </header>
        {/* Users Table */}
        <main className="p-4 flex-1 overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="table w-full bg-gradient-to-r from-slate-600 via-sky-700 to-indigo-800 p-4 z-50 shadow rounded">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.status === "Active"
                            ? "badge-primary"
                            : "badge-accent"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      {/* <button className="btn btn-sm btn-outline btn-success flex items-center gap-1">
                      <Edit size={14} /> Edit
                    </button> */}
                      <Link
                        to={`/edit/${user._id}`}
                        className="btn btn-sm btn-outline btn-success flex items-center gap-1"
                      >
                        <Edit size={14} /> Edit
                      </Link>

                      <Link
                        className="btn btn-sm btn-outline btn-error flex items-center gap-1"
                        onClick={() => handleDelete(user._id)}
                      >
                        <Trash2 size={14} /> Delete
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
