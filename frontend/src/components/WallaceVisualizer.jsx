import React from "react";

const CARD = (style = {}) => ({
  padding: "16px 20px",
  borderRadius: 10,
  textAlign: "center",
  fontWeight: 500,
  ...style,
});

const ARROW = () => (
  <div style={{ fontSize: 32, color: "#1565a0", lineHeight: 1 }}>↓</div>
);

function WallaceVisualizer({ A, B, result }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: 40,
        boxShadow: "none",
        border: "1px solid #b8d9ef",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#0f2a4a", fontSize: 22 }}>
        Hardware Pipeline Architecture
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Inputs */}
        <div
          style={CARD({
            background: "#e8f4fb",
            border: "2px solid #1565a0",
            minWidth: 300,
          })}
        >
          <div style={{ fontSize: 13, color: "#4a7a9b", marginBottom: 8 }}>
            32-bit Signed Inputs
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#0f2a4a" }}>
            {A} × {B}
          </div>
        </div>
        <ARROW />

        {/* Booth Encoder */}
        <div
          style={CARD({
            background: "#e8f0fd",
            border: "2px solid #1976d2",
            minWidth: 300,
          })}
        >
          <div style={{ fontWeight: 700, color: "#0d47a1", fontSize: 15 }}>
            Radix-4 Booth Encoder
          </div>
          <div style={{ fontSize: 12, color: "#1565a0", marginTop: 4 }}>
            32 multiplier bits → 16 partial products
          </div>
        </div>
        <ARROW />

        {/* Partial Products */}
        <div
          style={CARD({
            background: "#e8f5e9",
            border: "2px solid #2e7d32",
            minWidth: 300,
          })}
        >
          <div style={{ fontWeight: 700, color: "#1b5e20", fontSize: 15 }}>
            Partial Products
          </div>
          <div style={{ fontSize: 12, color: "#2e7d32", marginTop: 4 }}>
            16 × 64-bit values (pp0 ... pp15)
          </div>
        </div>
        <ARROW />

        {/* Wallace Tree */}
        <div
          style={CARD({
            background: "#f3e8fd",
            border: "2px solid #7b1fa2",
            minWidth: 300,
          })}
        >
          <div style={{ fontWeight: 700, color: "#4a148c", fontSize: 15 }}>
            Wallace Tree Reduction
          </div>
          <div style={{ fontSize: 12, color: "#7b1fa2", marginTop: 4 }}>
            5 stages of parallel adders
          </div>
        </div>
        <ARROW />

        {/* Carry Lookahead Adder */}
        <div
          style={CARD({
            background: "#fff3e0",
            border: "2px solid #e65100",
            minWidth: 300,
          })}
        >
          <div style={{ fontWeight: 700, color: "#bf360c", fontSize: 15 }}>
            Carry Lookahead Adder
          </div>
          <div style={{ fontSize: 12, color: "#e65100", marginTop: 4 }}>
            64-bit hierarchical 4-bit CLA blocks
          </div>
        </div>
        <ARROW />

        {/* Final Product */}
        <div
          style={CARD({
            background:
              result !== undefined && result !== null ? "#ffebee" : "#f5f9fd",
            border: `2px solid ${result !== undefined && result !== null ? "#c62828" : "#b8d9ef"}`,
            minWidth: 300,
          })}
        >
          <div
            style={{
              fontWeight: 700,
              color:
                result !== undefined && result !== null ? "#b71c1c" : "#0f2a4a",
              fontSize: 15,
            }}
          >
            64-bit Signed Result
          </div>
          {result !== undefined && result !== null ? (
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#c62828",
                marginTop: 8,
              }}
            >
              {result}
            </div>
          ) : (
            <div
              style={{
                fontSize: 14,
                color: "#7aa3bf",
                marginTop: 8,
                fontStyle: "italic",
              }}
            >
              Run simulation to see result
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WallaceVisualizer;
