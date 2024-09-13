const { Op } = require("sequelize");
const { 
    Verification_Token,
    Black_List,
    Refresh_Token
} = require("../../models/index");

const schedule_clear_token = async () => {
    await Verification_Token.destroy({
        where: {
            expiry_time: {
                [Op.lt]: new Date(),
            }
        }
    });

    await Black_List.destroy({
        where: {
            expiry_time: {
                [Op.lt]: new Date(),
            }
        }
    });

    await Refresh_Token.destroy({
        where: {
            expiry_time: {
                [Op.lt]: new Date(),
            }
        }
    })
}

module.exports = schedule_clear_token;