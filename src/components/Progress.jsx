import { useState, useEffect } from "react";

function Progress() {
  const user_id = localStorage.getItem("user_id");
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/progress/${user_id}`);
        const data = await res.json();
        setStats(data.stats);
        setHistory(data.history);
      } catch (err) {
        console.log("Error fetching progress");
      }
      setLoading(false);
    };
    fetchProgress();
  }, []);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading... ⏳</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "30px" }}>📊 Your Progress</h2>

      {/* STATS CARDS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
        <div style={{
          flex: 1, background: "linear-gradient(135deg,#4c6fff,#6a82fb)",
          color: "white", padding: "25px", borderRadius: "20px", textAlign: "center"
        }}>
          <h1>{stats?.total_attempted || 0}</h1>
          <p>Questions Attempted</p>
        </div>

        <div style={{
          flex: 1, background: "linear-gradient(135deg,#11998e,#38ef7d)",
          color: "white", padding: "25px", borderRadius: "20px", textAlign: "center"
        }}>
          <h1>{stats?.total_correct || 0}</h1>
          <p>Correct Answers</p>
        </div>

        <div style={{
          flex: 1, background: "linear-gradient(135deg,#ff758c,#ff7eb3)",
          color: "white", padding: "25px", borderRadius: "20px", textAlign: "center"
        }}>
          <h1>{stats?.accuracy || 0}%</h1>
          <p>Accuracy</p>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <h3 style={{ marginBottom: "15px" }}>Recent Activity</h3>
      <div style={{
        background: "white", borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)", overflow: "hidden"
      }}>
        {history.length === 0 ? (
          <p style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            No attempts yet. Start a quiz! 🎯
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f7fb" }}>
                <th style={{ padding: "15px", textAlign: "left" }}>Question</th>
                <th style={{ padding: "15px", textAlign: "center" }}>Result</th>
                <th style={{ padding: "15px", textAlign: "right" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index} style={{ borderTop: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "15px" }}>{item.question_text}</td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    {item.is_correct ? "✅" : "❌"}
                  </td>
                  <td style={{ padding: "15px", textAlign: "right", color: "#666", fontSize: "13px" }}>
                    {new Date(item.attempted_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Progress;