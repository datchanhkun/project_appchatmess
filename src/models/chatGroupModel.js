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
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

ChatGroupSchema.statics = {
  //Lấy tất cả chat group hiện có của 1 user
  getChatGroups(userId, limit) {
    return this.find({
      //Sử dụng elemMatch của mongoose nếu userId có tồn tại trong mảng thì lấy cả members
      "members": {$elemMatch: {"userId": userId}}
    }).sort({"createAt": -1}).limit(limit).exec();
  }
};
module.exports = mongoose.model("chatGroup", ChatGroupSchema);