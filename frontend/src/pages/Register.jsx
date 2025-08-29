import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [role, setRole] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault(); // لو بتخليها داخل form
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
           alert(data?.message ||` HTTP ${res.status}`);
        return;
      }

      alert("Registered successfully");
      navigate("/"); // رجّعه للّوجين
    } catch (err) {
      console.error(err);
      alert("Registration error");
    }
  }

  return (

   
    <div>
      <h2>Register</h2>
      <form className="login-box" onSubmit={handleRegister}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* Role select */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
    
  );
}