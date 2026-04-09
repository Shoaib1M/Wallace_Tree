module wallace_multiplier_top(
    input  wire [31:0] A,
    input  wire [31:0] B,
    output wire [63:0] product
);

    // Booth encoder partial products (16 × 64-bit)
    wire [63:0] pp0, pp1, pp2, pp3,
                pp4, pp5, pp6, pp7,
                pp8, pp9, pp10, pp11,
                pp12, pp13, pp14, pp15;

    // Wallace tree outputs (two rows for final adder)
    wire [63:0] wsum;
    wire [63:0] wcarry;

    // Carry Lookahead final sum and carry-out
    wire [63:0] final_sum;
    wire        final_cout;   // not used in product; kept for completeness


    // -- Booth Encoder -----------------------------------------------------
    booth_encoder_radix4 booth_unit (
        .A  (A),
        .B  (B),
        .pp0(pp0),
        .pp1(pp1),
        .pp2(pp2),
        .pp3(pp3),
        .pp4(pp4),
        .pp5(pp5),
        .pp6(pp6),
        .pp7(pp7),
        .pp8(pp8),
        .pp9(pp9),
        .pp10(pp10),
        .pp11(pp11),
        .pp12(pp12),
        .pp13(pp13),
        .pp14(pp14),
        .pp15(pp15)
    );


    // -- Wallace Tree ------------------------------------------------------
    wallace_tree_32bit wallace_unit (
        .pp0   (pp0),
        .pp1   (pp1),
        .pp2   (pp2),
        .pp3   (pp3),
        .pp4   (pp4),
        .pp5   (pp5),
        .pp6   (pp6),
        .pp7   (pp7),
        .pp8   (pp8),
        .pp9   (pp9),
        .pp10  (pp10),
        .pp11  (pp11),
        .pp12  (pp12),
        .pp13  (pp13),
        .pp14  (pp14),
        .pp15  (pp15),
        .sum   (wsum),
        .carry (wcarry)
    );


    // -- Carry Lookahead Adder ---------------------------------------------
    carry_lookahead_adder cla (
        .A   (wsum),
        .B   (wcarry),
        .cin (1'b0),
        .SUM (final_sum),
        .cout(final_cout)
    );


    // -- Final Product -----------------------------------------------------
    // A 32×32 signed product fits in 64 bits
    assign product = final_sum;

endmodule