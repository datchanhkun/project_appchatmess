import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
//io from socket.io 
let removeContact = (io) => {
  let clients = {};
  //io.on là sự kiện lắng nghe khi f5 web sẽ chạy
  io.on("connection",(socket) => {
    clients = pushSocketIdToArray(clients,socket.request.user._id, socket.id);

    //socket.on là lắng nghe sự kiện tạo ra, data: contactId
    socket.on("remove-contact", (data) => {
      // console.log(data);
      // console.log(socket.request.user);
      let currentUser = {
        id: socket.request.user._id
      };

      //Tiến hành emit thông báo cho 1 contactId
      if(clients[data.contactId]) {
        emitNotifyToArray(clients, data.contactId, io, "response-remove-contact",currentUser);
      }

    });

    //Khi người dùng f5 thì sẽ gọi đến "disconnect" và giữ lại những socket.id khác với socket.id hiện tại 
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
    });
    // console.log(clients);
  });
}

module.exports = removeContact;
