# Execution Timing & Comparison Guide

This document describes the timing tracking and comparison features added to the Wallace Tree Multiplier project.

## Overview

The system now records and compares execution times for multiplication operations, providing insights into the performance of different multiplier implementations.

## Features Implemented

### 1. **Backend Timing Tracking** (`backend/simulation.js`)

- **VVP Execution Time**: Measures the actual Verilog simulation execution time in milliseconds
- **Total Simulation Time**: Tracks the complete time from start to finish, including compilation overhead
- **Compilation Overhead**: Calculates the time spent waiting for compilation (if needed)

### 2. **API Endpoints** (`backend/server.js`)

#### POST `/multiply`
Returns timing data with each multiplication result:
```json
{
  "A": 12,
  "B": 34,
  "wallace": 408,
  "array": 408,
  "expected": 408,
  "partialProducts": [12, 0, 24, 36],
  "timing": {
    "vvpExecutionTime": 45.25,
    "totalSimulationTime": 52.10,
    "compilationOverhead": 6.85
  }
}
```

#### GET `/timing/stats`
Returns comprehensive timing statistics:
```json
{
  "totalRuns": 15,
  "averageVvpTime": 42.80,
  "averageTotalTime": 50.35,
  "minVvpTime": 38.90,
  "maxVvpTime": 62.15,
  "history": [
    {
      "timestamp": "2025-01-15T10:30:45.123Z",
      "A": 12,
      "B": 34,
      "vvpExecutionTime": 45.25,
      "totalSimulationTime": 52.10,
      "compilationOverhead": 6.85
    },
    ...
  ]
}
```

#### POST `/timing/reset`
Clears all timing history and statistics.

### 3. **Frontend Display** (`frontend/src/App.jsx`)

**Per-Simulation Timing Card**: Shows after each simulation:
- VVP Execution Time (cyan)
- Total Simulation Time (purple)
- Compilation Overhead (amber)

### 4. **Timing Statistics Component** (`frontend/src/components/TimingStats.jsx`)

A new dedicated component that displays:
- **Total Runs**: Number of simulations executed
- **Average Time**: Mean execution time across all runs
- **Min / Max Times**: Range of execution times
- **Recent Runs Table**: Last 20 simulation runs with:
  - Operands (A × B)
  - Execution time
  - Total time

Features:
- Auto-refreshes every 5 seconds
- Reset button to clear history
- Responsive grid layout
- Color-coded metrics

## How to Use

### 1. Run a Simulation
- Enter operands A and B in the input fields
- Click "Simulate"
- View timing information in the results card

### 2. View Timing Statistics
- Scroll down to see the "📊 Timing Statistics" section
- Review average times, min/max, and recent runs
- Auto-updates every 5 seconds

### 3. Reset Timing Data
- Click the "🔄 Reset" button in the Timing Statistics card
- All timing history will be cleared

### 4. Programmatic Access
Use `curl` or any HTTP client to fetch timing data:

```bash
# Get current timing statistics
curl http://localhost:5000/timing/stats

# Reset timing statistics
curl -X POST http://localhost:5000/timing/reset
```

## Tracking Metrics

### VVP Execution Time
- Measures the actual simulation execution time
- Includes both Wallace Tree and Array multiplier operations
- Does not include compilation time

### Total Simulation Time
- Complete time for the multiplication operation
- Includes compilation (if needed) and execution
- Useful for end-to-end performance analysis

### Compilation Overhead
- Time spent compiling Verilog code (if needed)
- Only shown if compilation occurred during the simulation
- On subsequent runs, this is typically 0 if sources haven't changed

## Performance Optimization Notes

1. **Compilation Caching**: The system only recompiles if source files are modified
2. **Subsequent Runs**: After initial compilation, runs should be faster (lower overhead)
3. **Timing Variability**: Small variations in execution time are normal

## Example Timing Analysis

```
Run 1: 12 × 34
- VVP: 45.25ms
- Total: 52.10ms
- Overhead: 6.85ms (initial compilation)

Run 2: 56 × 78
- VVP: 40.15ms
- Total: 40.22ms
- Overhead: 0.07ms (no recompilation needed)
```

## Technical Details

### Timing Implementation
- Uses JavaScript `performance.now()` for high-precision timing
- Captures nanosecond-precision timestamps
- Accurate to microseconds in millisecond results

### History Storage
- Keeps last 20 runs in memory
- Complete statistics computed from all stored records
- Resets on server restart

## Future Enhancements

- [ ] Export timing history to CSV
- [ ] Graphical timing trends visualization
- [ ] Configurable history retention
- [ ] Wallace vs Array comparisons
- [ ] Performance regression detection
