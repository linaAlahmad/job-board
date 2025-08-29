import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/");

        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization:`Bearer ${token}`},
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          return navigate("/");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
   

      <div>
        <div className="user-card">
          <h2>User Profile</h2>

          {user ? (
            <>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </>
          ) : (
            <p className="profile-error">Could not load user data.</p>
          )}

          <div className="profile-buttons">


            <Link to="/jobs">
              <button type="button">Go to Jobs</button>
            </Link>

            <Link to="/search">
              <button type="button">Search Jobs</button>
            </Link>

            {user?.role === "user" && (
           <Link to="/my-applications">
              <button type="button">My Applications</button>
           </Link>
            )}

           {/* زر للأدمن */}
            {user?.role === "admin" && (
           <Link to="/admin">
              <button type="button">Admin Dashboard</button>
           </Link>
            )}

            <button type="button" onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
   
  );
}

export default Profile;