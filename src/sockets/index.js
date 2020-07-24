import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from "./contact/removeRequestContactSent";
import removeRequestContactReceived from "./contact/removeRequestContactReceived";
//Để gọi qua server.js
let initSockets = (io) => {
  addNewContact(io);
  removeRequestContactSent(io);
  removeRequestContactReceived(io);
  //
}

module.exports = initSockets;
