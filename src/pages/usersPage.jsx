import React, { useState } from "react";
import { Search, Edit, Trash2, UserCircle } from "lucide-react";

const initialUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@mail.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@mail.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@mail.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana@mail.com",
    role: "User",
    status: "Active",
  },
];

const UsersPage = () => {
  const [search, setSearch] = useState("");

  const filteredUsers = initialUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white shadow px-4 py-3 gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">Users</h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-gray-100 px-2 rounded w-full">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              className="bg-transparent outline-none p-1 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            <UserCircle size={16} /> Add User
          </button>
        </div>
      </header>

      {/* Users Table */}
      <main className="p-4 flex-1 overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="table w-full bg-base-100 shadow rounded">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
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
                    <button className="btn btn-sm btn-outline btn-success flex items-center gap-1">
                      <Edit size={14} /> Edit
                    </button>
                    <button className="btn btn-sm btn-outline btn-error flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
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
  );
};

export default UsersPage;
