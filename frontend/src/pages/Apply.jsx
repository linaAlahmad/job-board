import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Apply() {
  const [formData, setFormData] = useState({ name: "", email: "", cv: null });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("cv", formData.cv);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // لا تضيف Content-Type مع FormData
        body: data,
      });

      if (res.status === 401) return navigate("/");

      const result = await res.json();
      alert(result.message || "Application sent");
    } catch (err) {
      console.error(err);
      alert("Error sending application");
    }
  };

  return (
    <div className="login-page">
    
          <div className="login-container">
            <form className="login-box" onSubmit={ handleSubmit}>
    
    
               <h2>Apply for Job</h2>
     
               <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required />
               <input type="email" name="email" placeholder="Your Email" onChange={handleChange} required />
               <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleChange} required />
               <button type="button" onClick={() => navigate("/jobs")}>Apply</button>
               
           </form>
         </div>
    </div>
  );
};

export default Apply;