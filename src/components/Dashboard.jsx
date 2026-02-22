import { useState } from "react";
import Question from "./Question";

function Dashboard({ setIsLoggedIn }) {
  const questions = [
    {
      question: "What is the SI unit of Force?",
      answer: "newton",
      hint: "It is named after Isaac Newton."
    },
    {
      question: "What is the formula for acceleration?",
      answer: "force/mass",
      hint: "It comes from Newton's Second Law."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  const checkAnswer = () => {
    if (
      userAnswer.toLowerCase() ===
      questions[currentIndex].answer.toLowerCase()
    ) {
      setScore(score + 1);
      setMessage("Correct ✅");
    } else {
      setMessage("Wrong ❌");
    }
  };

  const showHint = () => {
    setMessage("Hint: " + questions[currentIndex].hint);
  };

  const nextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setUserAnswer("");
    setMessage("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      {/* Logout Button */}
      <div style={{ textAlign: "right" }}>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h1>Mechanics Quiz ⚙️</h1>
      <h3>Score: {score}</h3>

      {currentIndex < questions.length ? (
        <>
          <Question
            question={questions[currentIndex].question}
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
        <h2>Quiz Completed 🎉 Final Score: {score}</h2>
      )}
    </div>
  );
}

export default Dashboard;