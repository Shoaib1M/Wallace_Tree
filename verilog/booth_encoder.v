module booth_encoder_radix4(
    input  wire [31:0] A,
    input  wire [31:0] B,

    output wire [63:0] pp0, pp1, pp2, pp3,
                       pp4, pp5, pp6, pp7,
                       pp8, pp9, pp10, pp11,
                       pp12, pp13, pp14, pp15
);

    // Sign-extend A
    wire signed [63:0] A_sext = {{32{A[31]}}, A};

    // Extend B
    wire [32:0] B_ext = {B, 1'b0};

    // Internal array (this is OK inside module)
    reg signed [63:0] partial [15:0];

    integer i;

    always @(*) begin
        for (i = 0; i < 16; i = i + 1) begin
            case ({B_ext[2*i+2], B_ext[2*i+1], B_ext[2*i]})

                3'b000: partial[i] =  64'sd0;
                3'b001: partial[i] =  A_sext  <<< (2*i);
                3'b010: partial[i] =  A_sext  <<< (2*i);
                3'b011: partial[i] =  A_sext  <<< (2*i + 1);
                3'b100: partial[i] = -(A_sext <<< (2*i + 1));
                3'b101: partial[i] = -(A_sext <<< (2*i));
                3'b110: partial[i] = -(A_sext <<< (2*i));
                3'b111: partial[i] =  64'sd0;

                default: partial[i] = 64'sd0;

            endcase
        end
    end

    // Assign each output
    assign pp0  = partial[0];
    assign pp1  = partial[1];
    assign pp2  = partial[2];
    assign pp3  = partial[3];
    assign pp4  = partial[4];
    assign pp5  = partial[5];
    assign pp6  = partial[6];
    assign pp7  = partial[7];
    assign pp8  = partial[8];
    assign pp9  = partial[9];
    assign pp10 = partial[10];
    assign pp11 = partial[11];
    assign pp12 = partial[12];
    assign pp13 = partial[13];
    assign pp14 = partial[14];
    assign pp15 = partial[15];

endmodule