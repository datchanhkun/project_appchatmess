//io from socket.io 
let addNewContact = (io) => {
  //io.on là sự kiện lắng nghe khi f5 web sẽ chạy
  io.on("connection",(socket) => {
    //socket.on là lắng nghe sự kiện tạo ra
    socket.on("add-new-contact", (data) => {
      console.log(data);
      console.log(socket.request.user);
    });
  });
}

module.exports = addNewContact;
