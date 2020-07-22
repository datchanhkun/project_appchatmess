import NotificationModel from "./../models/notificationModel";
import UserModel from "./../models/userModel";

let getNotifications = (currentUserId, limit = 10) => {
  return new Promise(async(resolve, reject)=>{
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId,limit);
      //Map tương tự foreach nhưng lại return ra 1 mảng mới
      let getNotifContents = notifications.map(async(notification) => {
        //Query vào bảng user
        let sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.contents.getContent(notification.type, notification.isRead,sender._id,sender.username, sender.avatar);
      });

      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error);
    }
  });
};
let countNotiUnread = (currentUserId) => {
  return new Promise(async(resolve, reject)=>{
    try {
      //Gọi đến model
      let notificationsUnread = await NotificationModel.model.countNotiUnread(currentUserId);
      resolve(notificationsUnread);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getNotifications : getNotifications,
  countNotiUnread: countNotiUnread
};
