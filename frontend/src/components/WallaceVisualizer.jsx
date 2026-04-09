import React from "react";

const CARD = (style = {}) => ({
  padding: "16px 20px",
  borderRadius: 10,
  textAlign: "center",
  fontWeight: 500,
  ...style,
});

const ARROW = () => (
  <div style={{ fontSize: 32, color: "#a78bfa", lineHeight: 1 }}>↓</div>
);

function WallaceVisualizer({ A, B, result }) {
  return (
    <div style={{
      background: "#2a2535",
      borderRadius: 16,
      padding: 40,
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      border: "1px solid #3d3550",
    }}>
      <h2 style={{ marginTop: 0, color: "#e5d4ff", fontSize: 22 }}>Hardware Pipeline Architecture</h2>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}>
        {/* Inputs */}
        <div style={CARD({
          background: "#3a2a4a",
          border: "2px solid #8b5cf6",
          minWidth: 300,
        })}>
          <div style={{ fontSize: 13, color: "#b8a8d8", marginBottom: 8 }}>32-bit Signed Inputs</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#c4b5fd" }}>
            {A} × {B}
          </div>
        </div>
        <ARROW />

        {/* Booth Encoder */}
        <div style={CARD({
          background: "#3a3052",
          border: "2px solid #3b82f6",
          minWidth: 300,
        })}>
          <div style={{ fontWeight: 700, color: "#93c5fd", fontSize: 15 }}>Radix-4 Booth Encoder</div>
          <div style={{ fontSize: 12, color: "#87ceeb", marginTop: 4 }}>32 multiplier bits → 16 partial products</div>
        </div>
        <ARROW />

        {/* Partial Products */}
        <div style={CARD({
          background: "#2a3f2a",
          border: "2px solid #10b981",
          minWidth: 300,
        })}>
          <div style={{ fontWeight: 700, color: "#6ee7b7", fontSize: 15 }}>Partial Products</div>
          <div style={{ fontSize: 12, color: "#86efac", marginTop: 4 }}>16 × 64-bit values (pp0 ... pp15)</div>
        </div>
        <ARROW />

        {/* Wallace Tree */}
        <div style={CARD({
          background: "#402850",
          border: "2px solid #a855f7",
          minWidth: 300,
        })}>
          <div style={{ fontWeight: 700, color: "#d8b4fe", fontSize: 15 }}>Wallace Tree Reduction</div>
          <div style={{ fontSize: 12, color: "#e9d5ff", marginTop: 4 }}>5 stages of parallel adders</div>
        </div>
        <ARROW />

        {/* Carry Lookahead Adder */}
        <div style={CARD({
          background: "#3f2f1f",
          border: "2px solid #f97316",
          minWidth: 300,
        })}>
          <div style={{ fontWeight: 700, color: "#fed7aa", fontSize: 15 }}>Carry Lookahead Adder</div>
          <div style={{ fontSize: 12, color: "#fedd95", marginTop: 4 }}>64-bit hierarchical 4-bit CLA blocks</div>
        </div>
        <ARROW />

        {/* Final Product */}
        <div style={CARD({
          background: result !== undefined && result !== null ? "#4f2e2e" : "#3a3240",
          border: `2px solid ${result !== undefined && result !== null ? "#f87171" : "#5a4f70"}`,
          minWidth: 300,
        })}>
          <div style={{
            fontWeight: 700,
            color: result !== undefined && result !== null ? "#fca5a5" : "#c4b5fd",
            fontSize: 15,
          }}>
            64-bit Signed Result
          </div>
          {result !== undefined && result !== null ? (
            <div style={{ fontSize: 28, fontWeight: 700, color: "#f87171", marginTop: 8 }}>
              {result}
            </div>
          ) : (
            <div style={{ fontSize: 14, color: "#9b8bb3", marginTop: 8, fontStyle: "italic" }}>
              Run simulation to see result
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WallaceVisualizer;