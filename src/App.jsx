import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Trophy,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import quizDataRaw from "./data.json";
import "./index.css";

function App() {
  const [view, setView] = useState("start"); // 'start', 'quiz', 'guide', 'result'
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Basic shuffle for the quiz
    const shuffled = [...quizDataRaw].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
  }, []);

  const handleStart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setView("quiz");
  };

  const handleOptionSelect = (opt) => {
    if (showFeedback) return;
    setSelectedOption(opt);
    setShowFeedback(true);
    if (opt === questions[currentIdx].answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setView("result");
    }
  };

  const navItem = (targetView, label, Icon) => (
    <button
      className={view === targetView ? "active" : ""}
      onClick={() => setView(targetView)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <Icon size={18} /> {label}
      </div>
    </button>
  );

  return (
    <div className="app-container">
      <header>
        <div className="logo" onClick={() => setView("start")}>
          <BookOpen color="var(--primary)" />
          <span>
            Constitution<span className="gradient-text">IQ</span>
          </span>
        </div>
        <div
          className="header-links"
          style={{ display: "flex", gap: "0.5rem" }}
        >
          {navItem("start", "Practice", Play)}
          {navItem("guide", "Study Guide", BookOpen)}
        </div>
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {view === "start" && (
            <motion.div
              key="start"
              className="glass-card"
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Trophy
                size={64}
                color="var(--primary)"
                style={{ margin: "0 auto 1.5rem" }}
              />
              <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                Master the{" "}
                <span className="gradient-text">Indian Constitution</span>
              </h1>
              <p
                style={{
                  marginBottom: "2rem",
                  fontSize: "1.2rem",
                  maxWidth: "600px",
                  margin: "0 auto 2rem",
                }}
              >
                Test your knowledge with our comprehensive database of 56
                curated questions. Learn on the go with instant feedback and
                detailed explanations.
              </p>
              <button className="btn-primary" onClick={handleStart}>
                <Play fill="currentColor" size={20} /> Start Quiz
              </button>
            </motion.div>
          )}

          {view === "quiz" && questions.length > 0 && (
            <motion.div
              key="quiz"
              className="glass-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="quiz-header">
                <div className="progress-container">
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${(currentIdx / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                  <div
                    style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
                  >
                    Question {currentIdx + 1} of {questions.length}
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: "var(--primary)" }}>
                  Score: {score}
                </div>
              </div>

              <h2 className="question-text">
                {questions[currentIdx].question}
              </h2>

              <div className="options-grid">
                {questions[currentIdx].options.map((opt, i) => {
                  let cls = "";
                  if (showFeedback) {
                    if (opt === questions[currentIdx].answer) cls = "correct";
                    else if (opt === selectedOption) cls = "incorrect";
                  } else if (opt === selectedOption) {
                    cls = "selected";
                  }

                  return (
                    <button
                      key={i}
                      className={`option-btn ${cls}`}
                      onClick={() => handleOptionSelect(opt)}
                      disabled={showFeedback}
                    >
                      <span>{opt}</span>
                      {showFeedback && opt === questions[currentIdx].answer && (
                        <CheckCircle2 color="var(--success)" size={20} />
                      )}
                      {showFeedback &&
                        opt === selectedOption &&
                        opt !== questions[currentIdx].answer && (
                          <XCircle color="var(--error)" size={20} />
                        )}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div
                  className={`feedback-box ${selectedOption === questions[currentIdx].answer ? "success" : "error"}`}
                >
                  <div className="feedback-title">
                    {selectedOption === questions[currentIdx].answer
                      ? "Correct Answer!"
                      : "Incorrect"}
                  </div>
                  <div className="explanation-text">
                    {questions[currentIdx].explanation}
                  </div>
                </div>
              )}

              <div className="action-row">
                <button
                  className="btn-primary"
                  onClick={handleNext}
                  style={{
                    opacity: showFeedback ? 1 : 0,
                    pointerEvents: showFeedback ? "auto" : "none",
                  }}
                >
                  {currentIdx < questions.length - 1
                    ? "Next Question"
                    : "View Results"}{" "}
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {view === "result" && (
            <motion.div
              key="result"
              className="glass-card results-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Trophy
                size={64}
                color="var(--success)"
                style={{ margin: "0 auto" }}
              />
              <h2
                style={{
                  fontSize: "2rem",
                  marginTop: "1rem",
                  color: "var(--text-main)",
                }}
              >
                Quiz Completed!
              </h2>

              <div className="score-circle">
                <div className="score-number">{score}</div>
                <div className="score-text">out of {questions.length}</div>
              </div>

              <p
                style={{
                  marginBottom: "2rem",
                  fontSize: "1.2rem",
                  color: "var(--text-muted)",
                }}
              >
                {score / questions.length > 0.8
                  ? "Outstanding! You're an expert on the Indian Constitution."
                  : score / questions.length > 0.5
                    ? "Good job! You have a solid foundation."
                    : "Keep studying! Check out our Study Guide to learn more."}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <button className="btn-secondary" onClick={handleStart}>
                  <RotateCcw size={20} /> Retry Quiz
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setView("guide")}
                >
                  <BookOpen size={20} /> View Guide
                </button>
              </div>
            </motion.div>
          )}

          {view === "guide" && (
            <motion.div
              key="guide"
              className="glass-card guide-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ maxHeight: "75vh", overflowY: "auto" }}
            >
              <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                <span className="gradient-text">
                  Study Guide: Indian Constitution
                </span>
              </h1>
              <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                A quick reference based on core concepts.
              </p>

              <div className="guide-content">
                <h2>1. The Preamble</h2>
                <p>
                  The Preamble is derived from the "Objectives Resolution"
                  drafted by Jawaharlal Nehru. It was adopted by the Constituent
                  Assembly on <strong>26 November 1949</strong>.
                </p>
                <ul>
                  <li>
                    <strong>Borrowed from:</strong> Constitution of USA.
                  </li>
                  <li>
                    <strong>Ideals:</strong> Liberty, Equality, and Fraternity
                    (from French Constitution) and Justice (Social, Economic,
                    Political) from the Russian Revolution.
                  </li>
                  <li>
                    <strong>Nature of State:</strong> Sovereign, Socialist,
                    Secular, Democratic, Republic.
                  </li>
                  <li>
                    <strong>Amendments:</strong> Amended only once (42nd
                    Amendment, 1976), which added "Socialist, Secular and
                    Integrity".
                  </li>
                </ul>

                <h2>2. Constituent Assembly & Drafting</h2>
                <p>
                  The idea of a Constituent Assembly was first suggested by M.N.
                  Roy in 1934. The Indian Constitution is the longest written
                  constitution.
                </p>
                <ul>
                  <li>
                    <strong>Drafting Committee:</strong> Formed on 29 Aug 1947
                    with 7 members. Dr. B.R. Ambedkar was the Chairman.
                  </li>
                  <li>
                    <strong>Sittings:</strong> The draft was prepared in 141
                    sittings.
                  </li>
                  <li>
                    <strong>Adoption:</strong> Adopted on 26 Nov 1949, came into
                    force on 26 Jan 1950 (Purna Swaraj Day).
                  </li>
                </ul>

                <h2>3. Key Features & Borrowed Concepts</h2>
                <p>
                  The Constitution is a blend of rigidity and flexibility,
                  establishing India as a "Union of States".
                </p>
                <ul>
                  <li>
                    <strong>Fundamental Rights & Judicial Review:</strong>{" "}
                    Borrowed from the USA.
                  </li>
                  <li>
                    <strong>Fundamental Duties:</strong> Borrowed from the USSR.
                  </li>
                  <li>
                    <strong>Parliamentary System:</strong> Ensures
                    accountability of the executive to the legislature.
                  </li>
                  <li>
                    <strong>Federal System:</strong> Quasi-federal, single
                    integrated judiciary (from Govt. of India Act 1935).
                  </li>
                </ul>

                <h2>4. Ambedkar's Vision</h2>
                <p>
                  In his warnings, Dr. B.R. Ambedkar emphasized that political
                  democracy is incomplete without social and economic democracy.
                </p>
                <ul>
                  <li>
                    <strong>Trinity:</strong> Liberty, Equality, and Fraternity
                    are inseparable principles of life forming a social
                    democracy.
                  </li>
                  <li>
                    <strong>Warnings:</strong> He warned against Hero-worship in
                    politics, the Grammar of Anarchy, and having political
                    democracy without social democracy.
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer>
        <p>
          &copy; {new Date().getFullYear()} ConstitutionIQ &middot; Built for
          learning
        </p>
      </footer>
    </div>
  );
}

export default App;
