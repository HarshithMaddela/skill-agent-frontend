import React from "react";

function JobDescription({ setJobDescription }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h3
        style={{
          marginBottom: "12px",
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "var(--text)",
        }}
      >
        Job Description
      </h3>

      <textarea
        className="job-textarea"
        rows="6"
        placeholder="Paste the job requirements here... (skills, tools, etc.)"
        onChange={(e) => setJobDescription(e.target.value)}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  );
}

export default JobDescription;
