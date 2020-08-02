import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
//io from socket.io 
let addNewContact = (io) => {
  let clients = {};
  //io.on là sự kiện lắng nghe khi f5 web sẽ chạy
  io.on("connection",(socket) => {
    clients = pushSocketIdToArray(clients,socket.request.user._id, socket.id);
    //socket.on là lắng nghe sự kiện tạo ra, data: contactId
    socket.on("add-new-contact", (data) => {
      // console.log(data);
      // console.log(socket.request.user);
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        //vì khi đăng nhập không yêu cầu phải nhập địa chỉ nên phải dùng toán tử 3 ngôi để kiểm tra
        address: (socket.request.user.address != null) ? socket.request.user.address != null : ""
      };

      //Tiến hành emit thông báo cho 1 contactId
      if(clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact",currentUser);
      }

    });

    //Khi người dùng f5 thì sẽ gọi đến "disconnect" và giữ lại những socket.id khác với socket.id hiện tại 
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
    });
    // console.log(clients);
  });
}

module.exports = addNewContact;
