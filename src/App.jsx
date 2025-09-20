import { Routes, Route, Outlet } from "react-router";
import MainLayout from "./layouts/mainLayout";
import AdminDashboard from "./pages/adminDashboard";
import UserDashboard from "./pages/userDashboard";
import TaskPage from "./pages/taskPage";
import WorkLog from "./pages/workLog";
import Login from "./pages/login";
import CreateUser from "./pages/createUser";
import UsersPage from "./pages/usersPage";
import Projects from "./pages/projects";
import CreateProject from "./pages/createProject.jsx";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Login />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/taskPage" element={<TaskPage />} />
        <Route path="/workLog" element={<WorkLog />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/usersPage" element={<UsersPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/createProject" element={<CreateProject />} />
      </Route>
    </Routes>
  );
}

export default App;
