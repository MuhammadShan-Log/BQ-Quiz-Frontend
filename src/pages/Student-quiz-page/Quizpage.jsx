import React, { useState } from "react";
import "./Quizpage.css";

const questions = [
  {
    id: 1,
    text: "Which of the following is not an element of the periodic table?",
    options: ["Gold", "Iron", "Sulphur", "Fiber"],
  },
  {
    id: 2,
    text: "Which of the following is not an element of the periodic table?",
    options: ["Gold", "Iron", "Sulphur", "Fiber"],
  },
  {
    id: 3,
    text: "Which of the following is not an element of the periodic table?",
    options: ["Gold", "Iron", "Sulphur", "Fiber"],
  },
];

const Quizpage = () => {
  const [answers, setAnswers] = useState({});
  const timer = "50:04";

  const handleOptionChange = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  return (
    <div className="quiz-bg">
      <div className="quiz-card quiz-card-enhanced">
        <div className="quiz-header">
          <span className="quiz-page">Page#02</span>
          <span className="quiz-timer">
            <span className="quiz-timer-icon" role="img" aria-label="clock">
              🕒
            </span>{" "}
            {timer}
          </span>
        </div>
        <div className="quiz-progress">
          <div className="quiz-progress-bar" />
        </div>
        <h2 className="quiz-title">
          BANO QABIL QUIZ <span className="quiz-title-number">#1</span>
        </h2>
        <form>
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="quiz-question-block quiz-question-block-enhanced"
            >
              <div className="quiz-question">
                <span className="quiz-question-number">{idx + 1}.</span> {q.text}
              </div>
              <div className="quiz-options">
                {q.options.map((opt, i) => (
                  <label
                    key={opt}
                    className={`quiz-option quiz-option-enhanced${
                      answers[q.id] === opt ? " quiz-option-selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleOptionChange(q.id, opt)}
                    />
                    <span>
                      <b className="quiz-option-label">
                        {String.fromCharCode(65 + i)}
                      </b>
                      . {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="quiz-nav">
            <button type="button" className="quiz-btn quiz-btn-prev">
              &#8592; Previous
            </button>
            <button type="button" className="quiz-btn quiz-btn-next">
              Next &#8594;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Quizpage;