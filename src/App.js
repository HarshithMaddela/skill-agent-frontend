import React, { useState, useEffect } from "react";
import UploadResume from "./components/UploadResume";
import JobDescription from "./components/JobDescription";
import Result from "./components/Result";
import axios from "axios";
import "./App.css";

import { FiSun, FiMoon, FiTarget } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

// Fun messages to show while the user is waiting!
const loadingMessages = [
  "Scanning resume...",
  "Extracting keywords...",
  "Evaluating experience...",
  "Matching to job...",
  "Running AI models...",
  "Finalizing results...",
];

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyze Resume");
  const [isDark, setIsDark] = useState(true);

  // Apply theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  // Cycle through loading messages while loading is true
  useEffect(() => {
    let interval;
    if (loading) {
      let i = 0;
      setLoadingText(loadingMessages[0]);
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[i]);
      }, 1200); // Changes text every 1.2 seconds
    } else {
      setLoadingText("Analyze Resume");
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async () => {
    if (!file || !jobDescription) {
      alert("Please upload your resume and enter a job description!🚨");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);

      // 1. Calculate a random delay between 4000ms (4s) and 6000ms (6s)
      const randomDelay = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000;

      // 2. Create a dummy promise that just waits for that delay
      const delayPromise = new Promise((resolve) =>
        setTimeout(resolve, randomDelay),
      );

      // 3. Run BOTH the API call and the delay at the same time.
      // It won't move to the next line until BOTH are finished!
      const [res] = await Promise.all([
        axios.post(
          "https://skill-agent-backend-production.up.railway.app/api/analyze-pdf",
          formData,
        ),
        delayPromise,
      ]);

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Oops, backend error! Check your server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-mesh"></div>

      <div className="app-container">
        <div className="content-wrapper">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: "30px",
            }}
          >
            <h1
              className="text-gradient"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "2.8rem",
                fontWeight: 700,
                margin: 0,
              }}
            >
              <FiTarget size={36} color="var(--accent)" />
              Skill Assessment Agent
            </h1>

            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                padding: "10px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text)",
                transition: "all 0.3s ease",
              }}
              title="Toggle Theme"
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
          <div className="glass-card">
            <UploadResume setFile={setFile} />
            <JobDescription setJobDescription={setJobDescription} />

            <button
              className={`action-button ${loading ? "loading-pulse" : ""}`}
              style={{ opacity: loading ? 0.8 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <BsStars size={20} className={loading ? "spin-icon" : ""} />
                {loadingText}
              </span>
            </button>
          </div>
          {result && (
            <div className="fade-in">
              {/* ✅ Passed jobDescription here! */}
              <Result data={result} jobDescription={jobDescription} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
