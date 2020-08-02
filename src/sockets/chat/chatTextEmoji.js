import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
//io from socket.io 
let chatTextEmoji = (io) => {
  let clients = {};
  //io.on là sự kiện lắng nghe khi f5 web sẽ chạy
  io.on("connection", (socket) => {
    clients = pushSocketIdToArray(clients,socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });
    //Khi có 1 cuộc trò chuyện mới thì bên tin nhắn cũng phải push id chat đó vào clients
    socket.on("new-group-created", (data) => {
      clients = pushSocketIdToArray(clients,data.groupChat._id, socket.id);
    });
    socket.on("member-received-group-chat", (data) => {
      clients = pushSocketIdToArray(clients,data.groupChatId, socket.id);
    });
    //socket.on là lắng nghe sự kiện tạo ra, data: contactId
    socket.on("chat-text-emoji", (data) => {
      if (data.groupId) {
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
          message: data.message
        };
        //Tiến hành emit thông báo cho 1 contactId
        if (clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, "response-chat-text-emoji",response);
        }
      }
      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message
        };
        //Tiến hành emit thông báo cho 1 contactId
        if (clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, "response-chat-text-emoji",response);
        }
      }
    });

    //Khi người dùng f5 thì sẽ gọi đến "disconnect" và giữ lại những socket.id khác với socket.id hiện tại 
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
  });
}

module.exports = chatTextEmoji;
