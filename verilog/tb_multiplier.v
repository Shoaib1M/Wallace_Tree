`timescale 1ns/1ps
`default_nettype none

// Testbench for Wallace Tree vs Array (reference) multiplier
//
// Fixes applied:
//   Bug #4: added signed test cases  (negative × positive, negative × negative)
//   Bug #5: automatic PASS/FAIL check against $signed(A) * $signed(B)

module tb_multiplier;

    // ── DUT signals ───────────────────────────────────────────────────────
    reg  signed [31:0] A;
    reg  signed [31:0] B;

    wire signed [63:0] wallace_product;
    wire signed [63:0] array_product;

    // Booth encoder outputs for visualization - individual wires
    wire [63:0] pp0, pp1, pp2, pp3, pp4, pp5, pp6, pp7;
    wire [63:0] pp8, pp9, pp10, pp11, pp12, pp13, pp14, pp15;

    // ── Instantiations ────────────────────────────────────────────────────
    booth_encoder_radix4 BOOTH (
        .A   (A),
        .B   (B),
        .pp0 (pp0),  .pp1 (pp1),  .pp2 (pp2),  .pp3 (pp3),
        .pp4 (pp4),  .pp5 (pp5),  .pp6 (pp6),  .pp7 (pp7),
        .pp8 (pp8),  .pp9 (pp9),  .pp10(pp10), .pp11(pp11),
        .pp12(pp12), .pp13(pp13), .pp14(pp14), .pp15(pp15)
    );

    wallace_multiplier_top WALLACE (
        .A       (A),
        .B       (B),
        .product (wallace_product)
    );

    array_multiplier_32bit ARRAY (
        .A       (A),
        .B       (B),
        .product (array_product)
    );

    // ── Pass/fail task ────────────────────────────────────────────────────
    integer pass_count;
    integer fail_count;

    task check;
        input signed [31:0] a_in;
        input signed [31:0] b_in;
        reg   signed [63:0] expected;
        begin
            expected = a_in * b_in;   // 64-bit signed Verilog reference

            #1;   // let combinational logic settle after inputs change

            if (wallace_product === expected && array_product === expected) begin
                $display("PASS  A=%12d  B=%12d  product=%0d", a_in, b_in, wallace_product);
                pass_count = pass_count + 1;
            end else begin
                $display("FAIL  A=%12d  B=%12d | Wallace=%0d  Array=%0d  Expected=%0d",
                         a_in, b_in, wallace_product, array_product, expected);
                fail_count = fail_count + 1;
            end
        end
    endtask

    // ── Timing measurement task ──────────────────────────────────────────
    // Measures propagation delay by monitoring output changes
    reg [63:0] wallace_prev, array_prev;
    time wallace_delay, array_delay;
    time input_change_time;

    task measure_timing;
        input signed [31:0] a_in;
        input signed [31:0] b_in;
        begin
            wallace_delay = 0;
            array_delay = 0;
            wallace_prev = wallace_product;
            array_prev = array_product;
            input_change_time = $time;
            
            A = a_in;
            B = b_in;
            
            // Wait a small amount for combinational logic to settle
            #0.1;
            
            // Calculate delays based on output changes
            if (wallace_product !== wallace_prev) begin
                wallace_delay = $time - input_change_time;
            end else begin
                wallace_delay = 0;
            end
            
            if (array_product !== array_prev) begin
                array_delay = $time - input_change_time;
            end else begin
                array_delay = 0;
            end
        end
    endtask

    // ── Stimulus ──────────────────────────────────────────────────────────
    integer a_arg, b_arg;
    integer single_mode;
    integer expected_val;

    initial begin

        pass_count = 0;
        fail_count = 0;
        single_mode = 0;

        // ── Single-value mode (called by the backend) ────────────────────
        // Usage:  vvp sim.out +A=<val> +B=<val>
        // Prints: WALLACE: <n>  ARRAY: <n>  EXPECTED: <n>  PP: pp0, pp1, ... pp15
        //         WALLACE_DELAY: <ns>  ARRAY_DELAY: <ns>
        if ($value$plusargs("A=%d", a_arg) && $value$plusargs("B=%d", b_arg)) begin
            single_mode = 1;
            measure_timing(a_arg[31:0], b_arg[31:0]);
            #1;

            expected_val = $signed(A) * $signed(B);

            $display("WALLACE: %0d", $signed(wallace_product));
            $display("ARRAY: %0d",   $signed(array_product));
            $display("EXPECTED: %0d", expected_val);
            $display("WALLACE_DELAY: %0d", wallace_delay);
            $display("ARRAY_DELAY: %0d", array_delay);
            $display("PP: %0d %0d %0d %0d %0d %0d %0d %0d %0d %0d %0d %0d %0d %0d %0d %0d",
                     $signed(pp0),  $signed(pp1),  $signed(pp2),  $signed(pp3),
                     $signed(pp4),  $signed(pp5),  $signed(pp6),  $signed(pp7),
                     $signed(pp8),  $signed(pp9),  $signed(pp10), $signed(pp11),
                     $signed(pp12), $signed(pp13), $signed(pp14), $signed(pp15));
            $finish;
        end

        // ── Full regression suite (run manually: vvp sim.out) ────────────
        $dumpfile("wave.vcd");
        $dumpvars(0, tb_multiplier);

        $display("============================================================");
        $display("  Wallace Tree Multiplier (32-bit) — Testbench");
        $display("============================================================");

        // ── Unsigned / small values (original tests) ────────────────────
        A =  32'd5;    B =  32'd7;     check(A, B);
        A =  32'd25;   B =  32'd13;    check(A, B);
        A =  32'd123;  B =  32'd45;    check(A, B);
        A =  32'd255;  B =  32'd200;   check(A, B);
        A =  32'd1024; B =  32'd512;   check(A, B);

        // ── Negative × positive ─────────────────────────────────────────
        A = -32'd5;    B =  32'd7;     check(A, B);
        A = -32'd25;   B =  32'd13;    check(A, B);
        A = -32'd100;  B =  32'd200;   check(A, B);
        A = -32'd1;    B =  32'd2147483647; check(A, B);

        // ── Negative × negative ─────────────────────────────────────────
        A = -32'd5;    B = -32'd7;     check(A, B);
        A = -32'd100;  B = -32'd200;   check(A, B);
        A = -32'd1024; B = -32'd512;   check(A, B);

        // ── Edge cases ───────────────────────────────────────────────────
        A =  32'd0;           B =  32'd12345678;   check(A, B);
        A =  32'd1;           B =  32'd1;          check(A, B);
        A =  32'd2147483647;  B =  32'd2147483647; check(A, B);
        A = -32'd2147483648;  B =  32'd1;          check(A, B);
        A = -32'd2147483648;  B = -32'd1;          check(A, B);
        A = -32'd2147483648;  B = -32'd2147483648; check(A, B);

        // ── Summary ──────────────────────────────────────────────────────
        $display("============================================================");
        $display("  Results: %0d PASSED,  %0d FAILED", pass_count, fail_count);
        $display("============================================================");

        $finish;
    end

endmodule

`default_nettype wire