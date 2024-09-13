require("dotenv").config();
const { Property, Image, Utility } = require("../models/index");

const _ = require("lodash");
const message_response = require("../utils/response");

module.exports = {
    get_properties: async (req, res) => {
        try {
            const { user_id } = req.body;

            if (!user_id) {
                return message_response(res, 400, false, "Missing user id");
            }

            const resultGet = await Property.findAll({
                where: {
                    user_id
                },
                include: {
                    model: Image,
                    as: "images"
                }
            });

            return message_response(res, 200, true, "Successfully get properties!", { resultGet });
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    get_property: async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) return message_response(res, 400, false, "Missing property id");

            const resultGet = await Property.findByPk(id, {
                include: [
                    {
                        model: Image,
                        as: "images"
                    },
                    {
                        model: Utility,
                        as: "utilities"
                    }
                ]
            });

            if (!resultGet) return message_response(res, 404, true, "Not found property!", { resultGet });
            return message_response(res, 200, true, "Successfully get property!", { resultGet });
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    get_property_step: async (req, res) => {
        try {
            const { id, step } = req.body;

            if (!id || !step) return message_response(res, 400, false, "Missing id or step create property!");

            let attributes = [];
            let include = [];

            switch(step) {
                case "structure":
                    attributes = ["structure"];
                    break;
                case "privacy-type":
                    attributes = ["privacy_type"];
                    break;
                case "location":
                    attributes = ["address", "longitude", "latitude"];
                    break;
                case "floor-plan":
                    attributes = ["people_count", "bedroom_count", "beds_count", "bathroom_count", "property_count"];
                    break;
                case "utilities":
                    include = [
                        {
                            model: Utility,
                            as: "utilities"
                        }
                    ]
                    break;
                case "photos":
                    include = [
                        {
                            model: Image,
                            as: "images"
                        }
                    ]
                    break;
                case "title":
                    attributes = ["title"];
                    break;
                case "description":
                    attributes = ["description"];
                    break;
                case "price":
                    attributes = ["base_price", "profit_price"];
                    break;
                case "receipt":
                    attributes = undefined,
                    include = [
                        {
                            model: Image,
                            as: "images"
                        },
                        {
                            model: Utility,
                            as: "utilities"
                        }
                    ]
                    break;
            }

            const resultGet = await Property.findByPk(
                id,
                { 
                    attributes,
                    include
                }
            );

            if (!resultGet) return message_response(res, 404, true, "Not found property!", { resultGet: "none!" });
            return message_response(res, 200, true, "Successfully get property!", { resultGet });
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    create_property: async (req, res) => {
        try {
            const { user_id } = req.body;

            if (!user_id) {
                return message_response(res, 400, false, "Missing user id");
            }

            const resultCreate = await Property.create({
                user_id,
            });

            return message_response(res, 200, true, "Successfully created property!", { resultCreate });
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    update_property: async (req, res) => {
        try {
            const body = req.body;

            if (!_.isObject(body) && _.isEmpty(body)) {
                return message_response(res, 400, false, "Missing data!");
            }

            const { id, data, relation } = body;

            if (!relation) {
                const resultUpdate = await Property.update(
                    { ...data },
                    { where: { id } }
                )
    
                if (resultUpdate[0] === 0) {
                    return message_response(res, 404, true, "Property not found!");
                }
                return message_response(res, 200, true, "Successfully updated property!");
            } else {
                if (relation === "utilities") {
                    const { ids } = data;

                    const property = await Property.findByPk(id);
                    await property.setUtilities(ids);

                    return message_response(res, 200, true, "Successfully updated property!");
                }
            }
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    delete_property: async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                return message_response(res, 400, false, "Missing data!");
            }

            await Property.destroy({
                where: {
                    id
                }
            })
            
            return message_response(res, 200, true, "Successfully deleted property!");
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    add_image: async (req, res) => {
        try {
            const body = req.body;

            if (!_.isObject(body) && _.isEmpty(body)) {
                return message_response(res, 400, false, "Missing data!");
            }

            const regex = process.env.REGEX_PUBLIC_ID_CLOUDINARY;
            const { property_id, image_urls } = body;

            const new_image_urls = image_urls?.map(url => {
                const public_id = url?.image_url?.match(regex);

                return {
                    ...url,
                    property_id,
                    public_id: public_id[1],
                }
            });

            const addResult = await Image.bulkCreate(new_image_urls);
            return message_response(res, 200, true, "Successfully created image!", { addResult });
        }
        catch (error) {
            console.log(error);
            
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            });
        }
    },

    edit_image: async (req, res) => {
        try {
            const body = req.body;

            if (!_.isObject(body) && _.isEmpty(body)) {
                return message_response(res, 400, false, "Missing data!");
            }

            const { image_url, image_cover } = body;
            const resultUpdate = await Image.update(
                { image_cover },
                { where: { image_url } }
            );

            if (resultUpdate[0] === 0) {
                message_response(res, 404, true, "Property not image!");
            }
            return message_response(res, 200, true, "Successfully updated image!");
        }
        catch (error) {
            console.log(error);
            
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            });
        }
    }
}