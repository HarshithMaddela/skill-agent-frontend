/* Result.js */
import React from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
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
      ? " Strong match! You're job-ready."
      : overallScore > 50
        ? "⚡ Moderate match. Improve key skills."
        : "📚 Focus on fundamentals to improve.";

  return (
    <div style={styles.glassContainer}>
      <h2 style={styles.heading}>
        <BsStars color="var(--accent)" style={{ marginRight: "8px" }} />
        Analysis Result
      </h2>

      {/* Summary Card */}
      <div style={styles.summaryCard}>
        <h3 style={{ color: "var(--text)", margin: "0 0 10px 0" }}>
          Overall Match
        </h3>
        <p style={styles.bigScore}>{overallScore}%</p>
        <p style={{ color: "var(--text-secondary)", marginTop: "5px" }}>
          {insight}
        </p>
      </div>

      {/* Radar Chart (Updated for Light/Dark mode AND Grid Lines) */}
      <div style={styles.chartBox}>
        <RadarChart width={300} height={250} data={skills}>
          {/* ✅ FIXED: Grid lines now use text-secondary with opacity so they show in light mode! */}
          <PolarGrid stroke="var(--text-secondary)" opacity={0.3} />

          <PolarAngleAxis
            dataKey="name"
            tick={{
              fill: "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 500,
            }}
          />
          <Radar
            dataKey="score"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.5}
          />
        </RadarChart>
      </div>

      {/* Skills Grid */}
      <div style={styles.grid}>
        {skills.map((skill, index) => (
          <div
            key={index}
            style={styles.glassCard}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.glassCardHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {" "}
            <h3 style={styles.skillName}>{skill.name}</h3>
            <div style={styles.stats}>
              <span style={styles.badge}>{skill.level}</span>
              <span style={styles.score}>{skill.score}/10</span>
            </div>
            {/* Glowing Progress bar */}
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
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Plan */}
      {data.learningPlan && (
        <div style={styles.planCard}>
          <h3 style={styles.planHeading}>📚 Recommended Learning Plan</h3>
          <p style={styles.planText}>{data.learningPlan}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  glassContainer: {
    background: "var(--card)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
    padding: "36px",
    borderRadius: "24px",
    marginTop: "20px",
  },
  heading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30px",
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "var(--text)",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  glassCard: {
    background: "var(--card-hover)",
    border: "1px solid var(--border)",
    padding: "20px",
    borderRadius: "16px",
    transition: "all 0.25s ease",
    cursor: "pointer",
  },
  skillName: {
    marginBottom: "12px",
    color: "var(--text)",
    fontSize: "1.1rem",
    fontWeight: "600",
  },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  badge: {
    background: "var(--accent-soft)",
    color: "var(--accent)",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
    border: "1px solid var(--border)",
  },
  score: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  progressBg: {
    width: "100%",
    height: "8px",
    background: "rgba(150, 150, 150, 0.2)",
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "5px",
    transition: "width 1s ease-in-out",
  },
  planCard: {
    marginTop: "32px",
    padding: "24px",
    background: "var(--card-hover)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
  },
  planHeading: {
    color: "var(--accent)",
    marginBottom: "12px",
    fontSize: "1.3rem",
    fontWeight: "600",
  },
  planText: {
    color: "var(--text-secondary)",
    lineHeight: "1.7",
    fontSize: "1rem",
  },
  summaryCard: {
    textAlign: "center",
    marginBottom: "25px",
    padding: "20px",
    background: "var(--accent-soft)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
  },
  bigScore: {
    fontSize: "2.8rem",
    fontWeight: "700",
    color: "var(--accent)",
    margin: "10px 0",
  },
  chartBox: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  glassCardHover: {
    transform: "translateY(-6px) scale(1.02)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(129, 140, 248, 0.25)",
  },
};

export default Result;
