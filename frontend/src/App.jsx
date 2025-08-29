// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import Apply from "./pages/Apply";
import SearchJobs from "./pages/SearchJobs";
import MyApplications from "./pages/MyApplications";
import AdminDashboard from "./pages/AdminDashboard";

function Protected({ children }) {
  const token = localStorage.getItem("token"); // يُقرأ عند كل رندر
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* العامة */}
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* المحمية */}
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/jobs" element={<Protected><Jobs /></Protected>} />
          <Route path="/apply/:id?" element={<Protected><Apply /></Protected>} />
          <Route path="/search" element={<Protected><SearchJobs /></Protected>} />
          <Route path="/my-applications" element={<Protected><MyApplications /></Protected>} />
          <Route path="/admin" element={<Protected><AdminDashboard /></Protected>} />

          {/* أي رابط خاطئ */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}