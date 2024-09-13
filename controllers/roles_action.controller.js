const { Role, Permission } = require("../models/index");
const format_string = require("../utils/format_string");

module.exports = {
    get_roles: async (req, res) => {
        try {
            const { all } = req.body;

            if (all) {
                const roles = await Role.findAll();
                return res.status(200).json({
                    success: true,
                    message: "Successfully retrieved the roles!",
                    roles,
                });
            }
            else {
                const page = req.query.page;
                const limit = req.query.limit;
    
                if (!page || !limit) {
                    return res.status(400).json({
                        success: false,
                        message: "Missing page or limit number!"
                    });
                }
    
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
    
                const roles = await Role.findAndCountAll({
                    order: [['created_at', 'DESC']],
                    offset: startIndex,
                    limit: endIndex,
                    
                });
    
                if (!roles) {
                    return res.status(400).json({
                        success: false,
                        message: "Failed to get the roles!"
                    });
                }
                else if (roles.length === 0) {
                    return res.status(200).json({
                        success: true,
                        message: "Empty role!",
                        roles: [],
                        paginate: {
                            total_pages: 0,
                            current_page: 0,
                            previous_page: null,
                            next_page: null,
                        }
                    });
                } else {
                    const total_pages = Math.ceil(roles.count / limit);
                    const current_page = +page;
    
                    return res.status(200).json({
                        success: true,
                        message: "Successfully retrieved the roles!",
                        roles,
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

    detail_role: async (req, res) => {
        try {
            const role_id = req.params.role_id;

            if (!role_id) {
                return res.status(400).json({
                    success: false,
                    message: "Role id not founded!"
                });
            }

            const detail_role = await Role.findOne({
                where: { id: role_id },
                include: [
                    {
                        model: Permission,
                        as: "permissions",
                    }
                ]
            });

            if (!detail_role) {
                return res.status(200).json({
                    success: false,
                    message: "Roles not founded!",
                });
            }
            else {
                return res.status(200).json({
                    success: true,
                    message: "Search for roles complete!",
                    detail_role,
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

    add_role: async (req, res) => {
        try {
            const data = req.body;

            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: "Missing data!"
                });
            }

            const { role, permissions } = data;
            let roleInstance;

            const roles = await Role.findAll();
            if (!roles) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to retrieve roles!"
                });
            }
            else if (roles.length === 0) {
                roleInstance = await Role.create({
                    role,
                });

                if (!roleInstance) {
                    return res.status(400).json({
                        success: false,
                        message: "Add role failed!"
                    });
                }
            }
            else if (roles.length > 0) {
                let exsitingRole = false;

                for (let i = 0; i < roles.length; i++) {
                    if (format_string(roles[i].role) === format_string(role)) {
                        exsitingRole = true;
                        break;
                    }
                }

                if (exsitingRole) {
                    return res.status(200).json({
                        success: false,
                        message: "Role already exists!"
                    });
                }
                else {
                    roleInstance = await Role.create({
                        role,
                    });
    
                    if (!roleInstance) {
                        return res.status(400).json({
                            success: false,
                            message: "Add role failed!"
                        });
                    }
                }
            }

            // Nếu permission đã tồn tại trong db thì thôi, chưa thì thêm
            if (permissions && permissions.length) {
                for (let permission of permissions) {
                    await Permission.findOrCreate(
                        {
                            where: { permission },
                            defaults: { permission },
                        },
                    );
                }
            }

            const permissionInstances = await Promise.all(
                permissions.map(async (permission) => {
                    const instance = await Permission.findOne({
                        where: { permission }
                    });
                    return instance;
                })
            );

            if (!permissionInstances) {
                return res.status(400).json({
                    success: false,
                    message: "Something went wrong at permissionInstance!"
                });
            }

            // Chưa hiểu rõ về cách thêm liên kết qua bảng trung gian!
            const linkRolePermissions = await roleInstance.addPermissions(permissionInstances); 

            if (!linkRolePermissions) {
                return res.status(400).json({
                    success: false,
                    message: "Something went wrong at linkRolePermissions!"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Add new role successfully!"
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

    edit_role: async (req, res) => {
        try {
            const data = req.body;

            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: "Missing data!"
                });
            }

            const { role, permissions, role_id } = data;

            const updateRole = await Role.update(
                { role },
                { where: { id: role_id } }
            );

            if (!updateRole) {
                return res.status(400).json({
                    success: false,
                    message: "Update role failed!"
                });
            }

            const roleInstance = await Role.findOne({
                where: { id: role_id }
            });

            // Nếu permission đã tồn tại trong db thì thôi, chưa thì thêm
            if (permissions && permissions.length) {
                for (let permission of permissions) {
                    await Permission.findOrCreate(
                        {
                            where: { permission },
                            defaults: { permission },
                        },
                    );
                }
            }

            const permissionInstances = await Promise.all(
                permissions.map(async (permission) => {
                    const instance = await Permission.findOne({
                        where: { permission }
                    });
                    return instance;
                })
            );

            if (!permissionInstances) {
                return res.status(400).json({
                    success: false,
                    message: "Something went wrong at permissionInstance!"
                });
            }

            // Chưa hiểu rõ về cách thêm liên kết qua bảng trung gian!
            await roleInstance.setPermissions(permissionInstances); 

            return res.status(200).json({
                success: true,
                message: "Update role successfully!"
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

    delete_role: async (req, res) => {
        try {
            const role_id = req.params.role_id;

            if(!role_id) {
                return res.status(400).json({
                    success: false,
                    message: "Missing role id!"
                });
            }

            const role = await Role.findByPk(role_id);
            await role.setUsers([]);
            await role.setPermissions([]);
            const delete_role = await Role.destroy({
                where: { id: role_id }
            });

            if (!delete_role) {
                return res.status(400).json({
                    success: false,
                    message: "Deleting the role has failed!"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Successfully deleted role!"
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