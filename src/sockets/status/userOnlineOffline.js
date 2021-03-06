import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
//io from socket.io 
let userOnlineOffline = (io) => {
  let clients = {};
  //io.on là sự kiện lắng nghe khi f5 web sẽ chạy
  io.on("connection", (socket) => {
    clients = pushSocketIdToArray(clients,socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients,group._id, socket.id);
    });
    //Khi có 1 cuộc trò chuyện mới thì bên tin nhắn cũng phải push id chat đó vào clients
    socket.on("new-group-created", (data) => {
      clients = pushSocketIdToArray(clients,data.groupChat._id, socket.id);
    });
    socket.on("member-received-group-chat", (data) => {
      clients = pushSocketIdToArray(clients,data.groupChatId, socket.id);
    });

    socket.on("check-status", () => {
      let listUsersOnline = Object.keys(clients);
      //1. Emit socket đến user sau khi login hoặc f5 trang web
      socket.emit("server-send-list-users-online",listUsersOnline);
      //2.Emit socket đến tất cả các user khi có user vừa login vào
      socket.broadcast.emit("server-send-when-new-user-online",socket.request.user._id);
    });

    //Khi người dùng f5 thì sẽ gọi đến "disconnect" và giữ lại những socket.id khác với socket.id hiện tại 
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
      //3. Emit socket đến tất cả user khi đăng xuất hoặc tắt website
      socket.broadcast.emit("server-send-when-new-user-offline",socket.request.user._id);
    });
    // console.log(clients);
  });
}

module.exports = userOnlineOffline;
