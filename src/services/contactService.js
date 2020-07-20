const { resolve, reject } = require("bluebird");

//File xử lí logic tìm kiếm người dùng và trả về cho controller

import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import _ from "lodash";
import { contact } from ".";
let findUsersContact = (currentUserId,keyword) => {
  return new Promise(async(resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    }); 
  //lọc dữ liệu trùng nhau bằng method uniqby của "lodash"
    deprecatedUserIds = _.uniqBy(deprecatedUserIds);
    let users = await UserModel.findAllForAddContact(deprecatedUserIds,keyword);
    // console.log(users);
    resolve(users);
  });
}

let addNew = (currentUserId,contactId) => {
  return new Promise(async(resolve, reject) => {
    let contactExit = await ContactModel.checkExists(currentUserId,contactId);
    //Kiểm tra đã là bạn bè chưa
    if(contactExit) {
      return reject(false);
    }
    //Nếu chưa tồn tại bản ghi thì tiến hành tạo mới contact
    let newContactItem = {
      userId : currentUserId,
      contactId : contactId
    };
    let newContact = await ContactModel.createNew(newContactItem);
    resolve(newContact._doc);
  });
}

let removeRequestContact = (currentUserId,contactId) => {
  return new Promise(async(resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContact(currentUserId,contactId);
    // console.log(removeReq.result);
    if(removeReq.result.n === 0) {
      return reject(false);
    }
    resolve(true);
  });
}
module.exports = {
  findUsersContact : findUsersContact,
  addNew : addNew,
  removeRequestContact : removeRequestContact
};
