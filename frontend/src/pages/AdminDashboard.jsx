import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    title: "",
    company_id: "",
    location: "",
    salary: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // guard بسيط بالواجهة
  useEffect(() => {
    if (!token || user.role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [navigate, token, user.role]);

  async function loadJobs() {
    const res = await fetch("http://localhost:5000/api/admin/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("Failed to load jobs", res.status);
      return;
    }
    const data = await res.json();
    setJobs(data.jobs || []);
  }

  async function loadApplications() {
    const res = await fetch("http://localhost:5000/api/admin/applications", {
      headers: { Authorization:` Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("Failed to load applicants", res.status);
      return;
    }
    const data = await res.json();
    setApplications(data.applications || []);
  }

  useEffect(() => {
    loadJobs();
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveJob(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/admin/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || "Failed to add job");
        return;
      }

      // clear form + reload lists
      setForm({ title: "", company_id: "", location: "", salary: "", description: "" });
      await loadJobs();
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="center-page">
      <section className="modal-card">
        <h2>Admin Dashboard</h2>

        {/* Add Job */}
        <form className="grid" onSubmit={saveJob}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Company"
            value={form.company_id}
            onChange={(e) => setForm({ ...form, company_id: e.target.value })}
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            placeholder="Salary"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Job"}
          </button>
        </form>

        {/* Jobs List */}
        <h3>Jobs List</h3>
        <ul className="job-grid">
          {jobs.map((j) => (
            <li className="job-card" key={j.id}>
              <h4>{j.title}</h4>
              <p>{j.company_id} — {j.location}</p>
              <p>{j.salary}</p>
              {/* لو حابة نضيف Edit/Delete لاحقًا */}
            </li>
          ))}
          {jobs.length === 0 && <p>No jobs yet.</p>}
        </ul>

        {/* Applicants */}
       <h3>Applicants</h3>
<table className="applicants-table">
  <thead>
    <tr>
      <th>#</th>
      <th>User</th>
      <th>Email</th>
      <th>Job</th>
      <th>Company</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {applications.length > 0 ? (
      applications.map((a, i) => (
        <tr key={a.application_id}>
          <td>{i + 1}</td>
          <td>{a.user_name}</td>
          <td>{a.user_email}</td>
          <td>{a.job_title}</td>
          <td>{a.company_id}</td>
          <td>{a.status || "Pending"}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" style={{ textAlign: "center" }}>
          No applicants yet.
        </td>
      </tr>
    )}
  </tbody>
</table>
        
      </section>
    </main>
  );
}