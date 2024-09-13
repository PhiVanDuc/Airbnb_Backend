const message_response = require("../../utils/response");
const { Category } = require("../../models/index");

module.exports = {
    get_categories_public: async (req, res) => {
        try {
            const getAll = await Category.findAll();
            if (!getAll) return message_response(res, 404, false, "Categories are empty or not found!", { categories: {} });
            
            return message_response(res, 404, true, "Categories retrived successfully!", { categories: getAll });
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    }
}