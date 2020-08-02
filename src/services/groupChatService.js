import _ from "lodash";
import ChatGroupModel from "./../models/chatGroupModel";
let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
  return new Promise(async(resolve,reject) => {
    try {
      //Thêm userid hiện tại vào đầu của mảng members, convert currentUserId thành String
      arrayMemberIds.unshift({userId: `${currentUserId}`});
      //Lọc ra những userId bị trùng khi thêm vào mảng
      arrayMemberIds = _.uniqBy(arrayMemberIds,"userId");
      
      let newGroupItem = {
        name: groupChatName,
        userAmount: arrayMemberIds.length,
        userId: `${currentUserId}`,
        members: arrayMemberIds,
      };

      let newGroup = await ChatGroupModel.createNew(newGroupItem);
      resolve(newGroup);
    } catch (error) {
      
    }
  });
};

module.exports = {
  addNewGroup: addNewGroup
};
