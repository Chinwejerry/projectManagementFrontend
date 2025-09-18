import React from "react";

const CreateUser = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[url(images/1.png)]  bg-no-repeat bg-center bg-cover p-4">
      <form className="card bg-base-100 w-full max-w-lg shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Create User</h2>

        {/* Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Chinwe"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@mail.com"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Role (dropdown) */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Role</span>
          </label>
          <select
            className="select select-bordered w-full"
            name="role"
            required
          >
            <option value="" disabled selected>
              Select a role
            </option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="form-control">
          <button type="submit" className="btn btn-primary w-full">
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
