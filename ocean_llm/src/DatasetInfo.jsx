import { useEffect, useState } from 'react'

function StatRow({ label, value }) {
  return (
    <div className="d-flex justify-content-between border-bottom py-2">
      <div className="text-muted">{label}</div>
      <div className="ms-3 text-break">{value}</div>
    </div>
  )
}

export default function DatasetInfo() {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true
    async function fetchInfo() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch('https://ocean-llm-xu4c.onrender.com/dataset/info')
        const data = await res.json()
        if (!isMounted) return
        if (data.error) {
          setError(data.error)
        } else {
          setInfo(data)
        }
      } catch (e) {
        if (isMounted) setError('Failed to load dataset info')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchInfo()
    return () => { isMounted = false }
  }, [])

  const variables = info?.variables || []
  const dimensions = info?.dimensions || {}
  const coords = info?.coords || {}
  const attributes = info?.attributes || {}

  return (
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1 className="display-6 mb-2">Dataset Overview</h1>
        <p className="text-muted m-0">Quick stats about the loaded ocean dataset.</p>
      </header>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-2">
              <a href="/" className="btn btn-outline-secondary btn-sm">← Chat</a>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => window.location.reload()}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>

          {loading && <div className="alert alert-info">Loading dataset info...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="card card-glass h-100">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Variables</h5>
                    {variables.length === 0 && <div className="text-muted">None</div>}
                    {variables.length > 0 && (
                      <ul className="mb-0">
                        {variables.map((v) => (
                          <li key={v} className="text-break">{v}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="card card-glass h-100">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Dimensions</h5>
                    {Object.keys(dimensions).length === 0 && <div className="text-muted">None</div>}
                    {Object.entries(dimensions).map(([k, v]) => (
                      <StatRow key={k} label={k} value={v} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="card card-glass h-100">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Coordinates</h5>
                    {Object.keys(coords).length === 0 && <div className="text-muted">None</div>}
                    {Object.entries(coords).map(([k, v]) => (
                      <div key={k} className="mb-2">
                        <div className="fw-semibold">{k}</div>
                        <div className="small text-muted">min: {v.min}, max: {v.max}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="card card-glass h-100">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Attributes</h5>
                    {Object.keys(attributes).length === 0 && <div className="text-muted">None</div>}
                    {Object.entries(attributes).map(([k, v]) => (
                      <StatRow key={k} label={k} value={String(v)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


