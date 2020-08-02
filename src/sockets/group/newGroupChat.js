import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
//io from socket.io 
let newGroupChat = (io) => {
  let clients = {};
  //io.on là sự kiện lắng nghe khi f5 web sẽ chạy
  io.on("connection", (socket) => {
    clients = pushSocketIdToArray(clients,socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients,group._id, socket.id);
    });
    //socket.on là lắng nghe sự kiện tạo ra, data: contactId
    socket.on("new-group-created", (data) => {
      clients = pushSocketIdToArray(clients,data.groupChat._id, socket.id);

      let response = {
        groupChat: data.groupChat
      };
      //Gửi socket id đến những user có trong nhóm trò chuyện
      data.groupChat.members.forEach(member => {
        if(clients[member.userId] && member.userId != socket.request.user._id) {
          emitNotifyToArray(clients, member.userId, io, "response-new-group-created", response);
        }
      });
    });
    //lấy được socket id của những user có trong group chat
    socket.on("member-received-group-chat", (data) => {
      clients = pushSocketIdToArray(clients,data.groupChatId, socket.id);
    });
    //Khi người dùng f5 thì sẽ gọi đến "disconnect" và giữ lại những socket.id khác với socket.id hiện tại 
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
    // console.log(clients);
  });
}

module.exports = newGroupChat;
