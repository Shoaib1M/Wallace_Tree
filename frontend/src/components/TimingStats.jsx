import { useState, useEffect } from "react";

export default function TimingStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/timing/stats");
      if (!res.ok) {
        throw new Error("Failed to fetch timing stats");
      }
      setStats(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/timing/reset", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to reset timing stats");
      }
      setStats({ message: "Timing history cleared" });
      setTimeout(fetchStats, 500);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{
        background: "#5f3a2d",
        border: "2px solid #d97706",
        borderRadius: 12,
        padding: 20,
        color: "#fed7aa",
      }}>
        <p style={{ margin: 0, marginBottom: 8, fontWeight: 600 }}>⚠️ Error loading stats</p>
        <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
      </div>
    );
  }

  if (!stats || stats.message) {
    return (
      <div style={{
        background: "#2a2535",
        borderRadius: 16,
        padding: 40,
        marginBottom: 30,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        border: "1px solid #3d3550",
        textAlign: "center",
      }}>
        <p style={{ color: "#b8a8d8", fontSize: 16 }}>No simulations run yet</p>
      </div>
    );
  }

  const avgVvpTime = stats.averageVvpTime?.toFixed(2);
  const minTime = stats.minVvpTime?.toFixed(2);
  const maxTime = stats.maxVvpTime?.toFixed(2);

  return (
    <div style={{
      background: "#2a2535",
      borderRadius: 16,
      padding: 40,
      marginBottom: 30,
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      border: "1px solid #3d3550",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}>
        <h2 style={{ margin: 0, color: "#e5d4ff", fontSize: 22 }}>📊 Timing Statistics</h2>
        <button
          onClick={resetStats}
          disabled={loading}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 500,
            background: "#3a2e52",
            color: "#b8a8d8",
            border: "1px solid #3d3550",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.background = "#4a3f5f";
              e.target.style.color = "#e5d4ff";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#3a2e52";
            e.target.style.color = "#b8a8d8";
          }}
        >
          {loading ? "⏳ Loading…" : "🔄 Reset"}
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 24,
      }}>
        <div style={{
          background: "#3a2e52",
          padding: 20,
          borderRadius: 12,
          borderLeft: "4px solid #8b5cf6",
        }}>
          <p style={{ margin: 0, fontSize: 13, color: "#b8a8d8", fontWeight: 500 }}>Total Runs</p>
          <p style={{ margin: "8px 0 0 0", fontSize: 32, fontWeight: 700, color: "#a78bfa" }}>
            {stats.totalRuns}
          </p>
        </div>
        <div style={{
          background: "#3a2e52",
          padding: 20,
          borderRadius: 12,
          borderLeft: "4px solid #06b6d4",
        }}>
          <p style={{ margin: 0, fontSize: 13, color: "#b8a8d8", fontWeight: 500 }}>Average Exec Time</p>
          <p style={{ margin: "8px 0 0 0", fontSize: 24, fontWeight: 700, color: "#22d3ee" }}>
            {avgVvpTime} ms
          </p>
        </div>
        <div style={{
          background: "#3a2e52",
          padding: 20,
          borderRadius: 12,
          borderLeft: "4px solid #10b981",
        }}>
          <p style={{ margin: 0, fontSize: 13, color: "#b8a8d8", fontWeight: 500 }}>Min / Max Time</p>
          <p style={{ margin: "8px 0 0 0", fontSize: 18, fontWeight: 600, color: "#6ee7b7" }}>
            {minTime} / {maxTime} ms
          </p>
        </div>
      </div>

      {/* Multiplier Comparison Summary */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#e5d4ff", fontSize: 16 }}>⚡ Multiplier Comparison</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}>
          <div style={{
            background: stats.wallaceTreeStats ? "rgba(139, 92, 246, 0.15)" : "#3a2e52",
            padding: 16,
            borderRadius: 8,
            borderLeft: "3px solid #8b5cf6",
          }}>
            <p style={{ margin: 0, fontSize: 12, color: "#b8a8d8", fontWeight: 500 }}>Wallace Tree</p>
            <p style={{ margin: "8px 0 0 0", fontSize: 18, fontWeight: 700, color: "#a78bfa" }}>
              {stats.wallaceTreeStats?.averageDelay || "N/A"} ns
            </p>
            <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#94a3b8" }}>
              Avg delay
            </p>
          </div>
          <div style={{
            background: stats.arrayMultiplierStats ? "rgba(16, 185, 129, 0.15)" : "#3a2e52",
            padding: 16,
            borderRadius: 8,
            borderLeft: "3px solid #10b981",
          }}>
            <p style={{ margin: 0, fontSize: 12, color: "#b8a8d8", fontWeight: 500 }}>Array Multiplier</p>
            <p style={{ margin: "8px 0 0 0", fontSize: 18, fontWeight: 700, color: "#6ee7b7" }}>
              {stats.arrayMultiplierStats?.averageDelay || "N/A"} ns
            </p>
            <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#94a3b8" }}>
              Avg delay
            </p>
          </div>
          <div style={{
            background: "#3a2e52",
            padding: 16,
            borderRadius: 8,
            borderLeft: "3px solid #f59e0b",
          }}>
            <p style={{ margin: 0, fontSize: 12, color: "#b8a8d8", fontWeight: 500 }}>Faster Architecture</p>
            <p style={{ margin: "8px 0 0 0", fontSize: 18, fontWeight: 700, color: "#fbbf24" }}>
              {stats.fasterArchitecture || "N/A"}
            </p>
            <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#94a3b8" }}>
              Overall winner
            </p>
          </div>
        </div>
      </div>

      {/* Win/Loss Record */}
      {stats.wallaceWins !== undefined && (
        <div style={{
          background: "#1a1625",
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
        }}>
          <p style={{ margin: "0 0 12px 0", color: "#e5d4ff", fontSize: 13, fontWeight: 600 }}>Head-to-Head Record</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}>
            <div style={{ textAlign: "center", padding: "8px", background: "#2a2535", borderRadius: 6 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#a78bfa" }}>
                {stats.wallaceWins}
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "#b8a8d8" }}>
                Wallace Wins
              </p>
            </div>
            <div style={{ textAlign: "center", padding: "8px", background: "#2a2535", borderRadius: 6 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#6ee7b7" }}>
                {stats.arrayWins}
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "#b8a8d8" }}>
                Array Wins
              </p>
            </div>
            <div style={{ textAlign: "center", padding: "8px", background: "#2a2535", borderRadius: 6 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fbbf24" }}>
                {stats.ties}
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "#b8a8d8" }}>
                Ties
              </p>
            </div>
          </div>
        </div>
      )}

      {stats.history && stats.history.length > 0 && (
        <div>
          <h3 style={{ margin: "0 0 16px 0", color: "#e5d4ff", fontSize: 16 }}>Recent Runs</h3>
          <div style={{
            overflowX: "auto",
            background: "#1a1625",
            borderRadius: 8,
            padding: 12,
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
              color: "#b8a8d8",
            }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #3d3550" }}>
                  <th style={{ padding: 8, textAlign: "left", color: "#e5d4ff", fontWeight: 600 }}>A × B</th>
                  <th style={{ padding: 8, textAlign: "right", color: "#e5d4ff", fontWeight: 600 }}>Wallace (ns)</th>
                  <th style={{ padding: 8, textAlign: "right", color: "#e5d4ff", fontWeight: 600 }}>Array (ns)</th>
                  <th style={{ padding: 8, textAlign: "center", color: "#e5d4ff", fontWeight: 600 }}>Faster</th>
                  <th style={{ padding: 8, textAlign: "right", color: "#e5d4ff", fontWeight: 600 }}>Time (ms)</th>
                </tr>
              </thead>
              <tbody>
                {stats.history.slice().reverse().map((run, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #2a2535" }}>
                    <td style={{ padding: 8, textAlign: "left" }}>
                      {run.A} × {run.B}
                    </td>
                    <td style={{ 
                      padding: 8, 
                      textAlign: "right", 
                      color: run.wallaceDelay < run.arrayDelay ? "#a78bfa" : "#94a3b8",
                      fontWeight: run.wallaceDelay < run.arrayDelay ? 600 : 400,
                    }}>
                      {run.wallaceDelay}
                    </td>
                    <td style={{ 
                      padding: 8, 
                      textAlign: "right", 
                      color: run.arrayDelay < run.wallaceDelay ? "#6ee7b7" : "#94a3b8",
                      fontWeight: run.arrayDelay < run.wallaceDelay ? 600 : 400,
                    }}>
                      {run.arrayDelay}
                    </td>
                    <td style={{ 
                      padding: 8, 
                      textAlign: "center",
                      color: run.fasterMultiplier === "Wallace" ? "#a78bfa" : (run.fasterMultiplier === "Array" ? "#6ee7b7" : "#fbbf24"),
                      fontWeight: 600,
                      fontSize: 13,
                    }}>
                      {run.fasterMultiplier === "Wallace" ? "🔷" : (run.fasterMultiplier === "Array" ? "🔶" : "=")}
                    </td>
                    <td style={{ padding: 8, textAlign: "right", color: "#22d3ee" }}>
                      {run.vvpExecutionTime.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
