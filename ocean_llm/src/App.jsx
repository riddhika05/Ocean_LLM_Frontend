import { useState } from 'react'
import './App.css'

async function askQuestion(question) {
  try {
    const response = await fetch("http://127.0.0.1:8000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    })

    const data = await response.json()
    return data.answer
  } catch (error) {
    console.error("Error querying backend:", error)
    throw error
  }
}

function App() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return
    setIsLoading(true)
    setError("")
    setAnswer("")
    try {
      const res = await askQuestion(question.trim())
      setAnswer(res || "No answer received.")
    } catch (err) {
      setError("Failed to reach backend. Ensure API is running at 127.0.0.1:8000.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <h1>Ocean Data Chatbot</h1>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask about ocean data..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
          className="chat-input"
        />
        <button type="submit" disabled={isLoading} className="chat-send">
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && <div className="chat-error">{error}</div>}

      <div className="chat-answer">
        {isLoading && <div className="chat-loading">Thinking...</div>}
        {!isLoading && answer && (
          <>
            <div className="answer-label">Answer</div>
            <div className="answer-bubble">{answer}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
