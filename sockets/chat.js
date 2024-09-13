const { Op } = require("sequelize");
const { Conversation, Message } = require("../models/index");

const userSocketMap = {}; // { userId: socketId }

module.exports = {
    chat_socket_handler: (io) => {
        io.on("connection", (socket) => {
            const user_id = socket.handshake.query?.user_id;
            console.log("A user is connected: ", user_id);
            
            if (user_id && user_id !== "undefined") {
                userSocketMap[user_id] = socket.id;
            }
    
            const arr = Object.keys(userSocketMap);
            arr.sort();
            io.emit("getOnlineUsers", arr);

            socket.on("message_notifications", async (user_id) => {
                const conversations = await Conversation.findAll(
                    {
                        where: {
                            [Op.or]: [
                                { first_user_id: user_id },
                                { second_user_id: user_id }
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
                if (conversations && conversations?.length > 0) {
                    conversations?.forEach(conversation => {
                        if (conversation?.messages?.length > 0 && !conversation?.messages?.[0]?.seen_id) numberNotifications++;
                    });

                    socket.emit("send_message_notifications", numberNotifications);
                    return;
                }

                socket.emit("send_message_notifications", numberNotifications);
            });
    
            socket.on("disconnect", () => {
                console.log("A user disconnected: ", socket.id);
                delete userSocketMap[user_id];
    
                const arr = Object.keys(userSocketMap);
                arr.sort();
                io.emit("getOnlineUsers", arr);
            });
        });
    },
    userSocketMap
}
