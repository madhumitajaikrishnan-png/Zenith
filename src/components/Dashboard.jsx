import { useState } from "react";

function Dashboard({ setIsLoggedIn }) {
  const username = localStorage.getItem("username");
  const [activePage, setActivePage] = useState("dashboard");

  const menuItemStyle = (page) => ({
    padding: "12px 15px",
    borderRadius: "12px",
    marginBottom: "10px",
    cursor: "pointer",
    background: activePage === page ? "#4c6fff" : "transparent",
    color: activePage === page ? "white" : "#333",
    transition: "all 0.3s ease",
    fontWeight: "500"
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2ff,#f8fafc)"
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "230px",
          background: "rgba(255,255,255,0.8)",
          padding: "30px 20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.05)"
        }}
      >
        <h2 style={{ marginBottom: "40px", color: "#4c6fff" }}>
          Smart Learning
        </h2>

        <div onClick={() => setActivePage("dashboard")} style={menuItemStyle("dashboard")}>
          🏠 Dashboard
        </div>
        <div onClick={() => setActivePage("classroom")} style={menuItemStyle("classroom")}>
          📚 Classroom
        </div>
        <div onClick={() => setActivePage("quiz")} style={menuItemStyle("quiz")}>
          📝 Quiz
        </div>
        <div onClick={() => setActivePage("progress")} style={menuItemStyle("progress")}>
          📊 Progress
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("username");
            setIsLoggedIn(false);
          }}
          style={{
            marginTop: "50px",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg,#ff4d4d,#ff6b6b)",
            color: "white",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "50px" }}>
        {activePage === "dashboard" && (
          <>
            {/* HERO SECTION */}
            <div
              style={{
                background: "linear-gradient(135deg,#4c6fff,#7b61ff)",
                padding: "50px",
                borderRadius: "25px",
                color: "white",
                boxShadow: "0 20px 40px rgba(76,111,255,0.3)",
                marginBottom: "30px"
              }}
            >
              <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
                Welcome back, {username} 👋
              </h1>
              <p style={{ opacity: 0.9 }}>
                Stay consistent. Stay smart. Let’s master Mechanics today.
              </p>

              <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
                <button style={primaryBtn}>Start Learning</button>
                <button style={secondaryBtn}>Take Quiz</button>
              </div>
            </div>

            {/* STATS */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
              <StatCard title="🔥 Study Streak" value="5 Days" />
              <StatCard title="📚 Topics Covered" value="8 / 20" />
              <StatCard title="📝 Quizzes Taken" value="12" />
            </div>

            {/* MOTIVATION */}
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>💡 Daily Motivation</h3>
              <p style={{ color: "#555" }}>
                “Success is the sum of small efforts repeated day in and day out.”
              </p>
            </div>
          </>
        )}

        {activePage === "classroom" && <h2>📚 Classroom Section</h2>}
        {activePage === "quiz" && <h2>📝 Quiz Section</h2>}
        {activePage === "progress" && <h2>📊 Progress Section</h2>}
      </div>

      {/* RIGHT PANEL - CALENDAR */}
      <div
        style={{
          width: "320px",
          background: "rgba(255,255,255,0.8)",
          padding: "30px",
          boxShadow: "-5px 0 20px rgba(0,0,0,0.05)"
        }}
      >
        <CalendarPlanner />
      </div>
    </div>
  );
}

/* ============================= */
/* CALENDAR WITH TASK PLANNER */
/* ============================= */

function CalendarPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taskInput, setTaskInput] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateKey = selectedDate.toDateString();

  const allTasks = JSON.parse(localStorage.getItem("plannerTasks")) || {};
  const tasks = allTasks[dateKey] || [];

  const saveTasks = (updatedTasks) => {
    const updatedStorage = { ...allTasks, [dateKey]: updatedTasks };
    localStorage.setItem("plannerTasks", JSON.stringify(updatedStorage));
  };

  const addTask = () => {
    if (!taskInput.trim()) return;
    saveTasks([...tasks, taskInput]);
    setTaskInput("");
  };

  const deleteTask = (index) => {
    saveTasks(tasks.filter((_, i) => i !== index));
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div>
      <h3>📅 Planner</h3>

      <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
        <button onClick={prevMonth} style={arrowStyle}>◀</button>
        <span style={{ fontWeight: "600" }}>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </span>
        <button onClick={nextMonth} style={arrowStyle}>▶</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} style={{ fontSize: "12px", fontWeight: "bold" }}>{d}</div>
        ))}

        {days.map((day, i) => (
          <div
            key={i}
            onClick={() => day && setSelectedDate(new Date(year, month, day))}
            style={{
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              cursor: day ? "pointer" : "default",
              background: day ? "#f1f5f9" : "transparent"
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "15px" }}>
        <h4>Tasks for {selectedDate.getDate()}</h4>

        <div style={{ display: "flex", gap: "5px", marginBottom: "8px" }}>
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Add task..."
            style={{
              flex: 1,
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #ddd"
            }}
          />
          <button
            onClick={addTask}
            style={{
              background: "#4c6fff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 10px",
              cursor: "pointer"
            }}
          >
            +
          </button>
        </div>

        {tasks.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#777" }}>No tasks yet</p>
        ) : (
          tasks.map((task, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px" }}>• {task}</span>
              <button
                onClick={() => deleteTask(index)}
                style={{
                  background: "none",
                  border: "none",
                  color: "red",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        flex: 1,
        background: "white",
        padding: "25px",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        transition: "0.3s",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
    >
      <h4 style={{ marginBottom: "8px", color: "#777" }}>{title}</h4>
      <h2 style={{ color: "#4c6fff" }}>{value}</h2>
    </div>
  );
}

const primaryBtn = {
  background: "white",
  color: "#4c6fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600"
};

const secondaryBtn = {
  background: "transparent",
  color: "white",
  border: "2px solid white",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600"
};

const arrowStyle = {
  border: "none",
  background: "#4c6fff",
  color: "white",
  borderRadius: "6px",
  padding: "4px 8px",
  cursor: "pointer"
};

export default Dashboard;