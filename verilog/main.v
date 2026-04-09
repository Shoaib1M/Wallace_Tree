`default_nettype none

// Top-level Wallace Tree Multiplier
// 32-bit signed inputs → 64-bit signed product
//
// Pipeline: Booth Encoder → Wallace Tree → Carry Lookahead Adder

module wallace_multiplier_top(
    input  wire [31:0] A,
    input  wire [31:0] B,
    output wire [63:0] product
);

    // Booth encoder partial products (16 × 64-bit)
    wire [63:0] pp [15:0];

    // Wallace tree outputs (two rows for final adder)
    wire [63:0] wsum;
    wire [63:0] wcarry;

    // Carry Lookahead final sum and carry-out
    wire [63:0] final_sum;
    wire        final_cout;   // not used in product; kept for completeness


    // ── Booth Encoder ─────────────────────────────────────────────────────
    booth_encoder_radix4 booth_unit (
        .A  (A),
        .B  (B),
        .pp (pp)
    );


    // ── Wallace Tree ──────────────────────────────────────────────────────
    wallace_tree_32bit wallace_unit (
        .pp0   (pp[0]),
        .pp1   (pp[1]),
        .pp2   (pp[2]),
        .pp3   (pp[3]),
        .pp4   (pp[4]),
        .pp5   (pp[5]),
        .pp6   (pp[6]),
        .pp7   (pp[7]),
        .pp8   (pp[8]),
        .pp9   (pp[9]),
        .pp10  (pp[10]),
        .pp11  (pp[11]),
        .pp12  (pp[12]),
        .pp13  (pp[13]),
        .pp14  (pp[14]),
        .pp15  (pp[15]),
        .sum   (wsum),
        .carry (wcarry)
    );


    // ── Carry Lookahead Adder ─────────────────────────────────────────────
    carry_lookahead_adder cla (
        .A   (wsum),
        .B   (wcarry),
        .cin (1'b0),
        .SUM (final_sum),
        .cout(final_cout)
    );


    // ── Final Product ─────────────────────────────────────────────────────
    // A 32×32 signed product fits in 64 bits
    assign product = final_sum;

endmodule

`default_nettype wire