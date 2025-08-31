import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try { data = await res.json(); } catch (err) {console.error("JSON parse error:", err)};

      const token = data.token || data.accessToken || data?.data?.token;
      const user = data.user;

      if (res.ok && token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // redirect by role
        if (user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/profile", { replace: true });
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert(data.message || `Login failed (status ${res.status})`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <button type="button" onClick={() => navigate("/register")}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}