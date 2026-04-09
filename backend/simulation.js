const { exec } = require("child_process");
const path = require("path");
const fs   = require("fs");

const VERILOG_DIR = path.resolve(__dirname, "../verilog");
const SIM_OUT     = path.join(VERILOG_DIR, "sim.out");

const VERILOG_SOURCES = [
  "half_adder.v",
  "full_adder.v",
  "booth_encoder.v",
  "carry_lookahead_adder.v",
  "normal_array_multiplier.v",
  "wallace_tree_32bit.v",
  "main.v",
  "tb_multiplier.v",
].map((f) => path.join(VERILOG_DIR, f));

// ── Compile once at startup ───────────────────────────────────────────────────
// We recompile only if sim.out is missing or any source is newer than it.
function needsRecompile() {
  if (!fs.existsSync(SIM_OUT)) return true;
  const simMtime = fs.statSync(SIM_OUT).mtimeMs;
  return VERILOG_SOURCES.some(
    (f) => fs.existsSync(f) && fs.statSync(f).mtimeMs > simMtime
  );
}

let compilePromise = null;   // singleton — don't compile twice simultaneously

function ensureCompiled() {
  if (!needsRecompile()) return Promise.resolve();

  if (!compilePromise) {
    compilePromise = new Promise((resolve, reject) => {
      const cmd = `iverilog -g2012 -o "${SIM_OUT}" ${VERILOG_SOURCES.map(f => `"${f}"`).join(" ")}`;
      exec(cmd, (err, _stdout, stderr) => {
        compilePromise = null;           // allow re-try on next request
        if (err) reject(new Error(`iverilog compile error:\n${stderr || err.message}`));
        else resolve();
      });
    });
  }
  return compilePromise;
}

// ── Run simulation for a single A, B pair ────────────────────────────────────
// The testbench checks for +A=<n> +B=<n> plusargs and, when present, prints:
//   WALLACE: <n>
//   ARRAY:   <n>
//   EXPECTED: <n>
// then calls $finish immediately (no waveform dump, no regression suite).
function runVerilog(A, B) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const cmd = `vvp "${SIM_OUT}" +A=${A} +B=${B}`;
    
    exec(cmd, { cwd: VERILOG_DIR }, (err, stdout, stderr) => {
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      if (err) {
        reject(new Error(`vvp error:\n${stderr || err.message}`));
        return;
      }

      const parse = (key) => {
        const m = stdout.match(new RegExp(key + ":\\s*(-?\\d+)"));
        if (!m) throw new Error(`Key "${key}" not found in vvp output:\n${stdout}`);
        return parseInt(m[1], 10);
      };

      // Parse partial products (PP: pp0 pp1 pp2 ... pp15)
      const ppMatch = stdout.match(/PP:\s*([\d\s\-]+)/);
      let partialProducts = [];
      if (ppMatch) {
        partialProducts = ppMatch[1].trim().split(/\s+/).map(n => parseInt(n, 10));
      }

      // Debug: log the vvp output
      console.log("VVP Output:", stdout);
      console.log("Partial Products parsed:", partialProducts);


      try {
        const wallaceDelay = parse("WALLACE_DELAY");
        const arrayDelay = parse("ARRAY_DELAY");
        
        resolve({
          wallace:  parse("WALLACE"),
          array:    parse("ARRAY"),
          expected: parse("EXPECTED"),
          partialProducts,
          executionTime,
          wallaceDelay,
          arrayDelay,
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

// ── Public API ────────────────────────────────────────────────────────────────
let timingHistory = [];  // Store timing data for analysis

async function runSimulation(A, B) {
  const simulationStartTime = performance.now();
  await ensureCompiled();
  
  const { wallace, array, expected, partialProducts, executionTime, wallaceDelay, arrayDelay } = await runVerilog(A, B);
  
  const simulationEndTime = performance.now();
  const totalSimulationTime = simulationEndTime - simulationStartTime;
  
  // Calculate timing metrics
  const timingMetrics = {
    vvpExecutionTime: executionTime,
    totalSimulationTime: totalSimulationTime,
    compilationOverhead: totalSimulationTime - executionTime,
    wallaceDelay,      // Propagation delay in ns
    arrayDelay,        // Propagation delay in ns
    fasterMultiplier: wallaceDelay < arrayDelay ? "Wallace" : (arrayDelay < wallaceDelay ? "Array" : "Equal"),
    delayDifference: Math.abs(wallaceDelay - arrayDelay),
  };
  
  const result = { 
    A, 
    B, 
    wallace, 
    array, 
    expected, 
    partialProducts, 
    simulated: true,
    timing: timingMetrics
  };
  
  // Store in history for comparison
  timingHistory.push({
    timestamp: new Date().toISOString(),
    A,
    B,
    ...timingMetrics
  });
  
  return result;
}

function getTimingStats() {
  if (timingHistory.length === 0) {
    return { message: "No simulations run yet" };
  }
  
  const wallaceDelays = timingHistory.map(h => h.wallaceDelay);
  const arrayDelays = timingHistory.map(h => h.arrayDelay);
  
  const stats = {
    totalRuns: timingHistory.length,
    averageVvpTime: timingHistory.reduce((sum, h) => sum + h.vvpExecutionTime, 0) / timingHistory.length,
    averageTotalTime: timingHistory.reduce((sum, h) => sum + h.totalSimulationTime, 0) / timingHistory.length,
    minVvpTime: Math.min(...timingHistory.map(h => h.vvpExecutionTime)),
    maxVvpTime: Math.max(...timingHistory.map(h => h.vvpExecutionTime)),
    
    // Multiplier delay comparisons
    wallaceTreeStats: {
      averageDelay: (wallaceDelays.reduce((a, b) => a + b, 0) / wallaceDelays.length).toFixed(3),
      minDelay: Math.min(...wallaceDelays),
      maxDelay: Math.max(...wallaceDelays),
    },
    arrayMultiplierStats: {
      averageDelay: (arrayDelays.reduce((a, b) => a + b, 0) / arrayDelays.length).toFixed(3),
      minDelay: Math.min(...arrayDelays),
      maxDelay: Math.max(...arrayDelays),
    },
    
    // Comparison
    fasterArchitecture: timingHistory.reduce((wallace, h) => wallace + (h.wallaceDelay < h.arrayDelay ? 1 : 0), 0) > timingHistory.length / 2 ? "Wallace" : "Array",
    wallaceWins: timingHistory.filter(h => h.wallaceDelay < h.arrayDelay).length,
    arrayWins: timingHistory.filter(h => h.arrayDelay < h.wallaceDelay).length,
    ties: timingHistory.filter(h => h.wallaceDelay === h.arrayDelay).length,
    
    history: timingHistory.slice(-20) // Last 20 runs
  };
  
  return stats;
}

function resetTimingStats() {
  timingHistory = [];
  return { message: "Timing history cleared" };
}

module.exports = { runSimulation, getTimingStats, resetTimingStats };