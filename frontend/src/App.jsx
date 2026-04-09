import { useState } from "react";
import PartialProducts from "./components/PartialProducts";
import WallaceVisualizer from "./components/WallaceVisualizer";
import TimingStats from "./components/TimingStats";

function parseInput(raw) {
  if (raw === "" || raw === "-") return NaN;
  const n = parseInt(raw, 10);
  return Number.isFinite(n)
    ? Math.max(-2147483648, Math.min(2147483647, n))
    : NaN;
}

function App() {
  const [rawA, setRawA] = useState("12");
  const [rawB, setRawB] = useState("34");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const A = isNaN(parseInput(rawA)) ? 0 : parseInput(rawA);
  const B = isNaN(parseInput(rawB)) ? 0 : parseInput(rawB);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/multiply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ A, B }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Server error");
      }
      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleA = (e) => {
    setRawA(e.target.value);
    setResult(null);
  };
  const handleB = (e) => {
    setRawB(e.target.value);
    setResult(null);
  };

  const blurA = () => setRawA(isNaN(parseInput(rawA)) ? "0" : String(A));
  const blurB = () => setRawB(isNaN(parseInput(rawB)) ? "0" : String(B));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#dceef8",
        padding: "48px 40px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{ textAlign: "center", marginBottom: 50, color: "#0f2a4a" }}
        >
          <h1
            style={{
              fontSize: 42,
              margin: 0,
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            Wallace Tree Multiplier
          </h1>
          <p style={{ fontSize: 18, opacity: 0.8, margin: 0 }}>
            32-bit Signed Multiplier using Hardware-Optimized Booth Encoding &
            Carry Lookahead Adder
          </p>
        </div>

        {/* Input Card */}
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
          <h2
            style={{
              marginTop: 0,
              marginBottom: 24,
              color: "#0f2a4a",
              fontSize: 22,
            }}
          >
            Enter Operands
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: 20,
              alignItems: "end",
              flexWrap: "wrap",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "#4a7a9b",
                }}
              >
                Operand A
              </label>
              <input
                type="number"
                min={-2147483648}
                max={2147483647}
                value={rawA}
                onChange={handleA}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: 16,
                  border: "2px solid #3d3550",
                  borderRadius: 8,
                  boxSizing: "border-box",
                  background: "#e8f4fb",
                  color: "#0f2a4a",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1976d2")}
                onBlur={(e) => {
                  e.target.style.borderColor = "#b8d9ef";
                  blurA();
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "#4a7a9b",
                }}
              >
                Operand B
              </label>
              <input
                type="number"
                min={-2147483648}
                max={2147483647}
                value={rawB}
                onChange={handleB}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: 16,
                  border: "2px solid #3d3550",
                  borderRadius: 8,
                  boxSizing: "border-box",
                  background: "#e8f4fb",
                  color: "#0f2a4a",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1976d2")}
                onBlur={(e) => {
                  e.target.style.borderColor = "#b8d9ef";
                  blurB();
                }}
              />
            </div>
            <button
              onClick={runSimulation}
              disabled={loading}
              style={{
                padding: "12px 32px",
                fontSize: 16,
                fontWeight: 600,
                background: loading
                  ? "#b8d9ef"
                  : "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
                color: "#0f2a4a",
                border: "none",
                borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: loading ? "none" : "none",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "none";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              {loading ? "⏳ Running…" : "▶ Simulate"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "#fff3f3",
              border: "1.5px solid #e57373",
              borderRadius: 12,
              padding: 20,
              marginBottom: 30,
              color: "#b71c1c",
            }}
          >
            <p style={{ margin: 0, marginBottom: 8, fontWeight: 600 }}>
              ❌ Error
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
            <small style={{ opacity: 0.8 }}>
              Make sure the backend is running:{" "}
              <code
                style={{
                  background: "#b8d9ef",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                cd backend && node server.js
              </code>
            </small>
          </div>
        )}

        {/* Results Card */}
        {result && (
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
            <h2 style={{ marginTop: 0, color: "#0f2a4a", fontSize: 22 }}>
              Simulation Results
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 20,
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
                    fontSize: 14,
                    color: "#4a7a9b",
                    fontWeight: 500,
                  }}
                >
                  Wallace Result
                </p>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#1565a0",
                  }}
                >
                  {result.wallace}
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
                    fontSize: 14,
                    color: "#4a7a9b",
                    fontWeight: 500,
                  }}
                >
                  Array Result
                </p>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#0288d1",
                  }}
                >
                  {result.array}
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
                    fontSize: 14,
                    color: "#4a7a9b",
                    fontWeight: 500,
                  }}
                >
                  Expected
                </p>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#2e7d32",
                  }}
                >
                  {result.expected}
                </p>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              {result.wallace === result.expected ? (
                <p style={{ color: "#2e7d32", fontWeight: 600 }}>
                  ✅ Wallace result matches expected
                </p>
              ) : (
                <p style={{ color: "#c62828", fontWeight: 600 }}>
                  ❌ Mismatch! Wallace={result.wallace}, Expected=
                  {result.expected}
                </p>
              )}
            </div>

            {/* Timing Information */}
            {result.timing && (
              <div
                style={{
                  marginTop: 30,
                  borderTop: "1px solid #d0e8f5",
                  paddingTop: 20,
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: 16,
                    color: "#0f2a4a",
                    fontSize: 18,
                  }}
                >
                  ⏱️ Execution Timing
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      background: "#f0f7fd",
                      padding: 16,
                      borderRadius: 8,
                      borderLeft: "3px solid #0288d1",
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
                      VVP Execution
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0 0",
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#0288d1",
                      }}
                    >
                      {result.timing.vvpExecutionTime.toFixed(2)} ms
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#f0f7fd",
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
                      Total Simulation
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0 0",
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#1565a0",
                      }}
                    >
                      {result.timing.totalSimulationTime.toFixed(2)} ms
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
                      Compilation Overhead
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0 0",
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#f57c00",
                      }}
                    >
                      {result.timing.compilationOverhead.toFixed(2)} ms
                    </p>
                  </div>
                </div>

                {/* Multiplier Comparison */}
                <h4
                  style={{
                    marginTop: 20,
                    marginBottom: 12,
                    color: "#0f2a4a",
                    fontSize: 16,
                  }}
                >
                  ⚡ Multiplier Propagation Delay Comparison
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      background:
                        result.timing.fasterMultiplier === "Wallace"
                          ? "rgba(139, 92, 246, 0.2)"
                          : "#f0f7fd",
                      padding: 14,
                      borderRadius: 8,
                      borderLeft: `3px solid ${result.timing.fasterMultiplier === "Wallace" ? "#1976d2" : "#6b7280"}`,
                      opacity:
                        result.timing.fasterMultiplier === "Wallace" ? 1 : 0.7,
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
                        margin: "6px 0 0 0",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#1565a0",
                      }}
                    >
                      {result.timing.wallaceDelay} ns
                    </p>
                    {result.timing.fasterMultiplier === "Wallace" && (
                      <p
                        style={{
                          margin: "6px 0 0 0",
                          fontSize: 11,
                          color: "#1565a0",
                          fontWeight: 600,
                        }}
                      >
                        ⚡ Faster
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      background:
                        result.timing.fasterMultiplier === "Array"
                          ? "rgba(16, 185, 129, 0.2)"
                          : "#f0f7fd",
                      padding: 14,
                      borderRadius: 8,
                      borderLeft: `3px solid ${result.timing.fasterMultiplier === "Array" ? "#2e7d32" : "#c9e2f4"}`,
                      opacity:
                        result.timing.fasterMultiplier === "Array" ? 1 : 0.7,
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
                        margin: "6px 0 0 0",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#2e7d32",
                      }}
                    >
                      {result.timing.arrayDelay} ns
                    </p>
                    {result.timing.fasterMultiplier === "Array" && (
                      <p
                        style={{
                          margin: "6px 0 0 0",
                          fontSize: 11,
                          color: "#2e7d32",
                          fontWeight: 600,
                        }}
                      >
                        ⚡ Faster
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      background: "#f0f7fd",
                      padding: 14,
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
                      Difference
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0 0",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#f57c00",
                      }}
                    >
                      {result.timing.delayDifference} ns
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0 0",
                        fontSize: 11,
                        color: "#8a6000",
                        fontWeight: 500,
                      }}
                    >
                      {result.timing.fasterMultiplier !== "Equal"
                        ? `${result.timing.fasterMultiplier} is faster`
                        : "Equal"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Components */}
        {result && (
          <>
            <TimingStats />
            <PartialProducts
              partialProducts={result.partialProducts}
              A={A}
              B={B}
            />
            <WallaceVisualizer A={A} B={B} result={result.wallace} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
