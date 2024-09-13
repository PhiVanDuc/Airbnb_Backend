require("dotenv").config();

const { Image } = require("../models/index");
const cloudinary = require("../utils/cloudinary.config");

module.exports = {
    delete_image: async (req, res) => {
        try {
            const { image_url } = req.body;
            const regex = process.env.REGEX_PUBLIC_ID_CLOUDINARY;
            const public_id = image_url.match(regex);

            if (!image_url || !public_id) {
                return res.status(400).json({
                    success: false,
                    message: "Image url is missing or not correct!"
                });
            }
 
            const result = await cloudinary.uploader.destroy(`${public_id[1]}`);
            const deleteImage = await Image.destroy({
                where: { public_id }
            });
            
            if (result?.result !== "ok" || deleteImage <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "There is something wrong when delete image!"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Successfully deleted image!",
                result,
            });
        }
        catch(error) {
            console.log(error);
            
            return res.status(500).json({
                success: false,
                message: "Error from server!",
            });
        }
    }
}