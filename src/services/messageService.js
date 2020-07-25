const { resolve, reject } = require("bluebird");
import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import _, { isEmpty } from "lodash";

const LIMIT_CONVERSATIONS = 15;
let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS);

      let userConversationPromise = contacts.map(async (contact) => {
        //Kiểm tra contactId == với user đang đăng nhập, so sánh String == object
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          //Thêm field createAt cho user để đổ ra view
          getUserContact.createAt = contact.createAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          //Thêm field createAt cho user để đổ ra view
          getUserContact.createAt = contact.createAt;
          return getUserContact;
        }
      });
      //Lấy dữ liệu trò chuyện cá nhân
      let userConversations = await Promise.all(userConversationPromise);
      //Lấy dữ liệu trò chuyện nhóm
      let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS);
      //Lấy dữ liệu tất cả cuộc trò chuyện 
      let allConversations = userConversations.concat(groupConversations);
      
      allConversations = _.sortBy(allConversations, (item) => {
        return -item.createAt; // Sắp xếp từ lớn đến nhỏ theo timestamp của createAt
      });
      resolve({
        userConversations: userConversations,
        groupConversations: groupConversations,
        allConversations: allConversations
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems: getAllConversationItems
}