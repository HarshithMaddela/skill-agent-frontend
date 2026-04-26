import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { BsStars } from "react-icons/bs";

function Result({ data }) {
  const skills = data.skills || [];

  const overallScore =
    skills.length > 0
      ? Math.round(
          (skills.reduce((sum, s) => sum + s.score, 0) / skills.length) * 10,
        )
      : 0;

  const insight =
    overallScore > 75
      ? "Strong match! You're job-ready."
      : overallScore > 50
        ? "⚡ Moderate match. Improve key skills."
        : "📚 Focus on fundamentals to improve.";

  const renderLearningPlan = (text) => {
    // 🔥 FIX: Added a filter to ignore the redundant AI introductory text
    const blocks = text.split(/\n\n|(?=👉|📌)/).filter((b) => {
      const trimmed = b.trim();
      return (
        trimmed !== "" && !trimmed.includes("Personalized Learning Roadmap")
      );
    });

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return (
      <div style={styles.planGrid}>
        {blocks.map((block, index) => {
          const lines = block.split("\n").filter((l) => l.trim() !== "");

          return (
            <div key={index} style={styles.resourceCard}>
              {lines.map((line, i) => {
                const hasLink = urlRegex.test(line);

                if (hasLink) {
                  const parts = line.split(urlRegex);
                  return (
                    <div key={i} style={{ marginTop: "16px" }}>
                      {parts.map((part, k) =>
                        part.match(urlRegex) ? (
                          <a
                            key={k}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.primaryLinkButton}
                          >
                            📚 Open Resource
                          </a>
                        ) : (
                          <span key={k}>{part.replace(/📚/g, "")}</span>
                        ),
                      )}
                    </div>
                  );
                }

                if (i === 0) {
                  return (
                    <h4 key={i} style={styles.resourceTitle}>
                      {line}
                    </h4>
                  );
                }

                return (
                  <p key={i} style={styles.resourceText}>
                    {line}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={styles.glassContainer}>
      <h2 style={styles.heading}>
        <BsStars color="var(--accent)" style={{ marginRight: "10px" }} />
        Assessment Results
      </h2>

      <div style={styles.topLayout}>
        <div style={styles.leftColumn}>
          <div style={styles.summaryCard}>
            <h3 style={{ color: "var(--text)", marginBottom: "10px" }}>
              Overall Match
            </h3>
            <p style={styles.bigScore}>{overallScore}%</p>
            <p style={{ color: "var(--text-secondary)" }}>{insight}</p>
          </div>

          <div style={styles.chartBox}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={skills}>
                <PolarGrid stroke="var(--text-secondary)" opacity={0.3} />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                />
                <Radar
                  dataKey="score"
                  stroke="var(--accent)"
                  fill="var(--accent)"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.rightColumn}>
          <h3 style={styles.subHeading}>Skill Breakdown</h3>
          <div style={styles.skillsGrid}>
            {skills.map((skill, index) => (
              <div
                key={index}
                style={styles.glassCard}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, styles.glassCardHover)
                }
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.05)";
                }}
              >
                <h3 style={styles.skillName}>{skill.name}</h3>

                <div style={styles.stats}>
                  <span style={styles.badge}>{skill.level}</span>
                  <span style={styles.score}>{skill.score}/10</span>
                </div>

                <div style={styles.progressBg}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${skill.score * 10}%`,
                      background:
                        skill.score >= 7
                          ? "linear-gradient(90deg, #10b981, #34d399)"
                          : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.learningPlan && (
        <div style={styles.planSection}>
          <h3 style={styles.planHeading}>🚀 Recommended Learning Path</h3>
          {renderLearningPlan(data.learningPlan)}
        </div>
      )}
    </div>
  );
}

const styles = {
  glassContainer: {
    background: "var(--card)",
    padding: "clamp(20px, 5vw, 40px)",
    borderRadius: "24px",
    marginTop: "20px",
    width: "100%",
    maxWidth: "1200px",
    margin: "20px auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    boxSizing: "border-box",
  },

  heading: {
    textAlign: "center",
    marginBottom: "clamp(20px, 5vw, 40px)",
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
    color: "var(--text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  topLayout: {
    display: "flex",
    flexWrap: "wrap",
    gap: "clamp(20px, 4vw, 40px)",
    marginBottom: "40px",
  },

  leftColumn: {
    flex: "1 1 min(100%, 300px)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  rightColumn: {
    flex: "2 1 min(100%, 500px)",
  },

  subHeading: {
    color: "var(--text)",
    marginBottom: "20px",
    fontSize: "1.4rem",
  },

  summaryCard: {
    textAlign: "center",
    padding: "clamp(20px, 4vw, 30px)",
    background: "var(--card-hover)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  bigScore: {
    fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
    fontWeight: "bold",
    color: "var(--accent)",
    margin: "10px 0",
  },

  chartBox: {
    width: "100%",
    height: "300px",
    background: "var(--card-hover)",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
    boxSizing: "border-box",
  },

  skillsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: "16px",
  },

  glassCard: {
    background: "var(--card-hover)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.05)",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    cursor: "default",
  },

  glassCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    borderColor: "var(--accent-soft)",
  },

  skillName: {
    marginBottom: "12px",
    color: "var(--text)",
    fontSize: "1.1rem",
  },

  stats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },

  badge: {
    background: "var(--accent-soft)",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "var(--text)",
  },

  score: {
    color: "var(--text-secondary)",
    fontWeight: "500",
  },

  progressBg: {
    width: "100%",
    height: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "5px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "5px",
    transition: "width 1s ease-out",
  },

  planSection: {
    marginTop: "40px",
    paddingTop: "40px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },

  planHeading: {
    color: "var(--accent)",
    marginBottom: "24px",
    fontSize: "clamp(1.3rem, 4vw, 1.6rem)",
    textAlign: "center",
  },

  planGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
    gap: "24px",
  },

  resourceCard: {
    background: "var(--card-hover)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  resourceTitle: {
    color: "var(--text)",
    fontSize: "1.2rem",
    marginBottom: "12px",
    fontWeight: "600",
  },

  resourceText: {
    color: "var(--text-secondary)",
    lineHeight: "1.6",
    fontSize: "0.95rem",
    marginBottom: "8px",
  },

  primaryLinkButton: {
    display: "block",
    textAlign: "center",
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(0, 255, 200, 0.1)",
    border: "1px solid rgba(0, 255, 200, 0.3)",
    color: "#00f5d4",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    marginTop: "auto",
  },
};

export default Result;
