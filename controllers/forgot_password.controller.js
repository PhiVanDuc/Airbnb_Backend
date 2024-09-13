const bcrypt = require("bcrypt");
const { User, Provider, Verification_Token, Black_List } = require("../models/index");

const { decode_token } = require("../utils/token");

module.exports = {
    change_password: async (req, res) => {
        try {
            const data = req.body;

            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: "Missing data!",
                });
            }

            const { email, password, otp, provider } = data.formData;

            const existingAccount = await User.findOne({
                where: { email },
                include: [
                    {
                        model: Provider,
                        as: "providers",
                        where: { provider }
                    }
                ],
            });

            if (!existingAccount) {
                return res.status(400).json({
                    success: false,
                    message: "Account with email does not exist!",
                });
            }

            // Kiểm tra mã otp có nhận đúng với mã otp được lưu bên trong token hay không
            const verification_token = await Verification_Token.findOne({
                where: {
                    email,
                }
            });

            if (verification_token) {
                const decode = decode_token(verification_token.token);

                if (!decode.success) {
                    return res.status(400).json({
                        success: false,
                        message: "OTP code not available!",
                    });
                }

                if (+decode.decode.otp !== +otp) {
                    return res.status(400).json({
                        success: false,
                        message: "OTP code is incorrect!",
                    });
                }

                // Bước thêm tài khoản vào db sau khi đã kiểm tra tất cả các trg hợp
                const hashPassword = bcrypt.hashSync(password, 10);

                await User.update(
                    { password: hashPassword },
                    {
                        where: { email },
                        include: [
                            {
                                model: Provider,
                                as: "providers",
                                where: { provider }
                            }
                        ],
                    }
                );

                // Sau khi dùng xong OTP, token chứa OTP đó sẽ đưa bị đưa vào black list và xóa trong verification_token
                await Black_List.create({
                    token: verification_token.token,
                    expiry_time: verification_token.expiry_time,
                });

                await Verification_Token.destroy({
                    where: {
                        token: verification_token.token,
                    }
                });

                return res.status(200).json({
                    success: true,
                    message: "Password successfully changed!",
                });
            } 
            else {
                return res.status(400).json({
                    success: false,
                    message: "OTP code does not exist!",
                });
            }
        }
        catch (error) {
            console.log("Error: ", error);

            return res.status(500).json({
                success: false,
                message: "Error from server!",
            });
        }
    }
}