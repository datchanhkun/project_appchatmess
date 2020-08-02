import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: {type: Number, min: 3, max: 50},
  messageAmount: {type: Number, default: 0},
  userId: String,
  members: [
    {userId: String}
  ],
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: Date.now},
  deleteAt: {type: Number, default: null}
});

ChatGroupSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  //Lấy tất cả chat group hiện có của 1 user
  getChatGroups(userId, limit) {
    return this.find({
      //Sử dụng elemMatch của mongoose nếu userId có tồn tại trong mảng thì lấy cả members
      "members": {$elemMatch: {"userId": userId}}
    }).sort({"updateAt": -1}).limit(limit).exec();
  },
  getChatGroupById(id) {
    return this.findById(id).exec();
  },
  /**
   * 
   * @param {String} id  id của group chat
   * @param {Number} newMessageAmount 
   */
  updateWhenHasNewMessage(id, newMessageAmount) {
    return this.findByIdAndUpdate(id,{
      "messageAmount": newMessageAmount,
      "updateAt": Date.now()
    }).exec();
  },
  getChatGroupIdsByUser(userId) {
    return this.find({
      //Sử dụng elemMatch của mongoose nếu userId có tồn tại trong mảng thì lấy cả members
      "members": {$elemMatch: {"userId": userId}}
    },{_id: 1}).exec();
  }
};
module.exports = mongoose.model("chatGroup", ChatGroupSchema);