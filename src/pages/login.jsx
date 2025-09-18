import React from "react";

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[url(images/1.png)] bg-no-repeat bg-center bg-cover p-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-sm p-5">
        <h2 className="card-title text-center mb-4">Login</h2>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
