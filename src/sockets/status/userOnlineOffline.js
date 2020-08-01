//io from socket.io 
let userOnlineOffline = (io) => {
  let clients = {};
  //io.on là sự kiện lắng nghe khi f5 web sẽ chạy
  io.on("connection", (socket) => {
    let currentUserId = socket.request.user._id;//Lấy id của user hiện tại
    // console.log(socket.request.user);
    if (clients[currentUserId]) { //nếu đang tồn tại id của người dùng đang đăng nhập
      //Trường hợp người dùng f5 hoặc mở tab mới thì push socket id vào trong mảng của clients
      clients[currentUserId].push(socket.id);
    } else { //Trường hợp người dùng đăng nhập lần đầu thì sẽ gán id user vs id của socket vào clients
      clients[currentUserId] = [socket.id];
    }
    // console.log(socket.request.user);
    socket.request.user.chatGroupIds.forEach(group => {
      currentUserId = group._id;//Lấy id của user hiện tại
      // console.log(socket.request.user);
      if (clients[currentUserId]) { //nếu đang tồn tại id của người dùng đang đăng nhập
        //Trường hợp người dùng f5 hoặc mở tab mới thì push socket id vào trong mảng của clients
        clients[currentUserId].push(socket.id);
      } else { //Trường hợp người dùng đăng nhập lần đầu thì sẽ gán id user vs id của socket vào clients
        clients[currentUserId] = [socket.id];
      }
    });

    let listUsersOnline = Object.keys(clients);
    //1. Emit socket đến user sau khi login hoặc f5 trang web
    socket.emit("server-send-list-users-online",listUsersOnline);
    //2.Emit socket đến tất cả các user khi có user vừa login vào
    socket.broadcast.emit("server-send-when-new-user-online",socket.request.user._id);
    

    //Khi người dùng f5 thì sẽ gọi đến "disconnect" và giữ lại những socket.id khác với socket.id hiện tại 
    socket.on("disconnect", () => {
      clients[currentUserId] = clients[currentUserId].filter(socketId => {
        return socketId !== socket.id;
      });
      //Trường hợp người dùng không còn truy cập nữa thì xóa clients đi
      if (!clients[currentUserId].length) {
        delete clients[currentUserId];
      }
      socket.request.user.chatGroupIds.forEach(group => {
        currentUserId = group._id;//Lấy id của user hiện tại
        clients[currentUserId] = clients[currentUserId].filter(socketId => {
          return socketId !== socket.id;
        });
        //Trường hợp người dùng không còn truy cập nữa thì xóa clients đi
        if (!clients[currentUserId].length) {
          delete clients[currentUserId];
        }
      });
      //3. Emit socket đến tất cả user khi đăng xuất hoặc tắt website
      socket.broadcast.emit("server-send-when-new-user-offline",socket.request.user._id);
    });
    // console.log(clients);
  });
}

module.exports = userOnlineOffline;
