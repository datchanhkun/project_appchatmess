import {notification,contact, message} from "./../services/index";
import {bufferToBase64} from "./../helpers/clientHelper";
let getHome = async(req, res) => {
  //Chỉ hiển thị 10 thông báo
  let notifications = await notification.getNotifications(req.user._id);
  //Đếm tổng số những thông báo chưa đọc
  let countNotiUnread = await notification.countNotiUnread(req.user._id);

  //lấy ra 10 item trong danh bạ 1 lần
  let contacts = await contact.getContacts(req.user._id);
  //lấy ra 10 item trong đang chờ xác nhận 1 lần
  let contactsSent = await contact.getContactsSent(req.user._id);
  //lấy ra 10 item trong yêu cầu kết bạn 1 lần
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  //Đếm những item chưa được load trong modal kết bạn
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  //
  let getAllConversationItems = await message.getAllConversationItems(req.user._id);
  let allConversations = getAllConversationItems.allConversations;
  let userConversations = getAllConversationItems.userConversations;
  let groupConversations = getAllConversationItems.groupConversations;
  //Tất cả tin nhắn với toàn bộ cuộc trò chuyện
  let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;
  //Return ra view
  return res.render("main/home/home" , {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user, // lay thang du lieu tu user
    notifications: notifications,
    countNotiUnread: countNotiUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    allConversations: allConversations,
    userConversations: userConversations,
    groupConversations: groupConversations,
    allConversationWithMessages: allConversationWithMessages,
    bufferToBase64: bufferToBase64
  });
};

module.exports = {
  getHome: getHome
};
