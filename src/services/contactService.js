const { resolve, reject } = require("bluebird");

//File xử lí logic tìm kiếm người dùng và trả về cho controller

import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import _ from "lodash";
let findUsersContact = async (currentUserId,keyword) => {
  return new Promise(async(resolve, reject) => {
    let deprecatedUserIds = [];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    }); 
  //lọc dữ liệu trùng nhau bằng method uniqby của "lodash"
    deprecatedUserIds = _.uniqBy(deprecatedUserIds);
    let users = await UserModel.findAllForAddContact(deprecatedUserIds,keyword);
    resolve(users);
  });
}

module.exports = {
  findUsersContact : findUsersContact
};
