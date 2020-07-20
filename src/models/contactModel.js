import mongoose from "mongoose";
import { user, contact } from "../services";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: {type: Boolean, default: false},
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

//Tao ban ghi, this la contactschema
ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  //Hàm tìm kiếm tất cả những bản ghi liên quan đến user
  findAllByUser(userId) {
    return this.find({
      //Khi A kết bạn với B, A sẽ là userId và B là contactId và ngược lại
      $or: [
        {"userId": userId},
        {"contactId": userId}
      ]
    }).exec();
  },
  //Hàm kiểm tra xem userId và contactId đã là bạn bè hay chưa
  //A: userId , B: contactId
  checkExists(userId,contactId) {
    return this.findOne({
      $or: [
        //Kiểm tra chéo
        //Trường hợp A gửi lời mời kb cho B rồi nên kiểm tra chéo để B không gửi được lời mời KB cho A
        {$and: [
          {"userId": userId}, //Kiểm tra userId có trùng với userId truyền vào
          {"contactId" : contactId}
        ]},
        {$and: [
          {"userId" : contactId},
          {"contactId": userId} //Kiểm tra userId có trùng với userId truyền vào
        ]}
      ]
    }).exec();
  },

  //Hàm xóa 1 yêu cầu kết bạn
  removeRequestContact(userId,contactId) {
    return this.remove({
      $and: [
        {"userId": userId}, //Kiểm tra userId có trùng với userId truyền vào
        {"contactId" : contactId}
      ]
    }).exec();
  }
};

module.exports = mongoose.model("contact", ContactSchema);
