import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) return navigate("/");
        const data = await res.json();
        setApps(data.applications || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [navigate]);

  // يفتح المودال في صفحة Jobs
  const openInJobs = (jobId) => {
    navigate("/jobs", { state: { openJobId: jobId } });
  };

  return (
    <main className="center-page">
      <section className="modal-card">
        <h2>My Job Applications</h2>

        {apps.length === 0 && <p>No applications yet.</p>}

        <ul className="job-grid">
          {apps.map((a) => (
            <li
              className="job-card"
              key={a.application_id}
              onClick={() => openInJobs(a.job_id)}
              style={{ cursor: "pointer" }}
            >
              <h3>{a.title}</h3>
              <p>{a.company_name ?? a.company_id} — {a.location}</p>
              <p>Status: {a.status || "pending"}</p>

              {/* زر/رابط صريح (اختياري) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // ما يفعّل onClick تبع الكرت
                  openInJobs(a.job_id);
                }}
                
              >
                View Job Details
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}