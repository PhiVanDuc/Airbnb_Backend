const message_response = require("../../utils/response");
const { Property, Image, Utility, Category, User } = require("../../models/index"); 

module.exports = {
    find_properties_public: async (req, res) => {
        try {
            const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;
            const category_id = req.params?.category_id;
            const page = +req.params?.page || 1;
            const limit = +req.params?.limit || 20;

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            
            if (category_id === "undefined" || !regex.test(category_id) || !category_id) {
                const finded = await Property.findAll({
                    order: [['created_at', 'DESC']],
                    offset: startIndex,
                    limit: endIndex,
                    include: [
                        {
                            model: Image,
                            as: "images"
                        }
                    ]
                });
    
                if (!finded?.length) return message_response(res, 404, false, "Properties are empty!");
                return message_response(res, 200, true, "Properties founded successfully!", {
                    properties: finded,
                    current_page: page,
                    data: finded?.length < (+limit) ? false : true
                });
            }
            else {
                const finded = await Property.findAll({
                    order: [['created_at', 'DESC']],
                    offset: startIndex,
                    limit: endIndex,
                    where: {
                        structure: category_id
                    },
                    include: [
                        {
                            model: Image,
                            as: "images"
                        }
                    ]
                });
        
                if (!finded?.length) return message_response(res, 404, false, "Properties are empty or not found!");
                return message_response(res, 200, true, "Properties founded successfully!", {
                    properties: finded,
                    current_page: page,
                    data: finded?.length < (+limit) ? false : true
                });
            }
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    get_property_public: async (req, res) => {
        try {
            const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;
            const id = req.params?.id;

            if (!id) return message_response(res, 404, false, "Missing property id!");
            if (!regex.test(id)) return message_response(res, 400, false, "Invalid data!");

            const find = await Property.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: "users"
                    },
                    {
                        model: Image,
                        as: "images"
                    },
                    {
                        model: Utility,
                        as: "utilities"
                    },
                    {
                        model: Category,
                        as: "categories"
                    }
                ]
            });

            if (!find) return message_response(res, 404, false, "Property not found!");
            return message_response(res, 200, true, "Property found successfully!", { property: find });
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    }
}