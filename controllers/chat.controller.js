const message_response = require("../utils/response");
const { userSocketMap } = require("../sockets/chat");

const { Conversation, Message, User } = require("../models/index");
const { Op, literal } = require("sequelize");

module.exports = {
    get_conversation: async (req, res) => {
        try {
            const conversation_id = req.query?.conversation_id;
            const partner_id = req.query?.partner_id;

            if (!conversation_id ||!partner_id) return message_response(res, 404, false, "Missing data!");

            const conversation = await Conversation.findByPk(conversation_id);
            if (!conversation) return message_response(res, 404, false, "Conversation not found!");

            const messages = await Message.findAll({
                where: { conversation_id },
                limit: 20,
                order: [['created_at', 'DESC']],
                include: {
                    model: User,
                    as: "sender",
                    attributes: ["id", "fullname", "image"],
                }
            });
            if (messages?.length > 0) messages.reverse();

            const partner_info = await User.findByPk(
                partner_id,
                {
                    attributes: ["id", "fullname", "image"]
                }
            );

            return message_response(res, 200, true, "Conversation found!", {
                conversation,
                messages,
                partner_info
            });
        }
        catch (error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    create_conversation: async (req, res) => {
        try {
            const { user_id, partner_id } = req.body;
            if (!user_id || !partner_id) return message_response(res, 404, false, "Missing data!");

            const existing = await Conversation.findOne(
                {
                    where: {
                        [Op.and]: [
                            {
                                [Op.or]: [
                                    { first_user_id: user_id },
                                    { second_user_id: user_id }
                                ]
                            },
                            {
                                [Op.or]: [
                                    { first_user_id: partner_id },
                                    { second_user_id: partner_id }
                                ]
                            }
                        ]
                    }
                }
            );
            if (existing) return message_response(res, 200, true, "Found conversation!", { conversation: existing });

            const conversation = await Conversation.create(
                {
                    first_user_id: user_id,
                    second_user_id: partner_id
                },
            );
            if (!conversation) return message_response(res, 400, false, "Something wrong with create conversation!");

            return message_response(res, 200, true, "Successfully created conversation!", { conversation });
        } catch (error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    create_message: async (req, res) => {
        try {
            const { conversation_id, sender_id, reciver_id, message, image } = req.body;
            if (!conversation_id || !sender_id || !reciver_id || (!message && !image)) return message_response(res, 404, false, "Missing data!");

            const create_message = await Message.create(
                {
                    conversation_id,
                    sender_id,
                    message,
                    image
                }
            );
            if (!create_message) return message_response(res, 404, false, "Can't creat new message!");

            // Bắt đầu sử dụng server websocket
            const { io } = req.app;

            if (io && (userSocketMap[reciver_id] || userSocketMap[sender_id])) {
                // Gửi tin nhắn về cho người nhận           
                const sender = await User.findByPk(
                    sender_id,
                    {
                        attributes: ["id", "fullname", "image"],
                    }
                );

                const copy_create_message = create_message?.dataValues;
                copy_create_message.sender = sender;

                io.to(userSocketMap[reciver_id]).emit("create_message", {
                    message: copy_create_message
                });

                // Cập nhật lại cuộc hội thoại cho cả hai bên
                await Conversation.update(
                    { updated_at: new Date() },
                    { where: { id: conversation_id } }
                );

                const conversation = await Conversation.findByPk(
                    conversation_id,
                    {
                        include: {
                            model: Message,
                            as: "messages",
                            limit: 1,
                            order: [["created_at", "DESC"]],
                            include: {
                                model: User,
                                as: "sender",
                                attributes: ["id", "fullname"]
                            }
                        }
                    }
                );

                io.to(userSocketMap[reciver_id]).emit("update_conversations", {
                    conversation,
                    partner_info: sender
                });

                const reciver = await User.findByPk(
                    reciver_id,
                    {
                        attributes: ["id", "fullname", "image"],
                    }
                );
                
                io.to(userSocketMap[sender_id]).emit("update_conversations", {
                    conversation,
                    partner_info: reciver
                });

                // Gửi thông báo tin nhắn mới cho bên nhận
                const conversations = await Conversation.findAll(
                    {
                        where: {
                            [Op.or]: [
                                { first_user_id: reciver_id },
                                { second_user_id: reciver_id }
                            ]
                        },
                        include: {
                            model: Message,
                            as: "messages",
                            limit: 1,
                            order: [["created_at", "DESC"]]
                        }
                    }
                )

                let numberNotifications = 0;
                conversations?.forEach((conversation) => {
                    if (conversation?.messages?.length > 0 && !conversation?.messages?.[0]?.seen_id) numberNotifications++;
                })

                io.to(userSocketMap[reciver_id]).emit("send_message_notifications", numberNotifications); 
            }

            return message_response(res, 200, true, "Successfully create new message!", { message: create_message });
        } catch (error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        } 
    },

    get_conversations: async (req, res) => {
        try {
            const user_id = req.query?.user_id;
            if (!user_id) return message_response(res, 404, false, "Missing data!");

            const conversations = await Conversation.findAll({
                where: { 
                    [Op.or] : [
                        { first_user_id: user_id },
                        { second_user_id: user_id }
                    ]
                },
                limit: 15,
                order: [["updated_at", "DESC"]],
                include: {
                    model: Message,
                    as: "messages",
                    limit: 1,
                    order: [["created_at", "DESC"]],
                    include: {
                        model: User,
                        as: "sender",
                        attributes: ["id", "fullname"]
                    }
                }
            });
            if (!conversations || conversations?.length === 0) return message_response(res, 404, false, "Conversations not found!", { conversations });

            const results = await Promise.all(
                conversations.map(async (conversation) => {
                    const partner_id = conversation.first_user_id === user_id 
                        ? conversation.second_user_id 
                        : conversation.first_user_id;

                    const partner_info = await User.findByPk(partner_id);

                    return {
                        conversation,
                        partner_info
                    };
                })
            );

            return message_response(res, 200, true, "Found conversations!", { conversations: results })
        } catch (error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    mark_read_messages: async (req, res) => {
        try {
            const { conversation_id, sender_id, reciver_id } = req.body;
            if (!conversation_id || !sender_id || !reciver_id) return message_response(res, 404, false, "Missing data!");

            await Message.update(
                {
                    seen_id: reciver_id
                },
                {
                    where: {
                        conversation_id,
                        sender_id
                    }
                }
            );

            const seen_info = await User.findByPk(
                reciver_id,
                {
                    attributes: ["id", "fullname", "image"]
                }
            );

            const conversation = await Conversation.findByPk(
                conversation_id,
                {
                    include: {
                        model: Message,
                        as: "messages",
                        limit: 1,
                        order: [["created_at", "DESC"]],
                        include: {
                            model: User,
                            as: "sender",
                            attributes: ["id", "fullname"]
                        }
                    }
                }
            );

            const { io } = req.app;

            if (io && userSocketMap[reciver_id]) {
                const sender = await User.findByPk(
                    sender_id,
                    {
                        attributes: ["id", "fullname", "image"],
                    }
                );

                io.to(userSocketMap[reciver_id]).emit("update_conversations", {
                    conversation,
                    partner_info: sender
                });

                io.to(userSocketMap[sender_id]).emit("update_conversations", {
                    conversation,
                    partner_info: sender
                });

                // Gửi thông báo tin nhắn mới cho bên nhận
                const conversations = await Conversation.findAll(
                    {
                        where: {
                            [Op.or]: [
                                { first_user_id: reciver_id },
                                { second_user_id: reciver_id }
                            ]
                        },
                        include: {
                            model: Message,
                            as: "messages",
                            limit: 1,
                            order: [["created_at", "DESC"]]
                        }
                    }
                )

                let numberNotifications = 0;
                conversations?.forEach((conversation) => {
                    if (conversation?.messages?.length > 0 && !conversation?.messages?.[0]?.seen_id) numberNotifications++;
                })

                io.to(userSocketMap[reciver_id]).emit("send_message_notifications", numberNotifications);
            }

            return message_response(res, 200, true, "Successfully mark read message!", {
                seen_info: seen_info
            });
        } catch (error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    }
}