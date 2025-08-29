import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // جلب قائمة الوظائف
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    })();
  }, []);

  // فتح وظيفة (يجلب التفاصيل ثم يفتح المودال)
  const openJob = useCallback(async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelectedJob(data.job || null);
      setIsOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedJob(null);
  };

  const goApply = () => {
    if (selectedJob) navigate(`/apply/${selectedJob.id}`);
  };

  // ✅ إذا جينا من صفحة Search مع state { openJobId } افتح المودال تلقائيًا
  useEffect(() => {
    const id = location.state?.openJobId;
    if (!id) return;
    openJob(id);
    // امسح state حتى ما يُعاد الفتح عند الرجوع/التحديث
    navigate(".", { replace: true, state: {} });
  }, [location.state, navigate, openJob]);

  return (
    <>
      <h2>Available Jobs</h2>

      <ul className="job-grid">
        {jobs.map((job) => (
          <li
            className="job-card"
            key={job.id}
            onClick={() => openJob(job.id)}
            style={{ cursor: "pointer" }}
          >
            <h3>{job.company_name}</h3>
            <p><strong>{job.title}</strong></p>
            <p>{job.location}</p>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {isOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {loading || !selectedJob ? (
              <p>Loading…</p>
            ) : (
              <>
                <h2>{selectedJob.title}</h2>
                <p><strong>Company:</strong> {selectedJob.company_name}</p>
                <p><strong>Location:</strong> {selectedJob.location}</p>
                <p><strong>Salary:</strong> {selectedJob.salary}</p>
                {selectedJob.description && <p>{selectedJob.description}</p>}
                {selectedJob.company_description && (
                  <p style={{ opacity: 0.9 }}>
                    <em>{selectedJob.company_description}</em>
                  </p>
                )}
                <div className="modal-buttons">
                  <button onClick={closeModal}>Close</button>
                  <button onClick={goApply}>Apply</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}