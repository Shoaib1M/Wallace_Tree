
module wallace_tree_32bit(
    input  wire [63:0] pp0,
    input  wire [63:0] pp1,
    input  wire [63:0] pp2,
    input  wire [63:0] pp3,
    input  wire [63:0] pp4,
    input  wire [63:0] pp5,
    input  wire [63:0] pp6,
    input  wire [63:0] pp7,
    input  wire [63:0] pp8,
    input  wire [63:0] pp9,
    input  wire [63:0] pp10,
    input  wire [63:0] pp11,
    input  wire [63:0] pp12,
    input  wire [63:0] pp13,
    input  wire [63:0] pp14,
    input  wire [63:0] pp15,

    output wire [63:0] sum,
    output wire [63:0] carry
);

    genvar i;

    // ── Stage 1: 16 rows → 11 rows ────────────────────────────────────────
    // Reduce: pp0,pp1,pp2 + pp3,pp4,pp5 + pp6,pp7,pp8 + pp9,pp10,pp11
    // Rows remaining: s1a, c1a_up, s1b, c1b_up, s1c, c1c_up, s1d, c1d_up, pp12, pp13, pp14, pp15

    wire [63:0] s1a, c1a, s1b, c1b, s1c, c1c, s1d, c1d;

    generate
        for (i = 0; i < 64; i = i + 1) begin : stage1
            full_adder FA1a (.a(pp0[i]), .b(pp1[i]), .cin(pp2[i]),
                             .sum(s1a[i]), .cout(c1a[i]));
            full_adder FA1b (.a(pp3[i]), .b(pp4[i]), .cin(pp5[i]),
                             .sum(s1b[i]), .cout(c1b[i]));
            full_adder FA1c (.a(pp6[i]), .b(pp7[i]), .cin(pp8[i]),
                             .sum(s1c[i]), .cout(c1c[i]));
            full_adder FA1d (.a(pp9[i]), .b(pp10[i]), .cin(pp11[i]),
                             .sum(s1d[i]), .cout(c1d[i]));
        end
    endgenerate

    wire [63:0] c1a_up = {c1a[62:0], 1'b0};
    wire [63:0] c1b_up = {c1b[62:0], 1'b0};
    wire [63:0] c1c_up = {c1c[62:0], 1'b0};
    wire [63:0] c1d_up = {c1d[62:0], 1'b0};

    // ── Stage 2: 11 rows → 8 rows ──────────────────────────────────────────
    // Rows: s1a, c1a_up, s1b, c1b_up, s1c, c1c_up, s1d, c1d_up, pp12, pp13, pp14, pp15
    // We can make 3 FAs: [s1a, c1a_up, s1b] → s2a, c2a
    //                    [c1b_up, s1c, c1c_up] → s2b, c2b
    //                    [s1d, c1d_up, pp12] → s2c, c2c
    // Remaining: pp13, pp14, pp15

    wire [63:0] s2a, c2a, s2b, c2b, s2c, c2c;

    generate
        for (i = 0; i < 64; i = i + 1) begin : stage2
            full_adder FA2a (.a(s1a[i]), .b(c1a_up[i]), .cin(s1b[i]),
                             .sum(s2a[i]), .cout(c2a[i]));
            full_adder FA2b (.a(c1b_up[i]), .b(s1c[i]), .cin(c1c_up[i]),
                             .sum(s2b[i]), .cout(c2b[i]));
            full_adder FA2c (.a(s1d[i]), .b(c1d_up[i]), .cin(pp12[i]),
                             .sum(s2c[i]), .cout(c2c[i]));
        end
    endgenerate

    wire [63:0] c2a_up = {c2a[62:0], 1'b0};
    wire [63:0] c2b_up = {c2b[62:0], 1'b0};
    wire [63:0] c2c_up = {c2c[62:0], 1'b0};

    // ── Stage 3: 8 rows → 6 rows ───────────────────────────────────────────
    // Rows: s2a, c2a_up, s2b, c2b_up, s2c, c2c_up, pp13, pp14, pp15
    // We can make 2 FAs: [s2a, c2a_up, s2b] → s3a, c3a
    //                    [c2b_up, s2c, c2c_up] → s3b, c3b
    // Remaining: pp13, pp14, pp15

    wire [63:0] s3a, c3a, s3b, c3b;

    generate
        for (i = 0; i < 64; i = i + 1) begin : stage3
            full_adder FA3a (.a(s2a[i]), .b(c2a_up[i]), .cin(s2b[i]),
                             .sum(s3a[i]), .cout(c3a[i]));
            full_adder FA3b (.a(c2b_up[i]), .b(s2c[i]), .cin(c2c_up[i]),
                             .sum(s3b[i]), .cout(c3b[i]));
        end
    endgenerate

    wire [63:0] c3a_up = {c3a[62:0], 1'b0};
    wire [63:0] c3b_up = {c3b[62:0], 1'b0};

    // ── Stage 4: 6 rows → 4 rows ───────────────────────────────────────────
    // Rows: s3a, c3a_up, s3b, c3b_up, pp13, pp14, pp15
    // We can make 2 FAs: [s3a, c3a_up, s3b] → s4a, c4a
    //                    [c3b_up, pp13, pp14] → s4b, c4b
    // Remaining: pp15

    wire [63:0] s4a, c4a, s4b, c4b;

    generate
        for (i = 0; i < 64; i = i + 1) begin : stage4
            full_adder FA4a (.a(s3a[i]), .b(c3a_up[i]), .cin(s3b[i]),
                             .sum(s4a[i]), .cout(c4a[i]));
            full_adder FA4b (.a(c3b_up[i]), .b(pp13[i]), .cin(pp14[i]),
                             .sum(s4b[i]), .cout(c4b[i]));
        end
    endgenerate

    wire [63:0] c4a_up = {c4a[62:0], 1'b0};
    wire [63:0] c4b_up = {c4b[62:0], 1'b0};

    // ── Stage 5: 4 rows → 3 rows ───────────────────────────────────────────
    // Rows: s4a, c4a_up, s4b, c4b_up, pp15
    // We can make 1 FA: [s4a, c4a_up, s4b] → s5, c5
    // Remaining: c4b_up, pp15

    wire [63:0] s5, c5;

    generate
        for (i = 0; i < 64; i = i + 1) begin : stage5
            full_adder FA5 (.a(s4a[i]), .b(c4a_up[i]), .cin(s4b[i]),
                            .sum(s5[i]), .cout(c5[i]));
        end
    endgenerate

    wire [63:0] c5_up = {c5[62:0], 1'b0};

    // ── Final Stage: 3 rows → 2 rows ───────────────────────────────────────
    // Rows: s5, c5_up, c4b_up, pp15
    // Final add: [s5, c5_up] and [c4b_up, pp15]
    wire [63:0] final_row1, final_row2;

    generate
        for (i = 0; i < 64; i = i + 1) begin : final_stage
            half_adder HA1 (.a(s5[i]), .b(c5_up[i]),
                            .sum(final_row1[i]), .carry(final_row2[i]));
        end
    endgenerate

    wire [63:0] final_row2_up = {final_row2[62:0], 1'b0};

    // ── Output Assignment ──────────────────────────────────────────────────
    assign sum   = final_row1;
    assign carry = c4b_up | pp15 | final_row2_up;

endmodule

