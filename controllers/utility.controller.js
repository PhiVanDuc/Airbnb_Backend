const { Utility } = require("../models/index");

module.exports = {
    get_utilities: async (req, res) => {
        try {
            const { all } = req.body;

            if (all) {
                const utilities = await Utility.findAll();
                return res.status(200).json({
                    success: true,
                    message: "Successfully retrieved the utilities!",
                    utilities,
                });
            }
            else {
                const page = req.query.page;
                const limit = req.query.limit;
                const utility_type = req.query.type;

                if (!page || !limit || !utility_type) {
                    return res.status(400).json({
                        success: false,
                        message: "Missing page or limit number or utility type!"
                    });
                }

                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;

                const utilities = await Utility.findAll({
                    order: [['created_at', 'DESC']],
                    offset: startIndex,
                    limit: endIndex,
                    where: { utility_type }
                });

                if (!utilities) {
                    return res.status(400).json({
                        success: false,
                        message: "Failed to get the utilities!"
                    });
                }
                else if (utilities.length === 0) {
                    return res.status(200).json({
                        success: true,
                        message: "Empty utility!",
                        utilities: [],
                        paginate: {
                            total_pages: 0,
                            current_page: 0,
                            previous_page: null,
                            next_page: null,
                        }
                    });
                } else {
                    const total_pages = Math.ceil(utilities.length / limit);
                    const current_page = +page;
    
                    return res.status(200).json({
                        success: true,
                        message: "Successfully retrieved the utilities!",
                        utilities,
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
            return res.status(200).json({
                success: false,
                message: "Error from server"
            });
        }
    },

    detail_utility: async (req, res) => {
        try {
            const utility_id = req.query?.utility_id;

            if (!utility_id) {
                return res.status(400).json({
                    success: false,
                    message: "Missing utility id!"
                });
            }

            const utility = await Utility.findByPk(utility_id);

            return res.status(200).json({
                success: true,
                message: utility ? "Successfully retrieved the utility!" : "Empty utility!",
                utility
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

    add_utility: async (req, res) => {
        try {
            const {utility_name, utility_type, icon, prefix_icon} = req.body;

            if (!utility_name || !utility_type || !icon) {
                return res.status(400).json({
                    success: false,
                    message: "Missing data!"
                });
            }

            const create = await Utility.create({
                utility: utility_name,
                utility_type,
                icon,
                prefix_icon
            });

            if (create) {
                return res.status(200).json({
                    success: true,
                    message: "Add new utility successfully!"
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Adding a new utility has failed!"
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

    edit_category: async (req, res) => {
        try {
            const utility_id = req.query?.utility_id;
            const data = req.body;

            if (!utility_id || !data) {
                return res.status(400).json({
                    success: false,
                    message: "Missing category id or data edit!"
                });
            }

            const { utility_name, utility_type, icon, prefix_icon } = data;
            const update = await Utility.update(
                {
                    utility: utility_name,
                    utility_type,
                    icon,
                    prefix_icon
                },
                {
                    where: { id: utility_id }
                }
            )

            if (!update) {
                return res.status(400).json({
                    success: false,
                    message: "Something wrong when update utility!"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Updated utility successfully!"
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

    delete_category: async (req, res) => {
        try {
            const { utility_id } = req.body;

            if (!utility_id) {
                return res.status(400).json({
                    success: false,
                    message: "Missing utility's id!"
                });
            }

            await Utility.destroy({
                where: { id: utility_id }
            });

            return res.status(200).json({
                success: true,
                message: "Delete utility successfully!"
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