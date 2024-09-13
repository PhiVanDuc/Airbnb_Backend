const { decode_token } = require("../utils/token");
const { User } = require("../models/index");

module.exports = async (req, res, next) => {
    const accessToken = req.get("Authorization")?.split(" ").slice(1).join();

    try {
        const decodeToken = decode_token(accessToken);
        if ((!decodeToken?.success && decodeToken?.error && !decodeToken?.error?.expiredAt) || (decodeToken?.success && !decodeToken?.decode?.user_id))
            return res.status(401).json(decodeToken);
        else if (!decodeToken?.success && decodeToken?.error && decodeToken?.error?.expiredAt)
            return res.status(400).json(decodeToken);

        const user = await User.findByPk(decodeToken?.decode?.user_id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist!"
            })
        } else if (user && !user.status) {
            return res.status(401).json({
                success: false,
                message: "User blocked!"
            })
        }

        req.user = user;
        return next();
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error from server!"
        });
    }
}