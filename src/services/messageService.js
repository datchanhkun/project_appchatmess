const { resolve, reject } = require("bluebird");
import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import _, { isEmpty } from "lodash";
import MessageModel from "./../models/messageModel";
import { transErrors } from "./../../lang/vi";
import { app } from "./../config/app";
import fsExtra from "fs-extra";
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
      let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject(); // convert thành object
        //Nếu là nhóm trò chuyện
        if (conversation.members) {
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGE);
          //Gán conversation.messages = với mảng dữ liệu getMessages
          conversation.messages = _.reverse(getMessages); //Đảo ngược mảng để hiển thị ra tin nhắn mới nhất
        } else {
          let getMessages = await MessageModel.model.getMessages(currentUserId, conversation._id, LIMIT_MESSAGE);
          //Gán conversation.messages = với mảng dữ liệu getMessages
          conversation.messages = _.reverse(getMessages);//Đảo ngược mảng để hiển thị ra tin nhắn mới nhất
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
/**
 * 
 * @param {Object} sender người dùng hiện tại 
 * @param {String} receiverId 1 người dùng hoặc 1 nhóm
 * @param {String} messageValue nội dung cuộc trò chuyện
 * @param {boolean} isChatGroup  kiểm tra trò chuyện cá nhân hay trò chuyện group
 */
let addNewTextEmoji = (sender, receiverId, messageValue, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) { //Kiểm tra nếu cuộc trò chuyện không tồn tại thì thông báo lỗi
          return reject(transErrors.conversation_not_found);
        }
        //Nếu có tồn tại
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name, //Chatgroupmodel
          avatar: app.general_avatar_group_chat
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageValue,
          createAt: Date.now()
        };
        //tạo mới 1 tin nhắn 
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        //Cập nhật lại thông tin của nhóm trò chuyện để người dùng nhận tin nhắn nhảy lên đầu ở leftside
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1); //Bởi vì mỗi lần chỉ nhắn đ 1 tin nhắn
        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId); //id cuar contact
        if (!getUserReceiver) { //Kiểm tra nếu cuộc trò chuyện không tồn tại thì thông báo lỗi
          return reject(transErrors.conversation_not_found);
        }
        //Nếu có tồn tại
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username, //usermodel
          avatar: getUserReceiver.avatar
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageValue,
          createAt: Date.now()
        };

        let newMessage = await MessageModel.model.createNew(newMessageItem);
        //Cập nhật lại thông tin của cuộc trò chuyện để người dùng nhận tin nhắn nhảy lên đầu ở leftside
        await ContactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id);
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * 
 * @param {Object} sender người dùng hiện tại 
 * @param {String} receiverId 1 người dùng hoặc 1 nhóm
 * @param {file} messageValue nội dung cuộc trò chuyện
 * @param {boolean} isChatGroup  kiểm tra trò chuyện cá nhân hay trò chuyện group
 */
let addNewImage = (sender, receiverId, messageValue, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) { //Kiểm tra nếu cuộc trò chuyện không tồn tại thì thông báo lỗi
          return reject(transErrors.conversation_not_found);
        }
        //Nếu có tồn tại
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name, //Chatgroupmodel
          avatar: app.general_avatar_group_chat
        };
        //Convert dữ liệu hình ảnh từ controller truyền sang thành 1 dạng buffer
        let imageBuffer = await fsExtra.readFile(messageValue.path);
        let imageContentType = messageValue.mimetype;
        let imageName = messageValue.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.IMAGE,
          sender: sender,
          receiver: receiver,
          file: {data: imageBuffer, contentType: imageContentType, fileName: imageName},
          createAt: Date.now()
        };
        //tạo mới 1 tin nhắn 
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        //Cập nhật lại thông tin của nhóm trò chuyện để người dùng nhận tin nhắn nhảy lên đầu ở leftside
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1); //Bởi vì mỗi lần chỉ nhắn đ 1 tin nhắn
        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId); //id cuar contact
        if (!getUserReceiver) { //Kiểm tra nếu cuộc trò chuyện không tồn tại thì thông báo lỗi
          return reject(transErrors.conversation_not_found);
        }
        //Nếu có tồn tại
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username, //usermodel
          avatar: getUserReceiver.avatar
        };

        //Convert dữ liệu hình ảnh từ controller truyền sang thành 1 dạng buffer
        let imageBuffer = await fsExtra.readFile(messageValue.path);
        let imageContentType = messageValue.mimetype;
        let imageName = messageValue.originalname;
        
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.IMAGE,
          sender: sender,
          receiver: receiver,
          file: {data: imageBuffer, contentType: imageContentType, fileName: imageName},
          createAt: Date.now()
        };

        let newMessage = await MessageModel.model.createNew(newMessageItem);
        //Cập nhật lại thông tin của cuộc trò chuyện để người dùng nhận tin nhắn nhảy lên đầu ở leftside
        await ContactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id);
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage
}
