import { Routes, Route, Outlet } from "react-router";
import MainLayout from "./layouts/mainLayout";
import AdminDashboard from "./pages/adminDashboard";
import UserDashboard from "./pages/userDashboard";
import TaskPage from "./pages/taskPage";
import WorkLog from "./pages/workLog";
import Login from "./pages/login";
import CreateUser from "./pages/createUser";

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
      </Route>
    </Routes>
  );
}

export default App;
