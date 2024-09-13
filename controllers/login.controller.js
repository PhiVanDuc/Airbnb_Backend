const bcrypt = require("bcrypt");
const { create_token, decode_token } = require("../utils/token");
const message_response = require("../utils/response");

const { User, Provider, Permission, Role, Black_List, Refresh_Token } = require("../models/index");

module.exports = {
    verify_black_list: async (req, res) => {
        try {
            const { token } = req.body;
            const token_blocked = await Black_List.findOne({
                where: { token, }
            });

            if (!token_blocked) return message_response(res, 404, true, "Token not found in black list!");
            return message_response(res, 200, true, "Token found in black list!", token_blocked);
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            });
        }
    },

    login: async (req, res) => {
        try {
            const form_data = req.body;

            if (!form_data) {
                return res.status(400).json({
                    success: false,
                    message: "Missing form_data!"
                });
            }

            const { email, password, provider } = form_data;
            
            // Kiểm tra tài khoản và mật khẩu
            const user = await User.findOne({
                where: { email },
                include: [
                    {
                        model: Provider,
                        as: "providers",
                        where: { provider }
                    },
                    {
                        model: Role,
                        as: "roles",
                        include: {
                            model: Permission,
                            as: "permissions"
                        },
                    }
                ]
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Email or password is invalid!"
                });
            }

            const isCorrectPass = await bcrypt.compare(password, user.password);
            if (!isCorrectPass) {
                return res.status(401).json({
                    success: false,
                    message: "Email or password is invalid!"
                });
            }

            // Tạo access token và refresh token
            const access_token = create_token({ user_id: user.id }, process.env.access_exp);
            const refresh_token = create_token({ role: "refresh token" }, process.env.refresh_exp);
            const decode_refresh_token = decode_token(refresh_token);

            if (!access_token || !refresh_token) {
                return res.status(400).json({
                    success: false,
                    message: "Error creating login session!"
                });
            }

            const [addRefreshToken, created] = await Refresh_Token.findOrCreate({
                where: {
                    user_id: user.id
                },
                defaults: {
                    user_id: user.id,
                    refresh_token,
                    expiry_time: new Date(decode_refresh_token?.decode?.exp * 1000)
                }
            });

            if (!created) {
                const updateRefreshToken = await Refresh_Token.update(
                    {
                        refresh_token,
                        expiry_time: new Date(decode_refresh_token?.decode?.exp * 1000)
                    },
                    {
                        where: { user_id: user.id }
                    }
                );

                if (!updateRefreshToken) {
                    return res.status(400).json({
                        success: false,
                        message: "Error creating login session!"
                    });
                }
            }

            return res.status(200).json({
                success: true,
                message: "Signed in successfully!",
                user: {
                    ...user.dataValues,
                    access_token,
                    refresh_token
                }
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            });
        }
    },

    oauth: async (req, res) => {
        try {
            const data = req.body;
            
            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: "Missing data!"
                });
            }

            const [providerInstance] = await Provider.findOrCreate({
                where: { provider: data?.provider },
                defaults: { provider: data?.provider }
            });

            const [user] = await User.findOrCreate({
                where: {
                    email: data?.email,
                    provider_id: providerInstance?.id
                },
                defaults: {
                    image: data?.image,
                    fullname: data?.name,
                    email: data?.email,
                    status: true,
                    provider_id: providerInstance?.id
                }
            });

            // Tạo access token và refresh token
            const access_token = create_token({ user_id: user.id }, process.env.access_exp);
            const refresh_token = create_token({ role: "refresh token" }, process.env.refresh_exp);
            const decode_refresh_token = decode_token(refresh_token);

            if (!access_token || !refresh_token) {
                return res.status(400).json({
                    success: false,
                    message: "Error creating login session!"
                });
            }

            const [addRefreshToken, created] = await Refresh_Token.findOrCreate({
                where: {
                    user_id: user.id
                },
                defaults: {
                    user_id: user.id,
                    refresh_token,
                    expiry_time: new Date(decode_refresh_token?.decode?.exp * 1000)
                }
            });

            if (!created) {
                const updateRefreshToken = await Refresh_Token.update(
                    {
                        refresh_token,
                        expiry_time: new Date(decode_refresh_token?.decode?.exp * 1000)
                    },
                    {
                        where: { user_id: user.id }
                    }
                );

                if (!updateRefreshToken) {
                    return res.status(400).json({
                        success: false,
                        message: "Error creating login session!"
                    });
                }
            }

            return res.status(200).json({
                success: true,
                message: "Signed in successfully!",
                user: {
                    ...user.dataValues,
                    access_token,
                    refresh_token
                }
            });
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            })
        }
    },

    logout: async (req, res) => {
        try {
            const tokens = req.body;

            if (tokens) {
                if (tokens?.refresh_token) {
                    await Refresh_Token.destroy({
                        where: { refresh_token: tokens?.refresh_token }
                    })
                }

                if (tokens?.access_token) {
                    const decode = decode_token(tokens?.access_token);
                    if (decode?.success) {
                        await Black_List.create({
                            token: tokens?.access_token,
                            expiry_time: new Date(decode?.decode?.exp * 1000),
                        })
                    }
                }
            }

            return res.status(200).json({
                success: true,
                message: "Signed out successfully!",
            })
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            })
        }
    },
}