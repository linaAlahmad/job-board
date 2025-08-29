// frontend/src/pages/SearchJobs.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SearchJobs() {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("developer");
  const navigate = useNavigate();

  async function fetchJobs() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/jobs?q=${encodeURIComponent(keyword)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 401) return navigate("/");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="center-page">
      <section className="modal-card">
        <h2>Search Jobs</h2>

        <div className="search-row">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="frontend, backend, react..."
          />
          <button onClick={fetchJobs}>Search</button>
        </div>

        <div className="results">
          {jobs.map((job) => (
            <article className="job-item" key={job.id}>
              {/* ⇩⇩ هنا التغيير: نذهب إلى /jobs ونرسل openJobId عبر state */}
              <Link
                to="/jobs"
                state={{ openJobId: job.id }}
                className="job-link"
              >
                <h3 className="job-title">{job.title || "Untitled role"}</h3>
                <div className="job-meta">
                  <span>Company {job.company_name ?? job.company_id ?? "-"}</span>
                  <span>{job.location || "Location N/A"}</span>
                </div>
                {job.salary && <div className="job-salary">{job.salary}</div>}
              </Link>
            </article>
          ))}

          {jobs.length === 0 && (
            <p className="empty">No results. Try another keyword.</p>
          )}
        </div>
      </section>
    </main>
  );
}