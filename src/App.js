import React, { useState, useEffect } from "react";
import UploadResume from "./components/UploadResume";
import JobDescription from "./components/JobDescription";
import Result from "./components/Result";
import axios from "axios";
import "./App.css";

import { FiSun, FiMoon } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

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

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  useEffect(() => {
    let interval;
    if (loading) {
      let i = 0;
      setLoadingText(loadingMessages[0]);
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[i]);
      }, 1200);
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

      const randomDelay = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000;
      const delayPromise = new Promise((resolve) =>
        setTimeout(resolve, randomDelay),
      );

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

      <header className="app-header">
        <div
          className="header-left"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <img
            src="/Logo.png"
            alt="Logo"
            style={{ height: "30px", width: "auto", objectFit: "contain" }}
          />
          <span className="header-logo-text text-gradient">
            Skill Assessment Agent
          </span>
        </div>

        <div className="header-right">
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
      </header>

      <div className="app-container">
        <div className="content-wrapper">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginBottom: "30px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <h1
              className="text-gradient"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                fontWeight: 700,
                margin: 0,
                textAlign: "center",
              }}
            >
              <BsStars
                size={36}
                color="var(--accent)"
                style={{ flexShrink: 0 }}
              />
              AI Resume Analysis
            </h1>
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
            <div className="fade-in" style={{ width: "100%" }}>
              <Result data={result} jobDescription={jobDescription} />
            </div>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span
              className="header-logo-text text-gradient"
              style={{ fontSize: "1.2rem" }}
            >
              Skill Assessment Agent
            </span>
          </div>
          <div className="footer-links">
            <a href="#about">About Us</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#support">Contact Support</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Skill Assessment Agent. All rights reserved. Made in India.
        </div>
      </footer>
    </>
  );
}

export default App;
