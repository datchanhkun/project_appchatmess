import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: {type: Boolean, default: false},
  createAt: {type: Number, default: Date.now}
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequestContactNotif(senderId,receiverId,type) {
    return this.remove({
      $and: [
        {"senderId": senderId},
        {"receiverId": receiverId},
        {"type": type}
      ]
    }).exec();
  },
  //Load thông báo có giới hạn là 10 , "createAt": -1 mới nhất để lên trên
  getByUserIdAndLimit(userId, limit) {
    return this.find({"receiverId" : userId}).sort({"createAt": -1}).limit(limit).exec();
  },
  //hàm đếm số lượng thông báo chưa đọc ở model để gọi qua service
  countNotiUnread(userId) {
    return this.count({ //sử dụng hàm count của mongoose
      $and: [
        {"receiverId" : userId},
        {"isRead": false}
      ]
    }).exec();
  }
}

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact"
};
//get content tu js/addContact.js/socket.on
const NOTIFICATION_CONTENTS = {
  getContent: (notificationType ,isRead ,userId, username, userAvatar) => {
    if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
      if(!isRead) {
        return `<div class="notif-readed-false" data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
      } else {
        return `<div data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
      }

    }
    
    return "No matching with any notification type";
  }
};

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENTS
};
