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
      <div
        style={{
          background: "#5f3a2d",
          border: "2px solid #d97706",
          borderRadius: 12,
          padding: 20,
          color: "#fed7aa",
        }}
      >
        <p style={{ margin: 0, marginBottom: 8, fontWeight: 600 }}>
          ⚠️ Error loading stats
        </p>
        <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
      </div>
    );
  }

  if (!stats || stats.message) {
    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: 40,
          marginBottom: 30,
          boxShadow: "none",
          border: "1px solid #d0e8f5",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#4a7a9b", fontSize: 16 }}>No simulations run yet</p>
      </div>
    );
  }

  const avgVvpTime = stats.averageVvpTime?.toFixed(2);
  const minTime = stats.minVvpTime?.toFixed(2);
  const maxTime = stats.maxVvpTime?.toFixed(2);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: 40,
        marginBottom: 30,
        boxShadow: "none",
        border: "1px solid #d0e8f5",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0, color: "#0f2a4a", fontSize: 22 }}>
          📊 Timing Statistics
        </h2>
        <button
          onClick={resetStats}
          disabled={loading}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 500,
            background: "#f0f7fd",
            color: "#4a7a9b",
            border: "1px solid #d0e8f5",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.background = "#4a3f5f";
              e.target.style.color = "#0f2a4a";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#f0f7fd";
            e.target.style.color = "#4a7a9b";
          }}
        >
          {loading ? "⏳ Loading…" : "🔄 Reset"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "#f0f7fd",
            padding: 20,
            borderRadius: 12,
            borderLeft: "4px solid #1565a0",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#4a7a9b",
              fontWeight: 500,
            }}
          >
            Total Runs
          </p>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: 32,
              fontWeight: 700,
              color: "#1565a0",
            }}
          >
            {stats.totalRuns}
          </p>
        </div>
        <div
          style={{
            background: "#f0f7fd",
            padding: 20,
            borderRadius: 12,
            borderLeft: "4px solid #0288d1",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#4a7a9b",
              fontWeight: 500,
            }}
          >
            Average Exec Time
          </p>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: 24,
              fontWeight: 700,
              color: "#0288d1",
            }}
          >
            {avgVvpTime} ms
          </p>
        </div>
        <div
          style={{
            background: "#f0f7fd",
            padding: 20,
            borderRadius: 12,
            borderLeft: "4px solid #2e7d32",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#4a7a9b",
              fontWeight: 500,
            }}
          >
            Min / Max Time
          </p>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: 18,
              fontWeight: 600,
              color: "#2e7d32",
            }}
          >
            {minTime} / {maxTime} ms
          </p>
        </div>
      </div>

      {/* Multiplier Comparison Summary */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#0f2a4a", fontSize: 16 }}>
          ⚡ Multiplier Comparison
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          <div
            style={{
              background: stats.wallaceTreeStats
                ? "rgba(139, 92, 246, 0.15)"
                : "#f0f7fd",
              padding: 16,
              borderRadius: 8,
              borderLeft: "3px solid #1565a0",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#4a7a9b",
                fontWeight: 500,
              }}
            >
              Wallace Tree
            </p>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: 18,
                fontWeight: 700,
                color: "#1565a0",
              }}
            >
              {stats.wallaceTreeStats?.averageDelay || "N/A"} ns
            </p>
            <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#4a7a9b" }}>
              Avg delay
            </p>
          </div>
          <div
            style={{
              background: stats.arrayMultiplierStats
                ? "rgba(16, 185, 129, 0.15)"
                : "#f0f7fd",
              padding: 16,
              borderRadius: 8,
              borderLeft: "3px solid #2e7d32",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#4a7a9b",
                fontWeight: 500,
              }}
            >
              Array Multiplier
            </p>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: 18,
                fontWeight: 700,
                color: "#2e7d32",
              }}
            >
              {stats.arrayMultiplierStats?.averageDelay || "N/A"} ns
            </p>
            <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#4a7a9b" }}>
              Avg delay
            </p>
          </div>
          <div
            style={{
              background: "#f0f7fd",
              padding: 16,
              borderRadius: 8,
              borderLeft: "3px solid #f57c00",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#4a7a9b",
                fontWeight: 500,
              }}
            >
              Faster Architecture
            </p>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: 18,
                fontWeight: 700,
                color: "#f57c00",
              }}
            >
              {stats.fasterArchitecture || "N/A"}
            </p>
            <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#4a7a9b" }}>
              Overall winner
            </p>
          </div>
        </div>
      </div>

      {/* Win/Loss Record */}
      {stats.wallaceWins !== undefined && (
        <div
          style={{
            background: "#f5f9fd",
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <p
            style={{
              margin: "0 0 12px 0",
              color: "#0f2a4a",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Head-to-Head Record
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "8px",
                background: "#ffffff",
                borderRadius: 6,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1565a0",
                }}
              >
                {stats.wallaceWins}
              </p>
              <p
                style={{ margin: "4px 0 0 0", fontSize: 11, color: "#4a7a9b" }}
              >
                Wallace Wins
              </p>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "8px",
                background: "#ffffff",
                borderRadius: 6,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#2e7d32",
                }}
              >
                {stats.arrayWins}
              </p>
              <p
                style={{ margin: "4px 0 0 0", fontSize: 11, color: "#4a7a9b" }}
              >
                Array Wins
              </p>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "8px",
                background: "#ffffff",
                borderRadius: 6,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#f57c00",
                }}
              >
                {stats.ties}
              </p>
              <p
                style={{ margin: "4px 0 0 0", fontSize: 11, color: "#4a7a9b" }}
              >
                Ties
              </p>
            </div>
          </div>
        </div>
      )}

      {stats.history && stats.history.length > 0 && (
        <div>
          <h3 style={{ margin: "0 0 16px 0", color: "#0f2a4a", fontSize: 16 }}>
            Recent Runs
          </h3>
          <div
            style={{
              overflowX: "auto",
              background: "#f5f9fd",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
                color: "#4a7a9b",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #d0e8f5" }}>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "left",
                      color: "#0f2a4a",
                      fontWeight: 600,
                    }}
                  >
                    A × B
                  </th>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "right",
                      color: "#0f2a4a",
                      fontWeight: 600,
                    }}
                  >
                    Wallace (ns)
                  </th>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "right",
                      color: "#0f2a4a",
                      fontWeight: 600,
                    }}
                  >
                    Array (ns)
                  </th>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "center",
                      color: "#0f2a4a",
                      fontWeight: 600,
                    }}
                  >
                    Faster
                  </th>
                  <th
                    style={{
                      padding: 8,
                      textAlign: "right",
                      color: "#0f2a4a",
                      fontWeight: 600,
                    }}
                  >
                    Time (ms)
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.history
                  .slice()
                  .reverse()
                  .map((run, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e0eef7" }}>
                      <td style={{ padding: 8, textAlign: "left" }}>
                        {run.A} × {run.B}
                      </td>
                      <td
                        style={{
                          padding: 8,
                          textAlign: "right",
                          color:
                            run.wallaceDelay < run.arrayDelay
                              ? "#1565a0"
                              : "#4a7a9b",
                          fontWeight:
                            run.wallaceDelay < run.arrayDelay ? 600 : 400,
                        }}
                      >
                        {run.wallaceDelay}
                      </td>
                      <td
                        style={{
                          padding: 8,
                          textAlign: "right",
                          color:
                            run.arrayDelay < run.wallaceDelay
                              ? "#2e7d32"
                              : "#4a7a9b",
                          fontWeight:
                            run.arrayDelay < run.wallaceDelay ? 600 : 400,
                        }}
                      >
                        {run.arrayDelay}
                      </td>
                      <td
                        style={{
                          padding: 8,
                          textAlign: "center",
                          color:
                            run.fasterMultiplier === "Wallace"
                              ? "#1565a0"
                              : run.fasterMultiplier === "Array"
                                ? "#2e7d32"
                                : "#f57c00",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {run.fasterMultiplier === "Wallace"
                          ? "🔷"
                          : run.fasterMultiplier === "Array"
                            ? "🔶"
                            : "="}
                      </td>
                      <td
                        style={{
                          padding: 8,
                          textAlign: "right",
                          color: "#0288d1",
                        }}
                      >
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
