import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/mainLayout";

import AdminDashboard from "./pages/adminDashboard";
import UserDashboard from "./pages/userDashboard";
import TaskPage from "./pages/taskPage";
import TaskDetail from "./pages/taskDetail";
import WorklogForm from "./pages/workLog";
import Login from "./pages/login";
import CreateUser from "./pages/createUser";
import UsersPage from "./pages/usersPage";
import Projects from "./pages/projects";
import CreateProject from "./pages/createProject.jsx";
import EditUserPage from "./pages/edit.jsx";
import CreateTask from "./pages/createTask.jsx";
import ProfilePage from "./pages/profilePage";
//import { useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children, role }) {
  // read from localStorage
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // 1️⃣ check if logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2️⃣ check role if specified
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ all good, show the page
  return children;
}

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Login as index */}
        <Route index element={<Login />} />

        {/* USER ROUTES */}
        <Route
          path="/userDashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/taskPage"
          element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/taskDetail/:id"
          element={
            <ProtectedRoute role="user">
              <TaskDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="//tasks/:taskId/worklog"
          element={
            <ProtectedRoute role="user">
              <WorklogForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profilePage"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createUser"
          element={
            <ProtectedRoute role="admin">
              <CreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usersPage"
          element={
            <ProtectedRoute role="admin">
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createProject"
          element={
            <ProtectedRoute role="admin">
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute role="admin">
              <EditUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createTask"
          element={
            <ProtectedRoute role="admin">
              <CreateTask />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}

        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
