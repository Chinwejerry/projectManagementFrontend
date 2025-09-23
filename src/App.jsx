//َApp.jsx
import { Routes, Route, Outlet } from "react-router";
import MainLayout from "./layouts/mainLayout";
import AdminDashboard from "./pages/adminDashboard";
import UserDashboard from "./pages/userDashboard";
import TaskPage from "./pages/taskPage";
import TaskDetail from "./pages/taskDetail"; // اضافه شد
import WorkLog from "./pages/workLog";
import Login from "./pages/login";
import CreateUser from "./pages/createUser";
import UsersPage from "./pages/usersPage";
import Projects from "./pages/projects";
import CreateProject from "./pages/createProject.jsx";
import EditUserPage from "./pages/edit.jsx";
import CreateTask from "./pages/createTask.jsx";
import ProfilePage from "./pages/profilePage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Login />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/taskPage" element={<TaskPage />} />
        <Route path="/taskDetail/:id" element={<TaskDetail />} />
        <Route path="/workLog" element={<WorkLog />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/usersPage" element={<UsersPage />} />
        <Route path="/profilePage" element={<ProfilePage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/createProject" element={<CreateProject />} />
        <Route path="/edit/:id" element={<EditUserPage />} />
        <Route path="/createTask" element={<CreateTask />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
