export let pushSocketIdToArray = (clients, userId, socketId) => {
  if(clients[userId]) { //nếu đang tồn tại id của người dùng đang đăng nhập
    //Trường hợp người dùng f5 hoặc mở tab mới thì push socket id vào trong mảng của clients
    clients[userId].push(socketId);
  } else { //Trường hợp người dùng đăng nhập lần đầu thì sẽ gán id user vs id của socket vào clients
    clients[userId] = [socketId];
  }
  return clients;
};
export let emitNotifyToArray = (clients,userId,io, eventName,data) => {
  clients[userId].forEach(socketId => { //Lọc ra socketId
    //Trường hợp người nhận req đang mở 2 tab thì trả thông báo về cho 2 tab
    return io.sockets.connected[socketId].emit(eventName,data);
  });
};
export let removeSocketIdFromArray = (clients, userId, socket) => {
  clients[userId] = clients[userId].filter(socketId => {
    return socketId !== socket.id;
  });
  //Trường hợp người dùng không còn truy cập nữa thì xóa clients đi
  if(!clients[userId].length) {
    delete clients[userId];
  }
  return clients;
};