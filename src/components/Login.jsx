import { useState } from "react";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async () => {
    if (username === "" || password === "") {
      setError("Please enter username and password");
      return;
    }

    const endpoint = isRegistering ? "register" : "login";

    try {
      const response = await fetch(`http://localhost:3001/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      if (!isRegistering) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("user_id", data.user_id);
        setIsLoggedIn(true);
      } else {
        setError("Account created! Please log in.");
        setIsRegistering(false);
      }

    } catch (err) {
      setError("Cannot connect to server. Is the backend running?");
    }
  };

  return (
    <div style={{
      height: "100vh", width: "100vw",
      display: "flex", justifyContent: "center", alignItems: "center",
      background: "linear-gradient(to right, #1e3c72, #2a5298)"
    }}>
      <div style={{
        background: "white", padding: "40px", borderRadius: "12px",
        width: "350px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", textAlign: "center"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0 }}>⚙️</h1>
          <h2 style={{ margin: "5px 0", color: "#1e3c72" }}>Smart Mechanics Learning</h2>
          <p style={{ color: "#666", fontSize: "14px" }}>
            {isRegistering ? "Create an account" : "Login to continue"}
          </p>
        </div>

        <input
          type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

        <button onClick={handleSubmit} style={{
          width: "100%", padding: "10px", backgroundColor: "#1e3c72",
          color: "white", border: "none", borderRadius: "6px",
          cursor: "pointer", fontWeight: "bold"
        }}>
          {isRegistering ? "Register" : "Login"}
        </button>

        <p style={{ marginTop: "15px", color: "#666", fontSize: "14px" }}>
          {isRegistering ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={() => { setIsRegistering(!isRegistering); setError(""); }}
            style={{ color: "#1e3c72", cursor: "pointer", fontWeight: "bold" }}
          >
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;