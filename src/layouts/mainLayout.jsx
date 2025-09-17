import { Outlet } from "react-router";
import NavBar from "../components/navBar";
import Footer from "../components/footer";

const MainLayout = () => {
  return (
    <div>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
