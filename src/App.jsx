import { Routes, Route, Outlet } from "react-router";
import MainLayout from "./layouts/mainLayout";
import AdminDashboard from "./pages/adminDashboard";
import UserDashboard from "./pages/userDashboard";
import TaskPage from "./pages/taskPage";
import WorkLog from "./pages/workLog";
import Login from "./pages/login";
import CreateUser from "./pages/createUser";
import ProjectsPage from "./pages/projects";
import UsersPage from "./pages/usersPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/taskPage" element={<TaskPage />} />
        <Route path="/workLog" element={<WorkLog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/usersPage" element={<UsersPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
