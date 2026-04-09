import React from "react";

/**
 * Displays the 16 partial products from the Verilog Booth encoder simulation.
 * These are actual values computed by the hardware design.
 */

function toBinary(num, bits = 64) {
  if (num >= 0) {
    return num.toString(2).padStart(bits, "0");
  } else {
    // For negative numbers, show as two's complement in 64-bit
    const unsigned = (BigInt(num) + BigInt(1)) << BigInt(64);
    return unsigned.toString(2).padStart(bits, "0");
  }
}

function PartialProducts({ partialProducts, A, B }) {
  if (!partialProducts || partialProducts.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: 40,
        marginBottom: 30,
        boxShadow: "none",
        border: "1px solid #3d3550",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#0f2a4a", fontSize: 22 }}>
        Booth-Encoded Partial Products
      </h2>
      <p style={{ color: "#4a7a9b", fontSize: 15, marginBottom: 24 }}>
        16 partial products computed by the Verilog{" "}
        <code
          style={{
            background: "#e8f4fb",
            padding: "2px 6px",
            borderRadius: 4,
            color: "#1565a0",
          }}
        >
          booth_encoder_radix4
        </code>{" "}
        module
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {partialProducts.map((pp, index) => (
          <div
            key={index}
            style={{
              background: "#f0f7fd",
              border: "1px solid #4d3f66",
              borderRadius: 10,
              padding: 16,
              fontFamily: "monospace",
            }}
          >
            <div style={{ color: "#1565a0", fontWeight: 600, marginBottom: 8 }}>
              pp{index}:
            </div>
            <div
              style={{
                color: "#0f2a4a",
                fontSize: 13,
                lineHeight: 1.6,
                wordBreak: "break-all",
              }}
            >
              <div style={{ color: "#4a7a9b", fontSize: 12, marginBottom: 4 }}>
                Binary:
              </div>
              {toBinary(pp, 64)}
            </div>
            <div
              style={{
                color: "#1565a0",
                fontWeight: 600,
                marginTop: 8,
                fontSize: 14,
              }}
            >
              {pp}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#e8f4fb",
          color: "#0f2a4a",
          padding: 20,
          borderRadius: 10,
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8 }}>
          <strong>{A}</strong> × <strong>{B}</strong> = (
          <strong>{partialProducts.join(" + ")}</strong>) ={" "}
          <strong>{A * B}</strong>
        </p>
      </div>
    </div>
  );
}

export default PartialProducts;
