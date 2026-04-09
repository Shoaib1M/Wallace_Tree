
module array_multiplier_32bit(
    input  wire signed [31:0] A,
    input  wire signed [31:0] B,
    output wire signed [63:0] product
);
    assign product = A * B;

endmodule
