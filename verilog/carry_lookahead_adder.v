
module carry_lookahead_adder(
    input  wire [63:0] A,
    input  wire [63:0] B,
    input  wire        cin,
    output wire [63:0] SUM,
    output wire        cout
);

    // ── 16-bit CLA block outputs ─────────────────────────────────────────
    wire [15:0] sum0, sum1, sum2, sum3;
    wire        c1, c2, c3, cout_unused;

    // ── Instantiate four 16-bit CLA blocks ────────────────────────────────
    cla_16bit block0 (
        .A    (A[15:0]),
        .B    (B[15:0]),
        .cin  (cin),
        .SUM  (sum0),
        .cout (c1)
    );

    cla_16bit block1 (
        .A    (A[31:16]),
        .B    (B[31:16]),
        .cin  (c1),
        .SUM  (sum1),
        .cout (c2)
    );

    cla_16bit block2 (
        .A    (A[47:32]),
        .B    (B[47:32]),
        .cin  (c2),
        .SUM  (sum2),
        .cout (c3)
    );

    cla_16bit block3 (
        .A    (A[63:48]),
        .B    (B[63:48]),
        .cin  (c3),
        .SUM  (sum3),
        .cout (cout)
    );

    // ── Concatenate results ───────────────────────────────────────────────
    assign SUM = {sum3, sum2, sum1, sum0};

endmodule


// ── 16-bit CLA Block (composed of four 4-bit CLA blocks) ──────────────
module cla_16bit(
    input  wire [15:0] A,
    input  wire [15:0] B,
    input  wire        cin,
    output wire [15:0] SUM,
    output wire        cout
);

    // ── 4-bit CLA block outputs ───────────────────────────────────────────
    wire [3:0] sum0, sum1, sum2, sum3;
    wire       c1, c2, c3;

    // ── Instantiate four 4-bit CLA blocks ─────────────────────────────────
    cla_4bit block0 (
        .A    (A[3:0]),
        .B    (B[3:0]),
        .cin  (cin),
        .SUM  (sum0),
        .cout (c1)
    );

    cla_4bit block1 (
        .A    (A[7:4]),
        .B    (B[7:4]),
        .cin  (c1),
        .SUM  (sum1),
        .cout (c2)
    );

    cla_4bit block2 (
        .A    (A[11:8]),
        .B    (B[11:8]),
        .cin  (c2),
        .SUM  (sum2),
        .cout (c3)
    );

    cla_4bit block3 (
        .A    (A[15:12]),
        .B    (B[15:12]),
        .cin  (c3),
        .SUM  (sum3),
        .cout (cout)
    );

    // ── Concatenate results ───────────────────────────────────────────────
    assign SUM = {sum3, sum2, sum1, sum0};

endmodule


// ── 4-bit CLA Cell (basic building block) ──────────────────────────────
module cla_4bit(
    input  wire [3:0] A,
    input  wire [3:0] B,
    input  wire       cin,
    output wire [3:0] SUM,
    output wire       cout
);

    // ── Initial propagate and generate signals ────────────────────────────
    wire [3:0] p = A ^ B;
    wire [3:0] g = A & B;

    // ── Carry computation ─────────────────────────────────────────────────
    // C0 = cin
    // C1 = g0 + p0*cin
    // C2 = g1 + p1*g0 + p1*p0*cin
    // C3 = g2 + p2*g1 + p2*p1*g0 + p2*p1*p0*cin
    // C4 = g3 + p3*g2 + p3*p2*g1 + p3*p2*p1*g0 + p3*p2*p1*p0*cin

    wire c0 = cin;
    wire c1 = g[0] | (p[0] & c0);
    wire c2 = g[1] | (p[1] & g[0]) | (p[1] & p[0] & c0);
    wire c3 = g[2] | (p[2] & g[1]) | (p[2] & p[1] & g[0]) | (p[2] & p[1] & p[0] & c0);
    wire c4 = g[3] | (p[3] & g[2]) | (p[3] & p[2] & g[1]) | (p[3] & p[2] & p[1] & g[0]) | (p[3] & p[2] & p[1] & p[0] & c0);

    // ── Sum computation ───────────────────────────────────────────────────
    assign SUM[0] = p[0] ^ c0;
    assign SUM[1] = p[1] ^ c1;
    assign SUM[2] = p[2] ^ c2;
    assign SUM[3] = p[3] ^ c3;
    assign cout   = c4;

endmodule

