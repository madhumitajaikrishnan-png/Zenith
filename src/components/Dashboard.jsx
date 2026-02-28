import { useState } from "react";

function Dashboard({ setIsLoggedIn }) {
  const username = localStorage.getItem("username");

  return (
    <div style={{ display: "flex", background: "#f5f7fb", minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <div style={{
        width: "220px",
        background: "white",
        padding: "30px 20px",
        borderRadius: "0 20px 20px 0",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
      }}>
        <h2 style={{ marginBottom: "40px" }}>LearnThru</h2>

        <p style={{ marginBottom: "20px", cursor: "pointer" }}>🏠 Dashboard</p>
        <p style={{ marginBottom: "20px", cursor: "pointer" }}>📚 Classroom</p>
        <p style={{ marginBottom: "20px", cursor: "pointer" }}>🎥 Lessons</p>
        <p style={{ marginBottom: "20px", cursor: "pointer" }}>📊 Progress</p>

        <button
          onClick={() => {
            localStorage.removeItem("username");
            setIsLoggedIn(false);
          }}
          style={{
            marginTop: "50px",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "#ff4d4d",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "40px" }}>
        
        {/* TOP BAR */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px"
        }}>
          <input
            type="text"
            placeholder="Search..."
            style={{
              padding: "12px 20px",
              width: "300px",
              borderRadius: "20px",
              border: "1px solid #ddd"
            }}
          />
          <p>12 May 2026, Friday</p>
        </div>

        {/* WELCOME CARD */}
        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h2>Welcome back, {username} 👋</h2>
            <p>New mechanics lessons are available.</p>
            <button style={{
              marginTop: "15px",
              padding: "10px 20px",
              borderRadius: "20px",
              border: "none",
              background: "#4c6fff",
              color: "white",
              cursor: "pointer"
            }}>
              Start Learning
            </button>
          </div>

          <div style={{
            width: "120px",
            height: "120px",
            background: "linear-gradient(135deg,#4c6fff,#7b61ff)",
            borderRadius: "20px"
          }} />
        </div>

        {/* CLASS CARDS */}
        <h3 style={{ marginBottom: "20px" }}>Classes</h3>

        <div style={{ display: "flex", gap: "20px" }}>
          
          <div style={{
            flex: 1,
            background: "linear-gradient(135deg,#4c6fff,#6a82fb)",
            color: "white",
            padding: "25px",
            borderRadius: "20px"
          }}>
            <h4>Mechanics - Unit I</h4>
            <p>12 Files</p>
          </div>

          <div style={{
            flex: 1,
            background: "linear-gradient(135deg,#ff758c,#ff7eb3)",
            color: "white",
            padding: "25px",
            borderRadius: "20px"
          }}>
            <h4>Mechanics - Unit II</h4>
            <p>15 Files</p>
          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: "260px",
        background: "white",
        padding: "30px",
        borderRadius: "20px 0 0 20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#ddd",
            margin: "0 auto 15px"
          }} />
          <h4>{username}</h4>
          <p>Student</p>
        </div>

        <div style={{ marginTop: "40px" }}>
          <h4>Reminders</h4>
          <p>📘 Quiz on Monday</p>
          <p>📊 Submit Assignment</p>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;