import { Link, Outlet, NavLink } from "react-router-dom";
import "../index.css";

export default function Layout() {
  return (
    <div className="app-layout">
      {/* Background */}
      <div className="bg-watermark" aria-hidden="true"></div>

      {/* Content */}
      <div className="content">
        {/* Navbar */}
        <header className="navbar">
          <img src="/foto.jpg" alt="Logo" className="logo" />
          <h1 className="job-board-title">JOB BOARD</h1>
          <nav className="top-menu">
            <Link to="/jobs">Jobs</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Login</Link>
          </nav>
        </header>

        {/* Pages */}
        <main className="main">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} Student Project</p>
        </footer>
      </div>
    </div>
  );
}