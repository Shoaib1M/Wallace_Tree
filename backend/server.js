const express = require("express");
const cors    = require("cors");
const { runSimulation, getTimingStats, resetTimingStats } = require("./simulation");

const app = express();

app.use(cors());
app.use(express.json());

/**
 * POST /multiply
 * Body: { A: number, B: number }  (signed 32-bit integers)
 *
 * Bugs fixed:
 *  1. No input validation — NaN or out-of-range values would silently
 *     corrupt the simulation.
 *  2. No error handling — an unhandled promise rejection would crash the
 *     server process.
 */
app.post("/multiply", async (req, res) => {
  const A = parseInt(req.body.A, 10);
  const B = parseInt(req.body.B, 10);

  // Validate: both must be finite signed 32-bit integers
  if (!Number.isFinite(A) || !Number.isFinite(B)) {
    return res.status(400).json({ error: "A and B must be integers." });
  }
  if (A < -2147483648 || A > 2147483647 || B < -2147483648 || B > 2147483647) {
    return res.status(400).json({ error: "A and B must be 32-bit signed integers (−2,147,483,648 to 2,147,483,647)." });
  }

  try {
    const result = await runSimulation(A, B);
    res.json(result);
  } catch (err) {
    console.error("Simulation error:", err);
    res.status(500).json({ error: "Simulation failed: " + err.message });
  }
});

/**
 * GET /timing/stats
 * Returns timing statistics for all simulations run since server start or last reset
 */
app.get("/timing/stats", (req, res) => {
  const stats = getTimingStats();
  res.json(stats);
});

/**
 * POST /timing/reset
 * Clears the timing history
 */
app.post("/timing/reset", (req, res) => {
  const result = resetTimingStats();
  res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});