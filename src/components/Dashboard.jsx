import { useState } from "react";
import Question from "./Question";
import Progress from "./Progress";
import TopicSelect from "./TopicSelect";

function Dashboard({ setIsLoggedIn }) {
  const username = localStorage.getItem("username");
  const user_id = localStorage.getItem("user_id");

  const [view, setView] = useState("dashboard");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTopicName, setSelectedTopicName] = useState("");

  /* ---------------- CALENDAR STATES ---------------- */
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [tasks, setTasks] = useState({});
  const [taskInput, setTaskInput] = useState("");
  const [editingTask, setEditingTask] = useState(null); // { key, index }
  const [editingText, setEditingText] = useState("");

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const addTask = () => {
    if (!taskInput) return;
    const key = `${currentYear}-${currentMonth}-${selectedDate}`;
    setTasks({ ...tasks, [key]: [...(tasks[key] || []), taskInput] });
    setTaskInput("");
  };

  const deleteTask = (key, index) => {
    const updated = [...(tasks[key] || [])];
    updated.splice(index, 1);
    setTasks({ ...tasks, [key]: updated });
  };

  const startEdit = (key, index, text) => {
    setEditingTask({ key, index });
    setEditingText(text);
  };

  const saveEdit = () => {
    if (!editingTask) return;
    const { key, index } = editingTask;
    const updated = [...(tasks[key] || [])];
    updated[index] = editingText;
    setTasks({ ...tasks, [key]: updated });
    setEditingTask(null);
    setEditingText("");
  };

  /* ---------------- QUIZ FUNCTIONS ---------------- */
  const fetchQuestions = async (diff, topic_id = selectedTopic) => {
  setLoading(true);
  try {
    const url = topic_id
      ? `http://localhost:3001/api/questions?difficulty=${diff}&topic_id=${topic_id}`
      : `http://localhost:3001/api/questions?difficulty=${diff}`;
    const res = await fetch(url);
    const data = await res.json();
    setQuestions(data);
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer("");
    setMessage("");
    setView("quiz");
  } catch {
    alert("Could not load questions. Is the backend running?");
  }
  setLoading(false);
  };

  const checkAnswer = async () => {
    const current = questions[currentIndex];
    const correct = userAnswer.toLowerCase() === current.answer.toLowerCase();
    setScore(correct ? score + 1 : score);
    setMessage(correct ? "Correct ✅" : `Wrong ❌ Answer: ${current.answer}`);

    try {
      await fetch("http://localhost:3001/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, question_id: current.id, is_correct: correct }),
      });
    } catch (err) {
      console.log("Progress not saved");
    }
  };

  const showHint = () => setMessage("Hint: " + questions[currentIndex].hint);

  const nextQuestion = () => {
    const correct = message.startsWith("Correct");
    const newDiff = correct ? Math.min(difficulty + 1, 3) : Math.max(difficulty - 1, 1);
    setDifficulty(newDiff);
    setCurrentIndex(currentIndex + 1);
    setUserAnswer("");
    setMessage("");
  };

  const handleTopicSelect = (topic_id, topicName) => {
  setSelectedTopic(topic_id);
  setSelectedTopicName(topicName);
  fetchQuestions(difficulty, topic_id);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const taskKey = `${currentYear}-${currentMonth}-${selectedDate}`;

  /* ---------------- UI ---------------- */
  return (
    <div style={{ display: "flex", background: "#f5f7fb", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "220px", background: "white", padding: "30px 20px",
        borderRadius: "0 20px 20px 0", boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
      }}>
        <h2 style={{ marginBottom: "40px" }}>LearnThru</h2>
        <p style={{ marginBottom: "20px", cursor: "pointer" }} onClick={() => setView("dashboard")}>🏠 Dashboard</p>
        <p style={{ marginBottom: "20px", cursor: "pointer" }} onClick={() => setView("topics")}>📚 Classroom</p>
        <p style={{ marginBottom: "20px", cursor: "pointer" }}>🎥 Lessons</p>
        <p style={{ marginBottom: "20px", cursor: "pointer" }} onClick={() => setView("progress")}>📊 Progress</p>
        <button onClick={handleLogout} style={{
          marginTop: "50px", padding: "10px", borderRadius: "10px",
          border: "none", background: "#ff4d4d", color: "white", cursor: "pointer"
        }}>Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "40px" }}>

        {/* TOP BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
          <input type="text" placeholder="Search..."
            style={{ padding: "12px 20px", width: "300px", borderRadius: "20px", border: "1px solid #ddd" }}
          />
          <p>{today.toDateString()}</p>
        </div>

        {view === "dashboard" ? (
          <>
            {/* WELCOME CARD */}
            <div style={{
              background: "white", padding: "30px", borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "30px",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <h2>Welcome back, {username} 👋</h2>
                <p>New mechanics lessons are available.</p>
                <button onClick={() => fetchQuestions(difficulty)} style={{
                  marginTop: "15px", padding: "10px 20px", borderRadius: "20px",
                  border: "none", background: "#4c6fff", color: "white", cursor: "pointer"
                }}>
                  {loading ? "Loading..." : "Start Learning"}
                </button>
              </div>
              <div style={{
                width: "120px", height: "120px",
                background: "linear-gradient(135deg,#4c6fff,#7b61ff)", borderRadius: "20px"
              }} />
            </div>

            {/* CLASS CARDS */}
            <h3 style={{ marginBottom: "20px" }}>Classes</h3>
            <div style={{ display: "flex", gap: "20px" }}>
              <div onClick={() => fetchQuestions(1)} style={{
                flex: 1, background: "linear-gradient(135deg,#4c6fff,#6a82fb)",
                color: "white", padding: "25px", borderRadius: "20px", cursor: "pointer"
              }}>
                <h4>Mechanics - Unit I</h4>
                <p>Easy Questions ⭐</p>
              </div>
              <div onClick={() => fetchQuestions(2)} style={{
                flex: 1, background: "linear-gradient(135deg,#ff758c,#ff7eb3)",
                color: "white", padding: "25px", borderRadius: "20px", cursor: "pointer"
              }}>
                <h4>Mechanics - Unit II</h4>
                <p>Medium Questions ⭐⭐</p>
              </div>
            </div>
          </>

        ) : view === "topics" ? (
          <TopicSelect onSelect={handleTopicSelect} />

        ) : view === "progress" ? (
          <Progress />

        ) : (
          /* QUIZ VIEW */
          <div style={{
            background: "white", padding: "40px", borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center"
          }}>
            <h2>Mechanics Quiz ⚙️</h2>
            <p style={{ color: "#666" }}>Topic: {selectedTopicName || "All Topics"}</p>
            <p>Difficulty: {"⭐".repeat(difficulty)} | Score: {score}</p>

            {currentIndex < questions.length ? (
              <>
                <Question
                  question={questions[currentIndex].question_text}
                  answer={userAnswer}
                  setAnswer={setUserAnswer}
                  checkAnswer={checkAnswer}
                  showHint={showHint}
                  message={message}
                />
                <br />
                <button onClick={nextQuestion}>Next Question</button>
              </>
            ) : (
              <div>
                <h2>Quiz Completed 🎉 Final Score: {score}/{questions.length}</h2>
                <button onClick={() => fetchQuestions(difficulty)} style={{ marginRight: "10px" }}>Try Again</button>
                <button onClick={() => setView("dashboard")}>Back to Dashboard</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT PANEL WITH CALENDAR */}
      <div style={{
        width: "300px", background: "white", padding: "20px",
        borderRadius: "20px 0 0 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
      }}>

        {/* PROFILE */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "#ddd", margin: "0 auto 15px"
          }} />
          <h4>{username}</h4>
          <p style={{ color: "#666" }}>Student</p>
        </div>

        {/* CALENDAR */}
        <h3 style={{ textAlign: "center" }}>📅 Planner</h3>

        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "10px", marginTop: "10px"
        }}>
          <button onClick={prevMonth}>⬅</button>
          <strong>{monthNames[currentMonth]} {currentYear}</strong>
          <button onClick={nextMonth}>➡</button>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7,1fr)",
          gap: "5px", fontSize: "12px"
        }}>
          {[...Array(firstDay)].map((_, i) => <div key={"empty" + i}></div>)}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();
            return (
              <div key={day} onClick={() => setSelectedDate(day)} style={{
                padding: "8px", borderRadius: "8px", textAlign: "center", cursor: "pointer",
                background: selectedDate === day ? "#4c6fff" : isToday ? "#ddd" : "#f5f7fb",
                color: selectedDate === day ? "white" : "black"
              }}>
                {day}
              </div>
            );
          })}
        </div>

        {/* TASK INPUT */}
        <div style={{ marginTop: "20px" }}>
          <input type="text" placeholder="Add task..." value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ddd" }}
          />
          <button onClick={addTask} style={{
            marginTop: "8px", width: "100%", padding: "8px",
            borderRadius: "8px", border: "none", background: "#4c6fff", color: "white"
          }}>Add Task</button>
        </div>

        {/* TASKS LIST */}
        <div style={{ marginTop: "15px" }}>
          <strong>Tasks for {selectedDate} {monthNames[currentMonth]}:</strong>
          {(tasks[taskKey] || []).length === 0 && (
            <p style={{ color: "#aaa", fontSize: "13px", marginTop: "8px" }}>No tasks yet.</p>
          )}
          {(tasks[taskKey] || []).map((task, index) => (
            <div key={index} style={{
              background: "#f5f7fb", padding: "8px", marginTop: "8px",
              borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px"
            }}>
              {editingTask?.key === taskKey && editingTask?.index === index ? (
                <>
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    style={{
                      flex: 1, padding: "4px 6px", borderRadius: "6px",
                      border: "1px solid #4c6fff", fontSize: "13px"
                    }}
                    autoFocus
                  />
                  <button onClick={saveEdit} style={{
                    padding: "4px 8px", borderRadius: "6px", border: "none",
                    background: "#4c6fff", color: "white", cursor: "pointer", fontSize: "12px"
                  }}>✓</button>
                  <button onClick={() => setEditingTask(null)} style={{
                    padding: "4px 8px", borderRadius: "6px", border: "none",
                    background: "#ddd", cursor: "pointer", fontSize: "12px"
                  }}>✕</button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, fontSize: "13px" }}>{task}</span>
                  <button onClick={() => startEdit(taskKey, index, task)} style={{
                    padding: "4px 8px", borderRadius: "6px", border: "none",
                    background: "#e8edff", color: "#4c6fff", cursor: "pointer", fontSize: "12px"
                  }}>✏️</button>
                  <button onClick={() => deleteTask(taskKey, index)} style={{
                    padding: "4px 8px", borderRadius: "6px", border: "none",
                    background: "#ffe8e8", color: "#ff4d4d", cursor: "pointer", fontSize: "12px"
                  }}>🗑️</button>
                </>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;