//io from socket.io 
let typingOff = (io) => {
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
    //socket.on là lắng nghe sự kiện tạo ra, data: contactId
    socket.on("user-is-not-typing", (data) => {
      if (data.groupId) {
        let response = {
          currentGroupId: data.groupId,
          CurrentUserId: socket.request.user._id
        };
        //Tiến hành emit thông báo cho 1 contactId
        if (clients[data.groupId]) {
          clients[data.groupId].forEach(socketId => { //Lọc ra socketId
            //Trường hợp người nhận req đang mở 2 tab thì trả thông báo về cho 2 tab
            io.sockets.connected[socketId].emit("response-user-is-not-typing", response);
          });
        }
      }
      if (data.contactId) {
        let response = {
          CurrentUserId: socket.request.user._id
        };
        //Tiến hành emit thông báo cho 1 contactId
        if (clients[data.contactId]) {
          clients[data.contactId].forEach(socketId => { //Lọc ra socketId
            //Trường hợp người nhận req đang mở 2 tab thì trả thông báo về cho 2 tab
            io.sockets.connected[socketId].emit("response-user-is-not-typing", response);
          });
        }
      }

    });

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
    });
    // console.log(clients);
  });
}

module.exports = typingOff;
