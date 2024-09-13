const { Category } = require("../models/index");

module.exports = {
    get_categories: async (req, res) => {
        try {
            const { all, condition } = req.body;

            if (all) {
                const categories = await Category.findAll();
                return res.status(200).json({
                    success: true,
                    message: "Successfully retrieved the categories!",
                    categories,
                });
            }
            else if (condition && all) {
                const categories = await Category.findAll({
                    where: {
                        category_type: condition
                    }
                });
                return res.status(200).json({
                    success: true,
                    message: "Successfully retrieved the categories!",
                    categories,
                });
            }
            else {
                const page = req.query.page;
                const limit = req.query.limit;
    
                if (!page || !limit) {
                    return res.status(400).json({
                        success: false,
                        message: "Missing page or limit number"
                    });
                }
    
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
    
                const categories = await Category.findAll({
                    order: [['created_at', 'DESC']],
                    offset: startIndex,
                    limit: endIndex,
                });
    
                if (!categories) {
                    return res.status(400).json({
                        success: false,
                        message: "Failed to get the categories!"
                    });
                }
                else if (categories.length === 0) {
                    return res.status(200).json({
                        success: true,
                        message: "Empty category!",
                        categories: [],
                        paginate: {
                            total_pages: 0,
                            current_page: 0,
                            previous_page: null,
                            next_page: null,
                        }
                    });
                } else {
                    const total_pages = Math.ceil(categories.length / limit);
                    const current_page = +page;
    
                    return res.status(200).json({
                        success: true,
                        message: "Successfully retrieved the categories!",
                        categories,
                        paginate: {
                            total_pages,
                            current_page,
                            previous_page: (current_page === 1 || current_page === 0) ? null : +page - 1,
                            next_page: (total_pages > 1 && current_page < total_pages) ? +page + 1 : null,
                        }
                    });
                }
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

    detail_category: async (req, res) => {
        try {
            const category_id = req.query?.category_id;

            if (!category_id) {
                return res.status(400).json({
                    success: false,
                    message: "Missing category id!"
                });
            }

            const category = await Category.findByPk(category_id);

            return res.status(200).json({
                success: true,
                message: category ? "Successfully retrieved the categories!" : "Empty category!",
                category
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

    edit_category: async (req, res) => {
        try {
            const category_id = req.query?.category_id;
            const data = req.body;

            if (!category_id || !data) {
                return res.status(400).json({
                    success: false,
                    message: "Missing category id or data edit!"
                });
            }

            const { category_name, category_type, icon, prefix_icon } = data;
            const update = await Category.update(
                {
                    category: category_name,
                    category_type,
                    icon,
                    prefix_icon
                },
                {
                    where: { id: category_id }
                }
            )

            if (!update) {
                return res.status(400).json({
                    success: false,
                    message: "Something wrong when update category!"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Updated category successfully!"
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

    add_category: async (req, res) => {
        try {
            const { category_name, category_type, icon, prefix_icon } = req.body;

            if (!category_name || !category_type || !icon) {
                return res.status(400).json({
                    success: false,
                    message: "Missing category's data!"
                });
            }

            const addCategory = await Category.create({
                category: category_name,
                category_type,
                icon,
                prefix_icon
            });

            if (addCategory) {
                return res.status(200).json({
                    success: true,
                    message: "Add new category successfully!"
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Adding a new category has failed!"
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

    delete_category: async (req, res) => {
        try {
            const { category_id } = req.body;

            if (!category_id) {
                return res.status(400).json({
                    success: false,
                    message: "Missing category's id!"
                });
            }

            await Category.destroy({
                where: { id: category_id }
            });

            return res.status(200).json({
                success: true,
                message: "Delete category successfully!"
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