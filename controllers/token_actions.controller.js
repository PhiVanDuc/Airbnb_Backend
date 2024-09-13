const { decode_token, create_token } = require("../utils/token");
const { Black_List, Refresh_Token } = require("../models/index");
const { current_time } = require("../utils/time");

module.exports = {
    create_token: async (req, res) => {
        try {
            const data = req.body;
            
            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: "Mising payload!"
                });
            }

            const { payload, exp } = data;

            const token = create_token(payload, exp);
            return res.status(200).json({
                success: true,
                token
            });
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            });
        }
    },

    decode_token: async (req, res) => {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: "Mising token!"
                });
            }

            const payload = decode_token(token);
            if (!payload.success)return res.status(400).json(payload);
            else return res.status(200).json(payload);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            });
        }
    },

    refresh_token: async (req, res) => {
        try {
            const { refresh_token } = req.body;

            if (!refresh_token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorization"
                });
            }

            const existingToken = await Refresh_Token.findOne({
                where: { refresh_token }
            });

            if (!existingToken) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorization"
                });
            }

            const decodeToken = decode_token(refresh_token);
            if (!decodeToken?.success && !decodeToken?.error?.exp) return res.status(401).json(decodeToken);

            const access_token = create_token({ user_id: existingToken?.user_id }, process.env.access_exp);
            if (!access_token) {
                return res.status(400).json({
                    success: false,
                    message: "Failed create access token!"
                });
            }
            else {
                return res.status(200).json({
                    success: true,
                    access_token,
                });
            }
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            });
        }
    },

    block_token: async (req, res) => {
        try {
            const { token } = req.body;
            
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: "Mising token!"
                });
            }

            const tokenDecode = decode_token(token);
            if (tokenDecode?.success) {
                await Black_List.create({
                    token,
                    expiry_time: new Date(tokenDecode?.decode?.exp * 1000),
                });

                return res.status(200).json(tokenDecode);
            } else {
                return res.status(400).json(tokenDecode);
            }
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            });
        }
    },

    get_refresh_token: async (req, res) => {
        try {
            const { user_id } = req.body;

            if (!user_id) {
                return res.status(400).json({
                    success: false,
                    message: "Missing user's id!"
                });
            }

            const refresh_token = await Refresh_Token.findOne({
                where: { user_id }
            });

            if (!refresh_token) {
                return res.status(401).json({
                    success: false,
                    logout: true,
                    message: "Account already logout!"
                });
            }

            return res.status(200).json({
                success: true,
                logout: false,
                result: refresh_token,
            });
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            });
        }
    }
}