function Question({ question, answer, setAnswer, checkAnswer, showHint, message }) {
  return (
    <div>
      <h2>{question}</h2>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer"
      />

      <br /><br />

      <button onClick={checkAnswer}>Submit</button>
      <button onClick={showHint} style={{ marginLeft: "10px" }}>
        Hint
      </button>

      <p>{message}</p>
    </div>
  );
}

export default Question;