
module booth_encoder_radix4(
    input  wire [31:0] A,
    input  wire [31:0] B,
    output wire [63:0] pp [15:0]
);

    // Sign-extend A to 64 bits once; reused for every partial product
    wire signed [63:0] A_sext = {{32{A[31]}}, A};

    // Append a 0 below bit 0 so the lowest group always has a valid LSB
    wire [32:0] B_ext = {B, 1'b0};

    reg signed [63:0] partial [15:0];

    integer i;

    always @(*) begin
        for (i = 0; i < 16; i = i + 1) begin

            // 3-bit Booth group centred on bit 2*i+1
            case ({B_ext[2*i+2], B_ext[2*i+1], B_ext[2*i]})

                3'b000: partial[i] =  64'sd0;                       //  0
                3'b001: partial[i] =  A_sext  <<< (2*i);            // +A
                3'b010: partial[i] =  A_sext  <<< (2*i);            // +A
                3'b011: partial[i] =  A_sext  <<< (2*i + 1);        // +2A  (was (A<<1)<<2i)
                3'b100: partial[i] = -(A_sext <<< (2*i + 1));       // -2A  (was -(A<<1)<<2i)
                3'b101: partial[i] = -(A_sext <<< (2*i));           // -A
                3'b110: partial[i] = -(A_sext <<< (2*i));           // -A
                3'b111: partial[i] =  64'sd0;                       //  0

                default: partial[i] = 64'sd0;

            endcase
        end
    end

    // Drive outputs
    assign pp[0]  = partial[0];
    assign pp[1]  = partial[1];
    assign pp[2]  = partial[2];
    assign pp[3]  = partial[3];
    assign pp[4]  = partial[4];
    assign pp[5]  = partial[5];
    assign pp[6]  = partial[6];
    assign pp[7]  = partial[7];
    assign pp[8]  = partial[8];
    assign pp[9]  = partial[9];
    assign pp[10] = partial[10];
    assign pp[11] = partial[11];
    assign pp[12] = partial[12];
    assign pp[13] = partial[13];
    assign pp[14] = partial[14];
    assign pp[15] = partial[15];

endmodule
