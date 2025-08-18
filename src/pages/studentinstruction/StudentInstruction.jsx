import React, { useState } from "react";
import "./StudentInstruction.css";

const StudentInstruction = () => {
  const [quizKey, setQuizKey] = useState("");
  const [batch, setBatch] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [name] = useState("Ali");
  const [error, setError] = useState("");

  const validateInput = (value) => value.length >= 4 && value.length <= 25;
  const validateHour = (value) => /^\d{2}$/.test(value) && Number(value) >= 0 && Number(value) <= 23;
  const validateMinute = (value) => /^\d{2}$/.test(value) && Number(value) >= 0 && Number(value) <= 59;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInput(quizKey) || !validateInput(batch)) {
      setError("Quiz Key and Batch must be between 4 and 25 characters.");
      return;
    }
    if (!validateHour(hour) || !validateMinute(minute)) {
      setError("Timings must be in 24-hour format (HH:MM, e.g., 23:00) and numeric.");
      return;
    }
    setError("");
    alert(`Quiz Started at ${hour}:${minute}!`);
  };

  return (
    <div className="quiz-bg">
      <div className="quiz-container">
        <h2 className="quiz-title">BANO QABIL QUIZ</h2>
        <div className="quiz-flex">
          <div className="quiz-instructions">
            <h3>Instructions for the Test</h3>
            <ul>
              <li>
                <span role="img" aria-label="clock">🕒</span>
                <b> Time Rules</b><br />
                <span style={{ marginLeft: "28px" }}>
                  You will have 60 minutes to complete the exam.
                </span>
              </li>
              <li>
                <span role="img" aria-label="arrow">➡️</span>
                <b> Navigation</b><br />
                <span style={{ marginLeft: "28px" }}>
                  Use the Next and Previous buttons to navigate.
                </span>
              </li>
              <li>
                <span role="img" aria-label="check">✅</span>
                <b> Submission</b><br />
                <span style={{ marginLeft: "28px" }}>
                  You can review and change answers before submitting
                </span>
              </li>
            </ul>
            <p className="quiz-note">
              Note: <span>
                Before commencing the exams please fill in the required fields
              </span>
            </p>
            <h3 className="quiz-goodluck">
              Good Luck, You’re ready to ace it!
            </h3>
          </div>
          <div className="quiz-form-container">
            <div className="quiz-welcome">
              Welcome, {name}!
            </div>
            <div className="quiz-bar" />
            <form className="quiz-form" onSubmit={handleSubmit}>
              <label>Quiz Key:</label>
              <input
                type="text"
                placeholder="Enter Key"
                value={quizKey}
                onChange={e => setQuizKey(e.target.value)}
                required
                minLength={4}
                maxLength={25}
              />
              <label>BQ Batch:</label>
              <input
                type="text"
                placeholder="Enter Batch"
                value={batch}
                onChange={e => setBatch(e.target.value)}
                required
                minLength={4}
                maxLength={25}
              />
              <label>Timings (24-hour format, e.g. 23:00):</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="number"
                  placeholder="HH"
                  value={hour}
                  onChange={e => setHour(e.target.value)}
                  required
                  min={0}
                  max={23}
                  style={{ width: "60px" }}
                />
                <span>:</span>
                <input
                  type="number"
                  placeholder="MM"
                  value={minute}
                  onChange={e => setMinute(e.target.value)}
                  required
                  min={0}
                  max={59}
                  style={{ width: "60px" }}
                />
              </div>
              {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
              <button type="submit">
                Start Quiz
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInstruction;