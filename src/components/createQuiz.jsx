import { useState } from "react";
import Papa from "papaparse";

const CreateQuizPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeDuration, setTimeDuration] = useState("");
  const [quizKey, setQuizKey] = useState("");
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [quizLink, setQuizLink] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [isTextareaQuestion, setIsTextareaQuestion] = useState(false);
  const [customOptions, setCustomOptions] = useState(["", "", "", ""]);
  const [customCorrectOption, setCustomCorrectOption] = useState(0);
  const [customCorrectAnswer, setCustomCorrectAnswer] = useState("");

  const handleCSVUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((row) => ({
          question: row.question,
          options: [row.option1, row.option2, row.option3, row.option4],
          correctOption: parseInt(row.correctOption) - 1,
          isTextarea: false,
        }));
        setQuestions(parsed);
      },
    });
  };

  const handleAddCustomQuestion = (e) => {
    e.preventDefault();
    if (!customQuestion) {
      setMessage("⚠️ Please provide a question.");
      return;
    }

    if (
      !isTextareaQuestion &&
      (customOptions.some((opt) => !opt) ||
        customCorrectOption < 0 ||
        customCorrectOption > 3)
    ) {
      setMessage(
        "⚠️ Please fill all options and select a valid correct option for multiple-choice questions."
      );
      return;
    }

    if (isTextareaQuestion && !customCorrectAnswer) {
      setMessage("⚠️ Please provide a correct answer for textarea questions.");
      return;
    }

    const newQuestion = isTextareaQuestion
      ? {
          question: customQuestion,
          isTextarea: true,
          correctAnswer: customCorrectAnswer,
        }
      : {
          question: customQuestion,
          options: customOptions,
          correctOption: customCorrectOption,
          isTextarea: false,
        };

    setQuestions([...questions, newQuestion]);
    setCustomQuestion("");
    setCustomOptions(["", "", "", ""]);
    setCustomCorrectOption(0);
    setCustomCorrectAnswer("");
    setIsTextareaQuestion(false);
    setMessage("✅ Custom question added!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !timeDuration ||
      !quizKey ||
      questions.length === 0
    ) {
      setMessage("⚠️ Please fill all fields and add at least one question.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        timeDuration: parseInt(timeDuration),
        quizKey,
        questions,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      const link = `${window.location.origin}/quiz/${data.quizId}`;
      setQuizLink(link);
      setAccessKey(quizKey);
      setMessage("✅ Quiz created successfully!");
    } else {
      setMessage(data.error || "❌ Failed to create quiz.");
    }
  };

  const handleCopy = () => {
    const copyText = `🔗 Link: ${quizLink}\n🗝️ Access Key: ${accessKey}`;
    navigator.clipboard.writeText(copyText);
    alert("Quiz link and key copied to clipboard!");
  };

  return (
    <div className="content-card">
      <h2 className="content-title">📚 Create New Quiz</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Quiz Title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Quiz Description"
          className="input-field"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Time Duration (in minutes)"
          className="input-field"
          value={timeDuration}
          onChange={(e) => setTimeDuration(e.target.value)}
        />

        <input
          type="text"
          placeholder="Quiz Access Key"
          className="input-field"
          value={quizKey}
          onChange={(e) => setQuizKey(e.target.value)}
        />

        <div className="space-y-2">
          <label className="content-text">
            Upload CSV (question, option1, option2, option3, option4,
            correctOption):
          </label>
          <input
            type="file"
            accept=".csv"
            className="input-file"
            onChange={handleCSVUpload}
          />
        </div>

        <div className="space-y-2">
          <h3 className="content-text font-semibold">Add Custom Question</h3>
          <input
            type="text"
            placeholder="Question"
            className="input-field"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
          />
          <div>
            <label className="content-text">
              <input
                type="checkbox"
                checked={isTextareaQuestion}
                onChange={(e) => setIsTextareaQuestion(e.target.checked)}
              />
              Use textarea (open-ended question)
            </label>
          </div>
          {isTextareaQuestion ? (
            <textarea
              placeholder="Correct Answer (for teacher reference)"
              className="input-field"
              value={customCorrectAnswer}
              onChange={(e) => setCustomCorrectAnswer(e.target.value)}
            />
          ) : (
            <>
              {customOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  className="input-field"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...customOptions];
                    newOptions[index] = e.target.value;
                    setCustomOptions(newOptions);
                  }}
                />
              ))}
              <select
                className="input-field"
                value={customCorrectOption}
                onChange={(e) =>
                  setCustomCorrectOption(parseInt(e.target.value))
                }
              >
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </>
          )}
          <button
            type="button"
            onClick={handleAddCustomQuestion}
            className="action-button"
          >
            ➕ Add Question
          </button>
        </div>

        <button type="submit" className="action-button">
          ➕ Create Quiz
        </button>
      </form>

      {message && (
        <div className="message-box">
          <p className="message-text">{message}</p>
          {quizLink && (
            <div className="space-y-2">
              <p>
                🔗 <strong>Link:</strong>{" "}
                <a href={quizLink} className="link-text">
                  {quizLink}
                </a>
              </p>
              <p>
                🗝️ <strong>Access Key:</strong> {accessKey}
              </p>
              <button onClick={handleCopy} className="action-button">
                📋 Copy Link & Key
              </button>
            </div>
          )}
        </div>
      )}

      {questions.length > 0 && (
        <div className="space-y-2">
          <h3 className="content-text font-semibold">Added Questions</h3>
          <textarea
            className="input-field"
            rows={10}
            readOnly
            value={questions
              .map((q, idx) =>
                q.isTextarea
                  ? `${idx + 1}. ${q.question}\n   Correct Answer: ${
                      q.correctAnswer
                    }\n`
                  : `${idx + 1}. ${q.question}\n` +
                    q.options
                      .map(
                        (opt, i) =>
                          `   ${i + 1}. ${opt}${
                            q.correctOption === i ? " (Correct)" : ""
                          }`
                      )
                      .join("\n")
              )
              .join("\n\n")}
          />
        </div>
      )}
    </div>
  );
};

export default CreateQuizPage;
