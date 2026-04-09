import { useState } from "react";
import PartialProducts from "./components/PartialProducts";
import WallaceVisualizer from "./components/WallaceVisualizer";
import TimingStats from "./components/TimingStats";

function parseInput(raw) {
  if (raw === "" || raw === "-") return NaN;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? Math.max(-2147483648, Math.min(2147483647, n)) : NaN;
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

  const handleA = (e) => { setRawA(e.target.value); setResult(null); };
  const handleB = (e) => { setRawB(e.target.value); setResult(null); };

  const blurA = () => setRawA(isNaN(parseInput(rawA)) ? "0" : String(A));
  const blurB = () => setRawB(isNaN(parseInput(rawB)) ? "0" : String(B));

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1625 0%, #2a1f3d 100%)",
      backgroundAttachment: "fixed",
      padding: "60px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 50, color: "white" }}>
          <h1 style={{ fontSize: 42, margin: 0, marginBottom: 10, fontWeight: 700 }}>
            ✨ Wallace Tree Multiplier
          </h1>
          <p style={{ fontSize: 18, opacity: 0.8, margin: 0 }}>
            32-bit Signed Multiplier using Hardware-Optimized Booth Encoding & Carry Lookahead Adder
          </p>
        </div>

        {/* Input Card */}
        <div style={{
          background: "#2a2535",
          borderRadius: 16,
          padding: 40,
          marginBottom: 30,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          border: "1px solid #3d3550",
        }}>
          <h2 style={{ marginTop: 0, marginBottom: 24, color: "#e5d4ff", fontSize: 22 }}>Enter Operands</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: 20,
            alignItems: "end",
            flexWrap: "wrap",
          }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#b8a8d8" }}>
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
                  background: "#1a1625",
                  color: "#e5d4ff",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                onBlur={(e) => { e.target.style.borderColor = "#3d3550"; blurA(); }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#b8a8d8" }}>
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
                  background: "#1a1625",
                  color: "#e5d4ff",
                }}
                onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                onBlur={(e) => { e.target.style.borderColor = "#3d3550"; blurB(); }}
              />
            </div>
            <button
              onClick={runSimulation}
              disabled={loading}
              style={{
                padding: "12px 32px",
                fontSize: 16,
                fontWeight: 600,
                background: loading ? "#4a3f5f" : "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: loading ? "none" : "0 4px 15px rgba(139, 92, 246, 0.4)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.6)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(139, 92, 246, 0.4)";
                }
              }}
            >
              {loading ? "⏳ Running…" : "▶ Simulate"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "#5f3a2d",
            border: "2px solid #d97706",
            borderRadius: 12,
            padding: 20,
            marginBottom: 30,
            color: "#fed7aa",
          }}>
            <p style={{ margin: 0, marginBottom: 8, fontWeight: 600 }}>❌ Error</p>
            <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
            <small style={{ opacity: 0.8 }}>Make sure the backend is running: <code style={{ background: "#4a3f5f", padding: "2px 6px", borderRadius: 4 }}>cd backend && node server.js</code></small>
          </div>
        )}

        {/* Results Card */}
        {result && (
          <div style={{
            background: "#2a2535",
            borderRadius: 16,
            padding: 40,
            marginBottom: 30,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            border: "1px solid #3d3550",
          }}>
            <h2 style={{ marginTop: 0, color: "#e5d4ff", fontSize: 22 }}>Simulation Results</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20,
            }}>
              <div style={{
                background: "#3a2e52",
                padding: 20,
                borderRadius: 12,
                borderLeft: "4px solid #8b5cf6",
              }}>
                <p style={{ margin: 0, fontSize: 14, color: "#b8a8d8", fontWeight: 500 }}>Wallace Result</p>
                <p style={{ margin: "8px 0 0 0", fontSize: 28, fontWeight: 700, color: "#a78bfa" }}>
                  {result.wallace}
                </p>
              </div>
              <div style={{
                background: "#3a2e52",
                padding: 20,
                borderRadius: 12,
                borderLeft: "4px solid #d946ef",
              }}>
                <p style={{ margin: 0, fontSize: 14, color: "#b8a8d8", fontWeight: 500 }}>Array Result</p>
                <p style={{ margin: "8px 0 0 0", fontSize: 28, fontWeight: 700, color: "#e879f9" }}>
                  {result.array}
                </p>
              </div>
              <div style={{
                background: "#3a2e52",
                padding: 20,
                borderRadius: 12,
                borderLeft: "4px solid #10b981",
              }}>
                <p style={{ margin: 0, fontSize: 14, color: "#b8a8d8", fontWeight: 500 }}>Expected</p>
                <p style={{ margin: "8px 0 0 0", fontSize: 28, fontWeight: 700, color: "#6ee7b7" }}>
                  {result.expected}
                </p>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              {result.wallace === result.expected
                ? <p style={{ color: "#6ee7b7", fontWeight: 600 }}>✅ Wallace result matches expected</p>
                : <p style={{ color: "#f87171", fontWeight: 600 }}>❌ Mismatch! Wallace={result.wallace}, Expected={result.expected}</p>
              }
            </div>

            {/* Timing Information */}
            {result.timing && (
              <div style={{
                marginTop: 30,
                borderTop: "1px solid #3d3550",
                paddingTop: 20,
              }}>
                <h3 style={{ marginTop: 0, marginBottom: 16, color: "#e5d4ff", fontSize: 18 }}>⏱️ Execution Timing</h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  marginBottom: 20,
                }}>
                  <div style={{
                    background: "#3a2e52",
                    padding: 16,
                    borderRadius: 8,
                    borderLeft: "3px solid #06b6d4",
                  }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>VVP Execution</p>
                    <p style={{ margin: "6px 0 0 0", fontSize: 20, fontWeight: 600, color: "#22d3ee" }}>
                      {result.timing.vvpExecutionTime.toFixed(2)} ms
                    </p>
                  </div>
                  <div style={{
                    background: "#3a2e52",
                    padding: 16,
                    borderRadius: 8,
                    borderLeft: "3px solid #8b5cf6",
                  }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Total Simulation</p>
                    <p style={{ margin: "6px 0 0 0", fontSize: 20, fontWeight: 600, color: "#a78bfa" }}>
                      {result.timing.totalSimulationTime.toFixed(2)} ms
                    </p>
                  </div>
                  <div style={{
                    background: "#3a2e52",
                    padding: 16,
                    borderRadius: 8,
                    borderLeft: "3px solid #f59e0b",
                  }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Compilation Overhead</p>
                    <p style={{ margin: "6px 0 0 0", fontSize: 20, fontWeight: 600, color: "#fbbf24" }}>
                      {result.timing.compilationOverhead.toFixed(2)} ms
                    </p>
                  </div>
                </div>

                {/* Multiplier Comparison */}
                <h4 style={{ marginTop: 20, marginBottom: 12, color: "#e5d4ff", fontSize: 16 }}>⚡ Multiplier Propagation Delay Comparison</h4>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 12,
                }}>
                  <div style={{
                    background: result.timing.fasterMultiplier === "Wallace" ? "rgba(139, 92, 246, 0.2)" : "#3a2e52",
                    padding: 14,
                    borderRadius: 8,
                    borderLeft: `3px solid ${result.timing.fasterMultiplier === "Wallace" ? "#8b5cf6" : "#6b7280"}`,
                    opacity: result.timing.fasterMultiplier === "Wallace" ? 1 : 0.7,
                  }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#b8a8d8", fontWeight: 500 }}>Wallace Tree</p>
                    <p style={{ margin: "6px 0 0 0", fontSize: 20, fontWeight: 700, color: "#a78bfa" }}>
                      {result.timing.wallaceDelay} ns
                    </p>
                    {result.timing.fasterMultiplier === "Wallace" && (
                      <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#a78bfa", fontWeight: 600 }}>⚡ Faster</p>
                    )}
                  </div>
                  <div style={{
                    background: result.timing.fasterMultiplier === "Array" ? "rgba(16, 185, 129, 0.2)" : "#3a2e52",
                    padding: 14,
                    borderRadius: 8,
                    borderLeft: `3px solid ${result.timing.fasterMultiplier === "Array" ? "#10b981" : "#6b7280"}`,
                    opacity: result.timing.fasterMultiplier === "Array" ? 1 : 0.7,
                  }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#b8a8d8", fontWeight: 500 }}>Array Multiplier</p>
                    <p style={{ margin: "6px 0 0 0", fontSize: 20, fontWeight: 700, color: "#6ee7b7" }}>
                      {result.timing.arrayDelay} ns
                    </p>
                    {result.timing.fasterMultiplier === "Array" && (
                      <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#6ee7b7", fontWeight: 600 }}>⚡ Faster</p>
                    )}
                  </div>
                  <div style={{
                    background: "#3a2e52",
                    padding: 14,
                    borderRadius: 8,
                    borderLeft: "3px solid #f59e0b",
                  }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#b8a8d8", fontWeight: 500 }}>Difference</p>
                    <p style={{ margin: "6px 0 0 0", fontSize: 20, fontWeight: 700, color: "#fbbf24" }}>
                      {result.timing.delayDifference} ns
                    </p>
                    <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#fdba74", fontWeight: 500 }}>
                      {result.timing.fasterMultiplier !== "Equal" ? `${result.timing.fasterMultiplier} is faster` : "Equal"}
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
            <PartialProducts partialProducts={result.partialProducts} A={A} B={B} />
            <WallaceVisualizer A={A} B={B} result={result.wallace} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;