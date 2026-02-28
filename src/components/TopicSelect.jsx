import { useState, useEffect } from "react";

function TopicSelect({ onSelect }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const topicColors = [
    "linear-gradient(135deg,#4c6fff,#6a82fb)",
    "linear-gradient(135deg,#ff758c,#ff7eb3)",
    "linear-gradient(135deg,#11998e,#38ef7d)",
    "linear-gradient(135deg,#f7971e,#ffd200)",
    "linear-gradient(135deg,#7b61ff,#b06eff)",
  ];

  const topicEmojis = ["⚙️", "🌡️", "💧", "🔩", "🧪"];

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/questions/topics");
        const data = await res.json();
        setTopics(data);
      } catch (err) {
        console.log("Error fetching topics");
      }
      setLoading(false);
    };
    fetchTopics();
  }, []);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading topics... ⏳</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "10px" }}>📚 Select a Topic</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Choose a topic to start your personalised quiz!
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>

        {/* All Topics Card */}
        <div
          onClick={() => onSelect(null, "All Topics")}
          style={{
            background: "linear-gradient(135deg,#333,#555)",
            color: "white", padding: "30px", borderRadius: "20px",
            cursor: "pointer", gridColumn: "span 2",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
          <div>
            <h3>🎯 All Topics</h3>
            <p style={{ opacity: 0.8 }}>Mix of everything</p>
          </div>
          <span style={{ fontSize: "40px" }}>→</span>
        </div>

        {/* Individual Topic Cards */}
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            onClick={() => onSelect(topic.id, topic.name)}
            style={{
              background: topicColors[index % topicColors.length],
              color: "white", padding: "25px", borderRadius: "20px", cursor: "pointer"
            }}>
            <h2>{topicEmojis[index % topicEmojis.length]}</h2>
            <h4 style={{ marginTop: "10px" }}>{topic.name}</h4>
            <p style={{ opacity: 0.8, fontSize: "13px" }}>{topic.description}</p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default TopicSelect;