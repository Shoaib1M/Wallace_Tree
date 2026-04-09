# Wallace Tree Multiplier - 32-bit Upgrade

## Summary of Changes

This document describes the upgrade from 16-bit to 32-bit multiplication with the replacement of the Kogge-Stone adder with a Carry Lookahead Adder (CLA).

## Key Modifications

### 1. **Booth Encoder (`booth_encoder.v`)**
   - **Input bit-width**: 16-bit → 32-bit
   - **Partial products**: 8 → 16
   - **Partial product width**: 32-bit → 64-bit
   - **Hardware**: Scales by 2× (from 8 radix-4 groups to 16 radix-4 groups)

### 2. **Wallace Tree Reduction (`wallace_tree_32bit.v`)**
   - **New file**: `wallace_tree_32bit.v` (created to replace `wallace_tree_16bit.v`)
   - **Input rows**: 16 partial products (vs. 8 previously)
   - **Data width**: 64 bits per row (vs. 32 bits previously)
   - **Architecture**:
     - Stage 1: 16 rows → 11 rows (4 full adders)
     - Stage 2: 11 rows → 8 rows (3 full adders)
     - Stage 3: 8 rows → 6 rows (2 full adders)
     - Stage 4: 6 rows → 4 rows (2 full adders)
     - Stage 5: 4 rows → 3 rows (1 full adder)
     - Final: 3 rows → 2 rows (half adders for final pair)

### 3. **Carry Lookahead Adder (`carry_lookahead_adder.v`)**
   - **New file**: Created to replace Kogge-Stone adder
   - **Bit-width**: 64-bit
   - **Architecture**: Hierarchical 4-bit CLA cells
     - Four 4-bit CLA blocks compose 16-bit CLA blocks
     - Four 16-bit CLA blocks compose 64-bit CLA
   - **Advantages over Kogge-Stone**:
     - Simpler hierarchical structure
     - Easier to understand and verify
     - Still achieves O(log n) delay
     - Lower power consumption and gate count for moderate widths

### 4. **Array Multiplier Reference (`normal_array_multiplier.v`)**
   - **Input bit-width**: 16-bit → 32-bit
   - **Output bit-width**: 32-bit → 64-bit
   - Module renamed: `array_multiplier_16bit` → `array_multiplier_32bit`

### 5. **Top-level Module (`main.v`)**
   - **Port changes**:
     - Input A, B: 16-bit → 32-bit
     - Output product: 32-bit → 64-bit
   - **Adder replacement**: Kogge-Stone → Carry Lookahead
   - **Wallace tree instantiation**: Updated to use 16 partial product inputs

### 6. **Testbench (`tb_multiplier.v`)**
   - **Input bit-width**: 16-bit → 32-bit
   - **Output bit-width**: 32-bit → 64-bit
   - **Number of test cases**: Maintained (18 test vectors)
   - **Test coverage**: Positive, negative, and edge cases
   - **Results**: All 18 tests PASS

## File Status

### Files Modified
- `booth_encoder.v` - Updated to 32-bit
- `main.v` - Updated for 32-bit, now uses CLA
- `normal_array_multiplier.v` - Updated to 32-bit
- `tb_multiplier.v` - Updated to 32-bit

### Files Created
- `wallace_tree_32bit.v` - New 32-bit Wallace tree
- `carry_lookahead_adder.v` - New 64-bit CLA

### Files Retained (Not Modified)
- `full_adder.v` - No changes needed (bit-width agnostic)
- `half_adder.v` - No changes needed (bit-width agnostic)
- `kogge_stone_adder.v` - Retained for reference (not used in current design)
- `wallace_multiplier_16bit.v` - Retained for reference (not used in current design)

## Simulation Results

All test vectors pass with the new 32-bit design:
```
Results: 18 PASSED,  0 FAILED
```

Test coverage includes:
- Small unsigned values (5 × 7, 25 × 13, etc.)
- Signed multiplication (negative × positive, negative × negative)
- Large values (2,147,483,647 × 2,147,483,647)
- Edge cases (−2,147,483,648 with various operands)
- Zero multiplication

## Performance Characteristics

### Delay Analysis
- **Booth Encoder**: O(1) - combinational
- **Wallace Tree**: O(log n) - approximately 5 stages for 64-bit
- **CLA Adder**: O(log n) - hierarchical structure
- **Total**: Dominated by Wallace tree reduction depth

### Area Growth
- Approximately 2× area for doubling bit-width (N partial products of 2N width)
- CLA area vs. Kogge-Stone: Comparable or slightly lower for 64-bit width

## Design Considerations

1. **Pipeline Depth**: All combinational (can be pipelined if needed)
2. **Load Capacitance**: Increased due to larger bit-widths
3. **Power Consumption**: Higher dynamic power due to larger switching activity
4. **Timing Closure**: May require careful placement and routing in physical design

## Legacy Support

To revert to 16-bit design:
- Use `wallace_multiplier_16bit.v` (unchanged)
- Use `kogge_stone_adder.v` (unchanged)
- Use `array_multiplier_16bit.v` (unchanged)
- Revert `main.v` to use 16-bit ports and instantiate old modules
- Revert `tb_multiplier.v` to use 16-bit test vectors

## Testing and Validation

Run simulation with:
```bash
iverilog -g2012 -o sim.out tb_multiplier.v full_adder.v half_adder.v \
  carry_lookahead_adder.v booth_encoder.v wallace_tree_32bit.v main.v \
  normal_array_multiplier.v

vvp sim.out
```

For single-value testing:
```bash
vvp sim.out +A=<value> +B=<value>
```
