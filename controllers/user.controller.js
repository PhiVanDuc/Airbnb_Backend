const { User, Provider, Role, Permission } = require("../models/index");

module.exports = {
    get_users: async (req, res) => {
        try {
            const page = req.query?.page;
            const limit = req.query?.limit;

            if (!page || !limit) {
                return res.status(400).json({
                    success: false,
                    message: "Missing page or limit number!"
                });
            }

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const users = await User.findAll({
                order: [['created_at', 'DESC']],
                offset: startIndex,
                limit: endIndex,
                include: [
                    {
                        model: Provider,
                        as: "providers"
                    },
                    {
                        model: Role,
                        as: "roles",
                        include: {
                            model: Permission,
                            as: "permissions"
                        }
                    }
                ]
            });

            if (!users) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to get the users!"
                });
            }
            else if (users.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "Empty users!"
                });
            }
            else {
                const total_pages = Math.ceil(+users?.length / limit);
                const current_page = +page;

                return res.status(200).json({
                    success: true,
                    message: "Successfully retrieved the users!",
                    users,
                    paginate: {
                        total_pages,
                        current_page,
                        previous_page: (current_page === 1 || current_page === 0) ? null : +page - 1,
                        next_page: (total_pages > 1 && current_page < total_pages) ? +page + 1 : null,
                    }
                });
            }
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            })
        }
    },

    profile: async (req, res) => {
        try {
            const data = req.body;

            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: "Missing user_id!",
                });
            }

            const user = await User.findOne({
                where: { id: data?.user_id },
                include: [
                    {
                        model: Provider,
                        as: "providers",
                    },
                    {
                        model: Role,
                        as: "roles",
                        include: {
                            model: Permission,
                            as: "permissions"
                        }
                    }
                ]
            });

            return res.status(200).json({
                success: true,
                message: user ? "Founded user's profile" : "Not founded user's profile",
                user,
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
    
    assign_roles: async (req, res) => {
        try {
            const data = req.body;

            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: "Missing user_id and roles!"
                })
            }

            const { user_id, roles } = data;

            const user = await User.findByPk(user_id);
            if (!user) {
                return res.status(200).json({
                    success: true,
                    message: "User not found!"
                })
            }

            let roleInstances = [];
            if (roles?.length > 0) {
                roleInstances = await Promise.all(
                    roles?.map((role => {
                        return Role.findOne({
                            where: { role }
                        });
                    }))
                );
            }

            const assignRole = await user.setRoles(roleInstances);

            return res.status(200).json({
                success: true,
                message: "Role assignment was successful!",
                assignRole,
            });
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error from server!"
            })
        }
    }
}