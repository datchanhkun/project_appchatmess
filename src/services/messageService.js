const { resolve, reject } = require("bluebird");
import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import _, { isEmpty } from "lodash";
import MessageModel from "./../models/messageModel";

const LIMIT_CONVERSATIONS = 15;
const LIMIT_MESSAGE = 30;
let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS);

      let userConversationPromise = contacts.map(async (contact) => {
        //Kiểm tra contactId == với user đang đăng nhập, so sánh String == object
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          //Thêm field updateAt cho user để đổ ra view
          getUserContact.createAt = contact.updateAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          //Thêm field updateAt cho user để đổ ra view
          getUserContact.updateAt = contact.updateAt;
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
        return -item.updateAt; // Sắp xếp từ lớn đến nhỏ theo timestamp của updateAt
      });

      //Lấy ra message của từng cuộc hội thoại
      let allConversationWithMessagesPromise = allConversations.map(async(conversation) => {
        conversation = conversation.toObject(); // convert thành object
        //Nếu là nhóm trò chuyện
        if(conversation.members) {
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id,LIMIT_MESSAGE);
          //Gán conversation.messages = với mảng dữ liệu getMessages
          conversation.messages = getMessages;
        } else {
          let getMessages = await MessageModel.model.getMessages(currentUserId,conversation._id,LIMIT_MESSAGE);
          //Gán conversation.messages = với mảng dữ liệu getMessages
          conversation.messages = getMessages;
        }

        return conversation;
      });

      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      //Sắp xếp lại message theo thời gian 
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updateAt;// Sắp xếp từ lớn đến nhỏ theo timestamp của updateAt
      });
      
      resolve({
        allConversationWithMessages: allConversationWithMessages
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems: getAllConversationItems
}