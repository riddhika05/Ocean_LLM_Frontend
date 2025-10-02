import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

async function askQuestion(question) {
  try {
    const response = await fetch("https://ocean-llm-xu4c.onrender.com/query", {
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
  const sampleQueries = [
    "What is the average salinity in the region lat 8-12, lon 75-78?",
    "What is the ocean current direction at lat=15, lon=85 on 2024-08-15?",
    "What is the maximum sea surface temperature and when does it occur?",
  ]

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
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1 className="display-6 mb-2">Ocean Data Chatbot</h1>
        <p className="text-muted m-0">Ask domain-specific questions on salinity, currents, and SST.</p>
        <div className="mt-3">
          <Link to="/dataset" className="btn btn-outline-primary">
            📊 View Dataset Info
          </Link>
        </div>
      </header>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <form className="mb-3" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Ask about ocean data..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isLoading}
                className="form-control"
              />
              <button type="submit" disabled={isLoading} className="btn btn-primary">
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-4">
            <div className="mb-2">Try a sample query:</div>
            <div className="d-flex flex-wrap gap-2">
              {sampleQueries.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="chip"
                  onClick={() => setQuestion(q)}
                  title="Click to use this query"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="card card-glass">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="fw-semibold">Answer</div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setQuestion("")
                      setAnswer("")
                      setError("")
                    }}
                    disabled={isLoading || (!answer && !question)}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={async () => {
                      if (!answer) return
                      try {
                        await navigator.clipboard.writeText(answer)
                      } catch (_) {
                        // no-op
                      }
                    }}
                    disabled={!answer}
                  >
                    Copy
                  </button>
                </div>
              </div>

              {isLoading && <div className="text-muted">Thinking...</div>}
              {!isLoading && !!answer && (
                <div className="answer-surface">{answer}</div>
              )}
              {!isLoading && !answer && !error && (
                <div className="text-muted">Ask a question to see the answer here.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
